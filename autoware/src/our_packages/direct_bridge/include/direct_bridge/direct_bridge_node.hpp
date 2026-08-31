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

#ifndef DIRECT_BRIDGE__DIRECT_BRIDGE_NODE_HPP_
#define DIRECT_BRIDGE__DIRECT_BRIDGE_NODE_HPP_

#include <atomic>
#include <cstdint>
#include <memory>
#include <mutex>
#include <string>
#include <thread>

#include <rclcpp/rclcpp.hpp>
#include <rclcpp_lifecycle/lifecycle_node.hpp>
#include <rclcpp_lifecycle/lifecycle_publisher.hpp>

#include <autoware_control_msgs/msg/control.hpp>
#include <autoware_vehicle_msgs/msg/gear_command.hpp>
#include <autoware_vehicle_msgs/msg/gear_report.hpp>
#include <autoware_vehicle_msgs/msg/steering_report.hpp>
#include <autoware_vehicle_msgs/msg/velocity_report.hpp>
#include <diagnostic_msgs/msg/diagnostic_array.hpp>
#include <tier4_vehicle_msgs/msg/vehicle_emergency_stamped.hpp>

struct can_frame;

namespace direct_bridge
{

// ---- CAN driver abstraction (testable, replaceable) ----
class CanDriver
{
public:
  virtual ~CanDriver() = default;
  virtual bool open(const std::string & interface) = 0;
  virtual void close() = 0;
  virtual bool send(const struct can_frame & frame) = 0;
  virtual bool receive(struct can_frame & frame, int timeout_ms) = 0;
  virtual bool is_open() const = 0;
};

class SocketCanDriver : public CanDriver
{
public:
  bool open(const std::string & interface) override;
  void close() override;
  bool send(const struct can_frame & frame) override;
  bool receive(struct can_frame & frame, int timeout_ms) override;
  bool is_open() const override {return fd_ >= 0;}

private:
  int fd_{-1};
};

// ---- Parameters (immutable after configure) ----
struct DirectBridgeParams
{
  std::string can_interface{"vcan1"};
  double loop_rate{100.0};
  bool enable_mtr{true};
  bool enable_ses{true};
  bool enable_seb{true};
  double max_speed_forward{3.0};
  double max_speed_reverse{0.5};
  double max_steering_angle{0.747};
  double max_deceleration{5.0};
  double max_brake_pressure_kpa{5000.0};
  int command_timeout_ms{200};
  bool send_mode_auto{true};
  int steer_by_wire_offset{30000};
  double steer_rate_min{125.0};
  double steer_rate_max{525.0};
  bool require_ses_aligned{true};
  double brake_kpa_to_raw{0.02};
  uint16_t stroke_zero_raw{600};
  uint16_t stroke_max_raw{1140};
  bool publish_brake_diag{false};

  bool load_from(const rclcpp_lifecycle::LifecycleNode * node);
  void validate_or_throw() const;
};

// ---- Encoders: Autoware / parameters -> CAN frame ----
class UnitEncoder
{
public:
  explicit UnitEncoder(const DirectBridgeParams & params);

  bool encode_drive(double speed_mps, uint8_t gear, struct can_frame & frame) const;
  bool encode_neutral_drive(struct can_frame & frame) const;
  bool encode_ses(
    double steering_tire_angle_rad, double speed_mps, struct can_frame & frame);
  bool encode_seb(
    int32_t brake_kpa, bool braking, struct can_frame & frame);
  bool encode_seb_release(struct can_frame & frame);
  bool encode_mode(uint8_t mode, struct can_frame & frame) const;
  bool encode_estop(struct can_frame & frame) const;

  int16_t steering_raw_from_rad(double angle_rad) const;
  double steering_rad_from_raw(int16_t raw_0_1deg) const;

  uint8_t next_ses_roll() {ses_roll_ = (ses_roll_ + 1) & 0x0F; return ses_roll_;}
  uint8_t next_seb_roll() {seb_roll_ = (seb_roll_ + 1) & 0x0F; return seb_roll_;}

private:
  static int32_t speed_to_mmps_impl(double speed_mps);

