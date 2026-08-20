cmake_minimum_required(VERSION 3.8)
project(etrike_kinect2)

if(CMAKE_COMPILER_IS_GNUCXX OR CMAKE_CXX_COMPILER_ID MATCHES "Clang")
  add_compile_options(-Wall -Wextra -Wpedantic)
endif()

find_package(ament_cmake_auto REQUIRED)
ament_auto_find_build_dependencies()

find_package(PkgConfig REQUIRED)
pkg_check_modules(LIBFREENECT2 REQUIRED libfreenect2)

add_library(kinect2_device_lib SHARED
  src/kinect2_device.cpp
  src/frame_converter.cpp
)
target_include_directories(kinect2_device_lib PUBLIC
  include
  ${LIBFREENECT2_INCLUDE_DIRS}
)
target_link_libraries(kinect2_device_lib PUBLIC
  ${LIBFREENECT2_LIBRARIES}
)
ament_target_dependencies(kinect2_device_lib PUBLIC
  sensor_msgs
  cv_bridge
)

add_executable(kinect2_node src/kinect2_node.cpp src/main.cpp)
target_include_directories(kinect2_node PUBLIC include)
target_link_libraries(kinect2_node kinect2_device_lib)
ament_target_dependencies(kinect2_node PUBLIC
  rclcpp_lifecycle
  rclcpp_components
  sensor_msgs
  diagnostic_msgs
  image_transport
  camera_info_manager
  cv_bridge
  tf2_ros
)

rclcpp_components_register_node(kinect2_node
  PLUGIN "etrike_kinect2::Kinect2Node"
  EXECUTABLE kinect2_node_exec
)

install(TARGETS kinect2_device_lib kinect2_node
  ARCHIVE DESTINATION lib
  LIBRARY DESTINATION lib
  RUNTIME DESTINATION lib/${PROJECT_NAME}
)

install(DIRECTORY include/
  DESTINATION include
)

install(DIRECTORY launch config urdf rviz
  DESTINATION share/${PROJECT_NAME}
)

install(PROGRAMS run.sh
  DESTINATION lib/${PROJECT_NAME}
)

if(BUILD_TESTING)
  find_package(ament_lint_auto REQUIRED)
  ament_lint_auto_find_test_dependencies()

  find_package(ament_cmake_pytest REQUIRED)
  ament_add_pytest_test(${PROJECT_NAME}_launch_test test/test_launch.py)
endif()

ament_package()
