"""Dynamic YAML Contract Loader & Bit-Level Signal Decoder.

Ingests protocol schema YAMLs dynamically (zero hardcoding of addresses or signals).
Provides runtime bit extraction, physical value computation, and 64-bit payload mapping.
"""

from __future__ import annotations

import glob
import os
import subprocess
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import yaml

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
    sender: str = ""
    receivers: List[str] = field(default_factory=list)
    cycle_ms: int = 0
    access: str = "RX"  # "TX" (Host sends) or "RX" (Host receives)
    signals: List[SignalDef] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class ContractRegistry:
    """Loads and indexes CAN message and signal contracts dynamically from YAML files."""

    def __init__(self, contracts_dir: Optional[str] = None) -> None:
        self.contracts_dir = contracts_dir
        self.messages_by_id: Dict[int, MessageDef] = {}
        self.messages_by_key: Dict[str, MessageDef] = {}
        self.raw_contracts: Dict[str, Any] = {}
        self.source_description: str = "Not loaded"
        self.load()

    def _find_yaml_files(self) -> List[Path]:
        if self.contracts_dir:
            p = Path(self.contracts_dir)
            if p.is_dir():
                candidates = sorted(p.glob("*.yaml"))
                if candidates:
                    self.source_description = str(p.resolve())
                    return candidates

        # Default workspace search locations
        potential_paths = [
            Path(__file__).resolve().parents[1] / "contracts",
            Path("tools/av_dashboard/contracts"),
            Path("tools/can_watcher/contracts"),
            Path("autoware/src/our_packages/direct_bridge/protocol/contracts"),
            Path(__file__).resolve().parents[3] / "autoware" / "src" / "our_packages" / "direct_bridge" / "protocol" / "contracts",
            Path("protocol/contracts"),
            Path("../etrike/protocol/contracts"),
            Path("E:/work/etrike/protocol/contracts"),
            Path(__file__).resolve().parents[3] / "protocol" / "contracts",
        ]


        for p in potential_paths:
            if p.is_dir():
                found = sorted(p.glob("*.yaml"))
                if found:
                    self.source_description = str(p.resolve())
                    return found

        return []


    def _load_from_git(self, remote_ref: str = "etrike/main") -> Dict[str, Any]:
        """Fallback to loading YAML contracts directly from git remote if local files are missing."""
        contract_names = ["network", "host", "rt", "sys", "hmi", "mtr", "pwt"]
        results: Dict[str, Any] = {}
        for cname in contract_names:
            cmd = ["git", "show", f"{remote_ref}:protocol/contracts/{cname}.yaml"]
            try:
                res = subprocess.run(cmd, capture_output=True, text=True, check=True)
                results[f"{cname}.yaml"] = yaml.safe_load(res.stdout)
            except Exception:
                pass
        if results:
            self.source_description = f"git:{remote_ref}:protocol/contracts"
        return results

    def load(self) -> None:
        """Parse all YAML contracts and build the indexed message registry."""
        self.messages_by_id.clear()
        self.messages_by_key.clear()
        self.raw_contracts.clear()

        yaml_files = self._find_yaml_files()
        raw_map: Dict[str, Any] = {}

        if yaml_files:
            for yf in yaml_files:
                try:
                    with open(yf, "r", encoding="utf-8") as f:
                        data = yaml.safe_load(f)
                        if data:
                            raw_map[yf.name] = data
                except Exception as e:
                    print(f"[ContractRegistry] Warning reading {yf}: {e}")
        else:
            raw_map = self._load_from_git()

        self.raw_contracts = raw_map
        if not raw_map:
            self.source_description = "No contracts found (Empty)"
            return

        for filename, data in raw_map.items():
            messages = data.get("messages", [])
            for raw_msg in messages:
                key = raw_msg.get("key", "")
                name = raw_msg.get("name") or key
                dlc = int(raw_msg.get("dlc", 8))
                msg_byte_order = raw_msg.get("byte_order", "little")

                # Parse signals from either layout.fields or signals
                raw_fields = raw_msg.get("layout", {}).get("fields", []) or raw_msg.get("signals", [])
                signals: List[SignalDef] = []
                for idx, s in enumerate(raw_fields):
                    color = SIGNAL_PALETTE[idx % len(SIGNAL_PALETTE)]
                    sig_name = s.get("key") or s.get("name") or f"sig_{idx}"
                    endian = s.get("endian") or s.get("byte_order") or msg_byte_order
                    scale = float(s.get("factor", s.get("scale", 1.0)))
                    offset = float(s.get("offset", 0.0))
                    sig = SignalDef(
                        name=sig_name,
                        byte=int(s.get("byte", 0)),
                        bit=int(s.get("bit", 0)),
                        bits=int(s.get("bits", 1)),
                        endian=endian,
                        signed=bool(s.get("signed", False)),
                        scale=scale,
                        offset=offset,
                        min_val=s.get("min"),
                        max_val=s.get("max"),
                        unit=s.get("unit", ""),
                        comment=s.get("comment", ""),
                        color=color,
                    )
                    signals.append(sig)

                # Parse instances (IDs per bus)
                instances = raw_msg.get("instances", [])
                if not instances:
                    raw_id = raw_msg.get("id")
                    if raw_id is not None:
                        instances = [{"bus": "high", "id": raw_id, "cycle_ms": raw_msg.get("cycle_ms", 0)}]

                for inst in instances:
                    bus = inst.get("bus", "high")
                    raw_inst_id = inst.get("id", 0)
                    can_id = int(str(raw_inst_id), 0) if isinstance(raw_inst_id, (str, int)) else int(raw_inst_id)
                    cycle_ms = int(inst.get("cycle_ms", raw_msg.get("cycle_ms", 0)))
                    inst_sender = inst.get("sender") or raw_msg.get("sender") or raw_msg.get("owner", "")
                    receivers = inst.get("receivers", raw_msg.get("receivers", []))
                    if isinstance(receivers, str):
                        receivers = [r.strip() for r in receivers.split(",") if r.strip()]

                    # Infer Access relative to Host computer:
                    if inst_sender.lower() == "host" or "hmi" in key.lower():
                        access = "TX"
                    else:
                        access = "RX"

                    msg_def = MessageDef(
                        key=key,
                        name=name,
                        dlc=dlc,
                        id=can_id,
                        id_hex=f"0x{can_id:03X}",
                        bus=bus,
                        sender=inst_sender,
                        receivers=receivers,
                        cycle_ms=cycle_ms,
                        access=access,
                        signals=signals,
                    )

                    self.messages_by_id[can_id] = msg_def
                    self.messages_by_key[key] = msg_def

    def get_message(self, can_id: int) -> Optional[MessageDef]:
        return self.messages_by_id.get(can_id)

    def decode_frame(self, can_id: int, data: bytes) -> Tuple[Dict[str, Any], List[Dict[str, Any]]]:
        """Decode payload bytes for a CAN ID into physical values and a 64-bit matrix."""
        msg_def = self.get_message(can_id)
        decoded_signals: Dict[str, Any] = {}
        data_len = len(data)

        padded_bytes = bytearray(data[:8])
        if len(padded_bytes) < 8:
            padded_bytes.extend(b"\x00" * (8 - len(padded_bytes)))

        bit_owner: Dict[int, SignalDef] = {}
        if msg_def:
            for sig in msg_def.signals:
                start_bit = sig.byte * 8 + sig.bit
                for b_offset in range(sig.bits):
                    global_bit = start_bit + b_offset
                    if global_bit < 64:
                        bit_owner[global_bit] = sig

                raw_val = 0
                if sig.endian == "big" and sig.bit == 0 and (sig.bits % 8 == 0):
                    n_bytes = sig.bits // 8
                    for bi in range(n_bytes):
                        if sig.byte + bi < data_len:
                            raw_val = (raw_val << 8) | data[sig.byte + bi]
                elif sig.endian == "big" and sig.bits < 8:
                    mask = (1 << sig.bits) - 1
                    if sig.byte < data_len:
                        raw_val = (data[sig.byte] >> sig.bit) & mask
                else:
                    for b_offset in range(sig.bits):
                        g_bit = start_bit + b_offset
                        byte_idx = g_bit // 8
                        bit_idx = g_bit % 8
                        if byte_idx < data_len:
                            bit_val = (data[byte_idx] >> bit_idx) & 1
                            raw_val |= bit_val << b_offset

                if sig.signed and (raw_val & (1 << (sig.bits - 1))):
                    raw_val -= 1 << sig.bits

                phys_val = raw_val * sig.scale + sig.offset
                decoded_signals[sig.name] = {
                    "raw": raw_val,
                    "value": round(phys_val, 4) if isinstance(phys_val, float) else phys_val,
                    "unit": sig.unit,
                    "color": sig.color,
                }

        bit_cells: List[Dict[str, Any]] = []
        for byte_idx in range(8):
            b_val = padded_bytes[byte_idx] if byte_idx < data_len else 0
            for bit_col in range(7, -1, -1):
                global_bit = byte_idx * 8 + bit_col
                bit_val = (b_val >> bit_col) & 1
                owner = bit_owner.get(global_bit)
                bit_cells.append(
                    {
                        "index": global_bit,
                        "byte": byte_idx,
                        "bit": bit_col,
                        "val": bit_val,
                        "owner": owner.name if owner else None,
                        "color": owner.color if owner else None,
                    }
                )

        return decoded_signals, bit_cells

    def export_catalog(self) -> List[Dict[str, Any]]:
        sorted_msgs = sorted(self.messages_by_id.values(), key=lambda m: m.id)
        return [m.to_dict() for m in sorted_msgs]
