"""Bit-Level Signal Decoding and Matrix Cell Formatting for CAN frames."""

from __future__ import annotations

from typing import Any, Dict, List, Optional, Tuple

from .contracts_models import MessageDef, SignalDef


def decode_can_frame(
    msg_def: Optional[MessageDef], data: bytes
) -> Tuple[Dict[str, Any], List[Dict[str, Any]]]:
    """Decode payload bytes for a CAN ID into physical values and a 64-bit matrix."""
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
            elif sig.endian == "big" and (sig.bit + sig.bits) <= 8:
                mask = (1 << sig.bits) - 1
                if sig.byte < data_len:
                    raw_val = (data[sig.byte] >> sig.bit) & mask
            elif sig.endian == "big":
                # Unaligned or non-byte-multiple big-endian signal across byte boundaries
                remaining = sig.bits
                cur_byte = sig.byte
                cur_bit = sig.bit
                while remaining > 0 and cur_byte < data_len:
                    take = min(remaining, 8 - cur_bit)
                    mask = (1 << take) - 1
                    chunk = (data[cur_byte] >> cur_bit) & mask
                    raw_val = (raw_val << take) | chunk
                    remaining -= take
                    cur_byte += 1
                    cur_bit = 0
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
