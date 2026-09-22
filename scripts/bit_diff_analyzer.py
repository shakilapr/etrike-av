#!/usr/bin/env python3
"""Bit-by-bit difference analysis between local and upstream CAN protocol.

Inspects byte and bit layouts, signal boundaries, signedness, min/max bounds,
and bit allocations across local etrike_protocol.hpp and upstream etrike/main.
"""

from __future__ import annotations

import argparse
import os
import re
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple


@dataclass
class FieldBitSpec:
    name: str
    byte: int
    bit_offset: int
    width: int
    signed: bool = False
    min_val: Optional[float] = None
    max_val: Optional[float] = None


@dataclass
class MessageBitMap:
    name: str
    msg_id: int
    dlc: int
    fields: Dict[str, FieldBitSpec] = field(default_factory=dict)
    # Map (byte, bit) -> (field_name, bit_index_in_field)
    bit_to_field: Dict[Tuple[int, int], str] = field(default_factory=dict)

    def populate_bits(self) -> None:
        """Map every (byte, bit) to its signal name."""
        self.bit_to_field.clear()
        for f in self.fields.values():
            # In etrike big-endian / bit-packing layout:
            # f.byte is start byte, f.bit_offset is start bit in that byte.
            # Multi-byte fields cross subsequent bytes.
            curr_byte = f.byte
            curr_bit = f.bit_offset
            for b_idx in range(f.width):
                self.bit_to_field[(curr_byte, curr_bit)] = f.name
                curr_bit += 1
                if curr_bit >= 8:
                    curr_bit = 0
                    curr_byte += 1


def parse_header_structs(header_text: str) -> Dict[str, MessageBitMap]:
    """Parse struct definitions, DLC, and field bit metadata from etrike_protocol.hpp."""
    messages: Dict[str, MessageBitMap] = {}
    pattern = r"struct (\w+) \{(.*?)\n\};"
    for name, body in re.findall(pattern, header_text, re.DOTALL):
        m_id = re.search(r"static constexpr std::uint32_t kId = (0x[0-9a-fA-F]+|\d+)u?;", body)
        m_dlc = re.search(r"static constexpr std::size_t kDlc = (\d+)u?;", body)
        if not m_id or not m_dlc:
            continue

        raw_id = m_id.group(1)
        msg_id = int(raw_id, 16) if raw_id.startswith("0x") else int(raw_id)
        dlc = int(m_dlc.group(1))

        msg = MessageBitMap(name=name, msg_id=msg_id, dlc=dlc)

        meta_pattern = r"struct (\w+)Meta \{(.*?)\};"
        for meta_name, meta_body in re.findall(meta_pattern, body, re.DOTALL):
            f_name = re.sub(r"Meta$", "", meta_name)
            # convert PascalCase to snake_case for field name
            f_snake = re.sub(r"(?<!^)(?=[A-Z])", "_", f_name).lower()

            m_byte = re.search(r"static constexpr std::size_t kByte = (\d+)u?;", meta_body)
            m_bit = re.search(r"static constexpr std::uint8_t kBitOffset = (\d+)u?;", meta_body)
            m_width = re.search(r"static constexpr std::uint8_t kWidth = (\d+)u?;", meta_body)

            if m_byte and m_bit and m_width:
                b = int(m_byte.group(1))
                bo = int(m_bit.group(1))
                w = int(m_width.group(1))

                # Check signedness from field declaration in struct
                # e.g. std::int16_t <f_snake>{};
                is_signed = bool(re.search(rf"std::int\d+_t\s+{f_snake}", body))

                # Check min/max bounds in pack/unpack
                m_min_max = re.search(
                    rf"if \({f_snake} < (-?\d+) \|\| {f_snake} > (-?\d+)\)", body
                ) or re.search(
                    rf"if \(value\.{f_snake} < (-?\d+) \|\| value\.{f_snake} > (-?\d+)\)", body
                )

                min_v = float(m_min_max.group(1)) if m_min_max else None
                max_v = float(m_min_max.group(2)) if m_min_max else None

                if min_v is None and max_v is None:
                    m_max_only = re.search(
                        rf"if \({f_snake} > (\d+)\)", body
                    ) or re.search(
                        rf"if \(value\.{f_snake} > (\d+)\)", body
                    )
                    if m_max_only:
                        min_v = 0.0
                        max_v = float(m_max_only.group(1))

                msg.fields[f_snake] = FieldBitSpec(
                    name=f_snake,
                    byte=b,
                    bit_offset=bo,
                    width=w,
                    signed=is_signed,
                    min_val=min_v,
                    max_val=max_v,
                )

        msg.populate_bits()
        messages[name] = msg

    return messages


