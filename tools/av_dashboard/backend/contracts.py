"""Dynamic YAML Contract Loader & Bit-Level Signal Decoder.

Ingests protocol schema YAMLs dynamically (zero hardcoding of addresses or signals).
Provides runtime bit extraction, physical value computation, and 64-bit payload mapping.
"""

from __future__ import annotations

import glob
import os
import subprocess
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import yaml

from .contracts_decoder import decode_can_frame
from .contracts_models import SIGNAL_PALETTE, MessageDef, SignalDef

__all__ = ["SignalDef", "MessageDef", "SIGNAL_PALETTE", "ContractRegistry", "decode_can_frame"]


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

                instances = raw_msg.get("instances", [])
                if not instances:
                    raw_id = raw_msg.get("id")
                    if raw_id is not None:
                        instances = [{"bus": "high", "id": raw_id, "cycle_ms": raw_msg.get("cycle_ms", 0)}]

                for inst in instances:
                    bus = str(inst.get("bus", "high")).lower()
                    raw_inst_id = inst.get("id", 0)
                    can_id = int(str(raw_inst_id), 0) if isinstance(raw_inst_id, (str, int)) else int(raw_inst_id)
                    cycle_ms = int(inst.get("cycle_ms", raw_msg.get("cycle_ms", 0)))
                    inst_sender = inst.get("sender") or raw_msg.get("sender") or raw_msg.get("owner", "")
                    receivers = inst.get("receivers", raw_msg.get("receivers", []))
                    if isinstance(receivers, str):
                        receivers = [r.strip() for r in receivers.split(",") if r.strip()]
                    else:
                        receivers = list(receivers)

                    access = "TX" if (inst_sender.lower() == "host" or "hmi" in key.lower()) else "RX"

                    existing = self.messages_by_id.get(can_id)
                    if existing is not None and existing.key == key:
                        if bus not in existing.buses:
                            existing.buses.append(bus)
                        existing.bus = "high/low" if ("high" in existing.buses and "low" in existing.buses) else existing.buses[0]
                        for r in receivers:
                            if r not in existing.receivers:
                                existing.receivers.append(r)
                        if cycle_ms > 0 and (existing.cycle_ms == 0 or bus == "high"):
                            existing.cycle_ms = cycle_ms
                        continue

                    msg_def = MessageDef(
                        key=key,
                        name=name,
                        dlc=dlc,
                        id=can_id,
                        id_hex=f"0x{can_id:03X}",
                        bus=bus,
                        buses=[bus],
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
        return decode_can_frame(self.get_message(can_id), data)

    def export_catalog(self) -> List[Dict[str, Any]]:
        sorted_msgs = sorted(self.messages_by_id.values(), key=lambda m: m.id)
        return [m.to_dict() for m in sorted_msgs]
