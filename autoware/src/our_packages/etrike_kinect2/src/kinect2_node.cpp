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

#include "etrike_kinect2/kinect2_node.hpp"

#include <chrono>
#include <algorithm>
#include <functional>

#include "etrike_kinect2/frame_converter.hpp"

#include <diagnostic_msgs/msg/diagnostic_status.hpp>
#include <diagnostic_msgs/msg/key_value.hpp>

namespace etrike_kinect2
{

using namespace std::chrono_literals;
using CallbackReturn = rclcpp_lifecycle::node_interfaces::LifecycleNodeInterface::CallbackReturn;

Kinect2Node::Kinect2Node(const rclcpp::NodeOptions & options)
: LifecycleNode("kinect2_node", "", options),
  running_(false),
  device_ok_(false),
  color_frames_delivered_(0),
  depth_frames_delivered_(0),
  ir_frames_delivered_(0),
  frames_dropped_(0),
  timeouts_(0),
  connects_(0),
  disconnects_(0),
  last_diag_time_(std::chrono::steady_clock::now()),
  last_discover_time_(std::chrono::steady_clock::now()),
  diag_window_start_(std::chrono::steady_clock::now()),
  color_frames_in_window_(0),
  depth_frames_in_window_(0),
  ir_frames_in_window_(0)
{
  declare_parameter<std::string>("serial", "");
  declare_parameter<bool>("color_enabled", true);
  declare_parameter<bool>("depth_enabled", true);
  declare_parameter<bool>("ir_enabled", false);
  declare_parameter<bool>("registration_enabled", true);
  declare_parameter<std::string>("frame_id_color", "kinect_color_optical_frame");
  declare_parameter<std::string>("frame_id_depth", "kinect_depth_optical_frame");
  declare_parameter<std::string>("frame_id_ir", "kinect_ir_optical_frame");
  declare_parameter<int>("reconnect_attempts", 3);
  declare_parameter<double>("reconnect_delay_s", 2.0);
  declare_parameter<double>("discover_interval_s", 1.0);
  declare_parameter<int>("frame_timeout_ms", 1000);
  declare_parameter<int>("poll_interval_ms", 100);
}

Kinect2Node::~Kinect2Node()
{
  running_ = false;
  if (capture_thread_.joinable()) {
    capture_thread_.join();
  }
}

CallbackReturn Kinect2Node::on_configure(const rclcpp_lifecycle::State & /*state*/)
{
  serial_ = get_parameter("serial").as_string();
  color_enabled_ = get_parameter("color_enabled").as_bool();
  depth_enabled_ = get_parameter("depth_enabled").as_bool();
  ir_enabled_ = get_parameter("ir_enabled").as_bool();
  registration_enabled_ = get_parameter("registration_enabled").as_bool();
  frame_id_color_ = get_parameter("frame_id_color").as_string();
  frame_id_depth_ = get_parameter("frame_id_depth").as_string();
  frame_id_ir_ = get_parameter("frame_id_ir").as_string();
  reconnect_attempts_ = get_parameter("reconnect_attempts").as_int();
  reconnect_delay_s_ = get_parameter("reconnect_delay_s").as_double();
  discover_interval_s_ = get_parameter("discover_interval_s").as_double();
  frame_timeout_ms_ = get_parameter("frame_timeout_ms").as_int();
  poll_interval_ms_ = get_parameter("poll_interval_ms").as_int();

  // Hotplug-aware: the node does NOT require the device to be present at
  // configure time. It will connect whenever the target serial appears on
  // USB, and reconnect on unplug/replug.

  color_info_pub_ = create_publisher<sensor_msgs::msg::CameraInfo>(
    "color/camera_info", rclcpp::SensorDataQoS());
  depth_info_pub_ = create_publisher<sensor_msgs::msg::CameraInfo>(
    "depth/camera_info", rclcpp::SensorDataQoS());
  diag_pub_ = create_publisher<diagnostic_msgs::msg::DiagnosticArray>(
    "/diagnostics", rclcpp::SensorDataQoS());

  color_pub_ =
    create_publisher<sensor_msgs::msg::Image>("color/image_raw", rclcpp::SensorDataQoS());
  depth_pub_ =
    create_publisher<sensor_msgs::msg::Image>("depth/image_raw", rclcpp::SensorDataQoS());
  ir_pub_ = create_publisher<sensor_msgs::msg::Image>("ir/image_raw", rclcpp::SensorDataQoS());

  // Registered depth (color-aligned) is only published when requested.
  depth_registered_pub_ = create_publisher<sensor_msgs::msg::Image>(
    "depth_registered/image_raw", rclcpp::SensorDataQoS());

  // Factory intrinsics are only available once the device is open; fill in
  // correct dimensions now and refresh the matrices after open() succeeds.
  color_info_ = build_camera_info(frame_id_color_, 1920, 1080);
  depth_info_ = build_camera_info(frame_id_depth_, 512, 424);

  RCLCPP_INFO(
    get_logger(),
    "configured (hotplug mode): serial=%s color=%d depth=%d ir=%d reg=%d",
    serial_.c_str(), color_enabled_, depth_enabled_, ir_enabled_, registration_enabled_);

  return CallbackReturn::SUCCESS;
}

CallbackReturn Kinect2Node::on_activate(const rclcpp_lifecycle::State &)
{
  running_ = true;
  device_ok_ = false;
  color_frames_delivered_ = 0;
  depth_frames_delivered_ = 0;
  ir_frames_delivered_ = 0;
  frames_dropped_ = 0;
  timeouts_ = 0;
  connects_ = 0;
  disconnects_ = 0;
  last_diag_time_ = std::chrono::steady_clock::now();
  last_discover_time_ = std::chrono::steady_clock::now();
  diag_window_start_ = std::chrono::steady_clock::now();
  color_frames_in_window_ = 0;
  depth_frames_in_window_ = 0;
  ir_frames_in_window_ = 0;

  capture_thread_ = std::thread(&Kinect2Node::capture_loop, this);

  RCLCPP_INFO(get_logger(), "activated — hotplug worker started");
  return CallbackReturn::SUCCESS;
}

CallbackReturn Kinect2Node::on_deactivate(const rclcpp_lifecycle::State &)
{
  running_ = false;
  if (capture_thread_.joinable()) {
    capture_thread_.join();
  }

  {
    std::lock_guard<std::mutex> lock(device_mutex_);
    disconnect_device();
  }

  RCLCPP_INFO(get_logger(), "deactivated");
  return CallbackReturn::SUCCESS;
}

CallbackReturn Kinect2Node::on_cleanup(const rclcpp_lifecycle::State &)
{
  running_ = false;
  if (capture_thread_.joinable()) {
    capture_thread_.join();
  }

  device_.reset();
  color_pub_.reset();
  depth_pub_.reset();
  depth_registered_pub_.reset();
  ir_pub_.reset();
  color_info_pub_.reset();
  depth_info_pub_.reset();
  diag_pub_.reset();

  RCLCPP_INFO(get_logger(), "cleanup complete");
  return CallbackReturn::SUCCESS;
}

CallbackReturn Kinect2Node::on_shutdown(const rclcpp_lifecycle::State &)
{
  running_ = false;
  if (capture_thread_.joinable()) {
    capture_thread_.join();
  }
  device_.reset();
  return CallbackReturn::SUCCESS;
}

CallbackReturn Kinect2Node::on_error(const rclcpp_lifecycle::State &)
{
  RCLCPP_ERROR(get_logger(), "entering error state — closing device");
  running_ = false;
  if (capture_thread_.joinable()) {
    capture_thread_.join();
  }
  device_.reset();
  return CallbackReturn::SUCCESS;
}

void Kinect2Node::try_connect()
{
  if (device_ && device_->isOpen()) {
    return;
  }

  device_ = std::make_unique<Kinect2Device>();
  if (!device_->open(serial_, color_enabled_, depth_enabled_, ir_enabled_)) {
    device_.reset();
    return;
  }
  if (!device_->start()) {
    RCLCPP_ERROR(
      get_logger(), "opened serial=%s but failed to start streaming",
      serial_.c_str());
    device_.reset();
    return;
  }

  // Refresh CameraInfo with the factory-calibrated intrinsics now that the
  // device is open (dimensions were set at configure time; matrices were
  // placeholder-1.0 until here).
  auto color_params = device_->color_params();
  auto ir_params = device_->ir_params();
  color_info_ = build_camera_info(frame_id_color_, 1920, 1080, &color_params, nullptr);
  depth_info_ = build_camera_info(frame_id_depth_, 512, 424, nullptr, &ir_params);

  connects_++;
  device_ok_ = true;
  RCLCPP_INFO(get_logger(), "Kinect connected: serial=%s", device_->serial().c_str());
}

void Kinect2Node::disconnect_device()
{
  if (device_) {
    device_->stop();
    device_->close();
    device_.reset();
    disconnects_++;
    device_ok_ = false;
    RCLCPP_INFO(get_logger(), "Kinect disconnected (serial=%s)", serial_.c_str());
  }
}

void Kinect2Node::capture_loop()
{
  while (running_) {
    // -- Connection management (only runs while the device is NOT open). --
    {
      std::lock_guard<std::mutex> lock(device_mutex_);

      // Only enumerate the USB bus while the device is NOT already open.
      // Re-enumerating a live, streaming Kinect disrupts its transfers and
      // corrupts the depth stream (libfreenect2 re-claims the control
      // interface). When streaming, we trust the frame loop to detect unplug.
      if (!device_ && !serial_.empty()) {
        auto now = std::chrono::steady_clock::now();
        auto elapsed = std::chrono::duration<double>(now - last_discover_time_).count();
        if (elapsed >= discover_interval_s_) {
          last_discover_time_ = now;
          auto devices = Kinect2Device::enumerateDevices();
          bool present = std::any_of(
            devices.begin(), devices.end(),
            [this](const DeviceInfo & d) {return d.serial == serial_;});
          if (present) {
            try_connect();
          }
          if (!device_) {
            RCLCPP_DEBUG(
              get_logger(),
              "serial=%s not yet available on USB — retrying", serial_.c_str());
          }
        }
      }
    }

    // -- Streaming: block on the device listener (event-driven, ~30 Hz). --
    if (device_ && device_->isOpen() && device_->isStreaming()) {
      FrameSet frames{};
      bool got_frame = false;
      {
        std::lock_guard<std::mutex> lock(device_mutex_);
        got_frame = device_->wait_for_frames(frames, frame_timeout_ms_);
      }
      if (!got_frame) {
        timeouts_++;
        frames_dropped_++;
        if (timeouts_ > static_cast<uint64_t>(reconnect_attempts_)) {
          RCLCPP_ERROR(
            get_logger(),
            "repeated timeouts — device likely unplugged, disconnecting");
          std::lock_guard<std::mutex> lock(device_mutex_);
          disconnect_device();
          timeouts_ = 0;
        }
      } else {
        timeouts_ = 0;
        device_ok_ = true;
        auto stamp = this->now();
        publish_frame(frames, stamp);
        {
          std::lock_guard<std::mutex> lock(device_mutex_);
          if (device_) {
            device_->release_frames(frames);
          }
        }
      }

      // While streaming, only check diagnostics periodically; do NOT sleep a
      // fixed interval (that would throttle the camera to < 30 Hz).
      auto now = std::chrono::steady_clock::now();
      if (std::chrono::duration<double>(now - last_diag_time_).count() >= 1.0) {
        last_diag_time_ = now;
        publish_diagnostics();
      }
      continue;
    }

    // -- Not streaming (device absent / not yet open): poll at low rate. --
    auto now = std::chrono::steady_clock::now();
    if (std::chrono::duration<double>(now - last_diag_time_).count() >= 1.0) {
      last_diag_time_ = now;
      publish_diagnostics();
    }

    if (!running_) {
      break;
    }

    rclcpp::sleep_for(std::chrono::milliseconds(poll_interval_ms_));
  }
}

void Kinect2Node::publish_frame(FrameSet & frames, const rclcpp::Time & stamp)
{
  if (color_enabled_ && frames.color) {
    auto msg = FrameConverter::to_color_image(*frames.color, frame_id_color_, stamp);
    color_pub_->publish(*msg);

    auto ci = color_info_;
    ci.header.stamp = stamp;
    ci.header.frame_id = frame_id_color_;
    color_info_pub_->publish(ci);

    color_frames_delivered_++;
    color_frames_in_window_++;
  }

  if (depth_enabled_ && frames.depth) {
    auto msg = FrameConverter::to_depth_image(*frames.depth, frame_id_depth_, stamp);
    depth_pub_->publish(*msg);

    auto ci = depth_info_;
    ci.header.stamp = stamp;
    ci.header.frame_id = frame_id_depth_;
    depth_info_pub_->publish(ci);

    depth_frames_delivered_++;
    depth_frames_in_window_++;
  }

  if (registration_enabled_ && frames.depth && frames.color && depth_registered_pub_) {
    // Color-aligned depth using libfreenect2's factory-calibrated
    // registration (see frame_converter for the algorithm).
    auto msg = FrameConverter::to_registered_depth_image(
      *frames.depth, *frames.color, *device_->registration(),
      frame_id_depth_, stamp);
    depth_registered_pub_->publish(*msg);
  }

  if (ir_enabled_ && frames.ir) {
    auto msg = FrameConverter::to_ir_image(*frames.ir, frame_id_ir_, stamp);
    ir_pub_->publish(*msg);
    ir_frames_delivered_++;
    ir_frames_in_window_++;
  }
}

sensor_msgs::msg::CameraInfo Kinect2Node::build_camera_info(
  const std::string & frame_id,
  unsigned int width,
  unsigned int height,
  const libfreenect2::Freenect2Device::ColorCameraParams * color_params,
  const libfreenect2::Freenect2Device::IrCameraParams * ir_params) const
{
  sensor_msgs::msg::CameraInfo ci;
  ci.header.frame_id = frame_id;
  ci.width = width;
  ci.height = height;
  ci.distortion_model = "plumb_bob";

  double fx = 1.0, fy = 1.0, cx = width / 2.0, cy = height / 2.0;
  ci.d = {0.0, 0.0, 0.0, 0.0, 0.0};

  if (color_params) {
    fx = color_params->fx;
    fy = color_params->fy;
    cx = color_params->cx;
    cy = color_params->cy;
  } else if (ir_params) {
    fx = ir_params->fx;
    fy = ir_params->fy;
    cx = ir_params->cx;
    cy = ir_params->cy;
    ci.d = {ir_params->k1, ir_params->k2, ir_params->p1, ir_params->p2, ir_params->k3};
  }

  ci.k = {fx, 0.0, cx, 0.0, fy, cy, 0.0, 0.0, 1.0};
  ci.r = {1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0};
  ci.p = {fx, 0.0, cx, 0.0, 0.0, fy, cy, 0.0, 0.0, 0.0, 1.0, 0.0};
  return ci;
}

void Kinect2Node::publish_diagnostics()
{
  auto now = std::chrono::steady_clock::now();
  double window_s = std::chrono::duration<double>(now - diag_window_start_).count();
  if (window_s <= 0.0) {
    window_s = 1.0;
  }
  diag_window_start_ = now;

  double color_fps = static_cast<double>(color_frames_in_window_) / window_s;
  double depth_fps = static_cast<double>(depth_frames_in_window_) / window_s;
  double ir_fps = static_cast<double>(ir_frames_in_window_) / window_s;

  diagnostic_msgs::msg::DiagnosticArray diag;
  diagnostic_msgs::msg::DiagnosticStatus status;
  status.name = std::string(get_name()) + "/driver";
  status.hardware_id = serial_;

  if (device_ok_ && device_ && device_->isOpen()) {
    status.level = diagnostic_msgs::msg::DiagnosticStatus::OK;
    status.message = "streaming";
  } else if (serial_.empty()) {
    status.level = diagnostic_msgs::msg::DiagnosticStatus::WARN;
    status.message = "no serial configured — waiting for config";
  } else {
    status.level = diagnostic_msgs::msg::DiagnosticStatus::WARN;
    status.message = "device not connected — waiting for USB";
  }

  diagnostic_msgs::msg::KeyValue kv;
  kv.key = "serial"; kv.value = serial_; status.values.push_back(kv);
  kv.key = "connected"; kv.value = (device_ && device_->isOpen()) ? "true" : "false";
  status.values.push_back(kv);
  kv.key = "color_fps";
  kv.value = std::to_string(static_cast<int>(color_fps + 0.5));
  status.values.push_back(kv);
  kv.key = "depth_fps";
  kv.value = std::to_string(static_cast<int>(depth_fps + 0.5));
  status.values.push_back(kv);
  kv.key = "ir_fps";
  kv.value = std::to_string(static_cast<int>(ir_fps + 0.5));
  status.values.push_back(kv);
  kv.key = "frames_dropped"; kv.value = std::to_string(frames_dropped_);
  status.values.push_back(kv);
  kv.key = "timeouts"; kv.value = std::to_string(timeouts_); status.values.push_back(kv);
  kv.key = "connects"; kv.value = std::to_string(connects_); status.values.push_back(kv);
  kv.key = "disconnects"; kv.value = std::to_string(disconnects_); status.values.push_back(kv);

  diag.status.push_back(status);
  diag.header.stamp = this->now();
  diag_pub_->publish(diag);

  color_frames_in_window_ = 0;
  depth_frames_in_window_ = 0;
  ir_frames_in_window_ = 0;
}

}  // namespace etrike_kinect2
