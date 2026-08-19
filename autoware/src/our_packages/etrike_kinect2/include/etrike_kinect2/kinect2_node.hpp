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

#ifndef ETRIKE_KINECT2__KINECT2_NODE_HPP_
#define ETRIKE_KINECT2__KINECT2_NODE_HPP_

#include <rclcpp_lifecycle/lifecycle_node.hpp>
#include <sensor_msgs/msg/image.hpp>
#include <diagnostic_msgs/msg/diagnostic_array.hpp>
#include <image_transport/image_transport.hpp>
#include <camera_info_manager/camera_info_manager.hpp>

#include <memory>
#include <string>
#include <thread>
#include <atomic>
#include <mutex>

#include "etrike_kinect2/kinect2_device.hpp"

namespace etrike_kinect2
{

class Kinect2Node : public rclcpp_lifecycle::LifecycleNode
{
public:
    explicit Kinect2Node(const rclcpp::NodeOptions & options);
    ~Kinect2Node() override;

protected:
    using CallbackReturn = rclcpp_lifecycle::node_interfaces::LifecycleNodeInterface::CallbackReturn;

    CallbackReturn on_configure(const rclcpp_lifecycle::State & state) override;
    CallbackReturn on_activate(const rclcpp_lifecycle::State & state) override;
    CallbackReturn on_deactivate(const rclcpp_lifecycle::State & state) override;
    CallbackReturn on_cleanup(const rclcpp_lifecycle::State & state) override;
    CallbackReturn on_shutdown(const rclcpp_lifecycle::State & state) override;
    CallbackReturn on_error(const rclcpp_lifecycle::State & state) override;

private:
    void capture_loop();

    // Parameters
    std::string serial_;
    bool color_enabled_;
    bool depth_enabled_;
    bool ir_enabled_;
    bool registration_enabled_;
    std::string frame_id_color_;
    std::string frame_id_depth_;
    std::string frame_id_ir_;
    double depth_min_m_;
    double depth_max_m_;
    int reconnect_attempts_;
    double reconnect_delay_s_;

    // Device
    std::unique_ptr<Kinect2Device> device_;

    // Publishers
    image_transport::Publisher color_pub_;
    image_transport::Publisher depth_pub_;
    image_transport::Publisher ir_pub_;
    rclcpp::Publisher<sensor_msgs::msg::CameraInfo>::SharedPtr color_info_pub_;
    rclcpp::Publisher<sensor_msgs::msg::CameraInfo>::SharedPtr depth_info_pub_;

    // Diagnostics
    rclcpp::Publisher<diagnostic_msgs::msg::DiagnosticArray>::SharedPtr diag_pub_;

    // Camera info managers
    std::shared_ptr<camera_info_manager::CameraInfoManager> color_info_mgr_;
    std::shared_ptr<camera_info_manager::CameraInfoManager> depth_info_mgr_;

    // Capture thread
    std::thread capture_thread_;
    std::atomic<bool> running_;
    std::atomic<bool> device_ok_;
    std::mutex device_mutex_;

    // Stats
    uint64_t color_frames_delivered_;
    uint64_t depth_frames_delivered_;
    uint64_t ir_frames_delivered_;
    uint64_t frames_dropped_;
    uint64_t timeouts_;
    uint64_t reconnects_;
    rclcpp::Time last_frame_time_;
    rclcpp::Time last_diag_time_;
};

}  // namespace etrike_kinect2

#endif  // ETRIKE_KINECT2__KINECT2_NODE_HPP_
