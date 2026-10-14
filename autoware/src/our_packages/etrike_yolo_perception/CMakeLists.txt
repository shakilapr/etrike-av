cmake_minimum_required(VERSION 3.8)
project(etrike_yolo_perception)

if(CMAKE_COMPILER_IS_GNUCXX OR CMAKE_CXX_COMPILER_ID MATCHES "Clang")
  add_compile_options(-Wall -Wextra -Wpedantic)
endif()

find_package(ament_cmake REQUIRED)
find_package(ament_cmake_python REQUIRED)
find_package(rclpy REQUIRED)
find_package(sensor_msgs REQUIRED)
find_package(geometry_msgs REQUIRED)
find_package(std_msgs REQUIRED)
find_package(cv_bridge REQUIRED)
find_package(autoware_perception_msgs REQUIRED)
find_package(visualization_msgs REQUIRED)

# Install Python scripts
install(PROGRAMS
  scripts/yolo_perception_node.py
  scripts/fusion_mesh_node.py
  DESTINATION lib/${PROJECT_NAME}
)

# Install launch, config, models, and rviz directories
install(DIRECTORY
  launch
  config
  models
  rviz
  DESTINATION share/${PROJECT_NAME}
)

ament_package()
