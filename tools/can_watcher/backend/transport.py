"""CAN Transport layer for CAN Watcher Backend."""

from __future__ import annotations

import asyncio
import math
import os
import platform
import struct
import time
from typing import Any, AsyncGenerator, Dict, List, Optional


class CanFrame:
    """Represents a standard or extended CAN frame."""

    def __init__(self, can_id: int, data: bytes, is_extended: bool = False, timestamp: Optional[float] = None) -> None:
        self.can_id = can_id
        self.data = data
        self.dlc = len(data)
        self.is_extended = is_extended
        self.timestamp = timestamp if timestamp is not None else time.time()

    def to_hex_string(self) -> str:
        return " ".join(f"{b:02X}" for b in self.data)

    def __repr__(self) -> str:
        return f"CanFrame(0x{self.can_id:03X}, [{self.to_hex_string()}])"


class BaseCanTransport:
    """Abstract interface for CAN transports."""

    async def start(self) -> None:
        raise NotImplementedError

    async def stop(self) -> None:
        raise NotImplementedError

    async def frames(self) -> AsyncGenerator[CanFrame, None]:
        raise NotImplementedError


class SocketCanTransport(BaseCanTransport):
    """Native Linux SocketCAN transport using Python's standard library socket module."""

    def __init__(self, channel: str = "can2") -> None:
        self.channel = channel
        self.sock: Optional[Any] = None
        self._running = False

    async def start(self) -> None:
        import socket
        if not hasattr(socket, "AF_CAN"):
            raise RuntimeError("SocketCAN is only supported on Linux.")

        try:
            self.sock = socket.socket(socket.AF_CAN, socket.SOCK_RAW, socket.CAN_RAW)
            self.sock.bind((self.channel,))
            self.sock.setblocking(False)
            self._running = True
            print(f"[Transport] Bound successfully to SocketCAN interface '{self.channel}'.")
        except OSError as err:
            self.sock = None
            self._running = False
            raise RuntimeError(f"SocketCAN interface '{self.channel}' unavailable: {err}") from err


    async def stop(self) -> None:
        self._running = False
        if self.sock:
            self.sock.close()
            self.sock = None

    async def frames(self) -> AsyncGenerator[CanFrame, None]:
        loop = asyncio.get_running_loop()
        while self._running and self.sock:
            try:
                raw_data = await loop.sock_recv(self.sock, 16)
                if len(raw_data) < 16:
                    continue
                can_id, can_dlc = struct.unpack("<IB3x", raw_data[:8])
                is_extended = bool(can_id & 0x80000000)
                clean_id = can_id & 0x1FFFFFFF if is_extended else can_id & 0x7FF
                frame_data = raw_data[8 : 8 + min(can_dlc, 8)]
                yield CanFrame(can_id=clean_id, data=frame_data, is_extended=is_extended)
            except asyncio.CancelledError:
                break
            except Exception:
                await asyncio.sleep(0.01)


