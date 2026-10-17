"""CAN Transport layer for CAN Watcher Backend."""

from __future__ import annotations

import asyncio
import os
import platform
import struct
from typing import Any, AsyncGenerator, Optional

from .transport_base import BaseCanTransport, CanFrame
from .transport_sim import SimulatedCanTransport

__all__ = ["CanFrame", "BaseCanTransport", "SocketCanTransport", "SimulatedCanTransport", "create_transport"]


class SocketCanTransport(BaseCanTransport):
    """Native Linux SocketCAN transport with automatic interface reconnect."""

    def __init__(self, channel: str = "can2") -> None:
        self.channel = channel
        self.interface = channel
        self.sock: Optional[Any] = None
        self._running = False
        self.is_connected = False
        self.is_simulated = False
        self.last_error: Optional[str] = None

    def _try_bind(self) -> bool:
        import socket
        if not hasattr(socket, "AF_CAN"):
            self.last_error = "SocketCAN (AF_CAN) is only supported on Linux"
            self.is_connected = False
            return False

        self._close_sock()
        try:
            sock = socket.socket(socket.AF_CAN, socket.SOCK_RAW, socket.CAN_RAW)
            sock.bind((self.channel,))
            sock.setblocking(False)
            self.sock = sock
            self.is_connected = True
            self.last_error = None
            print(f"[Transport] Bound successfully to SocketCAN interface '{self.channel}'.")
            return True
        except OSError as err:
            self.sock = None
            self.is_connected = False
            err_msg = f"SocketCAN interface '{self.channel}' unavailable: {err}"
            if self.last_error != err_msg:
                print(f"[Transport] {err_msg} (will retry automatically)")
            self.last_error = err_msg
            return False

    def _close_sock(self) -> None:
        if self.sock is not None:
            try:
                self.sock.close()
            except Exception:
                pass
            self.sock = None
        self.is_connected = False

    async def start(self) -> None:
        self._running = True
        self._try_bind()

    async def stop(self) -> None:
        self._running = False
        self._close_sock()

    async def frames(self) -> AsyncGenerator[CanFrame, None]:
        loop = asyncio.get_running_loop()
        while self._running:
            if self.sock is None:
                if not self._try_bind():
                    await asyncio.sleep(1.5)
                    continue

            try:
                raw_data = await loop.sock_recv(self.sock, 16)
                if not raw_data:
                    self._close_sock()
                    await asyncio.sleep(0.5)
                    continue
                if len(raw_data) < 16:
                    continue
                can_id, can_dlc = struct.unpack("<IB3x", raw_data[:8])
                is_extended = bool(can_id & 0x80000000)
                clean_id = can_id & 0x1FFFFFFF if is_extended else can_id & 0x7FF
                frame_data = raw_data[8 : 8 + min(can_dlc, 8)]
                yield CanFrame(can_id=clean_id, data=frame_data, is_extended=is_extended)
            except asyncio.CancelledError:
                break
            except OSError as err:
                self.last_error = f"SocketCAN read error on '{self.channel}': {err}"
                self._close_sock()
                await asyncio.sleep(1.0)
            except Exception as err:
                self.last_error = str(err)
                await asyncio.sleep(0.1)


def create_transport(interface: str = "can2", sim: bool = False) -> BaseCanTransport:
    """Factory creating the appropriate transport according to OS and args."""
    if sim:
        print("[Transport] Simulation mode requested (--sim)")
        return SimulatedCanTransport()

    is_linux = platform.system() == "Linux"
    if is_linux:
        try:
            import socket
            if hasattr(socket, "AF_CAN"):
                print(f"[Transport] Initializing SocketCAN transport on '{interface}'")
                return SocketCanTransport(channel=interface)
        except Exception as e:
            print(f"[Transport] SocketCAN init error: {e}")

    print(f"[Transport] SocketCAN unavailable on {platform.system()} - Falling back to simulation")
    return SimulatedCanTransport()
