// Copyright 2026 E-Trike Dev. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#include <iostream>
#include <string>
#include <vector>

#include "etrike_kinect2/kinect2_node.hpp"
#include "etrike_kinect2/kinect2_device.hpp"

#include <rclcpp/rclcpp.hpp>

int main(int argc, char ** argv)
{
  // Check for discover mode
  for (int i = 1; i < argc; ++i) {
    if (std::string(argv[i]) == "--discover") {
      auto devices = etrike_kinect2::Kinect2Device::enumerateDevices();
      if (devices.empty()) {
        std::cout << "No Kinect v2 devices found." << std::endl;
        std::cout << "Check: USB 3.0 connection, udev rules, libfreenect2 install." << std::endl;
        return 1;
      }
      std::cout << "Found " << devices.size() << " Kinect v2 device(s):" << std::endl;
      for (size_t idx = 0; idx < devices.size(); ++idx) {
        std::cout << "  [" << idx << "] serial=" << devices[idx].serial << std::endl;
      }
      return 0;
    }
  }

  rclcpp::init(argc, argv);
  auto node = std::make_shared<etrike_kinect2::Kinect2Node>(rclcpp::NodeOptions());
  rclcpp::spin(node->get_node_base_interface());
  rclcpp::shutdown();
  return 0;
}
