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
#include "etrike_kinect2/frame_converter.hpp"

#include <diagnostic_msgs/msg/diagnostic_status.hpp>
#include <diagnostic_msgs/msg/key_value.hpp>

#include <chrono>
#include <functional>

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
      reconnects_(0),
      last_diag_time_(this->now())
{
    declare_parameter<std::string>("serial", "");
    declare_parameter<bool>("color_enabled", true);
    declare_parameter<bool>("depth_enabled", true);
    declare_parameter<bool>("ir_enabled", false);
    declare_parameter<bool>("registration_enabled", true);
    declare_parameter<std::string>("frame_id_color", "kinect_color_optical_frame");
    declare_parameter<std::string>("frame_id_depth", "kinect_depth_optical_frame");
    declare_parameter<std::string>("frame_id_ir", "kinect_ir_optical_frame");
    declare_parameter<double>("depth_min_m", 0.5);
    declare_parameter<double>("depth_max_m", 4.5);
    declare_parameter<int>("reconnect_attempts", 3);
    declare_parameter<double>("reconnect_delay_s", 2.0);
}

Kinect2Node::~Kinect2Node()
{
    running_ = false;
    if (capture_thread_.joinable()) {
        capture_thread_.join();
    }
}

CallbackReturn Kinect2Node::on_configure(const rclcpp_lifecycle::State &)
{
    serial_ = get_parameter("serial").as_string();
    color_enabled_ = get_parameter("color_enabled").as_bool();
    depth_enabled_ = get_parameter("depth_enabled").as_bool();
    ir_enabled_ = get_parameter("ir_enabled").as_bool();
    registration_enabled_ = get_parameter("registration_enabled").as_bool();
    frame_id_color_ = get_parameter("frame_id_color").as_string();
    frame_id_depth_ = get_parameter("frame_id_depth").as_string();
    frame_id_ir_ = get_parameter("frame_id_ir").as_string();
    depth_min_m_ = get_parameter("depth_min_m").as_double();
    depth_max_m_ = get_parameter("depth_max_m").as_double();
    reconnect_attempts_ = get_parameter("reconnect_attempts").as_int();
    reconnect_delay_s_ = get_parameter("reconnect_delay_s").as_double();

    if (serial_.empty()) {
        RCLCPP_ERROR(get_logger(), "serial parameter is empty — cannot open Kinect");
        return CallbackReturn::FAILURE;
    }

    device_ = std::make_unique<Kinect2Device>();
    if (!device_->open(serial_)) {
        RCLCPP_ERROR(get_logger(), "failed to open Kinect serial=%s", serial_.c_str());
        device_.reset();
        return CallbackReturn::FAILURE;
    }

    RCLCPP_INFO(get_logger(), "Kinect opened: serial=%s", device_->serial().c_str());

    color_info_pub_ = create_publisher<sensor_msgs::msg::CameraInfo>(
        "color/camera_info", rclcpp::SensorDataQoS());
    depth_info_pub_ = create_publisher<sensor_msgs::msg::CameraInfo>(
        "depth/camera_info", rclcpp::SensorDataQoS());
    diag_pub_ = create_publisher<diagnostic_msgs::msg::DiagnosticArray>(
        "/diagnostics", rclcpp::SensorDataQoS());

    color_pub_ = image_transport::create_publisher(this, "color/image_raw");
    depth_pub_ = image_transport::create_publisher(this, "depth/image_raw");
    ir_pub_ = image_transport::create_publisher(this, "ir/image_raw");

    color_info_mgr_ = std::make_shared<camera_info_manager::CameraInfoManager>(
        this, frame_id_color_);
    depth_info_mgr_ = std::make_shared<camera_info_manager::CameraInfoManager>(
        this, frame_id_depth_);

    RCLCPP_INFO(get_logger(), "configured: color=%d depth=%d ir=%d reg=%d",
        color_enabled_, depth_enabled_, ir_enabled_, registration_enabled_);

    return CallbackReturn::SUCCESS;
}

