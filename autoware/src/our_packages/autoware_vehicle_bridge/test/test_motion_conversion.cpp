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

#include <cassert>
#include <cmath>

#include "autoware_vehicle_bridge/motion_conversion.hpp"
#include "protocol/generated/cpp/etrike_protocol.hpp"

using autoware_vehicle_bridge::motion::legacy_yaw_mrad_s;

int main()
{
  constexpr double wheel_base = 2.0;
  constexpr double max_angle = 0.747;
  constexpr double threshold = 0.05;
  constexpr double left_10deg = 0.17453292519943295;

  assert(legacy_yaw_mrad_s(left_10deg, 0.0, wheel_base, max_angle, threshold) == 0);
  assert(legacy_yaw_mrad_s(left_10deg, 0.049, wheel_base, max_angle, threshold) == 0);
  assert(legacy_yaw_mrad_s(left_10deg, -0.049, wheel_base, max_angle, threshold) == 0);
  assert(legacy_yaw_mrad_s(left_10deg, 0.05, wheel_base, max_angle, threshold) < 0);
  assert(legacy_yaw_mrad_s(left_10deg, -0.05, wheel_base, max_angle, threshold) > 0);
  assert(legacy_yaw_mrad_s(left_10deg, 0.051, wheel_base, max_angle, threshold) < 0);
  assert(legacy_yaw_mrad_s(left_10deg, -0.051, wheel_base, max_angle, threshold) > 0);

  assert(
    autoware_vehicle_bridge::motion::to_trike_steering_0_1deg(
      left_10deg, max_angle) == -100);
  assert(
    std::abs(
      autoware_vehicle_bridge::motion::universe_steering_rad(-100) -
      left_10deg) < 1e-6);
  assert(
    std::abs(
      autoware_vehicle_bridge::motion::universe_heading_rate(-250) -
      0.25F) < 1e-6F);

  namespace generated = etrike::protocol::generated;
  generated::HostSteerCmd steer{-100, true, 0, 7};
  etrike::protocol::Frame steer_frame;
  assert(generated::encode(steer, steer_frame) == etrike::protocol::CodecStatus::Ok);
  assert(steer_frame.id == 0x303);
  assert(steer_frame.dlc == 4);
  assert(steer_frame.data[0] == 0xFF && steer_frame.data[1] == 0x9C);
  assert(steer_frame.data[2] == 0x01 && steer_frame.data[3] == 7);

  generated::RtMotionRpt motion{1200, -85, 1, true, true, true, 0, 9};
  etrike::protocol::Frame motion_frame;
  assert(generated::encode(motion, motion_frame) == etrike::protocol::CodecStatus::Ok);
  generated::RtMotionRpt decoded{};
  assert(generated::decode(motion_frame.view(), decoded) == etrike::protocol::CodecStatus::Ok);
  assert(decoded.speed_mmps == 1200 && decoded.yaw_rate_mrad_s == -85);
  assert(decoded.gear == 1 && decoded.rolling_counter == 9);

  // SysSafetySts (DLC 5 with rolling counter and CRC)
  generated::SysSafetySts safety{};
  safety.estop_active = false;
  safety.heartbeat_ok = true;
  safety.light_head = true;
  safety.rolling_counter = 5;
  safety.e2e_crc = 0xAA;
  etrike::protocol::Frame safety_frame;
  assert(generated::encode(safety, safety_frame) == etrike::protocol::CodecStatus::Ok);
  assert(safety_frame.id == 0x011);
  assert(safety_frame.dlc == 5);
  generated::SysSafetySts decoded_safety{};
  assert(generated::decode(safety_frame.view(), decoded_safety) == etrike::protocol::CodecStatus::Ok);
  assert(!decoded_safety.estop_active && decoded_safety.heartbeat_ok);
  assert(decoded_safety.light_head && decoded_safety.rolling_counter == 5);

  // RtNodeStatus (DLC 8)
  generated::RtNodeStatus rt_node{};
  rt_node.node_state = generated::RtNodeStatus::kNodeStateActive;
  rt_node.block_mask = 0x0002;
  rt_node.output_enabled = true;
  rt_node.rolling_counter = 12;
  etrike::protocol::Frame rt_node_frame;
  assert(generated::encode(rt_node, rt_node_frame) == etrike::protocol::CodecStatus::Ok);
  assert(rt_node_frame.id == 0x501);
  assert(rt_node_frame.dlc == 8);
  generated::RtNodeStatus decoded_rt_node{};
  assert(generated::decode(rt_node_frame.view(), decoded_rt_node) == etrike::protocol::CodecStatus::Ok);
  assert(decoded_rt_node.node_state == generated::RtNodeStatus::kNodeStateActive);
  assert(decoded_rt_node.block_mask == 0x0002 && decoded_rt_node.output_enabled);

  // HostEstopResetReq (DLC 4 with magic token 0x5253)
  generated::HostEstopResetReq reset_req{};
  reset_req.reset_token = 0x5253;
  reset_req.request_seq = 42;
  reset_req.rolling_counter = 3;
  etrike::protocol::Frame reset_frame;
  assert(generated::encode(reset_req, reset_frame) == etrike::protocol::CodecStatus::Ok);
  assert(reset_frame.id == 0x114);
  assert(reset_frame.dlc == 4);
  generated::HostEstopResetReq decoded_reset_req{};
  assert(generated::decode(reset_frame.view(), decoded_reset_req) == etrike::protocol::CodecStatus::Ok);
  assert(decoded_reset_req.reset_token == 0x5253 && decoded_reset_req.request_seq == 42);

  // SysEstopResetRsp (DLC 5)
  generated::SysEstopResetRsp reset_rsp{};
  reset_rsp.request_seq = 42;
  reset_rsp.result = generated::SysEstopResetRsp::kResultAccepted;
  reset_rsp.blocker_mask = 0x0000;
  reset_rsp.rolling_counter = 1;
  etrike::protocol::Frame reset_rsp_frame;
  assert(generated::encode(reset_rsp, reset_rsp_frame) == etrike::protocol::CodecStatus::Ok);
  assert(reset_rsp_frame.id == 0x115);
  assert(reset_rsp_frame.dlc == 5);
  generated::SysEstopResetRsp decoded_reset_rsp{};
  assert(generated::decode(reset_rsp_frame.view(), decoded_reset_rsp) == etrike::protocol::CodecStatus::Ok);
  assert(decoded_reset_rsp.request_seq == 42 && decoded_reset_rsp.result == generated::SysEstopResetRsp::kResultAccepted);

  return 0;
}

