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

#include "direct_bridge/direct_bridge_node.hpp"

#include <linux/can.h>
#include <linux/can/raw.h>
#include <net/if.h>
#include <sys/ioctl.h>
#include <sys/socket.h>
#include <unistd.h>

#include <algorithm>
#include <cerrno>
#include <chrono>
#include <cmath>
#include <cstring>
#include <string>

#include <diagnostic_msgs/msg/diagnostic_status.hpp>

#include "protocol/codecs/seb.hpp"
#include "protocol/codecs/ses.hpp"
#include "protocol/core/frame.hpp"
#include "protocol/generated/cpp/etrike_protocol.hpp"

namespace direct_bridge
{

namespace generated = etrike::protocol::generated;
namespace ses = etrike::protocol::codecs::ses;
namespace seb = etrike::protocol::codecs::seb;

// Gear constants: CAN (wire) <-> Autoware.
namespace gear
{
constexpr uint8_t CAN_N = 0, CAN_D = 1, CAN_S = 2, CAN_R = 3;
constexpr uint8_t AW_NEUTRAL = 1, AW_DRIVE = 2, AW_REVERSE = 20, AW_LOW = 23;
}  // namespace gear

// Mode constants (0x110).
namespace mode
{
constexpr uint8_t MANUAL = 0, AUTO = 1;
}  // namespace mode

// =====================================================================
//  SocketCanDriver
// =====================================================================
bool SocketCanDriver::open(const std::string & interface)
{
  close();
  fd_ = socket(PF_CAN, SOCK_RAW, CAN_RAW);
  if (fd_ < 0) {return false;}

  struct ifreq ifr {};
  std::strncpy(ifr.ifr_name, interface.c_str(), IFNAMSIZ - 1);
  if (ioctl(fd_, SIOCGIFINDEX, &ifr) < 0) {close(); return false;}

  struct sockaddr_can addr {};
  addr.can_family = AF_CAN;
  addr.can_ifindex = ifr.ifr_ifindex;
  if (bind(fd_, reinterpret_cast<struct sockaddr *>(&addr), sizeof(addr)) < 0) {
    close(); return false;
  }

  return true;
}

void SocketCanDriver::close()
{
  if (fd_ >= 0) {::close(fd_); fd_ = -1;}
}

bool SocketCanDriver::send(const struct can_frame & frame)
{
  if (fd_ < 0) {return false;}
  return write(fd_, &frame, sizeof(frame)) == static_cast<int>(sizeof(frame));
}

bool SocketCanDriver::receive(struct can_frame & frame, int timeout_ms)
{
  if (fd_ < 0) {return false;}
  if (timeout_ms > 0) {
    struct timeval tv {timeout_ms / 1000, (timeout_ms % 1000) * 1000};
    setsockopt(fd_, SOL_SOCKET, SO_RCVTIMEO, &tv, sizeof(tv));
  }
  return read(fd_, &frame, sizeof(frame)) == static_cast<int>(sizeof(frame));
}

// =====================================================================
//  DirectBridgeParams
// =====================================================================
bool DirectBridgeParams::load_from(const rclcpp_lifecycle::LifecycleNode * node)
{
  can_interface = node->get_parameter("can_interface").as_string();
  loop_rate = node->get_parameter("loop_rate").as_double();
  enable_mtr = node->get_parameter("enable_mtr").as_bool();
  enable_ses = node->get_parameter("enable_ses").as_bool();
  enable_seb = node->get_parameter("enable_seb").as_bool();
  max_speed_forward = node->get_parameter("max_speed_forward").as_double();
  max_speed_reverse = node->get_parameter("max_speed_reverse").as_double();
  max_steering_angle = node->get_parameter("max_steering_angle").as_double();
  max_deceleration = node->get_parameter("max_deceleration").as_double();
  max_brake_pressure_kpa = node->get_parameter("max_brake_pressure_kpa").as_double();
  command_timeout_ms = node->get_parameter("command_timeout_ms").as_int();
  send_mode_auto = node->get_parameter("send_mode_auto").as_bool();
  steer_by_wire_offset = node->get_parameter("steer_by_wire_offset").as_int();
  steer_rate_min = node->get_parameter("steer_rate_min").as_double();
  steer_rate_max = node->get_parameter("steer_rate_max").as_double();
  require_ses_aligned = node->get_parameter("require_ses_aligned").as_bool();
  brake_kpa_to_raw = node->get_parameter("brake_kpa_to_raw").as_double();
  stroke_zero_raw = static_cast<uint16_t>(node->get_parameter("stroke_zero_raw").as_int());
  stroke_max_raw = static_cast<uint16_t>(node->get_parameter("stroke_max_raw").as_int());
  publish_brake_diag = node->get_parameter("publish_brake_diag").as_bool();
  return true;
}

void DirectBridgeParams::validate_or_throw() const
{
  if (can_interface.empty()) {throw std::domain_error("can_interface must not be empty");}
  if (loop_rate <= 0.0) {throw std::domain_error("loop_rate must be positive");}
  if (max_speed_forward <= 0.0) {throw std::domain_error("max_speed_forward must be positive");}
  if (max_speed_reverse < 0.0) {throw std::domain_error("max_speed_reverse must be non-negative");}
  if (max_steering_angle <= 0.0) {throw std::domain_error("max_steering_angle must be positive");}
  if (max_deceleration <= 0.0) {throw std::domain_error("max_deceleration must be positive");}
  if (max_brake_pressure_kpa <= 0.0) {
    throw std::domain_error("max_brake_pressure_kpa must be positive");
  }
  if (command_timeout_ms <= 0) {throw std::domain_error("command_timeout_ms must be positive");}
  if (steer_rate_min <= 0.0 || steer_rate_max < steer_rate_min) {
    throw std::domain_error("steer_rate_min/max invalid");
  }
  if (brake_kpa_to_raw <= 0.0) {throw std::domain_error("brake_kpa_to_raw must be positive");}
}

// =====================================================================
//  Frame conversion helpers
// =====================================================================
namespace
{

bool to_socket_frame(const etrike::protocol::Frame & source, struct can_frame & destination)
{
  if (!etrike::protocol::is_valid_frame(source.view())) {return false;}
  std::memset(&destination, 0, sizeof(destination));
  destination.can_id = source.id | (source.extended ? CAN_EFF_FLAG : 0);
  destination.len = source.dlc;
  std::copy_n(source.data.begin(), source.dlc, destination.data);
  return true;
}

etrike::protocol::FrameView protocol_view(const struct can_frame & frame)
{
  if ((frame.can_id & (CAN_ERR_FLAG | CAN_RTR_FLAG)) != 0) {
    return etrike::protocol::FrameView(
      etrike::protocol::kExtendedCanIdMax + 1u, false, frame.len,
      frame.data, sizeof(frame.data));
  }
  const bool extended = (frame.can_id & CAN_EFF_FLAG) != 0;
  const canid_t mask = extended ? CAN_EFF_MASK : CAN_SFF_MASK;
  return etrike::protocol::FrameView(
    frame.can_id & mask, extended, frame.len, frame.data, sizeof(frame.data));
}

}  // namespace

// =====================================================================
//  UnitEncoder
// =====================================================================
UnitEncoder::UnitEncoder(const DirectBridgeParams & params) : params_(params) {}

int32_t UnitEncoder::speed_to_mmps_impl(double speed_mps)
{
  return static_cast<int32_t>(std::lround(speed_mps * 1000.0));
}

bool UnitEncoder::encode_drive(double speed_mps, uint8_t gear, struct can_frame & frame) const
{
  if (!std::isfinite(speed_mps)) {return false;}
  // Protocol hard bounds: the generated RtDriveCmd codec rejects values outside
  // [-500, +3000] mm/s. Clamp to the intersection of the configured limits and
  // these hard bounds so an over-large parameter can never make the codec fail.
  const int32_t hard_min = -500;
  const int32_t hard_max = 3000;
  const int32_t lo = std::max(
    hard_min, static_cast<int32_t>(-params_.max_speed_reverse * 1000.0));
  const int32_t hi = std::min(
    hard_max, static_cast<int32_t>(params_.max_speed_forward * 1000.0));
  int32_t speed_mmps = speed_to_mmps_impl(speed_mps);
  speed_mmps = std::clamp(speed_mmps, lo, hi);

  generated::RtDriveCmd message{};
  message.motor_speed_mmps = speed_mmps;
  message.gear = gear;
  etrike::protocol::Frame encoded;
  if (generated::encode(message, encoded) != etrike::protocol::CodecStatus::Ok) {return false;}
  return to_socket_frame(encoded, frame);
}

bool UnitEncoder::encode_neutral_drive(struct can_frame & frame) const
{
  generated::RtDriveCmd message{};
  message.motor_speed_mmps = 0;
  message.gear = gear::CAN_N;
  etrike::protocol::Frame encoded;
  if (generated::encode(message, encoded) != etrike::protocol::CodecStatus::Ok) {return false;}
  return to_socket_frame(encoded, frame);
}

int16_t UnitEncoder::steering_raw_from_rad(double angle_rad) const
{
  constexpr double kRadTo01Deg = 1800.0 / 3.14159265358979323846;
  const double trike_angle = -std::clamp(
    angle_rad, -params_.max_steering_angle, params_.max_steering_angle);
  int16_t raw = static_cast<int16_t>(
    std::lround(trike_angle * kRadTo01Deg) + params_.steer_by_wire_offset);
  return raw;
}

double UnitEncoder::steering_rad_from_raw(int16_t raw_0_1deg) const
{
  constexpr double k01DegToRad = 3.14159265358979323846 / 1800.0;
  const double trike_angle_0_1deg = raw_0_1deg - params_.steer_by_wire_offset;
  return -trike_angle_0_1deg * k01DegToRad;
}

bool UnitEncoder::encode_ses(
  double steering_tire_angle_rad, double speed_mps, struct can_frame & frame)
{
  if (!std::isfinite(steering_tire_angle_rad)) {return false;}
  ses::Command message{};
  message.alignment_enable = true;
  message.control_enable = true;
  message.target_angle_raw = steering_raw_from_rad(steering_tire_angle_rad);

  // Dynamic slew rate: interpolate between min and max from vehicle speed (km/h).
  double speed_kmh = std::abs(speed_mps) * 3.6;
  double rate = params_.steer_rate_min +
    (speed_kmh - 2.0) * ((params_.steer_rate_max - params_.steer_rate_min) / 23.0);
  rate = std::clamp(rate, params_.steer_rate_min, params_.steer_rate_max);
  message.target_speed_raw = static_cast<uint16_t>(std::lround(rate));

  message.vehicle_speed_raw = static_cast<uint8_t>(
    std::clamp(std::lround(speed_kmh), 0L, 255L));
  message.rolling_counter = next_ses_roll();

  etrike::protocol::Frame encoded;
  if (ses::encode_command(message, encoded) != etrike::protocol::CodecStatus::Ok) {return false;}
  return to_socket_frame(encoded, frame);
}

bool UnitEncoder::encode_seb(int32_t brake_kpa, bool braking, struct can_frame & frame)
{
  seb::Command message{};
  message.alignment_enable = true;
  message.control_enable = true;
  message.rolling_counter = next_seb_roll();

  if (braking && brake_kpa > 0) {
    message.control_mode = seb::ControlMode::Pressure;
    int32_t raw = static_cast<int32_t>(
      std::lround(brake_kpa * params_.brake_kpa_to_raw));
    message.pressure_request_raw = static_cast<uint8_t>(
      std::clamp(raw, 0, 100));
    message.stroke_request_raw = params_.stroke_zero_raw;
    message.auto_brake = true;
  } else {
    message.control_mode = seb::ControlMode::Stroke;
    message.stroke_request_raw = params_.stroke_zero_raw;
    message.pressure_request_raw = 0;
    message.auto_brake = false;
  }

  etrike::protocol::Frame encoded;
  if (seb::encode_command(message, encoded) != etrike::protocol::CodecStatus::Ok) {return false;}
  return to_socket_frame(encoded, frame);
}

bool UnitEncoder::encode_seb_release(struct can_frame & frame)
{
  return encode_seb(0, false, frame);
}

bool UnitEncoder::encode_mode(uint8_t m, struct can_frame & frame) const
{
  generated::SysModeCmd message{};
  message.mode = m;
  etrike::protocol::Frame encoded;
  if (generated::encode(message, encoded) != etrike::protocol::CodecStatus::Ok) {return false;}
  return to_socket_frame(encoded, frame);
}

bool UnitEncoder::encode_estop(struct can_frame & frame) const
{
  generated::SafetyEstop message{};
  etrike::protocol::Frame encoded;
  if (generated::encode(message, encoded) != etrike::protocol::CodecStatus::Ok) {return false;}
  return to_socket_frame(encoded, frame);
}

// =====================================================================
//  DirectBridgeNode
// =====================================================================
DirectBridgeNode::DirectBridgeNode(const rclcpp::NodeOptions & options)
: rclcpp_lifecycle::LifecycleNode("direct_bridge", options)
{
  declare_parameter("can_interface", "vcan1");
  declare_parameter("loop_rate", 100.0);
  declare_parameter("enable_mtr", true);
  declare_parameter("enable_ses", true);
  declare_parameter("enable_seb", true);
  declare_parameter("max_speed_forward", 3.0);
  declare_parameter("max_speed_reverse", 0.5);
  declare_parameter("max_steering_angle", 0.747);
  declare_parameter("max_deceleration", 5.0);
  declare_parameter("max_brake_pressure_kpa", 5000.0);
  declare_parameter("command_timeout_ms", 200);
  declare_parameter("send_mode_auto", true);
  declare_parameter("steer_by_wire_offset", 30000);
  declare_parameter("steer_rate_min", 125.0);
  declare_parameter("steer_rate_max", 525.0);
  declare_parameter("require_ses_aligned", true);
  declare_parameter("brake_kpa_to_raw", 0.02);
  declare_parameter("stroke_zero_raw", 600);
  declare_parameter("stroke_max_raw", 1140);
  declare_parameter("publish_brake_diag", false);

  const auto command_qos = rclcpp::QoS(1).reliable();
  sub_control_ = create_subscription<autoware_control_msgs::msg::Control>(
    "/control/command/control_cmd", command_qos,
    [this](const autoware_control_msgs::msg::Control::SharedPtr m) {on_control(m);});
  sub_gear_ = create_subscription<autoware_vehicle_msgs::msg::GearCommand>(
    "/control/command/gear_cmd", command_qos,
    [this](const autoware_vehicle_msgs::msg::GearCommand::SharedPtr m) {on_gear(m);});
  sub_emergency_ = create_subscription<tier4_vehicle_msgs::msg::VehicleEmergencyStamped>(
    "/control/command/emergency_cmd", command_qos,
    [this](const tier4_vehicle_msgs::msg::VehicleEmergencyStamped::SharedPtr m) {
      on_emergency(m);
    });

  pub_velocity_ = create_publisher<autoware_vehicle_msgs::msg::VelocityReport>(
    "/vehicle/status/velocity_status", rclcpp::QoS(1));
  pub_gear_ = create_publisher<autoware_vehicle_msgs::msg::GearReport>(
    "/vehicle/status/gear_status", rclcpp::QoS(1));
  pub_steering_ = create_publisher<autoware_vehicle_msgs::msg::SteeringReport>(
    "/vehicle/status/steering_status", rclcpp::QoS(1));
  pub_diag_ = create_publisher<diagnostic_msgs::msg::DiagnosticArray>(
    "~/output/diagnostics", rclcpp::QoS(1));

  can_ = std::make_unique<SocketCanDriver>();
  RCLCPP_INFO(get_logger(), "DirectBridgeNode constructed.");
}

DirectBridgeNode::~DirectBridgeNode() {can_->close();}

void DirectBridgeNode::set_can_driver(std::unique_ptr<CanDriver> driver)
{
  can_ = std::move(driver);
}

// ---- Lifecycle ----
rclcpp_lifecycle::node_interfaces::LifecycleNodeInterface::CallbackReturn DirectBridgeNode::
on_configure(const rclcpp_lifecycle::State &)
{
  RCLCPP_INFO(get_logger(), "on_configure");
  if (!load_parameters()) {return CallbackReturn::FAILURE;}
  try {
    params_.validate_or_throw();
  } catch (const std::exception & e) {
    RCLCPP_ERROR(get_logger(), "Parameter validation failed: %s", e.what());
    return CallbackReturn::FAILURE;
  }
  if (!can_->open(params_.can_interface)) {
    RCLCPP_ERROR(
      get_logger(), "Failed to open CAN '%s': %s",
      params_.can_interface.c_str(), std::strerror(errno));
    return CallbackReturn::FAILURE;
  }

  encoder_ = std::make_unique<UnitEncoder>(params_);

  auto loop = std::chrono::duration<double>(1.0 / params_.loop_rate);
  timer_control_ = create_wall_timer(
    std::chrono::duration_cast<std::chrono::nanoseconds>(loop),
    std::bind(&DirectBridgeNode::tick_control, this));
  timer_control_->cancel();

  timer_mode_ = create_wall_timer(
    std::chrono::milliseconds(100),
    std::bind(&DirectBridgeNode::tick_mode, this));
  timer_mode_->cancel();

  RCLCPP_INFO(
    get_logger(), "Configured: loop=%.0fHz can=%s",
    params_.loop_rate, params_.can_interface.c_str());
  return CallbackReturn::SUCCESS;
}

rclcpp_lifecycle::node_interfaces::LifecycleNodeInterface::CallbackReturn DirectBridgeNode::
on_activate(const rclcpp_lifecycle::State &)
{
  RCLCPP_INFO(get_logger(), "on_activate");
  if (!can_->is_open() && !can_->open(params_.can_interface)) {
    RCLCPP_ERROR(get_logger(), "Failed to reopen CAN '%s'", params_.can_interface.c_str());
    return CallbackReturn::FAILURE;
  }

  pub_velocity_->on_activate();
  pub_gear_->on_activate();
  pub_steering_->on_activate();
  pub_diag_->on_activate();

  control_tick_ = 0;
  software_emergency_.store(false, std::memory_order_relaxed);
  ses_aligned_.store(false, std::memory_order_relaxed);

  timer_control_->reset();
  timer_mode_->reset();

  rx_running_ = true;
  rx_thread_ = std::thread(&DirectBridgeNode::run_can_receive, this);
  return CallbackReturn::SUCCESS;
}

rclcpp_lifecycle::node_interfaces::LifecycleNodeInterface::CallbackReturn DirectBridgeNode::
on_deactivate(const rclcpp_lifecycle::State &)
{
  RCLCPP_INFO(get_logger(), "on_deactivate");
  timer_control_->cancel();
  timer_mode_->cancel();

  rx_running_ = false;
  can_->close();
  if (rx_thread_.joinable()) {rx_thread_.join();}
  invalidate_control();

  pub_velocity_->on_deactivate();
  pub_gear_->on_deactivate();
  pub_steering_->on_deactivate();
  pub_diag_->on_deactivate();
  return CallbackReturn::SUCCESS;
}

rclcpp_lifecycle::node_interfaces::LifecycleNodeInterface::CallbackReturn DirectBridgeNode::
on_cleanup(const rclcpp_lifecycle::State &)
{
  RCLCPP_INFO(get_logger(), "on_cleanup");
  can_->close();
  timer_control_.reset();
  timer_mode_.reset();
  encoder_.reset();
  software_emergency_.store(false, std::memory_order_relaxed);
  ses_aligned_.store(false, std::memory_order_relaxed);
  return CallbackReturn::SUCCESS;
}

rclcpp_lifecycle::node_interfaces::LifecycleNodeInterface::CallbackReturn DirectBridgeNode::
on_shutdown(const rclcpp_lifecycle::State &)
{
  RCLCPP_INFO(get_logger(), "on_shutdown");
  rx_running_ = false;
  can_->close();
  if (rx_thread_.joinable()) {rx_thread_.join();}
  return CallbackReturn::SUCCESS;
}

// ---- Parameter loading ----
bool DirectBridgeNode::load_parameters()
{
  try {
    params_.load_from(this);
  } catch (const std::exception & e) {
    RCLCPP_ERROR(get_logger(), "Parameter load failed: %s", e.what());
    return false;
  }
  return true;
}

// ---- Subscription callbacks ----
void DirectBridgeNode::on_control(const autoware_control_msgs::msg::Control::SharedPtr msg)
{
  std::lock_guard<std::mutex> lock(mutex_);
  if (software_emergency_.load(std::memory_order_relaxed)) {return;}
  latest_control_ = msg;
  last_cmd_time_ = now();
}

void DirectBridgeNode::on_gear(const autoware_vehicle_msgs::msg::GearCommand::SharedPtr msg)
{
  std::lock_guard<std::mutex> lock(mutex_);
  latest_gear_ = msg;
}

void DirectBridgeNode::on_emergency(
  const tier4_vehicle_msgs::msg::VehicleEmergencyStamped::SharedPtr msg)
{
  software_emergency_.store(msg->emergency, std::memory_order_relaxed);
  if (!msg->emergency) {
    // Physical recovery is an operator action; a cleared flag only re-arms
    // after a fresh command arrives.
    return;
  }
  invalidate_control();

  // Rate-limited: max 1 ESTOP frame per 500 ms.
  auto n = now();
  if ((n - last_estop_tx_).seconds() * 1000.0 < 500.0) {return;}
  last_estop_tx_ = n;

  RCLCPP_ERROR(get_logger(), "EMERGENCY received — sending ESTOP");
  struct can_frame frame;
  if (encoder_ && encoder_->encode_estop(frame)) {
    send(frame);
  }
}

// ---- Timer ticks ----
void DirectBridgeNode::tick_control()
{
  if (!can_->is_open() || !encoder_) {return;}

  const auto tick_now = now();
  bool emergency = software_emergency_.load(std::memory_order_relaxed);

  // Snapshot latest commands.
  autoware_control_msgs::msg::Control::SharedPtr ctrl;
  autoware_vehicle_msgs::msg::GearCommand::SharedPtr gear_cmd;
  rclcpp::Time command_time;
  {
    std::lock_guard<std::mutex> lock(mutex_);
    ctrl = latest_control_;
    gear_cmd = latest_gear_;
    command_time = last_cmd_time_;
  }

  bool cmd_fresh = !emergency && ctrl != nullptr &&
    (tick_now - command_time).seconds() * 1000.0 <= params_.command_timeout_ms;

  uint8_t gear_can = gear::CAN_N;
  bool has_gear = false;
  int32_t speed_mmps = 0;
  double speed_mps = 0.0;
  double steer_rad = 0.0;
  int32_t brake_kpa = 0;
  bool braking = false;

  if (cmd_fresh) {
    speed_mps = ctrl->longitudinal.velocity;
    if (!std::isfinite(speed_mps)) {speed_mps = 0.0;}
    speed_mmps = static_cast<int32_t>(std::lround(speed_mps * 1000.0));
    speed_mmps = std::clamp(
      speed_mmps, static_cast<int32_t>(-params_.max_speed_reverse * 1000.0),
      static_cast<int32_t>(params_.max_speed_forward * 1000.0));

    steer_rad = ctrl->lateral.steering_tire_angle;
    if (!std::isfinite(steer_rad)) {steer_rad = 0.0;}

    // Brake pressure from defined deceleration.
    if (ctrl->longitudinal.is_defined_acceleration &&
      ctrl->longitudinal.acceleration < 0.0f)
    {
      double decel = -ctrl->longitudinal.acceleration;
      brake_kpa = static_cast<int32_t>(
        std::lround((decel / params_.max_deceleration) * params_.max_brake_pressure_kpa));
      brake_kpa = std::clamp(brake_kpa, 0, static_cast<int32_t>(params_.max_brake_pressure_kpa));
      braking = true;
    }

    // Gear resolution.
    if (gear_cmd && gear_cmd->command != autoware_vehicle_msgs::msg::GearCommand::NONE) {
      has_gear = true;
      switch (gear_cmd->command) {
        case gear::AW_DRIVE:   gear_can = gear::CAN_D; break;
        case gear::AW_REVERSE: gear_can = gear::CAN_R; break;
        case gear::AW_LOW:     gear_can = gear::CAN_S; break;
        default:               gear_can = gear::CAN_N; break;
      }
    }
  }
  if (!has_gear) {
    gear_can = resolve_gear(speed_mmps, false, gear::CAN_N);
  }

  // Increment sub-counter before use so phases align deterministically.
  const uint32_t tick = control_tick_++;

  // MTR: 0x204 every 10 ms (100 Hz loop -> every tick).
  if (params_.enable_mtr) {
    struct can_frame frame;
    if (cmd_fresh && encoder_->encode_drive(speed_mps, gear_can, frame)) {
      send(frame);
    } else if (encoder_->encode_neutral_drive(frame)) {
      send(frame);
    }
  }

  // SES: 0x169 every 20 ms (every 2nd tick).
  if (params_.enable_ses && (tick % 2 == 0)) {
    bool gate = !params_.require_ses_aligned ||
      ses_aligned_.load(std::memory_order_relaxed);
    struct can_frame frame;
    if (gate && cmd_fresh) {
      if (encoder_->encode_ses(steer_rad, speed_mps, frame)) {
        send(frame);
      }
    } else {
      // Center command while not aligned / no command.
      if (encoder_->encode_ses(0.0, 0.0, frame)) {
        send(frame);
      }
    }
  }

  // SEB: 0x7B9 every 20 ms (every 2nd tick).
  if (params_.enable_seb && (tick % 2 == 0)) {
    struct can_frame frame;
    if (cmd_fresh && encoder_->encode_seb(brake_kpa, braking, frame)) {
      send(frame);
    } else if (encoder_->encode_seb_release(frame)) {
      send(frame);
    }
  }
}

void DirectBridgeNode::tick_mode()
{
  if (!can_->is_open() || !encoder_) {return;}
  bool emergency = software_emergency_.load(std::memory_order_relaxed);
  if (emergency || !params_.send_mode_auto) {
    struct can_frame frame;
    if (encoder_->encode_mode(mode::MANUAL, frame)) {send(frame);}
    return;
  }
  struct can_frame frame;
  if (encoder_->encode_mode(mode::AUTO, frame)) {send(frame);}
}

void DirectBridgeNode::invalidate_control()
{
  std::lock_guard<std::mutex> lock(mutex_);
  latest_control_.reset();
  last_cmd_time_ = now();
}

bool DirectBridgeNode::send(const struct can_frame & frame)
{
  if (!can_->is_open()) {return false;}
  return can_->send(frame);
}

uint8_t DirectBridgeNode::resolve_gear(
  int32_t speed_mmps, bool has_override, uint8_t override_gear) const
{
  if (has_override) {return override_gear;}
  if (speed_mmps > 50) {return gear::CAN_D;}
  if (speed_mmps < -50) {return gear::CAN_R;}
  return gear::CAN_N;
}

// ---- CAN receive thread ----
void DirectBridgeNode::run_can_receive()
{
  RCLCPP_INFO(get_logger(), "CAN RX thread started");
  while (rx_running_) {
    struct can_frame frame;
    if (!can_->receive(frame, 100)) {continue;}
    handle_received_frame(frame);
  }
  RCLCPP_INFO(get_logger(), "CAN RX thread stopped");
}

void DirectBridgeNode::handle_received_frame(const struct can_frame & frame)
{
  const uint32_t id = protocol_view(frame).id();
  using autoware_vehicle_msgs::msg::GearReport;
  using autoware_vehicle_msgs::msg::SteeringReport;
  using autoware_vehicle_msgs::msg::VelocityReport;

  switch (id) {
    case generated::MtrMotorFbk::kLowId: {
        generated::MtrMotorFbk value{};
        if (generated::decode(protocol_view(frame), value) !=
          etrike::protocol::CodecStatus::Ok)
        {
          break;
        }
        GearReport gear;
        gear.stamp = now();
        switch (value.gear_state) {
          case gear::CAN_N: gear.report = gear::AW_NEUTRAL; break;
          case gear::CAN_D: gear.report = gear::AW_DRIVE; break;
          case gear::CAN_S: gear.report = gear::AW_LOW; break;
          case gear::CAN_R: gear.report = gear::AW_REVERSE; break;
          default:          gear.report = gear::AW_NEUTRAL; break;
        }
        if (pub_gear_->is_activated()) {pub_gear_->publish(gear);}
        break;
      }

    case generated::SysThrottleSts::kLowId: {
        generated::SysThrottleSts value{};
        if (generated::decode(protocol_view(frame), value) !=
          etrike::protocol::CodecStatus::Ok)
        {
          break;
        }
        VelocityReport velocity;
        velocity.header.stamp = now();
        velocity.header.frame_id = "base_link";
        velocity.longitudinal_velocity = value.speed_mmps / 1000.0f;
        velocity.lateral_velocity = 0.0f;
        velocity.heading_rate = 0.0f;
        if (pub_velocity_->is_activated()) {pub_velocity_->publish(velocity);}
        break;
      }

    case ses::kStatusId: {
        ses::Status value{};
        if (ses::decode_status(protocol_view(frame), value) !=
          etrike::protocol::CodecStatus::Ok)
        {
          break;
        }
        ses_aligned_.store(value.angle_aligned, std::memory_order_relaxed);
        SteeringReport steer;
        steer.stamp = now();
        steer.steering_tire_angle =
          encoder_ ? encoder_->steering_rad_from_raw(
            static_cast<int16_t>(value.steering_angle_raw)) : 0.0f;
        if (pub_steering_->is_activated()) {pub_steering_->publish(steer);}
        break;
      }

    case seb::kStatusId: {
        seb::Status value{};
        if (seb::decode_status(protocol_view(frame), value) !=
          etrike::protocol::CodecStatus::Ok)
        {
          break;
        }
        if (!params_.publish_brake_diag || !pub_diag_->is_activated()) {break;}
        diagnostic_msgs::msg::DiagnosticArray diag;
        diag.header.stamp = now();
        auto add = [&](const std::string & name, uint32_t val, uint8_t level) {
            diagnostic_msgs::msg::DiagnosticStatus s;
            s.name = "seb/" + name;
            s.hardware_id = "etrike";
            s.level = level;
            diagnostic_msgs::msg::KeyValue kv;
            kv.key = "raw";
            kv.value = std::to_string(val);
            s.values.push_back(kv);
            diag.status.push_back(s);
          };
        using DiagnosticStatus = diagnostic_msgs::msg::DiagnosticStatus;
        const uint8_t err = value.error_status;
        add("alignment", value.alignment_status ? 1u : 0u, DiagnosticStatus::OK);
        add(
          "error_status", err,
          err == 0 ? DiagnosticStatus::OK : DiagnosticStatus::ERROR);
        add("stroke_raw", value.stroke_value_raw, DiagnosticStatus::OK);
        if (value.control_mode == 1) {
          add("pressure_raw", value.pressure_value_raw, DiagnosticStatus::OK);
        }
        pub_diag_->publish(diag);
        break;
      }

    default:
      break;
  }
}

}  // namespace direct_bridge

#ifndef DIRECT_BRIDGE_NO_MAIN
int main(int argc, char * argv[])
{
  rclcpp::init(argc, argv);
  auto node = std::make_shared<direct_bridge::DirectBridgeNode>();
  rclcpp::executors::SingleThreadedExecutor executor;
  executor.add_node(node->get_node_base_interface());
  executor.spin();
  rclcpp::shutdown();
  return 0;
}
#endif  // DIRECT_BRIDGE_NO_MAIN
