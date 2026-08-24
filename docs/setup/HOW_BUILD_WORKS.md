# How the build works (and why we don't compile everything)

## The Docker image already has Autoware

The image `ghcr.io/autowarefoundation/autoware:universe-cuda-humble` has **all 300+ Autoware packages pre-built** at `/opt/autoware/`. They were installed via apt.

```bash
source /opt/autoware/setup.bash    # everything works, nothing to build
```

## We only build what we change

```
/opt/autoware/          ← 300+ packages, pre-built (apt), NEVER touched
        +
/workspace/autoware/install/  ← only the packages WE build
        =
merged workspace
```

When the same package exists in both, **ours wins** (the overlay shadows the base).

## Three scenarios

### 1. Our own new package (`our_controller`)

```
Exists in /opt/autoware/?   No
Exists in our install/?      Yes (we built it)
→ Used from our install/
```

### 2. An official package we modified (`autoware_mpc_lateral_controller`)

```
Exists in /opt/autoware/?   Yes (original)
Exists in our install/?      Yes (our modified version)
→ Ours wins. Original is shadowed.
```

### 3. An official package we never touch (`autoware_launch`)

```
Exists in /opt/autoware/?   Yes
Exists in our install/?      No (we never built it)
→ Used from /opt/autoware/. Zero compile time.
```

## What we actually build

```bash
# A new package we wrote
colcon build --symlink-install --packages-select our_controller

# An official package we modified
colcon build --symlink-install --packages-select autoware_mpc_lateral_controller

# That's it. Not 500 packages. Just the ones we changed.
```

## The Docker image never gets rebuilt

| What changed | Action |
|---|---|
| Our code | `colcon build --packages-select <pkg>` |
| Added a ROS dependency | `apt install ros-humble-<pkg>` in container |
| Added a system library | Rebuild Docker image (rare) |
