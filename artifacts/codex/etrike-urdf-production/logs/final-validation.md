# Final Validation — 2026-08-14

## Xacro and vehicle topology

- PASS: XML parses successfully
- PASS: robot name is `etrike`
- PASS: 6 links and 5 joints with one root, `base_footprint`
- PASS: two rear continuous wheel joints
- PASS: one revolute front steering joint with a nested continuous wheel joint
- PASS: 4 visuals: one solid body plus three exposed tires
- PASS: 9 collisions and 5 inertials
- PASS: every moving joint has damping and friction
- PASS: modeled kerb mass is 362 kg
- PASS: wheelbase 2.000 m, rear track 1.150 m, tire radius 0.203 m, and tire
  width 0.102 m
- PASS: no lights, windows, trim, hubs, mudguards, or wheel covers
- PASS: circular rear body openings expose both rear tires

## Body mesh

- PASS: original repository-owned geometry
- PASS: canonical OpenSCAD source uses a closed body envelope and two
  side-localized circular Boolean cutters
- PASS: generated OBJ has 108 vertices and 212 triangles
- PASS: generated ASCII STL has 212 triangles
- PASS: every mesh edge has exactly two incident faces (watertight manifold)
- PASS: body width 1.300 m and top height 1.700 m
- PASS: body front ends at X=1.800 m, 0.200 m behind the front-wheel center
- PASS: body lower front edge is Z=0.300 m
- PASS: nearest body-to-tire surface clearance is 0.0193 m
- PASS: each rear wheel opening has radius 0.225 m, giving 0.022 m radial
  clearance around the 0.203 m tire

The two forward nose stations were removed after comparison with a Bajaj RE
side photograph. A subsequent measurement against the downloaded model found
that the first apron left too much space: its diagonal surface clearance was
about 0.193 m. The apron was lowered and extended behind the wheel to reproduce
the reference model's approximately 0.017 m scaled clearance. The production
clearance is now 0.0193 m. The normal separate Bajaj mudguard is intentionally
omitted per the requested uncovered-wheel design.

The original angled lower-side clearance at the rear wheels was replaced with
two circular side cuts centered on the rear axle. Each cutter penetrates only
the outer side wall, so the center floor remains solid and both rear tires are
visible through fitted openings.

## EDE/RDE preview evidence

- Production-orientation render:
  `../screenshots/solid-bajaj-no-nose-exposed-front-wheel.png`
- Front three-quarter review proving the reference-scaled wheel clearance:
  `../screenshots/tight-front-gap-reference-scaled.png`
- Rear circular-opening review:
  `../screenshots/rear-wheel-circular-arches-settled.png`
- Side-oriented circular-opening review:
  `../screenshots/rear-wheel-circular-arch-side-settled.png`
- Immutable production Xacro input:
  `../snapshots/circular-rear-wheel-arches/vehicle.xacro`
- Canonical body source:
  `../snapshots/circular-rear-wheel-arches/etrike_body.scad`

The front-view screenshot used a temporary preview-only 180-degree root
rotation because EDE's default camera faces the rear. The production Xacro
coordinate frame was not changed. The pre-arch production version is retained
under `../snapshots/backup-before-rear-wheel-arches/`.

## ROS build environment

A focused `colcon` build was attempted earlier. The Windows shell cannot find
the unsourced ROS 2 `ament_cmake` and unbuilt Autoware message dependencies.
The retained logs are under `colcon-attempt/`. The mesh, XML, Xacro topology,
configuration consistency, and EDE rendering checks pass; repeat `colcon`
inside the project's supported sourced ROS 2/Autoware environment before
deployment.