class SimulatedCanTransport(BaseCanTransport):
    """Generates realistic E-Trike CAN traffic according to protocol contracts."""

    def __init__(self) -> None:
        self._running = False
        self._step = 0

    async def start(self) -> None:
        self._running = True

    async def stop(self) -> None:
        self._running = False

    async def frames(self) -> AsyncGenerator[CanFrame, None]:
        t0 = time.time()
        rolling_ctr: Dict[int, int] = {}

        while self._running:
            now = time.time()
            dt = now - t0
            self._step += 1

            speed_kmh = max(0.0, 18.0 + 8.0 * math.sin(dt * 0.3))
            speed_mmps = int(speed_kmh * (1000.0 / 3.6))
            steer_deg = 12.0 * math.sin(dt * 0.5)
            yaw_mrad = int(-steer_deg * 8.5)
            brake_applied = (math.sin(dt * 0.2) < -0.6)
            brake_press_kpa = int(2500) if brake_applied else 0

            turn_left = (int(dt * 1.5) % 2 == 1) if (math.sin(dt * 0.1) > 0.3) else False
            turn_right = False
            headlights = True
            gear_d = 1  # Drive

            msgs_to_send: List[CanFrame] = []

            # 1. 0x121 RT_MOTION_RPT (50Hz)
            if self._step % 2 == 0:
                ctr = rolling_ctr.get(0x121, 0)
                rolling_ctr[0x121] = (ctr + 1) % 256
                d121 = bytearray(8)
                s_u16 = speed_mmps & 0xFFFF
                d121[0] = (s_u16 >> 8) & 0xFF
                d121[1] = s_u16 & 0xFF
                y_u24 = yaw_mrad & 0xFFFFFF
                d121[2] = (y_u24 >> 16) & 0xFF
                d121[3] = (y_u24 >> 8) & 0xFF
                d121[4] = y_u24 & 0xFF
                d121[5] = gear_d
                d121[6] = 0x07  # valid flags
                d121[7] = ctr
                msgs_to_send.append(CanFrame(0x121, bytes(d121)))

            # 2. 0x300 HOST_DRIVE_CMD (50Hz - TX from Host)
            if self._step % 2 == 0:
                cmd_speed = speed_mmps + 50
                d300 = bytearray(8)
                s_u32 = cmd_speed & 0xFFFFFFFF
                d300[0] = (s_u32 >> 24) & 0xFF
                d300[1] = (s_u32 >> 16) & 0xFF
                d300[2] = (s_u32 >> 8) & 0xFF
                d300[3] = s_u32 & 0xFF
                y_u24 = yaw_mrad & 0xFFFFFF
                d300[4] = (y_u24 >> 16) & 0xFF
                d300[5] = (y_u24 >> 8) & 0xFF
                d300[6] = y_u24 & 0xFF
                d300[7] = gear_d
                msgs_to_send.append(CanFrame(0x300, bytes(d300)))

            # 3. 0x303 HOST_STEER_CMD (50Hz - TX from Host)
            if self._step % 2 == 0:
                ctr = rolling_ctr.get(0x303, 0)
                rolling_ctr[0x303] = (ctr + 1) % 256
                steer_0_1deg = int(steer_deg * 10.0) & 0xFFFF
                d303 = bytearray(4)
                d303[0] = (steer_0_1deg >> 8) & 0xFF
                d303[1] = steer_0_1deg & 0xFF
                d303[2] = 0x01
                d303[3] = ctr
                msgs_to_send.append(CanFrame(0x303, bytes(d303)))

            # 4. 0x011 SYS_SAFETY_STS (5Hz - RX)
            if self._step % 20 == 0:
                ctr = rolling_ctr.get(0x011, 0)
                rolling_ctr[0x011] = (ctr + 1) % 256
                d011 = bytearray(5)
                d011[0] = 0
                d011[1] = 1
                light_byte = (1 if turn_left else 0) | (4 if brake_applied else 0) | (8 if headlights else 0)
                d011[2] = light_byte
                d011[3] = ctr
                d011[4] = (d011[0] ^ d011[1] ^ d011[2] ^ d011[3]) & 0xFF
                msgs_to_send.append(CanFrame(0x011, bytes(d011)))

            # 5. 0x302 HOST_LIGHT_CMD (TX)
            if self._step % 20 == 0:
                light_cmd = (1 if turn_left else 0) | (4 if brake_applied else 0) | (8 if headlights else 0)
                msgs_to_send.append(CanFrame(0x302, bytes([light_cmd])))

            # 6. 0x210 RT_STATE_RPT (10Hz - RX)
            if self._step % 10 == 0:
                d210 = bytearray(6)
                d210[0] = 1  # Mode AUTO
                d210[1] = 0  # Safety OK
                msgs_to_send.append(CanFrame(0x210, bytes(d210)))

            # 7. 0x310 STEER_DIAG (10Hz - RX)
            if self._step % 10 == 0:
                d310 = bytearray(8)
                raw_ang = int((steer_deg * 10.0) + 3000) & 0xFFFF
                d310[0] = (raw_ang >> 8) & 0xFF
                d310[1] = raw_ang & 0xFF
                d310[2] = 0
                d310[5] = 0x01
                d310[6] = 0x5E
                msgs_to_send.append(CanFrame(0x310, bytes(d310)))

            # 8. 0x311 BRAKE_DIAG (10Hz - RX)
            if self._step % 10 == 0:
                d311 = bytearray(8)
                p_raw = int(brake_press_kpa / 50.0) & 0xFFFF
                d311[0] = (p_raw >> 8) & 0xFF
                d311[1] = p_raw & 0xFF
                msgs_to_send.append(CanFrame(0x311, bytes(d311)))

            # 9. 0x501 RT_NODE_STATUS (10Hz - RX)
            if self._step % 10 == 0:
                d501 = bytearray(8)
                d501[0] = 3
                d501[2] = 0x10
                msgs_to_send.append(CanFrame(0x501, bytes(d501)))

            # 10. 0x7FC HOST_HEARTBEAT & 0x7FD RT_HEARTBEAT
            if self._step % 10 == 0:
                ctr_h = rolling_ctr.get(0x7FC, 0)
                rolling_ctr[0x7FC] = (ctr_h + 1) % 256
                msgs_to_send.append(CanFrame(0x7FC, bytes([ctr_h, 0])))

                ctr_r = rolling_ctr.get(0x7FD, 0)
                rolling_ctr[0x7FD] = (ctr_r + 1) % 256
                msgs_to_send.append(CanFrame(0x7FD, bytes([ctr_r, 0])))

            for frame in msgs_to_send:
                yield frame

            await asyncio.sleep(0.01)


