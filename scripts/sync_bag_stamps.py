#!/usr/bin/env python3
import sqlite3
import struct
import time

db_path = '/dev/shm/etrike_loop_01_trimmed/etrike_loop_01_0.db3'
print(f"Connecting to {db_path}...")
conn = sqlite3.connect(db_path)
c = conn.cursor()

# Get all messages
c.execute("SELECT id, timestamp, data FROM messages")
rows = c.fetchall()
print(f"Total messages to process: {len(rows)}")

t0 = time.time()
updated = 0
updates = []
for msg_id, ts, data in rows:
    sec = ts // 1_000_000_000
    nsec = ts % 1_000_000_000
    # Replace header.stamp (bytes 4..12) with row timestamp
    new_stamp = struct.pack('<II', sec, nsec)
    new_data = data[:4] + new_stamp + data[12:]
    updates.append((new_data, msg_id))
    updated += 1

c.executemany("UPDATE messages SET data = ? WHERE id = ?", updates)
conn.commit()
conn.close()

dt = time.time() - t0
print(f"[OK] Successfully synchronized {updated} messages in {dt:.2f} seconds!")
