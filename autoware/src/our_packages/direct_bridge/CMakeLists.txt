cmake_minimum_required(VERSION 3.8)
project(direct_bridge LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

find_package(ament_cmake REQUIRED)
find_package(rclcpp REQUIRED)
find_package(rclcpp_lifecycle REQUIRED)
find_package(autoware_control_msgs REQUIRED)
find_package(autoware_vehicle_msgs REQUIRED)
find_package(tier4_vehicle_msgs REQUIRED)
find_package(diagnostic_msgs REQUIRED)

include_directories(include)
include_directories(${CMAKE_CURRENT_SOURCE_DIR})

add_executable(direct_bridge_node
  src/direct_bridge_node.cpp
)

ament_target_dependencies(direct_bridge_node
  rclcpp
  rclcpp_lifecycle
  autoware_control_msgs
  autoware_vehicle_msgs
  tier4_vehicle_msgs
  diagnostic_msgs
)

install(TARGETS
  direct_bridge_node
  DESTINATION lib/${PROJECT_NAME}
)

install(DIRECTORY
  config/
  DESTINATION share/${PROJECT_NAME}/config
)

install(DIRECTORY
  launch/
  DESTINATION share/${PROJECT_NAME}/launch
)

install(DIRECTORY
  include/
  DESTINATION include
)

install(DIRECTORY
  data/
  DESTINATION share/${PROJECT_NAME}/data
)

install(DIRECTORY
  scripts/
  DESTINATION share/${PROJECT_NAME}/scripts
)

if(BUILD_TESTING)
  find_package(ament_lint_auto REQUIRED)
  ament_lint_auto_find_test_dependencies()

  find_package(ament_cmake_pytest REQUIRED)

  add_executable(test_encode test/test_encode.cpp)
  target_include_directories(test_encode PRIVATE
    include
    ${CMAKE_CURRENT_SOURCE_DIR}
  )
  ament_target_dependencies(test_encode
    autoware_control_msgs
    autoware_vehicle_msgs
    tier4_vehicle_msgs
    diagnostic_msgs
  )
  add_test(NAME encode COMMAND test_encode)

  ament_add_pytest_test(${PROJECT_NAME}_autoware_compat test/test_autoware_compat.py)
endif()

ament_package()