CallbackReturn Kinect2Node::on_activate(const rclcpp_lifecycle::State &)
{
    {
        std::lock_guard<std::mutex> lock(device_mutex_);
        if (!device_ || !device_->start()) {
            RCLCPP_ERROR(get_logger(), "failed to start Kinect streaming");
            return CallbackReturn::FAILURE;
        }
    }

    running_ = true;
    device_ok_ = true;
    color_frames_delivered_ = 0;
    depth_frames_delivered_ = 0;
    ir_frames_delivered_ = 0;
    frames_dropped_ = 0;
    timeouts_ = 0;
    reconnects_ = 0;
    last_frame_time_ = this->now();
    last_diag_time_ = this->now();

    capture_thread_ = std::thread(&Kinect2Node::capture_loop, this);

    RCLCPP_INFO(get_logger(), "activated — capture thread started");
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
        if (device_) {
            device_->stop();
        }
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
    color_info_pub_.reset();
    depth_info_pub_.reset();
    diag_pub_.reset();
    color_info_mgr_.reset();
    depth_info_mgr_.reset();

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

void Kinect2Node::capture_loop()
{
    auto diag_timer = this->now();
    const auto diag_interval = std::chrono::seconds(1);

    while (running_) {
        FrameSet frames;
        bool ok;
        {
            std::lock_guard<std::mutex> lock(device_mutex_);
            if (!device_ || !device_->isStreaming()) {
                break;
            }
            ok = device_->wait_for_frames(frames, 5000);
        }

        if (!ok) {
            timeouts_++;
            if (timeouts_ > static_cast<uint64_t>(reconnect_attempts_)) {
                RCLCPP_ERROR(get_logger(), "repeated timeouts — attempting reconnect");
                std::lock_guard<std::mutex> lock(device_mutex_);
                if (device_) {
                    device_->stop();
                    device_->close();
                    rclcpp::sleep_for(
                        std::chrono::duration_cast<std::chrono::nanoseconds>(
                            std::chrono::duration<double>(reconnect_delay_s_)));
                    if (device_->open(serial_) && device_->start()) {
                        reconnects_++;
                        timeouts_ = 0;
                        RCLCPP_INFO(get_logger(), "reconnected to serial=%s", serial_.c_str());
                    } else {
                        RCLCPP_ERROR(get_logger(), "reconnect failed — going idle");
                        device_ok_ = false;
                        break;
                    }
                }
            }
            continue;
        }

        device_ok_ = true;
        auto stamp = this->now();
        last_frame_time_ = stamp;

        if (color_enabled_ && frames.color) {
            auto msg = FrameConverter::to_color_image(*frames.color, frame_id_color_, stamp);
            color_pub_.publish(msg);

            auto ci = color_info_mgr_->getCameraInfo();
            ci.header.stamp = stamp;
            ci.header.frame_id = frame_id_color_;
            color_info_pub_->publish(ci);

            color_frames_delivered_++;
        }

        if (depth_enabled_ && frames.depth) {
            auto msg = FrameConverter::to_depth_image(*frames.depth, frame_id_depth_, stamp);
            depth_pub_.publish(msg);

            auto ci = depth_info_mgr_->getCameraInfo();
            ci.header.stamp = stamp;
            ci.header.frame_id = frame_id_depth_;
            depth_info_pub_->publish(ci);

            depth_frames_delivered_++;
        }

        if (ir_enabled_ && frames.ir) {
            auto msg = FrameConverter::to_ir_image(*frames.ir, frame_id_ir_, stamp);
            ir_pub_.publish(msg);
            ir_frames_delivered_++;
        }

        {
            std::lock_guard<std::mutex> lock(device_mutex_);
            if (device_) {
                device_->release_frames(frames);
            }
        }

        // Publish diagnostics at ~1 Hz
        auto now = this->now();
        if ((now - diag_timer).seconds() >= 1.0) {
            diag_timer = now;

            diagnostic_msgs::msg::DiagnosticArray diag;
            diagnostic_msgs::msg::DiagnosticStatus status;
            status.name = "kinect2_driver";
            status.hardware_id = serial_;

            if (device_ok_) {
                status.level = diagnostic_msgs::msg::DiagnosticStatus::OK;
                status.message = "streaming";
            } else {
                status.level = diagnostic_msgs::msg::DiagnosticStatus::ERROR;
                status.message = "device disconnected";
            }

            diagnostic_msgs::msg::KeyValue kv;
            kv.key = "serial"; kv.value = serial_; status.values.push_back(kv);
            kv.key = "color_fps"; kv.value = std::to_string(color_frames_delivered_); status.values.push_back(kv);
            kv.key = "depth_fps"; kv.value = std::to_string(depth_frames_delivered_); status.values.push_back(kv);
            kv.key = "ir_fps"; kv.value = std::to_string(ir_frames_delivered_); status.values.push_back(kv);
            kv.key = "frames_dropped"; kv.value = std::to_string(frames_dropped_); status.values.push_back(kv);
            kv.key = "timeouts"; kv.value = std::to_string(timeouts_); status.values.push_back(kv);
            kv.key = "reconnects"; kv.value = std::to_string(reconnects_); status.values.push_back(kv);

            diag.status.push_back(status);
            diag.header.stamp = now;
            diag_pub_->publish(diag);

            color_frames_delivered_ = 0;
            depth_frames_delivered_ = 0;
            ir_frames_delivered_ = 0;
        }
    }
}

}  // namespace etrike_kinect2

#include <rclcpp_components/register_node_macro.hpp>
RCLCPP_COMPONENTS_REGISTER_NODE(etrike_kinect2::Kinect2Node)
