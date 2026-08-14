# Bajaj RE Vehicle Dimensions

This document records the vehicle dimensions and geometry parameters required for the Bajaj RE three-wheeler model.

## 1. Wheel Geometry

| Parameter | Value | Description |
|---|---:|---|
| Wheelbase | 2.000 m | Distance from rear axle midpoint to front wheel center |
| Rear wheel track | 1.150 m | Distance between rear wheel centers |
| Half rear track | 0.575 m | Rear axle midpoint to either rear wheel center |
| Rear wheel to front wheel diagonal | 2.081 m | Straight-line distance from either rear wheel center to front wheel center |
| Front wheel lateral position | 0.000 m | Front wheel lies on vehicle centerline |

### Wheel Center Coordinates

Assuming the origin is at the midpoint of the rear axle:

- **X-axis:** forward
- **Y-axis:** left

```text
Front wheel:
x = +2.000 m
y =  0.000 m

Rear-left wheel:
x = 0.000 m
y = +0.575 m

Rear-right wheel:
x = 0.000 m
y = -0.575 m
```

## 2. Steering Geometry

| Parameter | Value | Notes |
|---|---:|---|
| Maximum front-wheel steering angle | ~42.8° |
| Maximum front-wheel steering angle | ~0.747 rad |
| Minimum turning radius | ~2.88 m | Published for Bajaj RE variants |

The steering angle should be physically measured on the actual vehicle before being used as a final control limit.

For the kinematic steering model:

```text
delta = atan(yaw_rate * wheel_base / speed)
```

Use:

```text
wheel_base = 2.000 m
```

## 3. Vehicle Body Dimensions

| Parameter | Value |
|---|---:|
| Overall length | ~2.635 m |
| Overall width | ~1.300 m |
| Overall height | ~1.700 m |
| Ground clearance | ~0.170 m |

## 4. Overhangs

The combined longitudinal overhang is:

```text
front_overhang + rear_overhang
= overall_length - wheel_base
= 2.635 - 2.000
= 0.635 m
```

The individual front and rear overhangs should be measured directly from the actual vehicle.

The current visualization model uses an explicit provisional split that preserves
the published overall length:

```text
front_overhang = 0.350 m (estimated)
rear_overhang  = 0.285 m (estimated)
```

Estimated lateral body overhang:

```text
(1.300 - 1.150) / 2 = 0.075 m
```

Therefore:

```text
left_overhang  ~= 0.075 m
right_overhang ~= 0.075 m
```

These values assume the rear wheel track and body are centered symmetrically.

## 5. Wheels and Tires

Published tire size:

```text
4.00-8
```

Nominal working approximation:

| Parameter | Approximate Value |
|---|---:|
| Wheel radius | ~0.203 m |
| Wheel width | ~0.102 m |

For accurate simulation and odometry, measure the loaded rolling radius on the actual vehicle.

## 6. Recommended ROS Parameters

```yaml
/**:
  ros__parameters:
    # Wheel geometry
    wheel_base: 2.000
    wheel_tread: 1.150

    # Steering
    max_steer_angle: 0.747

    # Wheel dimensions
    wheel_radius: 0.203
    wheel_width: 0.102

    # Body dimensions
    vehicle_height: 1.700

    # Estimated lateral overhang
    left_overhang: 0.075
    right_overhang: 0.075

    # Measure on the actual vehicle
    front_overhang: ???
    rear_overhang: ???
```

## 7. Measurements Still Required on the Actual Vehicle

The following should be physically measured before finalizing the autonomous vehicle model:

- Front overhang: front wheel center to foremost body point
- Rear overhang: rear axle center to rearmost body point
- Maximum left steering angle
- Maximum right steering angle
- Maximum steering rate in deg/s or rad/s
- Loaded wheel rolling radius
- Exact wheel width
- Exact vehicle width at the widest point
- `base_link` location relative to the rear axle
- Steering sensor zero position
- Steering actuator mechanical limits

For a dynamic vehicle model, also measure or estimate:

- Vehicle mass
- Center-of-gravity longitudinal position
- Center-of-gravity height
- Yaw moment of inertia
- Front/rear axle load distribution
- Tire characteristics

## 8. Key Values for the Kinematic Model

```text
Rear wheel center-to-center distance = 1.150 m
Rear axle midpoint to front wheel    = 2.000 m
Maximum front-wheel steering angle   ~= 0.747 rad
```

These are the primary geometric values required for a three-wheel kinematic model of the Bajaj RE.
