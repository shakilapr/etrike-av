#!/usr/bin/env python3
"""Audit CAN protocol, signals, and RT/SYS bridge compatibility.

Compares autoware_vehicle_bridge and etrike_protocol against the canonical
firmware contracts and references in etrike/main.
"""

from __future__ import annotations

import argparse
import os
import re
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple

import yaml


@dataclass
class SignalSpec:
    key: str
    byte: int
    bit: int
    bits: int
    signed: bool = False
    min_val: Optional[float] = None
    max_val: Optional[float] = None


@dataclass
class MessageContract:
    key: str
    name: str
    dlc: int
    id_high: Optional[int] = None
    id_low: Optional[int] = None
    sender: str = ""
    receivers_high: List[str] = field(default_factory=list)
    receivers_low: List[str] = field(default_factory=list)
    cycle_ms_high: int = 0
    signals: Dict[str, SignalSpec] = field(default_factory=dict)


@dataclass
class AuditFinding:
    severity: str  # "CRITICAL", "WARNING", "INFO"
    category: str
    target: str
    description: str
    remediation: str


class ProtocolAuditor:
    """Performs deep comparison between workspace code and firmware contracts."""

    def __init__(self, workspace_root: Path, remote_ref: str = "etrike/main") -> None:
        self.workspace_root = workspace_root
        self.remote_ref = remote_ref
        self.findings: List[AuditFinding] = []
        self.contracts: Dict[str, MessageContract] = {}
        self.high_bus_messages: Dict[int, MessageContract] = {}

    def run_git_show(self, git_path: str) -> Optional[str]:
        """Read a file from git remote ref."""
        try:
            cmd = ["git", "show", f"{self.remote_ref}:{git_path}"]
            res = subprocess.run(
                cmd,
                cwd=str(self.workspace_root),
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                check=True,
            )
            return res.stdout
        except subprocess.CalledProcessError:
            return None

    def load_upstream_contracts(self) -> None:
        """Load and parse YAML contracts from the firmware upstream ref."""
        contract_names = ["network", "host", "rt", "sys", "hmi", "mtr"]
        for cname in contract_names:
            content = self.run_git_show(f"protocol/contracts/{cname}.yaml")
            if not content:
                continue
            data = yaml.safe_load(content)
            for raw_msg in data.get("messages", []):
                key = raw_msg.get("key", "")
                name = raw_msg.get("name", "")
                dlc = int(raw_msg.get("dlc", 0))

                contract = MessageContract(key=key, name=name, dlc=dlc)

                # Parse instances
                for inst in raw_msg.get("instances", []):
                    bus = inst.get("bus")
                    raw_id = inst.get("id")
                    msg_id = int(raw_id, 16) if isinstance(raw_id, str) and raw_id.startswith("0x") else int(raw_id)
                    sender = inst.get("sender", "")
                    receivers = inst.get("receivers", [])
                    cycle_ms = int(inst.get("cycle_ms", 0))

                    if bus == "high":
                        contract.id_high = msg_id
                        contract.sender = sender
                        contract.receivers_high = receivers
                        contract.cycle_ms_high = cycle_ms
                        self.high_bus_messages[msg_id] = contract
                    elif bus == "low":
                        contract.id_low = msg_id
                        contract.receivers_low = receivers

                # Parse signals
                layout = raw_msg.get("layout", {})
                for f in layout.get("fields", []):
                    sig = SignalSpec(
                        key=f.get("key", ""),
                        byte=int(f.get("byte", 0)),
                        bit=int(f.get("bit", 0)),
                        bits=int(f.get("bits", 1)),
                        signed=bool(f.get("signed", False)),
                        min_val=f.get("min"),
                        max_val=f.get("max"),
                    )
                    contract.signals[sig.key] = sig

                self.contracts[key] = contract

    def audit_etrike_protocol_hpp(self) -> None:
        """Compare local etrike_protocol.hpp against upstream contract specifications."""
        hpp_path = self.workspace_root / "autoware/src/our_packages/etrike_protocol/generated/cpp/etrike_protocol.hpp"
        if not hpp_path.exists():
            self.findings.append(
                AuditFinding(
                    severity="CRITICAL",
                    category="FILE_MISSING",
                    target=str(hpp_path),
                    description="Local etrike_protocol.hpp does not exist.",
                    remediation="Generate or sync etrike_protocol.hpp from etrike repo.",
                )
            )
            return

        hpp_text = hpp_path.read_text(encoding="utf-8")

        # 1. Audit SysSafetySts DLC
        m_safety = re.search(r"struct SysSafetySts \{.*?static constexpr std::size_t kDlc = (\d+)u;", hpp_text, re.DOTALL)
        if m_safety:
            local_dlc = int(m_safety.group(1))
            expected_dlc = self.contracts.get("sys_safety_sts", MessageContract("", "", 5)).dlc
            if local_dlc != expected_dlc:
                self.findings.append(
                    AuditFinding(
                        severity="CRITICAL",
                        category="DLC_MISMATCH",
                        target="SysSafetySts (0x011)",
                        description=(
                            f"Local SysSafetySts::kDlc = {local_dlc}, but upstream firmware transmits DLC = {expected_dlc} "
                            "(rolling_counter + e2e_crc added in bytes 3-4). Decoder rejects with UnexpectedLength."
                        ),
                        remediation="Update autoware/src/our_packages/etrike_protocol/generated/cpp/etrike_protocol.hpp",
                    )
                )
        else:
            self.findings.append(
                AuditFinding(
                    severity="CRITICAL",
                    category="PARSE_ERROR",
                    target="SysSafetySts",
                    description="Could not find SysSafetySts in local etrike_protocol.hpp.",
                    remediation="Check struct definition in etrike_protocol.hpp.",
                )
            )

        # 2. Audit RtStateRpt estop_reason range
        m_estop_reason = re.search(
            r"struct RtStateRpt \{.*?if \((?:value\.)?estop_reason > (\d+)\) return CodecStatus::ValueOutOfRange;",
            hpp_text,
            re.DOTALL,
        )
        if m_estop_reason:
            max_reason = int(m_estop_reason.group(1))
            if max_reason < 15:
                self.findings.append(
                    AuditFinding(
                        severity="CRITICAL",
                        category="SIGNAL_RANGE_MISMATCH",
                        target="RtStateRpt (0x210)",
                        description=(
                            f"Local RtStateRpt unpack limits estop_reason <= {max_reason}. "
                            "Firmware widened estop_reason to 4 bits (0..15). Reasons > 7 fail decode."
                        ),
                        remediation="Sync generated etrike_protocol.hpp with 4-bit estop_reason.",
                    )
                )

        # 3. Check for presence of new high-bus structs in header
        new_structs = [
            ("RtNodeStatus", "0x501", "CRITICAL"),
            ("RtDiagRpt", "0x620", "WARNING"),
            ("HostEstopResetReq", "0x114", "WARNING"),
            ("SysEstopResetRsp", "0x115", "WARNING"),
            ("HmiPwrReq", "0x112", "INFO"),
        ]
        for sname, can_id, sev in new_structs:
            if f"struct {sname} {{" not in hpp_text:
                self.findings.append(
                    AuditFinding(
                        severity=sev,
                        category="STRUCT_MISSING",
                        target=f"{sname} ({can_id})",
                        description=f"Struct {sname} ({can_id}) is missing from local etrike_protocol.hpp.",
                        remediation="Update generated headers to include newest contract structs.",
                    )
                )

    def audit_protocol_core_headers(self) -> None:
        """Check protocol core headers for missing utilities."""
        endian_path = self.workspace_root / "autoware/src/our_packages/etrike_protocol/protocol/core/endian.hpp"
        if endian_path.exists():
            content = endian_path.read_text(encoding="utf-8")
            if "read_be_i16" not in content or "write_be_i16" not in content:
                self.findings.append(
                    AuditFinding(
                        severity="WARNING",
                        category="CORE_HEADER_OUTDATED",
                        target="protocol/core/endian.hpp",
                        description="endian.hpp is missing read_be_i16 and write_be_i16 helpers.",
                        remediation="Sync protocol/core/endian.hpp from etrike/main.",
                    )
                )

    def audit_bridge_node_source(self) -> None:
        """Audit autoware_vehicle_bridge source code for protocol gaps."""
        node_cpp = self.workspace_root / "autoware/src/our_packages/autoware_vehicle_bridge/src/vehicle_bridge_node.cpp"
        if not node_cpp.exists():
            self.findings.append(
                AuditFinding(
                    severity="CRITICAL",
                    category="FILE_MISSING",
                    target=str(node_cpp),
                    description="vehicle_bridge_node.cpp not found.",
                    remediation="Check repository structure.",
                )
            )
            return

        cpp_text = node_cpp.read_text(encoding="utf-8")

        # 1. Check RX handling of all High-bus messages
        for msg_id, contract in self.high_bus_messages.items():
            if "Host" in contract.receivers_high:
                # Expected to be handled in publish_vehicle_reports
                hex_id = f"0x{msg_id:03X}"
                id_pattern = rf"(?:CAN_[A-Z_]+|0x{msg_id:03X}|{msg_id}u?)"
                case_pattern = rf"case\s+{id_pattern}:"
                # Also check direct struct kId or kHighId
                has_handling = re.search(case_pattern, cpp_text) or (f"{contract.name}::kId" in cpp_text) or (f"{contract.name}::kHighId" in cpp_text)

                if not has_handling:
                    sev = "WARNING" if msg_id in [0x501, 0x620, 0x115] else "INFO"
                    self.findings.append(
                        AuditFinding(
                            severity=sev,
                            category="UNHANDLED_RX_FRAME",
                            target=f"{contract.name} ({hex_id})",
                            description=f"Host is a receiver of {contract.name} ({hex_id}) on High bus, but frame is not handled in publish_vehicle_reports.",
                            remediation=f"Add decode and diagnostics handler for {contract.name} in vehicle_bridge_node.cpp.",
                        )
                    )

        # 2. Check 0x111 mode request burst / supervised stream handling
        # Looking at on_control_mode: does it send only 1 frame or a multi-frame burst?
        mode_func_m = re.search(r"void VehicleBridgeNode::on_control_mode\s*\([^)]*\)\s*\{(.*?)\n\}", cpp_text, re.DOTALL)
        if mode_func_m:
            mode_body = mode_func_m.group(1)
            send_calls = len(re.findall(r"can_->send\s*\(", mode_body))
            if send_calls == 1 and "for (" not in mode_body and "while (" not in mode_body:
                self.findings.append(
                    AuditFinding(
                        severity="WARNING",
                        category="SUPERVISION_DROPOUT_RISK",
                        target="HMI_MODE_REQ (0x111)",
                        description=(
                            "on_control_mode transmits only a single 0x111 frame. "
                            "sys-esp32 uses a RollingValidator where the 1st frame sets baseline; single frames can be dropped."
                        ),
                        remediation="Transmit 2-3 counter-advancing frames (burst) in on_control_mode so SYS accepts mode transition.",
                    )
                )

        # 3. Check for 0x114 ESTOP Reset support
        if "0x114" not in cpp_text and "HostEstopResetReq" not in cpp_text:
            self.findings.append(
                AuditFinding(
                    severity="WARNING",
                    category="MISSING_TX_CAPABILITY",
                    target="HOST_ESTOP_RESET_REQ (0x114)",
                    description=(
                        "Bridge cannot send 0x114 (magic token 0x5253) to remotely clear a latched SYS ESTOP. "
                        "When Autoware clears emergency, vehicle remains latched in ESTOP until physical button press."
                    ),
                    remediation="Add encode_estop_reset() sending 2+ frames with token 0x5253 when emergency clears.",
                )
            )

        # 4. Check for 0x112 Power request support
        if "0x112" not in cpp_text and "HmiPwrReq" not in cpp_text:
            self.findings.append(
                AuditFinding(
                    severity="INFO",
                    category="MISSING_TX_CAPABILITY",
                    target="HMI_PWR_REQ (0x112)",
                    description="Bridge does not implement remote 0x112 power request for actuator power-on sequence.",
                    remediation="Add optional encode_power_request() method to support full remote startup sequence.",
                )
            )

    def print_report(self) -> int:
        """Format and print findings report. Returns exit code (1 if critical findings exist)."""
        critical_count = sum(1 for f in self.findings if f.severity == "CRITICAL")
        warn_count = sum(1 for f in self.findings if f.severity == "WARNING")
        info_count = sum(1 for f in self.findings if f.severity == "INFO")

        print("=" * 80)
        print(" E-TRIKE CAN PROTOCOL & RT BRIDGE COMPATIBILITY AUDIT")
        print("=" * 80)
        print(f"Upstream Reference: {self.remote_ref}")
        print(f"Workspace Root:     {self.workspace_root}")
        print(f"Total Findings:     {len(self.findings)} ({critical_count} Critical, {warn_count} Warning, {info_count} Info)\n")

        if not self.findings:
            print("[PASS] All contracts, wire layouts, and bridge endpoints are fully aligned!")
            return 0

        color_map = {
            "CRITICAL": "\033[91m[CRITICAL]\033[0m",
            "WARNING": "\033[93m[WARNING] \033[0m",
            "INFO": "\033[94m[INFO]    \033[0m",
        }

        # Check if terminal supports ANSI colors
        supports_color = os.name != "nt" or "WT_SESSION" in os.environ or "ANSICON" in os.environ

        for idx, f in enumerate(self.findings, 1):
            tag = color_map.get(f.severity, f"[{f.severity}]") if supports_color else f"[{f.severity}]"
            print(f"{idx:2d}. {tag} {f.category} - {f.target}")
            print(f"    Issue:       {f.description}")
            print(f"    Remediation: {f.remediation}")
            print()

        print("=" * 80)
        if critical_count > 0:
            print(f"[FAIL] {critical_count} critical gap(s) must be resolved to communicate with RT/SYS.")
            return 1
        elif warn_count > 0:
            print(f"[WARN] No critical blockers, but {warn_count} warning(s) should be reviewed.")
            return 0
        else:
            print("[PASS] Only informational notices found.")
            return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Audit CAN protocol and RT bridge gaps.")
    parser.add_argument(
        "--remote-ref",
        default="etrike/main",
        help="Git ref for upstream firmware contracts (default: etrike/main)",
    )
    parser.add_argument(
        "--workspace",
        type=Path,
        default=Path(__file__).resolve().parents[1],
        help="Workspace root path",
    )
    args = parser.parse_args()

    auditor = ProtocolAuditor(workspace_root=args.workspace, remote_ref=args.remote_ref)
    auditor.load_upstream_contracts()
    auditor.audit_etrike_protocol_hpp()
    auditor.audit_protocol_core_headers()
    auditor.audit_bridge_node_source()

    return auditor.print_report()


if __name__ == "__main__":
    sys.exit(main())
