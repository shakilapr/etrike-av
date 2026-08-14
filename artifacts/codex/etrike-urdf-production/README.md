# E-Trike URDF Production Task Artifacts

This directory contains generated evidence and working records for the E-Trike
URDF implementation. It intentionally keeps screenshots and task logs outside
the project documentation tree.

## Layout

- `screenshots/`: preview captures from `rde-urdf`
- `logs/`: validation and preview-processing records
- `notes/`: implementation decisions and source-reference notes
- `snapshots/`: immutable Xacro inputs used for preview evidence
- `downloads/`: quarantined third-party model candidates and license records

The final six-direction review set is named `final-six-view-{front,rear,left,
right,top,bottom}.png`. Review-only Xacro rotations are not retained in the
production package.

`final-top-half-tire-width-proof.png` is a plan-layout check showing that only
the outer 0.051 m of each 0.102 m rear tire remains visible beyond the body.

The production model remains at
`autoware/src/our_packages/etrike_vehicle_description/urdf/vehicle.xacro`.
