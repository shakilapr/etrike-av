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
      [-0.285, -0.460, 0.280],
      [-0.285,  0.460, 0.280],
      [-0.285,  0.575, 0.820],
      [-0.285,  0.575, 1.680],
      [-0.285, -0.575, 1.680],
      [-0.285, -0.575, 0.820],

      // Front of main cabin.
      [1.200, -0.460, 0.280],
      [1.200,  0.460, 0.280],
      [1.200,  0.575, 0.820],
      [1.200,  0.575, 1.700],
      [1.200, -0.575, 1.700],
      [1.200, -0.575, 0.820],

      // Windshield shoulder.
      [1.450, -0.450, 0.480],
      [1.450,  0.450, 0.480],
      [1.450,  0.550, 0.820],
      [1.450,  0.550, 1.580],
      [1.450, -0.550, 1.580],
      [1.450, -0.550, 0.820],

      // Blunt front apron behind the uncovered front wheel.
      [1.800, -0.420, 0.300],
      [1.800,  0.420, 0.300],
      [1.800,  0.480, 0.780],
      [1.800,  0.480, 1.150],
      [1.800, -0.480, 1.150],
      [1.800, -0.480, 0.780]
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
  // A short transverse cutter removes only the outer side wall. The center
  // floor remains solid, while the 0.225 m radius gives each 0.203 m tire a
  // close circular opening without creating a fender or wheel cover.
  translate([0, side * 0.580, 0.203])
    rotate([90, 0, 0])
      cylinder(h = 0.400, r = 0.225, center = true);
}

difference() {
  body_envelope();
  rear_wheel_opening(1);
  rear_wheel_opening(-1);
}
