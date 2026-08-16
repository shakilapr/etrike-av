// Copyright 2026 E-Trike
// Licensed under the Apache License, Version 2.0
//
// Canonical Bajaj RE tuktuk body silhouette with sculpted waistline & canopy brow.
// Coordinates use ROS convention: +X forward, +Y left, +Z up.

$fn = 64;

module body_envelope() {
  polyhedron(
    points = [
      // Station 0: Rear Back Panel (X = -0.432)
      [-0.432, -0.575, 0.280], // 0: rear left floor
      [-0.432,  0.575, 0.280], // 1: rear right floor
      [-0.432,  0.575, 0.740], // 2: rear right beltline
      [-0.432,  0.530, 1.180], // 3: rear right shoulder
      [-0.432,  0.490, 1.480], // 4: rear right roof
      [-0.432, -0.490, 1.480], // 5: rear left roof
      [-0.432, -0.530, 1.180], // 6: rear left shoulder
      [-0.432, -0.575, 0.740], // 7: rear left beltline

      // Station 1: Rear Axle / Passenger Seat (X = 0.000)
      [ 0.000, -0.575, 0.280], // 8: axle left floor
      [ 0.000,  0.575, 0.280], // 9: axle right floor
      [ 0.000,  0.575, 0.760], // 10: axle right beltline
      [ 0.000,  0.540, 1.250], // 11: axle right shoulder
      [ 0.000,  0.490, 1.660], // 12: axle right roof
      [ 0.000, -0.490, 1.660], // 13: axle left roof
      [ 0.000, -0.540, 1.250], // 14: axle left shoulder
      [ 0.000, -0.575, 0.760], // 15: axle left beltline

      // Station 2: Passenger Entry Waistline Dip (X = 0.500)
      [ 0.500, -0.575, 0.280], // 16: entry left floor
      [ 0.500,  0.575, 0.280], // 17: entry right floor
      [ 0.500,  0.560, 0.680], // 18: entry right waistline dip
      [ 0.500,  0.540, 1.250], // 19: entry right shoulder
      [ 0.500,  0.490, 1.700], // 20: entry right roof peak
      [ 0.500, -0.490, 1.700], // 21: entry left roof peak
      [ 0.500, -0.540, 1.250], // 22: entry left shoulder
      [ 0.500, -0.560, 0.680], // 23: entry left waistline dip

      // Station 3: Windshield Top / Canopy Brow (X = 1.150)
      [ 1.150, -0.560, 0.280], // 24: cabin front left floor
      [ 1.150,  0.560, 0.280], // 25: cabin front right floor
      [ 1.150,  0.550, 0.760], // 26: cabin front right beltline
      [ 1.150,  0.520, 1.250], // 27: cabin front right shoulder
      [ 1.150,  0.480, 1.680], // 28: cabin front right roof brow
      [ 1.150, -0.480, 1.680], // 29: cabin front left roof brow
      [ 1.150, -0.520, 1.250], // 30: cabin front left shoulder
      [ 1.150, -0.550, 0.760], // 31: cabin front left beltline

      // Station 4: Dashboard / Windshield Base (X = 1.600)
      [ 1.600, -0.480, 0.280], // 32: cowl left floor
      [ 1.600,  0.480, 0.280], // 33: cowl right floor
      [ 1.600,  0.460, 0.750], // 34: cowl right beltline
      [ 1.600,  0.400, 1.100], // 35: cowl right windshield base
      [ 1.600, -0.400, 1.100], // 36: cowl left windshield base
      [ 1.600, -0.460, 0.750], // 37: cowl left beltline

      // Station 5: Front Apron Nose (X = 1.790)
      [ 1.790, -0.380, 0.280], // 38: apron left floor
      [ 1.790,  0.380, 0.280], // 39: apron right floor
      [ 1.790,  0.360, 0.700], // 40: apron right beltline
      [ 1.790,  0.300, 0.920], // 41: apron right top
      [ 1.790, -0.300, 0.920], // 42: apron left top
      [ 1.790, -0.360, 0.700]  // 43: apron left beltline
    ],
    faces = [
      // Rear Face (X = -0.432)
      [0, 1, 2, 3, 4, 5, 6, 7],

      // Station 0 -> Station 1
      [0, 8, 9, 1],
      [1, 9, 10, 2],
      [2, 10, 11, 3],
      [3, 11, 12, 4],
      [4, 12, 13, 5],
      [5, 13, 14, 6],
      [6, 14, 15, 7],
      [7, 15, 8, 0],

      // Station 1 -> Station 2 (Door Dip)
      [8, 16, 17, 9],
      [9, 17, 18, 10],
      [10, 18, 19, 11],
      [11, 19, 20, 12],
      [12, 20, 21, 13],
      [13, 21, 22, 14],
      [14, 22, 23, 15],
      [15, 23, 16, 8],

      // Station 2 -> Station 3 (Roof Peak to Brow)
      [16, 24, 25, 17],
      [17, 25, 26, 18],
      [18, 26, 27, 19],
      [19, 27, 28, 20],
      [20, 28, 29, 21],
      [21, 29, 30, 22],
      [22, 30, 31, 23],
      [23, 31, 24, 16],

      // Station 3 -> Station 4 (Windshield Slope)
      [24, 32, 33, 25],
      [25, 33, 34, 26],
      [26, 34, 35, 27],
      [27, 35, 28],
      [28, 35, 36, 29],
      [29, 36, 30],
      [30, 36, 37, 31],
      [31, 37, 32, 24],

      // Station 4 -> Station 5 (Front Cowl to Apron)
      [32, 38, 39, 33],
      [33, 39, 40, 34],
      [34, 40, 41, 35],
      [35, 41, 42, 36],
      [36, 42, 43, 37],
      [37, 43, 38, 32],

      // Front Face (X = 1.790)
      [38, 43, 42, 41, 40, 39]
    ],
    convexity = 10
  );
}

module rear_wheel_opening(side) {
  // Circular wheel arch cut into the side wall of the body.
  // Radius r = 0.240 m (Diameter = 0.480 m), which equals wheel diameter (0.406 m)
  // plus ~3 inches (0.074 m) clearance for a fitted wheel opening.
  // Clipped above Z = 0.280 m so the lower floor plane remains 100% flat and solid.
  intersection() {
    translate([0, side * 0.580, 0.203])
      rotate([90, 0, 0])
        cylinder(h = 0.400, r = 0.240, center = true);
    translate([-0.350, -1.000, 0.280001])
      cube([0.700, 2.000, 1.000]);
  }
}

difference() {
  body_envelope();
  rear_wheel_opening(1);
  rear_wheel_opening(-1);
}
