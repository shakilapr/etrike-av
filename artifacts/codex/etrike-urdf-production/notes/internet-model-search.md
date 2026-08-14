# Internet Model and Photo Review — 2026-08-14

## Downloaded geometry reference

- Name: `Bajaj Auto Rickshaw India 3D Model` (CadNav model 42110)
- Source: https://www.cadnav.com/3d-models/model-42110.html
- Formats: MAX, FBX, and OBJ
- Published geometry: 58,700 polygons and 37,690 vertices
- Published license: Non-commercial
- Archive: `../downloads/cadnav-bajaj-rickshaw-42110-reference.rar`
- SHA-256: `D8FD04CB97302B2D02A175828D77A0291305E7E80C783DBCA690CEA46DE66314`
- Extracted quarantine: `../downloads/cadnav-42110-extracted/`

The downloaded mesh is retained only as a private design reference. Its
license does not allow it to be redistributed as the production vehicle mesh.
No vertices, faces, textures, or branded details were copied into the ROS
package.

The OBJ was inspected numerically to understand coarse proportions. Its main
body bounds are approximately 1.771 wide, 2.198 high, and 3.316 long in source
units. Wheel centers imply an approximately 2.586-unit wheelbase and
1.616-unit rear track. Scaling the body length to the measured 2.635 m gives a
rough 1.408 m width and 1.747 m height, consistent enough to use the silhouette
as a reference but not as dimensional truth.

## CAD comparison

- GrabCAD `Tuk Tuk Bajaj RE 200`:
  https://grabcad.com/library/tuk-tuk-bajaj-re-200-2
- Marathon OS `Tuk Tuk Bajaj RE 200 Electric 1` STEP listing:
  https://marathon-os.com/library/this-is-thailands-original-tuktuk-one-68a86cc60bfc6774aa10d47f

The GrabCAD page exposed useful side-view renders but blocked direct automated
page access. The Marathon listing warns that its shared models may not be
accurate or production-ready, and its reported file name and bounding box do
not plausibly describe a full vehicle, so it was not adopted.

## Original-vehicle image check

- Manufacturer specifications and vehicle images:
  https://bajaj.com.ph/re/
- Side-view photograph retained for this task only:
  `../downloads/reference-images/bajaj-re-right-side.webp`
- Photo source page:
  https://www.cmv360.com/hi/three-wheelers/bajaj/compact-re/images

The side silhouette shows that the main front apron terminates behind the
front-wheel center. A separate mudguard normally extends over the wheel. The
requested model intentionally omits that mudguard, so the body must not grow a
replacement nose over the tire.

## Production decision

The production visual is original, watertight low-poly geometry built from
simple cross sections and the measured project dimensions. It contains no
lights, windows, trim, seats, branding, fenders, or wheel covers. Circular
openings are cut into the rear side walls around the exposed rear tires; these
are body clearances, not covering geometry. The center floor remains solid.
The production side wall terminates on the rear-wheel center plane at
Y=+/-0.575 m. With each 0.102 m tire centered there, the outer 0.051 m is
visible from above. This half-width requirement applies solely in the lateral
direction: the previous Z=0.280 m lower body line is retained, while the
circular opening remains centered at the 0.203 m axle height with a 0.225 m
radius.

The downloaded model's front wheel has a 0.276-source-unit radius. Excluding
its separate `bump_front_ok` mudguard group, the nearest useful main-body
surface is approximately 0.0228 source units from the tire surface. Scaling
that ratio to the production 0.203 m radius gives about 0.0168 m. The original
production apron was therefore corrected to end at X=1.800 m and Z=0.300 m;
its nearest point is 0.0193 m from the tire surface. The steering-wheel center
remains X=2.000 m, so the wheel is close to the body but fully external.
