# Autoware Reference Model Notes

Reference inspected locally:

`autoware/src/launcher/autoware_launch/vehicle/sample_vehicle_launch/sample_vehicle_description/`

Applied conventions:

- `base_link` is the center of the rear axle.
- Vehicle geometry is published through `config/vehicle_info.param.yaml`.
- Planning-simulator parameters live in `config/simulator_model.param.yaml`.
- Mirror crop dimensions live in `config/mirror.param.yaml`.
- The URDF is rooted so sensor-kit links can continue to attach to `base_link`.

E-Trike-specific extension:

- The model exposes three physical wheel links, rear spin joints, and a nested
  front steering/spin joint instead of only a static body mesh.
- The three tires remain native URDF cylinders. The single body visual uses a
  repository-owned STL generated from the canonical OpenSCAD source, so there
  is no third-party runtime dependency and the model remains visible in both
  RViz and `rde-urdf`.
