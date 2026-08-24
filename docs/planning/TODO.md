# TODO: Support non-default vehicle types in Autoware simulation

This tracks work needed to run Autoware simulation with vehicle types other than
the default `sample_vehicle` (a generic 4-wheel car, originally Lexus-based).

Relevant packages / locations:
- Ego description (URDF + mesh + config): `autoware_launch/vehicle/sample_vehicle_launch/sample_vehicle_description/` (`urdf/`, `mesh/`, `config/`)
- Ego dynamics/limits parameters: `vehicle_info_param` (wheelbase, vehicle length/width, max steer, max accel/brake, tire positions)
- Alternate ego presets: `autoware_launch/vehicle/awsim_labs_vehicle_launch/`
- External-sim bridge: `autoware_universe/simulator/autoware_carla_interface/`

## Background / constraints

Autoware models the ego vehicle as a **bicycle model**: 4 wheels, Ackermann
steering (steering angle + accel/brake), defined by a wheelbase and footprint.
The entire planning/control stack assumes this kinematic model. As a result:

- 4-wheel Ackermann vehicles (van, bus, truck, box truck) are feasible by only
  changing parameters and the visual mesh.
- Non-Ackermann vehicles (tricycle, tuk-tuk / auto-rickshaw, motorbike) are NOT
  supported by the default simulator and require custom vehicle dynamics plus a
  physics-based simulator.

## Tasks

- [ ] **Swap the visual model of the ego vehicle**
  - Replace the URDF/mesh in `sample_vehicle_description` (or point the launch
    file to a custom description package) so the simulated vehicle looks like the
    target type. This affects RViz/visualization only, not dynamics.

- [ ] **Update `vehicle_info_param` for a van / bus / truck**
  - Set wheelbase, vehicle length, vehicle width, front/rear tire positions,
    maximum steering angle, maximum acceleration/brake, and minimum turning radius
    to match the target 4-wheel vehicle.
  - Relaunch Autoware with the updated `vehicle_model` / `sensor_model` arguments.
  - Validate that footprint, turn radius, and stop/start behavior match the new size.

- [ ] **Verify control & planning behavior for large vehicles (bus/truck)**
  - Re-tune `autoware_raw_vehicle_cmd_converter` accel/brake maps and
    `external_cmd_converter` limits for the heavier/slower vehicle.
  - Check lane-change, turning, and obstacle avoidance margins given the larger
    footprint.

- [ ] **(Non-Ackermann) Implement a custom vehicle model for tricycle / tuk-tuk**
  - The default bicycle model does not represent single-front-wheel steering.
  - Add a custom vehicle model (e.g., tricycle/kinematic-single-track) and bridge
    it to Autoware's `VehicleCommand` / `SteeringReport` interfaces.
  - Use a physics-based simulator (CARLA via `autoware_carla_interface`, or
    AWSIM/AWSIM-Labs) that supports importing a custom vehicle with real dynamics.

- [ ] **(Non-Ackermann) Add motorbike support**
  - Motorbike requires single-track / lean dynamics, which the default stack does
    not model.
  - Wrap the bike dynamics behind the Ackermann command interface in an external
    simulator and bridge state into Autoware; expect significant tuning/limitations.

- [ ] **Pick the right simulator for the target vehicle**
  - Default `sample_vehicle` + Autoware planning: van / bus / truck only.
  - CARLA (`autoware_carla_interface`) or AWSIM-Labs (`awsim_labs_vehicle_launch`):
    for custom/non-standard vehicle meshes and dynamics.

- [ ] **Document the chosen vehicle configuration**
  - Record which `vehicle_info_param` values and which description package were
    used, and any control/planning parameter changes, so the setup is reproducible.
