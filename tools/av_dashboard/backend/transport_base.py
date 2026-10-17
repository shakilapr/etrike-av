"""Base classes and data containers for CAN transport."""

from __future__ import annotations

import time
from typing import AsyncGenerator, Optional


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

    def to_hex_raw(self) -> str:
        return "".join(f"{b:02X}" for b in self.data)

    def __repr__(self) -> str:
        return f"CanFrame(0x{self.can_id:03X}, [{self.to_hex_string()}])"


class BaseCanTransport:
    """Abstract interface for CAN transports."""

    interface: str = "unknown"
    is_connected: bool = False
    is_simulated: bool = False
    last_error: Optional[str] = None

    async def start(self) -> None:
        raise NotImplementedError

    async def stop(self) -> None:
        raise NotImplementedError

    async def frames(self) -> AsyncGenerator[CanFrame, None]:
        raise NotImplementedError
