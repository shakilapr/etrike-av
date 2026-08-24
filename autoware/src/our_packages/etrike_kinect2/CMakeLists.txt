cmake_minimum_required(VERSION 3.8)
project(etrike_kinect2)

if(CMAKE_COMPILER_IS_GNUCXX OR CMAKE_CXX_COMPILER_ID MATCHES "Clang")
  add_compile_options(-Wall -Wextra -Wpedantic)
endif()

find_package(ament_cmake_auto REQUIRED)
ament_auto_find_build_dependencies()

find_package(PkgConfig REQUIRED)
pkg_check_modules(LIBFREENECT2 REQUIRED freenect2)

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
  rclcpp
  sensor_msgs
  cv_bridge
)

add_executable(kinect2_node_exec src/kinect2_node.cpp src/main.cpp)
target_include_directories(kinect2_node_exec PUBLIC include)
target_link_libraries(kinect2_node_exec PUBLIC kinect2_device_lib)
ament_target_dependencies(kinect2_node_exec PUBLIC
  rclcpp_lifecycle
  sensor_msgs
  diagnostic_msgs
  cv_bridge
  tf2_ros
)

install(TARGETS kinect2_device_lib kinect2_node_exec
  ARCHIVE DESTINATION lib
  LIBRARY DESTINATION lib
  RUNTIME DESTINATION lib/${PROJECT_NAME}
)

install(PROGRAMS run.sh
  DESTINATION lib/${PROJECT_NAME}
)

install(PROGRAMS scripts/kinect_dual_view.py scripts/kinect_capture.py scripts/kinect_fastapi.py
  DESTINATION lib/${PROJECT_NAME}/scripts
)

install(DIRECTORY include/
  DESTINATION include
)

install(DIRECTORY launch config urdf rviz
  DESTINATION share/${PROJECT_NAME}
)

if(BUILD_TESTING)
  find_package(ament_lint_auto REQUIRED)
  ament_lint_auto_find_test_dependencies()

  find_package(ament_cmake_pytest REQUIRED)
  ament_add_pytest_test(${PROJECT_NAME}_launch_test test/test_launch.py)
endif()

ament_package()
