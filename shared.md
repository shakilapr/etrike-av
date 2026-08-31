ssh -N -L 8385:127.0.0.1:8384 med1@172.16.25.67


http://127.0.0.1:8385

med1@ubuntu:~$ ssh -N -L 8385:127.0.0.1:8384 med1@172.16.25.67
The authenticity of host '172.16.25.67 (172.16.25.67)' can't be established.
ED25519 key fingerprint is SHA256:U8Z34y+aXlxr9/Gp0/K76VYsxDbKZfm9tmolw4LSmO0.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '172.16.25.67' (ED25519) to the list of known hosts.
med1@172.16.25.67's password: 





cd ~/av_project
./docker/shell.sh
./scripts/lidar_standalone.sh


med1@ubuntu:~/av_project$ ./docker/shell.sh
./scripts/lidar_standalone.sh
bash: ./docker/shell.sh: Permission denied
not found: "/opt/ros/humble/local_setup.bash"
not found: "/opt/autoware/local_setup.bash"
/home/med1/av_project/autoware/install/setup.bash: line 11: COLCON_TRACE: unbound variable
med1@ubuntu:~/av_project$ 

---

# ✅ LiDAR standalone viewer — WORKING (2026-08-18)

## One command (run on the HOST, from ~/av_project)

```bash
./scripts/lidar_standalone.sh
```

- Checks the sensor is reachable, starts a detached container `lidar_rviz`
  that runs the Nebula Hesai driver + RViz2 (opens on the Jetson desktop,
  display `:1`). Point cloud appears within ~15 s.
- Logs: `docker logs -f lidar_rviz` — Stop: `docker rm -f lidar_rviz`
- Also works INSIDE the container (`./docker/shell.sh` → run it there).

## The saved config

**Package `etrike_lidar_viewer`** (`autoware/src/our_packages/etrike_lidar_viewer/`)
- `launch/lidar_view.launch.py` — ALL working driver params (25+ required
  params Nebula declares with no defaults), `udp_only: true`,
  `host_ip: 0.0.0.0`, remap `aw_points_ex` → `pointcloud_raw_ex`,
  static TF `base_link → lidar_link` (z = 1.7464), firetime + angle CSVs
  from `etrike_common_launch/config/lidar/`.
- `rviz/lidar_only.rviz` — fixed frame `lidar_link`, Best-Effort QoS,
  rainbow-intensity display of `/sensing/lidar/top/pointcloud_raw_ex`.

**Network (persistent via NetworkManager)**
- `Wired connection 1` on `eno1`: static `192.168.1.10/24`
  (NM kept wiping manual `ip addr add` — must go through `nmcli`).
- Sensor: `192.168.1.201`, UDP point cloud `2368` (broadcast to
  255.255.255.255), GNSS `10110`, web UI `http://192.168.1.201`.

## How it was made to work (pitfalls, in order)

1. Nebula standalone needs ~25 params the Autoware launch normally injects —
   driver crashes one-by-one with `UninitializedStaticallyTypedParameterException`
   (cut_angle, sync_angle, retry_hw, diag_span, diagnostics.*, ...).
2. Topic is `aw_points_ex`, NOT the legacy `velodyne_points` the container
   launch remaps.
3. Sensor broadcasts → driver must bind `0.0.0.0`, not the host IP.
4. Sensor's PTC port 9347 is CLOSED (only HTTP 80 open) → `udp_only: true`
   skips TCP entirely. For full Autoware later: enable PTC via the sensor
   web UI.
5. RViz needs `lidar_link` in the TF tree → static TF publisher.
6. `ros2 topic hz` shows nothing on best-effort topics (QoS mismatch) — the
   driver's own `/diagnostics` "Publish rate 10.02" is the reliable check.

Verified: firetime CSV loads (32 channels), publish rate 10.02 Hz,
publisher+RViz subscription matched.