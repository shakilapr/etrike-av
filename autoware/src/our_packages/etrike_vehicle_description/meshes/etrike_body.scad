// Copyright 2026 E-Trike
// Licensed under the Apache License, Version 2.0
//
// Canonical Bajaj RE tuktuk body silhouette.
// Coordinates use ROS convention: +X forward, +Y left, +Z up.

$fn = 64;

module body_envelope() {
  polyhedron(
    points = [
      // Station 0: Rear Back Panel (X = -0.432)
      // Sloped rear canopy roof tapering down to Z = 1.480
      [-0.432, -0.575, 0.280], // 0: rear left floor
      [-0.432,  0.575, 0.280], // 1: rear right floor
      [-0.432,  0.575, 0.740], // 2: rear right beltline
      [-0.432,  0.480, 1.180], // 3: rear right shoulder
      [-0.432,  0.360, 1.480], // 4: rear right roof
      [-0.432, -0.360, 1.480], // 5: rear left roof
      [-0.432, -0.480, 1.180], // 6: rear left shoulder
      [-0.432, -0.575, 0.740], // 7: rear left beltline

      // Station 1: Passenger Cabin Peak (X = 0.400)
      // Maximum cabin height Z = 1.700
      [ 0.400, -0.575, 0.280], // 8: mid left floor
      [ 0.400,  0.575, 0.280], // 9: mid right floor
      [ 0.400,  0.575, 0.760], // 10: mid right beltline
      [ 0.400,  0.500, 1.250], // 11: mid right shoulder
      [ 0.400,  0.380, 1.700], // 12: mid right roof
      [ 0.400, -0.380, 1.700], // 13: mid left roof
      [ 0.400, -0.500, 1.250], // 14: mid left shoulder
      [ 0.400, -0.575, 0.760], // 15: mid left beltline

      // Station 2: Windshield Top / Front Cabin (X = 0.850)
      [ 0.850, -0.575, 0.280], // 16: cabin front left floor
      [ 0.850,  0.575, 0.280], // 17: cabin front right floor
      [ 0.850,  0.560, 0.760], // 18: cabin front right beltline
      [ 0.850,  0.480, 1.250], // 19: cabin front right shoulder
      [ 0.850,  0.370, 1.680], // 20: cabin front right roof
      [ 0.850, -0.370, 1.680], // 21: cabin front left roof
      [ 0.850, -0.480, 1.250], // 22: cabin front left shoulder
      [ 0.850, -0.560, 0.760], // 23: cabin front left beltline

      // Station 3: Windshield Base / Cowl (X = 1.350)
      [ 1.350, -0.480, 0.280], // 24: cowl left floor
      [ 1.350,  0.480, 0.280], // 25: cowl right floor
      [ 1.350,  0.460, 0.750], // 26: cowl right beltline
      [ 1.350,  0.380, 1.150], // 27: cowl right windshield mid
      [ 1.350, -0.380, 1.150], // 28: cowl left windshield mid
      [ 1.350, -0.460, 0.750], // 29: cowl left beltline

      // Station 4: Front Apron (X = 1.790)
      [ 1.790, -0.400, 0.280], // 30: apron left floor
      [ 1.790,  0.400, 0.280], // 31: apron right floor
      [ 1.790,  0.380, 0.740], // 32: apron right beltline
      [ 1.790,  0.320, 0.950], // 33: apron right top
      [ 1.790, -0.320, 0.950], // 34: apron left top
      [ 1.790, -0.380, 0.740]  // 35: apron left beltline
    ],
    faces = [
      // Rear Face (X = -0.432)
      [0, 1, 2, 3, 4, 5, 6, 7],

      // Station 0 -> Station 1 (Rear Cabin to Peak)
      [0, 8, 9, 1],
      [1, 9, 10, 2],
      [2, 10, 11, 3],
      [3, 11, 12, 4],
      [4, 12, 13, 5],
      [5, 13, 14, 6],
      [6, 14, 15, 7],
      [7, 15, 8, 0],

      // Station 1 -> Station 2 (Cabin Peak to Windshield Top)
      [8, 16, 17, 9],
      [9, 17, 18, 10],
      [10, 18, 19, 11],
      [11, 19, 20, 12],
      [12, 20, 21, 13],
      [13, 21, 22, 14],
      [14, 22, 23, 15],
      [15, 23, 16, 8],

      // Station 2 -> Station 3 (Windshield Slope)
      [16, 24, 25, 17],
      [17, 25, 26, 18],
      [18, 26, 27, 19],
      [19, 27, 20],
      [20, 27, 28, 21],
      [21, 28, 22],
      [22, 28, 29, 23],
      [23, 29, 24, 16],

      // Station 3 -> Station 4 (Front Cowl to Apron)
      [24, 30, 31, 25],
      [25, 31, 32, 26],
      [26, 32, 33, 27],
      [27, 33, 34, 28],
      [28, 34, 35, 29],
      [29, 35, 30, 24],

      // Front Face (X = 1.790)
      [30, 35, 34, 33, 32, 31]
    ],
    convexity = 10
  );
}

module rear_wheel_opening(side) {
  // Fitted circular rear wheel arch clearance clipped above Z = 0.280 floor plane.
  intersection() {
    translate([0, side * 0.725, 0.203])
      rotate([90, 0, 0])
        cylinder(h = 0.300, r = 0.235, center = true);
    translate([-0.350, -1.000, 0.280001])
      cube([0.700, 2.000, 1.000]);
  }
}

difference() {
  body_envelope();
  rear_wheel_opening(1);
  rear_wheel_opening(-1);
}
