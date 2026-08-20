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

#ifndef ETRIKE_KINECT2__FRAME_CONVERTER_HPP_
#define ETRIKE_KINECT2__FRAME_CONVERTER_HPP_

#include <libfreenect2/frame_listener_impl.h>
#include <libfreenect2/registration.h>

#include <memory>
#include <string>

#include <rclcpp/time.hpp>
#include <sensor_msgs/msg/image.hpp>

namespace etrike_kinect2
{

class FrameConverter
{
public:
  static sensor_msgs::msg::Image::SharedPtr to_color_image(
    const libfreenect2::Frame & frame,
    const std::string & frame_id,
    const rclcpp::Time & stamp);

  static sensor_msgs::msg::Image::SharedPtr to_depth_image(
    const libfreenect2::Frame & frame,
    const std::string & frame_id,
    const rclcpp::Time & stamp);

  static sensor_msgs::msg::Image::SharedPtr to_ir_image(
    const libfreenect2::Frame & frame,
    const std::string & frame_id,
    const rclcpp::Time & stamp);

  // Depth registered to the RGB camera via libfreenect2 factory calibration.
  // rgb is the *color* frame (BGRX/RGBX, native libfreenect2 output). Output
  // is a BGR8 image aligned to the color camera.
  static sensor_msgs::msg::Image::SharedPtr to_registered_depth_image(
    const libfreenect2::Frame & depth,
    const libfreenect2::Frame & rgb,
    libfreenect2::Registration & registration,
    const std::string & frame_id,
    const rclcpp::Time & stamp);
};

}  // namespace etrike_kinect2

#endif  // ETRIKE_KINECT2__FRAME_CONVERTER_HPP_
