Open Remote Control
```bash
bash ~/av_project/scripts/open_remote_control.sh
```

Close Remote Control
```bash
bash ~/av_project/scripts/close_remote_control.sh
```

Open Autoware Universe
```bash
bash ~/av_project/autoware/scripts/loading/load_pipeline.sh --universe

bash ~/av_project/autoware/scripts/loading/load_pipeline.sh --bench
```

Open Point Cloud
```bash
bash ~/av_project/scripts/lidar_standalone.sh
```

Close All
```bash
bash ~/av_project/scripts/close_everything.sh
```

Open YOLO 26x Camera (GPU Accelerated - 25+ FPS)
```bash
bash ~/av_project/scripts/yolo-camera-gpu.sh
```

Open YOLO 26x Camera (Standard)
```bash
bash ~/av_project/scripts/yolo-camera.sh
```

Close YOLO 26x Camera
```bash
bash ~/av_project/scripts/close_camera.sh
```

Record 30s Raw Sensors (LiDAR + Camera) & Auto-Sync to Windows
```powershell
pwsh scripts/record_and_fetch_sensors.ps1
```

Record 30s Raw Sensors (Jetson Local Only)
```bash
bash ~/av_project/scripts/record_raw_sensors.sh
```