class AutoDetectTransport(BaseCanTransport):
    """Wraps hardware transport and transparently falls back to simulation if interface is unavailable."""

    def __init__(self, interface: str = "can2") -> None:
        self.interface = interface
        self._delegate: BaseCanTransport = SocketCanTransport(channel=interface)
        self.is_simulated = False

    async def start(self) -> None:
        try:
            await self._delegate.start()
        except Exception as err:
            print(f"[Transport] Hardware interface '{self.interface}' unavailable ({err}).")
            print("[Transport] Seamlessly activating realistic simulated vehicle telemetry stream.")
            self._delegate = SimulatedCanTransport()
            self.is_simulated = True
            await self._delegate.start()

    async def stop(self) -> None:
        await self._delegate.stop()

    async def frames(self) -> AsyncGenerator[CanFrame, None]:
        async for frame in self._delegate.frames():
            yield frame


def create_transport(interface: str = "can2", sim: bool = False) -> BaseCanTransport:
    if sim:
        return SimulatedCanTransport()

    if platform.system() == "Linux":
        return AutoDetectTransport(interface=interface)

    try:
        import can
        class PythonCanTransport(BaseCanTransport):
            def __init__(self, chan: str) -> None:
                self.channel = chan
                self.bus: Optional[Any] = None
                self._running = False

            async def start(self) -> None:
                self.bus = can.Bus(channel=self.channel, interface="virtual")
                self._running = True

            async def stop(self) -> None:
                self._running = False
                if self.bus:
                    self.bus.shutdown()
                    self.bus = None

            async def frames(self) -> AsyncGenerator[CanFrame, None]:
                loop = asyncio.get_running_loop()
                while self._running and self.bus:
                    msg = await loop.run_in_executor(None, self.bus.recv, 0.1)
                    if msg:
                        yield CanFrame(can_id=msg.arbitration_id, data=msg.data, is_extended=msg.is_extended_id)

        return PythonCanTransport(chan=interface)
    except Exception:
        pass

    print(f"[Transport] Hardware interface '{interface}' not available. Running in SIMULATION mode.")
    return SimulatedCanTransport()