def get_git_file(ref: str, path: str, cwd: Path) -> str:
    """Fetch file content from git."""
    cmd = ["git", "show", f"{ref}:{path}"]
    return subprocess.check_output(cmd, cwd=str(cwd), text=True)


class BitDiffAnalyzer:
    """Analyzes differences in bit layout between local and upstream messages."""

    def __init__(self, workspace_root: Path, remote_ref: str = "etrike/main") -> None:
        self.workspace_root = workspace_root
        self.remote_ref = remote_ref

        # Read local header
        local_path = (
            workspace_root
            / "autoware/src/our_packages/etrike_protocol/generated/cpp/etrike_protocol.hpp"
        )
        self.local_text = local_path.read_text(encoding="utf-8")
        self.local_messages = parse_header_structs(self.local_text)

        # Read upstream header
        self.upstream_text = get_git_file(
            remote_ref, "protocol/generated/cpp/etrike_protocol.hpp", workspace_root
        )
        self.upstream_messages = parse_header_structs(self.upstream_text)

    def analyze_message(
        self, msg_name: str
    ) -> Tuple[bool, List[str], List[List[str]]]:
        """Analyze a single message bit by bit.

        Returns: (has_differences, text_diff_lines, grid_rows)
        """
        loc = self.local_messages.get(msg_name)
        ups = self.upstream_messages.get(msg_name)

        diffs: List[str] = []
        grid: List[List[str]] = []

        if not loc and not ups:
            return False, ["Message not found in either local or upstream."], []

        if not loc:
            diffs.append(f"[NEW IN UPSTREAM] Message {msg_name} (ID 0x{ups.msg_id:03X}, DLC {ups.dlc}) does not exist locally.")
            return True, diffs, []

        if not ups:
            diffs.append(f"[DELETED IN UPSTREAM] Message {msg_name} (ID 0x{loc.msg_id:03X}, DLC {loc.dlc}) removed upstream.")
            return True, diffs, []

        has_diff = False

        # 1. DLC Diff
        if loc.dlc != ups.dlc:
            has_diff = True
            diffs.append(f"DLC Mismatch: Local = {loc.dlc} bytes, Upstream = {ups.dlc} bytes (delta {ups.dlc - loc.dlc:+d} bytes)")

        # 2. Bit by bit inspection
        max_bytes = max(loc.dlc, ups.dlc)
        for byte_idx in range(max_bytes):
            byte_has_diff = False
            bit_row_loc = []
            bit_row_ups = []

            for bit_idx in range(8):
                f_loc = loc.bit_to_field.get((byte_idx, bit_idx), ".")
                f_ups = ups.bit_to_field.get((byte_idx, bit_idx), ".")

                bit_row_loc.append(f_loc)
                bit_row_ups.append(f_ups)

                if f_loc != f_ups:
                    has_diff = True
                    byte_has_diff = True
                    diffs.append(
                        f"Byte {byte_idx}, Bit {bit_idx}: "
                        f"Local = '{f_loc}' vs Upstream = '{f_ups}'"
                    )

        # 3. Field metadata bounds diff
        all_field_names = set(loc.fields.keys()) | set(ups.fields.keys())
        for fname in sorted(all_field_names):
            floc = loc.fields.get(fname)
            fups = ups.fields.get(fname)

            if floc and not fups:
                has_diff = True
                diffs.append(f"Signal '{fname}' removed in upstream.")
            elif not floc and fups:
                has_diff = True
                diffs.append(
                    f"Signal '{fname}' added in upstream (Byte {fups.byte}, Bit {fups.bit_offset}, Width {fups.width}b)."
                )
            elif floc and fups:
                if floc.width != fups.width:
                    has_diff = True
                    diffs.append(
                        f"Signal '{fname}' width changed: Local = {floc.width}b, Upstream = {fups.width}b"
                    )
                if floc.byte != fups.byte or floc.bit_offset != fups.bit_offset:
                    has_diff = True
                    diffs.append(
                        f"Signal '{fname}' shifted: Local = (b{floc.byte}:{floc.bit_offset}), "
                        f"Upstream = (b{fups.byte}:{fups.bit_offset})"
                    )
                if floc.min_val != fups.min_val or floc.max_val != fups.max_val:
                    has_diff = True
                    diffs.append(
                        f"Signal '{fname}' bounds changed: "
                        f"Local = [{floc.min_val}, {floc.max_val}], "
                        f"Upstream = [{fups.min_val}, {fups.max_val}]"
                    )

        return has_diff, diffs, grid

    def render_message_bit_table(self, msg_name: str) -> str:
        """Render a side-by-side Markdown bit allocation table for a message."""
        loc = self.local_messages.get(msg_name)
        ups = self.upstream_messages.get(msg_name)

        if not loc and not ups:
            return ""

        max_dlc = max(loc.dlc if loc else 0, ups.dlc if ups else 0)
        msg_id = loc.msg_id if loc else (ups.msg_id if ups else 0)

        lines = []
        lines.append(f"### `{msg_name}` (CAN ID `0x{msg_id:03X}`)")
        lines.append("")
        loc_dlc_str = f"{loc.dlc} bytes" if loc else "N/A"
        ups_dlc_str = f"{ups.dlc} bytes" if ups else "N/A"
        lines.append(f"- **Local DLC**: {loc_dlc_str} | **Upstream DLC**: {ups_dlc_str}")
        lines.append("")
        lines.append("| Byte | Bit 7 | Bit 6 | Bit 5 | Bit 4 | Bit 3 | Bit 2 | Bit 1 | Bit 0 | Status |")
        lines.append("|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---|")

        for b in range(max_dlc):
            # Upstream row
            ups_cells = []
            loc_cells = []
            diff_in_byte = False

            for bit in range(7, -1, -1):
                f_u = ups.bit_to_field.get((b, bit), "-") if ups and b < ups.dlc else "N/A"
                f_l = loc.bit_to_field.get((b, bit), "-") if loc and b < loc.dlc else "N/A"

                if f_u != f_l:
                    diff_in_byte = True
                    ups_cells.append(f"**`{f_u}`**" if f_u != "-" else "-")
                    loc_cells.append(f"`{f_l}`" if f_l != "-" else "-")
                else:
                    ups_cells.append(f"`{f_u}`" if f_u != "-" else "-")
                    loc_cells.append(f"`{f_l}`" if f_l != "-" else "-")

            status_str = "MODIFIED" if diff_in_byte else "IDENTICAL"
            if b >= (loc.dlc if loc else 0):
                status_str = "**ADDED IN UPSTREAM**"
            elif b >= (ups.dlc if ups else 0):
                status_str = "**DELETED IN UPSTREAM**"

            lines.append(
                f"| **Byte {b} (Local)** | "
                + " | ".join(loc_cells)
                + f" | {status_str} |"
            )
            lines.append(
                f"| **Byte {b} (Upstream)** | "
                + " | ".join(ups_cells)
                + f" | {'DIFF' if diff_in_byte else 'OK'} |"
            )

        lines.append("")
        return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="CAN protocol bit-by-bit difference analyzer.")
    parser.add_argument(
        "--remote-ref",
        default="etrike/main",
        help="Upstream git ref (default: etrike/main)",
    )
    parser.add_argument(
        "--workspace",
        type=Path,
        default=Path(__file__).resolve().parents[1],
        help="Workspace root path",
    )
    parser.add_argument(
        "--markdown",
        action="store_true",
        help="Output full Markdown tables for every modified message",
    )
    parser.add_argument(
        "--message",
        type=str,
        help="Analyze a specific message name (e.g. SysSafetySts, RtStateRpt)",
    )
    args = parser.parse_args()

    analyzer = BitDiffAnalyzer(workspace_root=args.workspace, remote_ref=args.remote_ref)

    # Focus on High bus messages relevant to Host <-> RT/SYS communication
    target_messages = [
        "SysSafetySts",
        "RtStateRpt",
        "RtMotionRpt",
        "RtNodeStatus",
        "RtDiagRpt",
        "RtWheelSpeedSts",
        "MtrMotorFbk",
        "HostDriveCmd",
        "HostSteerCmd",
        "HostBrakeReq",
        "HostLightCmd",
        "HostHeartbeat",
        "RtHeartbeat",
        "HmiModeReq",
        "HmiPwrReq",
        "HostEstopResetReq",
        "SysEstopResetRsp",
        "SysDiagRpt",
        "SysNodeStatus",
        "SafetyEstop",
    ]

    if args.message:
        target_messages = [args.message]

    modified_count = 0
    print("=" * 80)
    print(" E-TRIKE CAN PROTOCOL BIT-BY-BIT DIFFERENCE ANALYSIS")
    print("=" * 80)
    print(f"Comparing Local (etrike_protocol.hpp) vs Upstream Ref ({args.remote_ref})\n")

    for msg_name in target_messages:
        has_diff, diff_lines, _ = analyzer.analyze_message(msg_name)
        if has_diff:
            modified_count += 1
            print(f">>> [DIFF DETECTED] {msg_name}:")
            for d in diff_lines:
                print(f"    * {d}")
            print()
            if args.markdown:
                print(analyzer.render_message_bit_table(msg_name))
        else:
            print(f"[OK] {msg_name}: Bit-identical.")

    print("=" * 80)
    print(f"Summary: {modified_count} message(s) have bit-level differences.")
    return 1 if modified_count > 0 else 0


if __name__ == "__main__":
    sys.exit(main())
