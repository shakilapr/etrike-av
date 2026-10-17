#!/usr/bin/env python3
import os
import sys
import time
import hashlib
import subprocess

TARGET_HOST = sys.argv[1] if len(sys.argv) > 1 else "med1@10.226.206.145"
REMOTE_FILE = sys.argv[2] if len(sys.argv) > 2 else "~/av_project/data/recordings/raw_sensors_20261017_125516/raw_sensors_20261017_125516_0.mcap.zstd"
LOCAL_FILE = sys.argv[3] if len(sys.argv) > 3 else r"e:\work\av_project\data\recordings\raw_sensors_20261017_125516\raw_sensors_20261017_125516_0.mcap.zstd"
EXPECTED_MD5 = "e7404a52e2ca9ee707992421c265788a"

local_size = os.path.getsize(LOCAL_FILE) if os.path.exists(LOCAL_FILE) else 0

# Get remote total size
cmd = ["ssh", "-o", "ConnectTimeout=5", TARGET_HOST, f"stat -c %s {REMOTE_FILE}"]
res = subprocess.run(cmd, capture_output=True, text=True, check=True)
remote_size = int(res.stdout.strip())

print(f"Remote file: {remote_size:,} bytes ({remote_size / (1024*1024):.2f} MB)")
print(f"Local file:  {local_size:,} bytes ({local_size / (1024*1024):.2f} MB)")

if local_size >= remote_size:
    print("Local file already matches or exceeds remote size.")
else:
    remaining = remote_size - local_size
    pct_done = (local_size / remote_size) * 100
    print(f"Progress:    {pct_done:.1f}% ({local_size / (1024*1024):.2f} MB / {remote_size / (1024*1024):.2f} MB)")
    print(f"Remaining:   {remaining:,} bytes ({remaining / (1024*1024):.2f} MB, {100 - pct_done:.1f}% left)")
    print("Resuming download...")

    start_byte = local_size + 1
    remote_cmd = f"tail -c +{start_byte} {REMOTE_FILE}"
    ssh_proc = subprocess.Popen(["ssh", TARGET_HOST, remote_cmd], stdout=subprocess.PIPE, bufsize=1024*1024)

    start_time = time.time()
    last_print = start_time
    bytes_downloaded = 0

    with open(LOCAL_FILE, "ab") as f:
        while True:
            chunk = ssh_proc.stdout.read(512 * 1024)
            if not chunk:
                break
            f.write(chunk)
            bytes_downloaded += len(chunk)
            now = time.time()
            if now - last_print >= 2.0:
                cur_total = local_size + bytes_downloaded
                pct = (cur_total / remote_size) * 100
                speed = (bytes_downloaded / (now - start_time)) / (1024 * 1024)
                eta = (remote_size - cur_total) / (speed * 1024 * 1024) if speed > 0 else 0
                print(f"[{pct:.1f}%] {cur_total / (1024*1024):.1f}/{remote_size / (1024*1024):.1f} MB | {speed:.2f} MB/s | ETA: {int(eta)}s", flush=True)
                last_print = now

    ssh_proc.wait()
    print("Download finished. Validating integrity...")

# Compute MD5
h = hashlib.md5()
with open(LOCAL_FILE, "rb") as f:
    while chunk := f.read(4 * 1024 * 1024):
        h.update(chunk)
local_md5 = h.hexdigest()

print(f"Expected MD5: {EXPECTED_MD5}")
print(f"Local MD5:    {local_md5}")
if local_md5 == EXPECTED_MD5:
    print("[SUCCESS] MD5 checksum verified! File is 100% complete and uncorrupted.")
else:
    print("[ERROR] MD5 mismatch! The file may need to be re-downloaded.")
