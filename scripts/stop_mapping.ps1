# ==============================================================================
# stop_mapping.ps1
#
# Cleanly terminates all SLAM, ROS 2, bag player, and RViz processes on the Jetson.
#
# Usage:
#   pwsh scripts/stop_mapping.ps1
# ==============================================================================

$targetHost = "med1@172.16.25.67"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Stopping all mapping and ROS processes on Jetson ($targetHost)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$killCmd = "docker exec -u root autoware_test pkill -9 -f 'ros2|rviz2|scanmatcher|graph_based_slam|static_transform|loop_mapping|rosbag2_player' 2>/dev/null || true; pkill -9 -f 'loop_mapping|record_slam|ffmpeg|baobab' 2>/dev/null || true"

ssh $targetHost $killCmd

Write-Host "[OK] All mapping processes stopped cleanly. Jetson desktop is idle." -ForegroundColor Green
