#!/usr/bin/env python3
"""Convert bridge_auto_log.csv (long format) into a wide one-sheet CSV.

Input columns:  wall_time, ros_sec, ros_nanosec, topic, data(JSON)
Output columns: #, time, <one column per topic>

Default: each output row = one input message; only the publishing topic's
column is filled (others empty) -- i.e. "filled when it publishes".

With --forward-fill: every row carries the most recent value of *every* topic
(carried forward), handy for plotting in a spreadsheet.
"""

import argparse
import csv


def main() -> None:
    ap = argparse.ArgumentParser(
        description="Convert bridge_auto_log.csv to a wide one-sheet CSV."
    )
    ap.add_argument("--in", dest="inp", default="bridge_auto_log.csv")
    ap.add_argument("--out", default="bridge_wide.csv")
    ap.add_argument(
        "--forward-fill",
        action="store_true",
        help="Carry the latest value of every topic into each row.",
    )
    args = ap.parse_args()

    rows = []
    topics = []
    seen = set()
    with open(args.inp, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
            if row["topic"] not in seen:
                seen.add(row["topic"])
                topics.append(row["topic"])
    topics.sort()

    out_cols = ["#", "time"] + topics
    with open(args.out, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(out_cols)
        last = {t: "" for t in topics}
        for i, row in enumerate(rows, 1):
            t = row["topic"]
            val = row["data"]
            if args.forward_fill:
                last[t] = val
                cells = [last[x] for x in topics]
            else:
                cells = [(val if x == t else "") for x in topics]
            w.writerow([i, row["wall_time"]] + cells)
    print(
        f"wrote {len(rows)} rows x {len(out_cols)} cols -> {args.out} "
        f"(forward_fill={args.forward_fill})"
    )


if __name__ == "__main__":
    main()
