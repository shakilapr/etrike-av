#!/usr/bin/env python3
"""CANalyst-II to SocketCAN High-Reliability Bridge Daemon.

Bridges USB CANalyst-II channels (Channel 1 / Channel 2) to Linux SocketCAN interfaces
(e.g., can2, can3, or vcan0, vcan1) with middleman monitoring, auto-reconnect,
and fail-safe packet handling for ROS 2 / Autoware Universe.
"""

from __future__ import annotations

import argparse
import logging
import os
import signal
import subprocess
import sys
import time
from typing import Any, Callable, List, Optional

try:
    import can  # type: ignore[import-untyped]
except ImportError:
    can = None  # Will report error if started without python-can


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [CANalyst-Bridge] %(message)s",
)
logger = logging.getLogger("canalyst_bridge")


class CanInterfaceManager:
    """Manages creation and configuration of Linux SocketCAN / vcan interfaces."""

    @staticmethod
    def interface_exists(interface_name: str) -> bool:
        """Check if network interface exists."""
        return os.path.exists(f"/sys/class/net/{interface_name}")

    @classmethod
    def ensure_vcan_interface(cls, interface_name: str) -> bool:
        """Create and bring up a vcan interface if it does not already exist."""
        if cls.interface_exists(interface_name):
            logger.info("Interface '%s' already exists.", interface_name)
            return True

        logger.info("Creating virtual CAN interface '%s'...", interface_name)
        try:
            subprocess.run(["sudo", "modprobe", "vcan"], check=True, capture_output=True)
            subprocess.run(
                ["sudo", "ip", "link", "add", "dev", interface_name, "type", "vcan"],
                check=True,
                capture_output=True,
            )
            subprocess.run(
                ["sudo", "ip", "link", "set", "up", interface_name],
                check=True,
                capture_output=True,
            )
            logger.info("Interface '%s' created and brought UP successfully.", interface_name)
            return True
        except subprocess.CalledProcessError as exc:
            logger.error("Failed to setup interface '%s': %s", interface_name, exc.stderr.decode().strip())
            return False


