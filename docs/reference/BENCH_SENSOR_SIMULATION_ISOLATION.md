# Dual-System Architecture & Isolation Guide

## Overview: The Two Coexisting Systems

During bench testing, the E-Trike platform runs two distinct systems concurrently on the same computer:

```
┌────────────────────────────────────────────────────────────────────────┐
│ SYSTEM 1: Autoware Simulation & Wheel Movement (Virtual Road)          │
│                                                                        │
│ • Purpose: Simulates vehicle driving on a Lanelet2 vector road map,     │
│   plans trajectories, and sends motion commands to bench actuators.    │
│ • Localization: Simulated by simple_planning_simulator (map -> base). │
│ • Actuation: autoware_vehicle_bridge forwards commands to CAN bus      │
│   (0x300 speed/gear, 0x303 steering, 0x301 brake).                     │
│ • Requirement: Must drive freely without stopping for lab furniture.   │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ SYSTEM 2: Physical Bench Sensors & Telemetry (Real-World Lab)          │
│                                                                        │
│ • Purpose: Evaluates physical sensors (Hesai LiDAR + Kinect Camera)    │
│   and tests real-time 3D pedestrian/obstacle detection in the room.    │
│ • Environment: Stationary test bench pointing at the room and people.  │
│ • Destination: Streams live data ONLY to the AV Dashboard display.     │
│ • Requirement: Must never touch Autoware planning or localization.    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Why They Must Be Isolated (The Problem)

If physical sensors feed into Autoware's autonomy pipeline while testing on the bench:
1. **Emergency Braking & Wheel Lockup**: Lab walls, desks, or people detected by the Kinect or LiDAR in the room get injected into Autoware's `obstacle_stop_planner`. Autoware treats them as obstacles on the road, commands 0 m/s and full brake, and `vehicle_bridge` locks the physical wheels.
2. **Localization Corruption**: The physical LiDAR is sitting stationary on a desk while the simulated car moves at 15 km/h. Forwarding stationary room point clouds into Autoware's localization matching (`pointcloud_before_sync`) causes map-matching divergence and TF jumps.

---

## The Isolation Solution (How They Run Separately)

1. **Bench Perception Isolation**:
   - `bench_perception_node.py` publishes detected room objects to **`/bench_perception/objects`** (instead of Autoware's `/perception/object_recognition/detection/objects`).
   - Autoware's obstacle stop planner never sees room obstacles, allowing the simulated car to drive smoothly.

2. **LiDAR & Camera Relay Decoupling**:
   - In `hybrid_bench_sensing.launch.py`, raw sensor streams stay on their own topics (`/sensing/lidar/top/pointcloud_raw_ex` and `/kinect_front/*`).
   - Relays into Autoware's internal topics (`pointcloud_before_sync` and `camera0`) are disabled on the bench, protecting simulated localization.

3. **Dashboard Dual-Feed Routing**:
   - `tools/av_dashboard/backend/ros2_bridge.py` subscribes to `/bench_perception/objects`.
   - The AV Dashboard renders the real people and objects in the room on the Radar Scope, while displaying vehicle driving speed and steering from the simulation.
