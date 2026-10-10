import os
import re
import csv
import json

LOW_CSV = "E:/work/etrike/protocol/generated/csv/buses/low.csv"
DECODER_C = "tools/low_bus_inspector/firmware/main/low_bus_decoder.c"
DECODER_H = "tools/low_bus_inspector/firmware/main/low_bus_decoder.h"
UI_MANAGER_C = "tools/low_bus_inspector/firmware/main/ui_manager.c"

# 1. Parse Low Bus CSV
canonical_msgs = {}
current_id = None
with open(LOW_CSV, "r") as f:
    reader = csv.reader(f)
    header = next(reader)
    for row in reader:
        if not row: continue
        msg_id, msg_name, sender, receivers, dlc, cycle = row[0:6]
        sig_name = row[6]
        if msg_id:
            current_id = int(msg_id, 16)
            canonical_msgs[current_id] = {
                "hex": msg_id,
                "name": msg_name,
                "sender": sender,
                "receivers": receivers,
                "dlc": int(dlc) if dlc else 0,
                "cycle": int(cycle) if cycle else 0,
                "signals": []
            }
        if sig_name and sig_name != "(No signals/Opaque)":
            canonical_msgs[current_id]["signals"].append({
                "name": sig_name,
                "byte": row[7],
                "bit": row[8],
                "size": row[9],
                "type": row[10],
                "scale": row[11],
                "range": row[12],
                "unit": row[13],
                "desc": row[14]
            })

print(f"=== CANONICAL LOW BUS MESSAGES ({len(canonical_msgs)}) ===")
for cid, m in sorted(canonical_msgs.items()):
    sigs = [s["name"] for s in m["signals"]]
    print(f"  {m['hex']} ({m['name']}): sender={m['sender']}, dlc={m['dlc']}, signals={sigs}")

# 2. Check low_bus_decoder.c cases
with open(DECODER_C, "r", encoding="utf-8") as f:
    dec_c = f.read()

cases_in_c = set(re.findall(r"case\s+(0x[0-9a-fA-F]+):", dec_c))
cases_int = {int(x, 16): x for x in cases_in_c}

print("\n=== LOW_BUS_DECODER.C CASES ===")
print("Cases handled:", sorted([hex(x) for x in cases_int.keys()]))

# Missing from decoder
missing_in_decoder = set(canonical_msgs.keys()) - set(cases_int.keys())
print("\nCanonical messages NOT explicitly handled in low_bus_decoder.c:")
for cid in sorted(missing_in_decoder):
    m = canonical_msgs[cid]
    print(f"  {m['hex']} ({m['name']}): sender={m['sender']}")

extra_in_decoder = set(cases_int.keys()) - set(canonical_msgs.keys())
print("\nMessages in decoder NOT in canonical low.csv:")
for cid in sorted(extra_in_decoder):
    print(f"  {hex(cid)}")

# 3. Inspect ui_manager.c for hardcoded / dummy strings and formats
with open(UI_MANAGER_C, "r", encoding="utf-8") as f:
    ui_lines = f.readlines()

print("\n=== SCANNING UI_MANAGER.C FOR STATIC / DUMMY STRINGS ===")
suspicious_patterns = [
    r"RATIO:", r"INV:", r"LIMIT:", r"SUPPLY VOLT: 13.8", r"SUPPLY VOLT:\s*\d", r"CURRENT: OK",
    r"WATCHDOG: LAST SEEN", r"RATIO: 8.5:1", r"CLOSED-LOOP", r"450 kPa", r"442 kPa", r"14.8", r"15.0",
    r"17.8 mm", r"18.0 mm", r"198 deg", r"200 deg", r"8.4 A", r"4.2 A", r"34°C", r"38°C", r"41°C", r"420 msg/s",
    r"CAN FLIGHT RECORDER", r"RAW_CAN_01.LOG", r"LOGGING", r"MODE: SPEED CTRL", r"LIM: 25 km/h",
    r"STATE: RUN", r"STATE CODE: 0x02X", r"RATIO"
]

for idx, line in enumerate(ui_lines, 1):
    for pat in suspicious_patterns:
        if re.search(pat, line) and not line.strip().startswith("//"):
            print(f"Line {idx}: {line.strip()}")
            break
