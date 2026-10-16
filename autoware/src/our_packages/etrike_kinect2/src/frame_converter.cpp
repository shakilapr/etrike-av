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

#include "etrike_kinect2/frame_converter.hpp"

#include <cv_bridge/cv_bridge.h>
#include <opencv2/imgproc.hpp>

namespace etrike_kinect2
{

sensor_msgs::msg::Image::SharedPtr FrameConverter::to_color_image(
  const libfreenect2::Frame & frame,
  const std::string & frame_id,
  const rclcpp::Time & stamp)
{
  // libfreenect2 outputs BGRX (4-channel uint8). Wrapping directly as bgra8
  // avoids 15-20 ms of synchronous CPU cv::cvtColor per frame.
  cv::Mat bgra(frame.height, frame.width, CV_8UC4, frame.data);

  auto msg = cv_bridge::CvImage(std_msgs::msg::Header(), "bgra8", bgra).toImageMsg();
  msg->header.frame_id = frame_id;
  msg->header.stamp = stamp;
  return msg;
}

sensor_msgs::msg::Image::SharedPtr FrameConverter::to_depth_image(
  const libfreenect2::Frame & frame,
  const std::string & frame_id,
  const rclcpp::Time & stamp)
{
  cv::Mat raw(frame.height, frame.width, CV_32FC1, frame.data);
  cv::Mat depth_meters;
  raw.convertTo(depth_meters, CV_32FC1, 1.0 / 1000.0);

  auto msg = cv_bridge::CvImage(std_msgs::msg::Header(), "32FC1", depth_meters).toImageMsg();
  msg->header.frame_id = frame_id;
  msg->header.stamp = stamp;
  return msg;
}

sensor_msgs::msg::Image::SharedPtr FrameConverter::to_ir_image(
  const libfreenect2::Frame & frame,
  const std::string & frame_id,
  const rclcpp::Time & stamp)
{
  cv::Mat raw(frame.height, frame.width, CV_32FC1, frame.data);
  cv::Mat ir_8bit;
  double min_val, max_val;
  cv::minMaxLoc(raw, &min_val, &max_val);
  if (max_val > min_val) {
    raw.convertTo(
      ir_8bit, CV_8UC1, 255.0 / (max_val - min_val),
      -min_val * 255.0 / (max_val - min_val));
  } else {
    ir_8bit = cv::Mat::zeros(raw.size(), CV_8UC1);
  }

  auto msg = cv_bridge::CvImage(std_msgs::msg::Header(), "mono8", ir_8bit).toImageMsg();
  msg->header.frame_id = frame_id;
  msg->header.stamp = stamp;
  return msg;
}

sensor_msgs::msg::Image::SharedPtr FrameConverter::to_registered_depth_image(
  const libfreenect2::Frame & depth,
  const libfreenect2::Frame & rgb,
  libfreenect2::Registration & registration,
  const std::string & frame_id,
  const rclcpp::Time & stamp)
{
  // Undistorted depth (512x424 float mm) produced by libfreenect2's
  // factory-calibrated Registration::apply(), converted to 32FC1 meters
  // for downstream depth_image_proc / obstacle avoidance consumers.
  libfreenect2::Frame undistorted(depth.width, depth.height, 4);
  libfreenect2::Frame registered(depth.width, depth.height, 4);

  registration.apply(&rgb, &depth, &undistorted, &registered);

  cv::Mat raw_undistorted(depth.height, depth.width, CV_32FC1, undistorted.data);
  cv::Mat depth_meters;
  raw_undistorted.convertTo(depth_meters, CV_32FC1, 1.0 / 1000.0);

  auto msg = cv_bridge::CvImage(std_msgs::msg::Header(), "32FC1", depth_meters).toImageMsg();
  msg->header.frame_id = frame_id;
  msg->header.stamp = stamp;
  return msg;
}

}  // namespace etrike_kinect2
