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
- PASS: the body side ends on each rear-wheel center plane (Y=+/-0.575 m),
  leaving the outer 0.051 m, exactly half of each 0.102 m tire width, visible
  from above

## Body mesh

- PASS: original repository-owned geometry
- PASS: canonical OpenSCAD source uses a closed body envelope and two
  side-localized circular Boolean cutters
- PASS: generated OBJ has 148 vertices and 292 triangles
- PASS: generated ASCII STL has 292 triangles
- PASS: the checked-in OBJ and STL reproduce byte-for-byte from the canonical
  SCAD source with `render_body_mesh.mjs`
- PASS: every mesh edge has exactly two incident faces (watertight manifold)
- PASS: main body width is 1.150 m, modeled overall-width allowance is
  1.300 m, and top height is 1.700 m
- PASS: body front ends at X=1.800 m, 0.200 m behind the front-wheel center
- PASS: body lower front edge is Z=0.300 m
- PASS: rear/main lower body edge remains at its prior Z=0.280 m position;
  only the lateral body plane changed for the half-width requirement
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
visible through fitted openings. The side wall is aligned to each tire's center
plane at Y=+/-0.575 m, while the prior vertical body profile is unchanged. This
exposes exactly the requested outer half of each rear tire width when viewed
from above; it does not move the wheel opening up or down.

## EDE/RDE preview evidence

- Production-orientation render:
  `../screenshots/solid-bajaj-no-nose-exposed-front-wheel.png`
- Front three-quarter review proving the reference-scaled wheel clearance:
  `../screenshots/tight-front-gap-reference-scaled.png`
- Rear circular-opening review:
  `../screenshots/rear-wheel-circular-arches-settled.png`
- Side-oriented circular-opening review:
  `../screenshots/rear-wheel-circular-arch-side-settled.png`
- Final front review: `../screenshots/final-six-view-front.png`
- Final rear review: `../screenshots/final-six-view-rear.png`
- Final left review: `../screenshots/final-six-view-left.png`
- Final right review: `../screenshots/final-six-view-right.png`
- Final roof-dominant review: `../screenshots/final-six-view-top.png`
- Final temporary underside review: `../screenshots/final-six-view-bottom.png`
- Exact plan-width proof: `../screenshots/final-top-half-tire-width-proof.png`
- Plan-width proof input: `../snapshots/top-half-tire-width-proof.xacro`
- Immutable final production Xacro input:
  `../snapshots/final-half-width-rear-wheel-visibility/vehicle.xacro`
- Canonical body source:
  `../snapshots/final-half-width-rear-wheel-visibility/etrike_body.scad`

The directional screenshots use temporary preview-only root rotations because
the RDE screenshot API does not expose camera controls. The roof image uses the
production orientation; the underside image uses a temporary upside-down root
joint. The production Xacro coordinate frame was not changed. Pre-change
versions are retained under `../snapshots/backup-before-rear-wheel-arches/`
and `../snapshots/backup-before-half-width-rear-visibility/`.

## ROS build environment

A focused `colcon` build was attempted earlier. The Windows shell cannot find
the unsourced ROS 2 `ament_cmake` and unbuilt Autoware message dependencies.
The retained logs are under `colcon-attempt/`. The mesh, XML, Xacro topology,
configuration consistency, and EDE rendering checks pass; repeat `colcon`
inside the project's supported sourced ROS 2/Autoware environment before
deployment.