  const DirectBridgeParams & params_;
  uint8_t ses_roll_{0};
  uint8_t seb_roll_{0};
};

// ---- Main node ----
class DirectBridgeNode : public rclcpp_lifecycle::LifecycleNode
{
public:
  explicit DirectBridgeNode(const rclcpp::NodeOptions & options = rclcpp::NodeOptions());
  ~DirectBridgeNode() override;

  CallbackReturn on_configure(const rclcpp_lifecycle::State & previous_state) override;
  CallbackReturn on_activate(const rclcpp_lifecycle::State & previous_state) override;
  CallbackReturn on_deactivate(const rclcpp_lifecycle::State & previous_state) override;
  CallbackReturn on_cleanup(const rclcpp_lifecycle::State & previous_state) override;
  CallbackReturn on_shutdown(const rclcpp_lifecycle::State & previous_state) override;

  // Testing hook
  void set_can_driver(std::unique_ptr<CanDriver> driver);

private:
  // ---- Dependencies ----
  std::unique_ptr<CanDriver> can_;
  DirectBridgeParams params_;
  std::unique_ptr<UnitEncoder> encoder_;

  // ---- Subscriptions ----
  rclcpp::Subscription<autoware_control_msgs::msg::Control>::SharedPtr sub_control_;
  rclcpp::Subscription<autoware_vehicle_msgs::msg::GearCommand>::SharedPtr sub_gear_;
  rclcpp::Subscription<tier4_vehicle_msgs::msg::VehicleEmergencyStamped>::SharedPtr
    sub_emergency_;

  // ---- Publications ----
  rclcpp_lifecycle::LifecyclePublisher<autoware_vehicle_msgs::msg::VelocityReport>::SharedPtr
    pub_velocity_;
  rclcpp_lifecycle::LifecyclePublisher<autoware_vehicle_msgs::msg::GearReport>::SharedPtr
    pub_gear_;
  rclcpp_lifecycle::LifecyclePublisher<autoware_vehicle_msgs::msg::SteeringReport>::SharedPtr
    pub_steering_;
  rclcpp_lifecycle::LifecyclePublisher<diagnostic_msgs::msg::DiagnosticArray>::SharedPtr
    pub_diag_;

  // ---- Timers ----
  rclcpp::TimerBase::SharedPtr timer_control_;
  rclcpp::TimerBase::SharedPtr timer_mode_;

  // ---- CAN receive thread ----
  std::thread rx_thread_;
  std::atomic<bool> rx_running_{false};

  // ---- Command state (mutex-protected) ----
  std::mutex mutex_;
  autoware_control_msgs::msg::Control::SharedPtr latest_control_;
  autoware_vehicle_msgs::msg::GearCommand::SharedPtr latest_gear_;
  rclcpp::Time last_cmd_time_;
  std::atomic<bool> software_emergency_{false};

  // ---- SES alignment gate (set in RX thread) ----
  std::atomic<bool> ses_aligned_{false};

  // ---- Rate limiting ----
  rclcpp::Time last_estop_tx_{0, 0, RCL_SYSTEM_TIME};

  // ---- Sub-counters for the control loop ----
  uint32_t control_tick_{0};

  // ---- Callbacks ----
  void on_control(const autoware_control_msgs::msg::Control::SharedPtr msg);
  void on_gear(const autoware_vehicle_msgs::msg::GearCommand::SharedPtr msg);
  void on_emergency(const tier4_vehicle_msgs::msg::VehicleEmergencyStamped::SharedPtr msg);

  void tick_control();
  void tick_mode();
  void run_can_receive();

  // ---- Helpers ----
  bool load_parameters();
  void invalidate_control();
  bool send(const struct can_frame & frame);
  void handle_received_frame(const struct can_frame & frame);
  uint8_t resolve_gear(int32_t speed_mmps, bool has_override, uint8_t override_gear) const;
};

}  // namespace direct_bridge

#endif  // DIRECT_BRIDGE__DIRECT_BRIDGE_NODE_HPP_
