# RDE-URDF Extension Setup for E-Trike Preview

## Overview

This document describes how to set up the [Robot Developer Extensions for URDF (rde-urdf)](https://github.com/Ranch-Hand-Robotics/rde-urdf) VS Code extension to preview the E-Trike vehicle URDF/Xacro model.

## Steps Performed

### 1. Clone the rde-urdf Repository

```bash
cd E:\work\av_project
git clone https://github.com/Ranch-Hand-Robotics/rde-urdf.git
```

### 2. Install Dependencies

```bash
cd E:\work\av_project\rde-urdf
npm install
```

### 3. Build the Extension

```bash
npm run build
```

### 4. Package as VSIX

```bash
npx vsce package
```

This generates `urdf-editor-1.7.0.vsix` in the `rde-urdf` directory.

### 5. Install Extension in VS Code

```bash
code --install-extension E:\work\av_project\rde-urdf\urdf-editor-1.7.0.vsix
```

### 6. Open E-Trike Vehicle Description

```bash
code E:\work\av_project\autoware\src\our_packages\etrike_vehicle_description
```

## How to Preview the E-Trike URDF

1. Open `urdf/vehicle.xacro` in VS Code
2. Right-click in the editor → select **"Preview"**
   - Or press `Ctrl+Shift+P` → type `URDF: Preview`

The extension auto-discovers ROS packages from the workspace. The preview xacro keeps the vehicle dimensions as numeric xacro properties because the JavaScript parser used by `rde-urdf` does not implement ROS 2's `xacro.load_yaml()` expression; the canonical Autoware parameter file remains at `config/vehicle_info.param.yaml`.

## E-Trike Vehicle Parameters

| Parameter          | Value  |
|--------------------|--------|
| wheel_base         | 2.000 m  |
| max_steer_angle    | 0.747 rad |
| wheel_radius       | 0.203 m |
| wheel_width        | 0.102 m |
| wheel_tread        | 1.150 m  |
| front_overhang     | 0.35 m |
| rear_overhang      | 0.285 m (estimated) |
| left_overhang      | 0.075 m |
| right_overhang     | 0.075 m |
| vehicle_height     | 1.700 m  |

## File Structure

```
autoware/src/our_packages/etrike_vehicle_description/
├── CMakeLists.txt
├── package.xml
├── config/
│   ├── mirror.param.yaml
│   ├── simulator_model.param.yaml
│   └── vehicle_info.param.yaml
└── urdf/
    └── vehicle.xacro
```

## References

- [rde-urdf GitHub Repository](https://github.com/Ranch-Hand-Robotics/rde-urdf)
- [rde-urdf Documentation](https://ranchhandrobotics.com/rde-urdf/)
