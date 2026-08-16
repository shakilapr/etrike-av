// Copyright 2026 E-Trike
// Licensed under the Apache License, Version 2.0
//
// Closed Bajaj-style body with circular rear wheel openings.
// Coordinates use ROS convention: +X forward, +Y left, +Z up.

$fn = 48;

module body_envelope() {
  polyhedron(
    points = [
      // Rear cabin station.
      [-0.432, -0.575, 0.280],
      [-0.432,  0.575, 0.280],
      [-0.432,  0.575, 0.780],
      [-0.432,  0.420, 1.680],
      [-0.432, -0.420, 1.680],
      [-0.432, -0.575, 0.780],

      // Front of passenger cabin. The short roof and following long slope
      // keep the silhouette recognisably tuktuk-shaped rather than boxy.
      [0.850, -0.575, 0.280],
      [0.850,  0.575, 0.280],
      [0.850,  0.575, 0.780],
      [0.850,  0.420, 1.700],
      [0.850, -0.420, 1.700],
      [0.850, -0.575, 0.780],

      // Long, steep windshield transition.
      [1.280, -0.440, 0.280],
      [1.280,  0.440, 0.280],
      [1.280,  0.500, 0.780],
      [1.280,  0.340, 1.550],
      [1.280, -0.340, 1.550],
      [1.280, -0.500, 0.780],

      // Blunt front apron behind the uncovered front wheel.
      [1.790, -0.420, 0.280],
      [1.790,  0.420, 0.280],
      [1.790,  0.440, 0.760],
      [1.790,  0.360, 1.100],
      [1.790, -0.360, 1.100],
      [1.790, -0.440, 0.760]
    ],
    faces = [
      [5, 4, 3, 2, 1, 0],

      [0, 1, 7, 6],
      [1, 2, 8, 7],
      [2, 3, 9, 8],
      [3, 4, 10, 9],
      [4, 5, 11, 10],
      [5, 0, 6, 11],

      [6, 7, 13, 12],
      [7, 8, 14, 13],
      [8, 9, 15, 14],
      [9, 10, 16, 15],
      [10, 11, 17, 16],
      [11, 6, 12, 17],

      [12, 13, 19, 18],
      [13, 14, 20, 19],
      [14, 15, 21, 20],
      [15, 16, 22, 21],
      [16, 17, 23, 22],
      [17, 12, 18, 23],

      [18, 19, 20, 21, 22, 23]
    ],
    convexity = 10
  );
}

module rear_wheel_opening(side) {
  // The body ends on the tire centre plane, exposing the outer half of its
  // width in top view. This circular side-only cutter is clipped above the
  // flat Z=0.280 floor so it cannot create an underside notch or diagonal cut.
  intersection() {
    translate([0, side * 0.640, 0.203])
      rotate([90, 0, 0])
        cylinder(h = 0.300, r = 0.225, center = true);
    translate([-0.300, -1.000, 0.280001])
      cube([0.600, 2.000, 1.000]);
  }
}

difference() {
  body_envelope();
  rear_wheel_opening(1);
  rear_wheel_opening(-1);
}
