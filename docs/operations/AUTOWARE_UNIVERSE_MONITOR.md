# Open Autoware Universe on the Jetson Monitor

How to launch the **E-Trike Autoware Universe** planning simulation with RViz on
the Jetson's physical display (`DISPLAY=:1`).

> **For the full stack run (Autoware Universe + CANable USB-CAN + bridge in sim
> mode), use the consolidated guide: [`docs/operations/ETRIKE_RUN.md`](ETRIKE_RUN.md).**
> This page is the focused Autoware-Universe-on-monitor walkthrough.

This is the documented E-Trike run
(`docs/operations/ETRIKE_RUN.md`): `planning_simulator.launch.xml` with
`vehicle_model:=etrike_vehicle sensor_model:=etrike_sensor_kit`. It is the
*dummy-perception* planning simulator — no real CAN/sensors, safe, no vehicle
motion.

## Prerequisites

- Jetson reachable by SSH (`med1@<jetson-ip>`). **The Jetson IP can change**
  (we have seen `172.16.25.56` → `172.16.25.67`). Verify the current IP before
  connecting (check the machine / `arp` / router).
- Docker present; image
  `ghcr.io/autowarefoundation/autoware:universe-cuda-humble` already pulled.
- Map at `~/autoware_map/sample-map-planning` on the Jetson.
- Workspace built on the Jetson at `~/av_project/autoware` (`install/` exists).

## Steps

### 1. SSH to the Jetson

```bash
ssh med1@<jetson-ip>
```

### 2. Allow the container to use the X server

Run this on the **Jetson host** (not inside the container), every time the X
server has restarted:

```bash
DISPLAY=:1 xhost +local:docker
```

### 3. (Re)create the container with the X socket mounted

The container **must** be started with `-e DISPLAY=:1` and the
`/tmp/.X11-unix` socket mounted, or RViz cannot open on the monitor. Recreate it
if the running container is missing those (e.g. a bridge-test container started
without the display mount):

```bash
docker rm -f autoware_test

docker run -d --name autoware_test \
  --privileged --runtime=nvidia --gpus all \
  --net=host --ipc=host \
  -e DISPLAY=:1 \
  -v /tmp/.X11-unix:/tmp/.X11-unix:ro \
  -v ~/av_project/autoware:/workspace/autoware \
  -v ~/autoware_map:/autoware_map \
  ghcr.io/autowarefoundation/autoware:universe-cuda-humble \
  bash -c 'while true; do sleep 1000; done'
```

If a container already exists **with** the `DISPLAY=:1` / X-socket mount, skip
to step 4.

### 4. Launch Autoware Universe (with RViz)

```bash
docker exec -d autoware_test bash -c \
  'export DISPLAY=:1; \
   source /opt/autoware/setup.bash; \
   source /workspace/autoware/install/setup.bash; \
   ros2 launch autoware_launch planning_simulator.launch.xml \
     map_path:=/autoware_map/sample-map-planning \
     vehicle_model:=etrike_vehicle \
     sensor_model:=etrike_sensor_kit \
     rviz:=true'
```

`rviz:=true` loads the **default `autoware.rviz`**. Do **not** pass a custom
`rviz_config` — the old `etrike.rviz` references lidar topics
(`/sensing/lidar/top/pointcloud_raw_ex`, `pointcloud_before_sync`) that do not
exist in dummy-perception planning sim and produce RViz errors.

### 5. Verify RViz opened

```bash
docker exec autoware_test ps aux | grep rviz2
```

You should see a process like:

```
/opt/ros/humble/lib/rviz2/rviz2 -d /opt/autoware/autoware_launch/share/autoware_launch/rviz/autoware.rviz ...
```

RViz should now be visible on the Jetson monitor (`DISPLAY=:1`).

## Drive (in RViz)

1. **2D Pose Estimate** → set initial position on the map.
2. **2D Goal Pose** → set destination.
3. **AutowareStatePanel → Engage**.

Pre-engage messages such as `Fixed Frame [map] does not exist` and
`topic not received` are **normal** until you set the pose + goal and engage.

## Gotchas

- **`xhost` must run on the Jetson host**, where the X server lives. Forgetting
  it (or running it inside the container) makes RViz fail to connect — the
  `rviz2` process simply never appears.
- **No `rviz2` after launch?** Check the container was started with
  `-e DISPLAY=:1` and the `/tmp/.X11-unix` mount (`docker inspect autoware_test`).
  If missing, recreate it (step 3).
- Only **one** Autoware ROS system per host: do not run a second
  `--net=host` container (e.g. a `vehicle_bridge` test) alongside this one —
  they share the ROS graph and collide on topics/nodes. To run the bridge, wire
  it into the sim or use a separate host.
- This is the planning simulator: the `autoware_vehicle_bridge` CAN node is
  **not** launched here (`vehicle_simulation=true`). The bridge is tested
  separately (see `autoware_vehicle_bridge/README.md`).
