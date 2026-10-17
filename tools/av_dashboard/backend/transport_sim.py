"""Simulated CAN Transport generating realistic E-Trike traffic."""

from __future__ import annotations

import asyncio
import math
import time
from typing import AsyncGenerator, Dict, List, Optional

from .transport_base import BaseCanTransport, CanFrame


class SimulatedCanTransport(BaseCanTransport):
    """Generates realistic E-Trike CAN traffic according to protocol contracts (explicit --sim only)."""

    def __init__(self) -> None:
        self.interface = "sim"
        self.is_connected = True
        self.is_simulated = True
        self.last_error = None
        self._running = False
        self._step = 0

    async def start(self) -> None:
        self._running = True
        self.is_connected = True

    async def stop(self) -> None:
        self._running = False
        self.is_connected = False

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
            brake_applied = math.sin(dt * 0.2) < -0.6
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
                d303[2] = 0x01  # angle_valid
                d303[3] = ctr
                msgs_to_send.append(CanFrame(0x303, bytes(d303)))

            # 4. 0x210 RT_STATE_RPT (10Hz)
            if self._step % 10 == 0:
                d210 = bytearray(6)
                d210[0] = 1  # AUTO mode
                d210[1] = 0  # safety OK
                d210[2] = 0  # not reversing
                d210[3] = 0
                d210[4] = 0xFF  # all tasks healthy
                d210[5] = 2  # steer state engaged
                msgs_to_send.append(CanFrame(0x210, bytes(d210)))

            # 5. 0x302 HOST_LIGHT_CMD (10Hz)
            if self._step % 10 == 0:
                d302 = bytearray(1)
                flags = (
                    (1 if turn_left else 0)
                    | ((1 if turn_right else 0) << 1)
                    | ((1 if brake_applied else 0) << 2)
                    | ((1 if headlights else 0) << 3)
                )
                d302[0] = flags
                msgs_to_send.append(CanFrame(0x302, bytes(d302)))

            # 6. 0x310 STEER_DIAG (10Hz)
            if self._step % 10 == 0:
                d310 = bytearray(8)
                raw_angle = int((steer_deg + 300.0) * 10.0) & 0xFFFF
                d310[0] = (raw_angle >> 8) & 0xFF
                d310[1] = raw_angle & 0xFF
                d310[2] = 0  # fault = 0
                d310[3] = 0x01  # motor_current ~ 3.5A
                d310[4] = 0x5E
                d310[5] = 0x01  # ecu_temp ~ 42.0 C
                d310[6] = 0xA4
                d310[7] = 0
                msgs_to_send.append(CanFrame(0x310, bytes(d310)))

            # 7. 0x311 BRAKE_DIAG (10Hz)
            if self._step % 10 == 0:
                d311 = bytearray(8)
                raw_p = int(brake_press_kpa / 0.05) & 0xFFFF
                d311[0] = (raw_p >> 8) & 0xFF
                d311[1] = raw_p & 0xFF
                d311[2] = 0  # fault = 0
                d311[3] = 0x00  # motor_current ~ 1.2A
                d311[4] = 0x78
                d311[5] = 0x01  # ecu_temp ~ 38.5 C
                d311[6] = 0x81
                d311[7] = 0
                msgs_to_send.append(CanFrame(0x311, bytes(d311)))

            # 8. 0x501 SYS_NODE_STATUS (50Hz)
            ctr501 = rolling_ctr.get(0x501, 0)
            rolling_ctr[0x501] = (ctr501 + 1) % 256
            d501 = bytearray(8)
            d501[0] = 3  # ACTIVE
            d501[1] = 0
            d501[2] = 0
            d501[3] = 0x1E  # ready, cmd_rcvd, cmd_nonzero, out_enabled
            d501[4] = 0
            d501[5] = 0
            d501[6] = ctr501
            d501[7] = 0xAA
            msgs_to_send.append(CanFrame(0x501, bytes(d501)))

            for msg in msgs_to_send:
                yield msg

            await asyncio.sleep(0.02)
