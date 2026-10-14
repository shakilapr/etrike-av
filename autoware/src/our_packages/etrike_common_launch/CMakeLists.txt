cmake_minimum_required(VERSION 3.5)
project(etrike_common_launch)

find_package(ament_cmake_auto REQUIRED)
ament_auto_find_build_dependencies()

if(BUILD_TESTING)
  find_package(ament_lint_auto REQUIRED)
  ament_lint_auto_find_test_dependencies()

  find_package(ament_cmake_pytest REQUIRED)
  ament_add_pytest_test(${PROJECT_NAME}_pytest test/test_calibration_and_configs.py)
endif()

install(PROGRAMS
  scripts/bench_perception_node.py
  scripts/hesai_synthetic_publisher.py
  scripts/hesai_pointxyzirc_adapter.py
  DESTINATION lib/${PROJECT_NAME}
)

ament_auto_package(INSTALL_TO_SHARE
  launch
  config
  rviz
)
