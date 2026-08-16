# E-Trike Visual Design Requirements

This is the acceptance specification for the visual body in `urdf/vehicle.xacro`
and `meshes/etrike_body.scad`. It records the requested appearance so that
future mesh edits are reviewed against the vehicle rather than treated as a
generic cabin.

## Required form

- The model shall read as a simplified Bajaj RE-style tuktuk, not as a boxy
  van, cab, or car.
- The body shall be one closed, solid, watertight visual mesh. It may use
  smooth or low-poly cross sections, but it must not be an open shell.
- The passenger cabin shall be tall at the rear, have a compact rounded/sloped
  roof profile, and transition into a distinctly sloped front windshield and
  short lower apron.
- The front apron shall stop behind the front-wheel centre. There shall be no
  pointed nose, fender, roof extension, or body shape above the front tire.
- The front wheel shall sit close to the apron without intersecting it; the
  target clearance is approximately 0.02 m.

## Wheels and clearances

- There shall be exactly three exposed tires: two rear tires and one front
  tire. No wheel covers, mudguards, fenders, hubs, or decorative wheel parts
  may be added.
- Rear body clearances shall be circular around the tire profile. Angled,
  straight sliced cuts through the rear body are not acceptable.
- In plan/top view, the body side shall finish at each rear tire centre plane:
  Y = +/-0.575 m. With the 0.102 m tire width centred there, the outer 0.051 m
  (one half of the tire width) shall remain visibly outside the body on each
  side. This is a left/right requirement only; do not move the body or tires
  up or down to satisfy it.
- The centre floor shall remain solid between the rear tires.

## Deliberate simplification

- Do not model lights, indicators, mirrors, windows, doors, trim, seats,
  branding, steering controls, or textures.
- The body is a clean solid silhouette only; visual character comes from its
  tuktuk proportions and wheel placement, not added features.

## Fixed geometry

| Item | Requirement |
|---|---:|
| Rear axle midpoint to front wheel | 2.000 m |
| Rear wheel track | 1.150 m |
| Tire radius | 0.203 m |
| Tire width | 0.102 m |
| Overall length | 2.635 m |
| Overall width allowance | 1.300 m |
| Overall height | 1.700 m |
| Ground clearance | 0.170 m |

The 2.635 m overall length is measured from the rear body panel at X=-0.432 m
to the front tire edge at X=2.203 m. This keeps the front tire as the foremost
element, as required by the uncovered-wheel design.

## Visual acceptance checks

- Front three-quarter: uncovered front tire is clearly external; no nose or
  canopy overlaps it.
- Rear three-quarter: both rear tires have fitted circular body clearances and
  no angular slice through the body.
- Left and right: the cabin is recognisably tuktuk-shaped, with a rear cabin,
  sloped windshield, and short low apron rather than a rectangular cab.
- Top: both rear tires visibly project by one half of their width beyond the
  body sides; this is checked against the tire centre planes, not perspective.
- Bottom: the floor remains solid and the tires do not intersect collision or
  visual body geometry.
- Any preview screenshot is review evidence only and must not be committed to
  this package.
