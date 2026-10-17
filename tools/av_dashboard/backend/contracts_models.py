"""CAN Contract Data Models and Palettes."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any, Dict, List, Optional

# Colorblind-safe, high-contrast palette for signal allocations in the 64-bit matrix
SIGNAL_PALETTE = [
    "#38bdf8",  # Sky Blue
    "#34d399",  # Emerald Green
    "#fbbf24",  # Amber Yellow
    "#f87171",  # Coral Red
    "#a78bfa",  # Violet Purple
    "#f472b6",  # Pink
    "#2dd4bf",  # Teal
    "#fb923c",  # Orange
    "#818cf8",  # Indigo
    "#a3e635",  # Lime Green
    "#e879f9",  # Fuchsia
    "#60a5fa",  # Blue
]


@dataclass
class SignalDef:
    name: str
    byte: int
    bit: int
    bits: int
    endian: str = "little"  # "little" (Intel) or "big" (Motorola)
    signed: bool = False
    scale: float = 1.0
    offset: float = 0.0
    min_val: Optional[float] = None
    max_val: Optional[float] = None
    unit: str = ""
    comment: str = ""
    color: str = "#38bdf8"


@dataclass
class MessageDef:
    key: str
    name: str
    dlc: int
    id: int
    id_hex: str
    bus: str = "high"
    buses: List[str] = field(default_factory=list)
    sender: str = ""
    receivers: List[str] = field(default_factory=list)
    cycle_ms: int = 0
    access: str = "RX"  # "TX" (Host sends) or "RX" (Host receives)
    signals: List[SignalDef] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)
