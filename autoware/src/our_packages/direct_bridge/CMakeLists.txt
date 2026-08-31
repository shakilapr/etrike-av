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
  find_package(ament_cmake_cpplint QUIET)
  find_package(ament_cmake_uncrustify QUIET)
  find_package(ament_cmake_flake8 QUIET)
  find_package(ament_cmake_pep257 QUIET)
  find_package(ament_cmake_copyright QUIET)
  find_package(ament_cmake_lint_cmake QUIET)

  # The vendored protocol/codecs/core/generated headers, the vendored protocol
  # generator (tools/protocol.py), and the vector JSON files are copied verbatim
  # from the etrike repository and MUST NOT be reformatted or restyled. Only our
  # own source directories are passed to the linters, so the vendored files are
  # never scanned.
  set(LINT_SOURCE_DIRS
    include
    src
    test
    launch
    scripts
    config
  )

  if(ament_cmake_cpplint_FOUND)
    ament_cpplint(
      ${LINT_SOURCE_DIRS}
    )
  endif()

  if(ament_cmake_uncrustify_FOUND)
    ament_uncrustify(
      ${LINT_SOURCE_DIRS}
    )
  endif()

  if(ament_cmake_flake8_FOUND)
    ament_flake8(
      ${LINT_SOURCE_DIRS}
    )
  endif()

  if(ament_cmake_pep257_FOUND)
    ament_pep257(
      ${LINT_SOURCE_DIRS}
    )
  endif()

  if(ament_cmake_copyright_FOUND)
    ament_copyright(
      ${LINT_SOURCE_DIRS}
    )
  endif()

  if(ament_cmake_lint_cmake_FOUND)
    ament_lint_cmake()
  endif()

  find_package(ament_cmake_pytest REQUIRED)

  add_executable(test_encode
    test/test_encode.cpp
    src/direct_bridge_node.cpp
  )
  target_compile_definitions(test_encode PRIVATE DIRECT_BRIDGE_NO_MAIN)
  target_include_directories(test_encode PRIVATE
    include
    ${CMAKE_CURRENT_SOURCE_DIR}
  )
  ament_target_dependencies(test_encode
    rclcpp
    rclcpp_lifecycle
    autoware_control_msgs
    autoware_vehicle_msgs
    tier4_vehicle_msgs
    diagnostic_msgs
  )
  add_test(NAME encode COMMAND test_encode)

  ament_add_pytest_test(${PROJECT_NAME}_autoware_compat test/test_autoware_compat.py)
endif()

ament_package()