class CanalystSocketCanBridge:
    """High-reliability bidirectional bridge between CANalyst-II and Linux SocketCAN."""

    def __init__(
        self,
        can_channel: int = 0,
        socketcan_interface: str = "can2",
        bitrate: int = 500000,
        middleman_mode: bool = False,
        forward_to_channel: Optional[int] = None,
    ) -> None:
        self.can_channel: int = can_channel
        self.socketcan_interface: str = socketcan_interface
        self.bitrate: int = bitrate
        self.middleman_mode: bool = middleman_mode
        self.forward_to_channel: Optional[int] = forward_to_channel

        self._running: bool = False
        self._hw_bus: Optional[Any] = None
        self._sock_bus: Optional[Any] = None
        self._fwd_hw_bus: Optional[Any] = None
        self._notifier: Optional[Any] = None

        self._rx_count: int = 0
        self._tx_count: int = 0
        self._err_count: int = 0

    def start(self) -> None:
        """Start the bridge loop with auto-reconnection."""
        if can is None:
            logger.error(
                "python-can is not installed! Run: pip3 install 'python-can[canalystii]'"
            )
            sys.exit(1)

        CanInterfaceManager.ensure_vcan_interface(self.socketcan_interface)

        self._running = True
        logger.info(
            "Starting Bridge: CANalyst Channel %d <-> %s @ %d bps (Middleman: %s)",
            self.can_channel,
            self.socketcan_interface,
            self.bitrate,
            self.middleman_mode,
        )

        while self._running:
            try:
                self._connect_and_run()
            except KeyboardInterrupt:
                logger.info("Keyboard interrupt received. Shutting down.")
                break
            except Exception as exc:
                logger.warning("Bridge exception: %s. Reconnecting in 3s...", exc)
                self._cleanup()
                time.sleep(3)

        self._cleanup()
        logger.info("Bridge stopped cleanly.")

    def _connect_and_run(self) -> None:
        """Establish connection and process frames."""
        logger.info("Opening SocketCAN interface '%s'...", self.socketcan_interface)
        self._sock_bus = can.Bus(
            interface="socketcan",
            channel=self.socketcan_interface,
            receive_own_messages=False,
        )

        logger.info("Connecting to CANalyst-II channel %d...", self.can_channel)
        self._hw_bus = can.Bus(
            interface="canalystii",
            channel=self.can_channel,
            bitrate=self.bitrate,
        )

        if self.forward_to_channel is not None:
            logger.info("Opening forwarding CANalyst-II channel %d...", self.forward_to_channel)
            self._fwd_hw_bus = can.Bus(
                interface="canalystii",
                channel=self.forward_to_channel,
                bitrate=self.bitrate,
            )

        logger.info("Buses opened successfully. Starting frame dispatch...")

        def on_hw_frame(msg: Any) -> None:
            """Callback when frame received from CANalyst-II hardware."""
            self._rx_count += 1
            if self.middleman_mode:
                self._log_middleman("HW -> NET", msg)

            try:
                self._sock_bus.send(msg)
            except Exception as e:
                self._err_count += 1
                logger.error("Failed forwarding to SocketCAN: %s", e)

            if self._fwd_hw_bus is not None:
                try:
                    self._fwd_hw_bus.send(msg)
                except Exception as e:
                    self._err_count += 1
                    logger.debug("Failed forwarding to secondary HW channel: %s", e)

        def on_sock_frame(msg: Any) -> None:
            """Callback when frame received from Autoware / SocketCAN."""
            self._tx_count += 1
            if self.middleman_mode:
                self._log_middleman("NET -> HW", msg)

            try:
                # SocketCAN sets msg.channel to interface string (e.g. 'can2').
                # canalystii requires integer channel index (0 or 1).
                msg.channel = self.can_channel

                # canalystii python driver requires data to be exactly 8 bytes for (c_ubyte * 8)
                if len(msg.data) < 8:
                    padded_data = bytearray(msg.data) + bytearray(8 - len(msg.data))
                    msg.data = bytes(padded_data)
                self._hw_bus.send(msg)
            except Exception as e:
                self._err_count += 1
                logger.warning("Failed forwarding to CANalyst-II: %s", e)
                err_str = str(e).lower()
                if "no such device" in err_str or "disconnected" in err_str or "pipe error" in err_str:
                    logger.error("USB hardware disconnect detected. Triggering auto-reconnect...")
                    raise

        listeners: List[Callable[[Any], None]] = [on_hw_frame]
        self._notifier = can.Notifier(self._hw_bus, listeners)

        # Main dispatch loop for SocketCAN -> HW
        last_stat_time = time.time()
        while self._running:
            msg = self._sock_bus.recv(timeout=1.0)
            if msg is not None:
                on_sock_frame(msg)

            # Periodic heartbeat statistics
            now = time.time()
            if now - last_stat_time >= 10.0:
                logger.info(
                    "Stats: RX=%d frames, TX=%d frames, Errors=%d",
                    self._rx_count,
                    self._tx_count,
                    self._err_count,
                )
                last_stat_time = now

    def _log_middleman(self, direction: str, msg: Any) -> None:
        """Format and print CAN frame in middleman watcher format."""
        data_hex = " ".join(f"{b:02X}" for b in msg.data)
        logger.info(
            "[%s] ID=0x%03X DLC=%d DATA=[%s]",
            direction,
            msg.arbitration_id,
            msg.dlc,
            data_hex,
        )

    def stop(self) -> None:
        """Signal bridge to stop."""
        self._running = False

    def _cleanup(self) -> None:
        """Safely close open buses and notifiers."""
        if self._notifier is not None:
            try:
                self._notifier.stop()
            except Exception:
                pass
            self._notifier = None

        for bus in [self._hw_bus, self._sock_bus, self._fwd_hw_bus]:
            if bus is not None:
                try:
                    bus.shutdown()
                except Exception:
                    pass

        self._hw_bus = None
        self._sock_bus = None
        self._fwd_hw_bus = None


def parse_arguments() -> argparse.Namespace:
    """Parse CLI arguments."""
    parser = argparse.ArgumentParser(
        description="CANalyst-II to Linux SocketCAN Bridge Daemon for Autoware & ROS 2"
    )
    parser.add_argument(
        "--channel",
        type=int,
        default=0,
        help="CANalyst-II channel index (0 = CAN1, 1 = CAN2) (default: 0)",
    )
    parser.add_argument(
        "--interface",
        type=str,
        default="can2",
        help="Target SocketCAN interface name (default: can2)",
    )
    parser.add_argument(
        "--bitrate",
        type=int,
        default=500000,
        help="CAN bus bitrate (default: 500000)",
    )
    parser.add_argument(
        "--middleman",
        action="store_true",
        help="Enable middleman verbose logging of all bidirectional frames",
    )
    parser.add_argument(
        "--forward-to",
        type=int,
        default=None,
        help="Optional second CANalyst channel to mirror/forward traffic to",
    )
    return parser.parse_args()


def main() -> None:
    """CLI entry point."""
    args = parse_arguments()

    bridge = CanalystSocketCanBridge(
        can_channel=args.channel,
        socketcan_interface=args.interface,
        bitrate=args.bitrate,
        middleman_mode=args.middleman,
        forward_to_channel=args.forward_to,
    )

    def signal_handler(signum: int, frame: Any) -> None:
        logger.info("Signal received. Stopping bridge...")
        bridge.stop()

    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    bridge.start()


if __name__ == "__main__":
    main()
