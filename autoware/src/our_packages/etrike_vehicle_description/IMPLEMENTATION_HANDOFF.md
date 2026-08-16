# E-Trike URDF Handoff

Read this with `DESIGN_REQUIREMENTS.md` before changing the body. The user is
actively reviewing the visual form and does not accept geometry shortcuts that
only appear correct from an oblique camera angle.

## Current production files

- `urdf/vehicle.xacro`: vehicle links, joints, tire geometry, visual mesh, and
  collision approximation.
- `meshes/etrike_body.scad`: canonical editable body source.
- `meshes/etrike_body.stl` and `meshes/etrike_body.obj`: generated production
  meshes; never edit them by hand.
- `scripts/render_body_mesh.mjs`: deterministic SCAD-to-STL/OBJ renderer.
- `DESIGN_REQUIREMENTS.md`: user-approved visual acceptance criteria.

## Current geometry and user intent

- Origin: rear axle midpoint; +X forward, +Y left, +Z up.
- Rear tire centres: `(0, +/-0.575, 0.203)`; front tire centre:
  `(2.000, 0, 0.203)`.
- Tire radius is `0.203 m`; tire width is `0.102 m`.
- The body must be a single simple solid with a Bajaj RE-style tuktuk
  silhouette, not a generic cab or car.
- No lights, mirrors, windows, doors, trim, seats, branding, fenders, or wheel
  covers are allowed.
- The front wheel must remain external and uncovered. The front apron ends at
  X=1.790 m, leaving about `0.0207 m` clearance to the tire.
- The bottom floor is flat at `Z=0.280 m`. Do not introduce an angled rise,
  triangular bottom slice, notch, or cut into the underside.
- The rear body is deliberately shrunk to a straight side edge at
  `Y=+/-0.575 m` over the rear-wheel zone (`X=-0.203` to `+0.203`). In exact
  top view this leaves the outer `0.051 m` of each `0.102 m` tire outside the
  body. Do not replace this with diagonal/triangular cuts from the body middle.
- The rear circular cutter is clipped above the floor so it only clears the
  side wall and cannot deform the underside.

## Important visual-review state

The latest exact orthographic top review showed the rear tires as narrow black
strips beyond the blue body because the requested exposed region is half of
the tire *width* (0.051 m). The user previously objected to earlier attempts
that produced angled cuts. If the user still says the top view is wrong, do
not silently reinterpret the requirement or add cuts; first capture a new
orthographic top view and compare it directly to the wording in
`DESIGN_REQUIREMENTS.md`.

The latest body mesh has 149 vertices and 294 triangles. Every edge has two
incident faces (watertight manifold). The flat floor minimum is `Z=0.280 m`.

## Regenerate and validate

From the repository root:

```powershell
node autoware/src/our_packages/etrike_vehicle_description/scripts/render_body_mesh.mjs `
  autoware/src/our_packages/etrike_vehicle_description/meshes/etrike_body.scad `
  autoware/src/our_packages/etrike_vehicle_description/meshes/etrike_body.stl `
  autoware/src/our_packages/etrike_vehicle_description/meshes/etrike_body.obj `
  rde-urdf/node_modules/@ranchhandrobotics/babylon_ros/dist/openscad-wasm-build/dist/openscad.js
```

Then verify XML parses, STL and OBJ reproduce byte-for-byte, mesh edges are
manifold, and use a true top/side/underside review before committing.

## Local URDF preview state

- `rde-urdf/` is intentionally ignored and has no `.git` directory or GitHub
  connection. It is a local preview tool only, not part of the repository.
- Its local source was changed at `rde-urdf/src/extension.ts` to debounce and
  refresh open previews for `urdf`, `xacro`, `scad`, `stl`, `obj`, `dae`,
  `glb`, and `gltf` file changes.
- `npm run build` completed successfully. The compiled `extension.js` was
  copied into the installed VS Code extension at
  `C:\Users\logsh\.vscode\extensions\ranch-hand-robotics.urdf-editor-1.7.0\dist\extension.js`.
- VS Code must run **Developer: Reload Window** once before the updated
  auto-refresh code is active. Do not add screenshots or the preview tool to
  this Git repository.

## Repository and recent commits

- Main repository remotes: `origin` is `etrike-av`; `etrike` is intentionally
  retained only for E-Trike package updates.
- Current visual-model commits, oldest to newest:
  - `c1b07ab` initial production body model
  - `fa2bf26` tuktuk silhouette refinement and requirements document
  - `90fc24f` flat lower-body profile
  - `8a23f2f` straight rear plan boundary and clarified top-view requirement
- The task artifact directory was deliberately removed in `3d12400`; keep
  future review screenshots in a temporary local location unless the user
  explicitly requests a tracked location.
