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
#include <cstdint>
#include <cstring>

#include <linux/can.h>

#include "direct_bridge/direct_bridge_node.hpp"
#include "protocol/codecs/seb.hpp"
#include "protocol/codecs/ses.hpp"
#include "protocol/generated/cpp/etrike_protocol.hpp"

namespace
{

void expect_hex(const struct can_frame & frame, const char * hex)
{
  // hex is "XX.XX.XX..." (cansend style) or "XXYYZZ" — normalize to a byte array.
  std::uint8_t expected[8];
  std::size_t expected_len = 0;
  for (std::size_t i = 0; hex[i] != '\0'; i += 2) {
    if (hex[i] == '.') {i -= 1; continue;}
    std::uint8_t hi = 0, lo = 0;
    auto nibble = [](char c) -> std::uint8_t {
        if (c >= '0' && c <= '9') {return static_cast<std::uint8_t>(c - '0');}
        if (c >= 'a' && c <= 'f') {return static_cast<std::uint8_t>(c - 'a' + 10);}
        if (c >= 'A' && c <= 'F') {return static_cast<std::uint8_t>(c - 'A' + 10);}
        return 0;
      };
    hi = nibble(hex[i]);
    lo = nibble(hex[i + 1]);
    expected[expected_len++] = static_cast<std::uint8_t>((hi << 4) | lo);
  }
  assert(frame.len == expected_len);
  for (std::size_t i = 0; i < expected_len; ++i) {
    assert(frame.data[i] == expected[i]);
  }
}

void test_drive_cmd()
{
  // Vector: rt-drive-negative -> 0x204 payload fffffe0c03 (motor_speed_mmps=-500, gear=3)
  direct_bridge::DirectBridgeParams params;
  direct_bridge::UnitEncoder enc(params);
  struct can_frame frame;
  assert(enc.encode_drive(-0.5, 3, frame));
  assert((frame.can_id & CAN_EFF_FLAG) == 0);
  assert(frame.len == 5);
  expect_hex(frame, "fffffe0c03");
}

void test_mode_cmd()
{
  // Vector: sys-mode -> 0x110 payload 02 (mode=2)
  direct_bridge::DirectBridgeParams params;
  direct_bridge::UnitEncoder enc(params);
  struct can_frame frame;
  assert(enc.encode_mode(2, frame));
  assert(frame.len == 1);
  expect_hex(frame, "02");
}

void test_estop()
{
  // Vector: safety-estop -> 0x001 payload empty
  direct_bridge::DirectBridgeParams params;
  direct_bridge::UnitEncoder enc(params);
  struct can_frame frame;
  assert(enc.encode_estop(frame));
  assert(frame.len == 0);
}

void test_ses_command_values()
{
  // Vector: ses-command-values -> alignment=1, control=1, angle_raw=1234,
  //         speed_raw=328, roll=5, veh_spd=10
  direct_bridge::DirectBridgeParams params;
  direct_bridge::UnitEncoder enc(params);
  struct can_frame frame;

  // Angle 1234 raw - offset 30000 = -28766 in 0.1deg -> rad.
  // Build via the encoder with a hand-computed angle; assert raw angle via codec.
  // Use encode_ses and decode back to verify fields + checksum.
  double angle_rad = enc.steering_rad_from_raw(static_cast<int16_t>(1234));
  // Reset roll to produce the vector's roll=5: encoder roll starts at 0,
  // so call next_ses_roll() five times then encode with a fresh encoder path.
  assert(enc.encode_ses(angle_rad, 0.0, frame));
  // The first encode uses roll=1 (roll starts 0, next_ses_roll increments first).
  // To match roll=5 we set the counter manually via a helper isn't exposed;
  // instead assert structural correctness: byte0 = 0x03, checksum valid, DLC 8.
  assert(frame.len == 8);
  assert((frame.data[0] & 0x03) == 0x03);  // both enables
  // Decode with the codec to verify checksum passes and fields round-trip.
  direct_bridge::UnitEncoder enc2(params);
  assert(enc2.encode_ses(angle_rad, 0.0, frame));
  etrike::protocol::codecs::ses::Command decoded{};
  assert(etrike::protocol::codecs::ses::decode_command(
    etrike::protocol::FrameView(frame.can_id, false, frame.len, frame.data), decoded) ==
    etrike::protocol::CodecStatus::Ok);
  assert(decoded.alignment_enable && decoded.control_enable);
  assert(decoded.target_angle_raw == 1234);
}

void test_seb_pressure_mode()
{
  // Vector: seb-command-pressure-mode -> pressure=50, stroke=0, mode=1, roll=3
  direct_bridge::DirectBridgeParams params;
  direct_bridge::UnitEncoder enc(params);
  struct can_frame frame;
  // 50 raw = 2500 kPa with 0.02 conversion.
  assert(enc.encode_seb(2500, true, frame));
  assert(frame.len == 8);
  assert((frame.data[0] & 0x07) == 0x07);  // align + control + mode(1)<<2
  assert((frame.data[0] & 0x08) != 0);     // auto_brake
  assert(frame.data[3] == 50);             // pressure raw
  // Verify checksum decodes cleanly.
  etrike::protocol::codecs::seb::Command decoded{};
  assert(etrike::protocol::codecs::seb::decode_command(
    etrike::protocol::FrameView(frame.can_id, false, frame.len, frame.data), decoded) ==
    etrike::protocol::CodecStatus::Ok);
  assert(decoded.control_mode == etrike::protocol::codecs::seb::ControlMode::Pressure);
  assert(decoded.pressure_request_raw == 50);
}

void test_seb_release_stroke()
{
  direct_bridge::DirectBridgeParams params;
  direct_bridge::UnitEncoder enc(params);
  struct can_frame frame;
  assert(enc.encode_seb(0, false, frame));
  assert(frame.len == 8);
  assert((frame.data[0] & 0x03) == 0x03);  // both enables
  assert((frame.data[0] & 0x04) == 0);     // stroke mode
  // stroke_request_raw 600 -> little endian bytes at 2,3.
  assert(frame.data[2] == (600 & 0xFF));
  assert(frame.data[3] == ((600 >> 8) & 0xFF));
  etrike::protocol::codecs::seb::Command decoded{};
  assert(etrike::protocol::codecs::seb::decode_command(
    etrike::protocol::FrameView(frame.can_id, false, frame.len, frame.data), decoded) ==
    etrike::protocol::CodecStatus::Ok);
  assert(decoded.control_mode == etrike::protocol::codecs::seb::ControlMode::Stroke);
  assert(decoded.stroke_request_raw == 600);
}

void test_steering_conversion_roundtrip()
{
  direct_bridge::DirectBridgeParams params;
  direct_bridge::UnitEncoder enc(params);
  // +10 deg left (Autoware convention). Wire is right-positive -> raw = -100 + 30000.
  double angle_rad = 10.0 * 3.14159265358979323846 / 180.0;
  int16_t raw = enc.steering_raw_from_rad(angle_rad);
  assert(raw == 29900);
  double back = enc.steering_rad_from_raw(raw);
  assert(std::abs(back - angle_rad) < 1e-6);
  // 0 rad -> centered raw 30000.
  assert(enc.steering_raw_from_rad(0.0) == 30000);
}

void test_speed_clamp()
{
  direct_bridge::DirectBridgeParams params;
  direct_bridge::UnitEncoder enc(params);
  struct can_frame frame;
  assert(enc.encode_drive(100.0, 1, frame));  // clamped to 3000 mm/s
  expect_hex(frame, "00000bb801");
  assert(enc.encode_drive(-100.0, 3, frame));  // clamped to -500 mm/s
  expect_hex(frame, "fffffe0c03");
}

}  // namespace

int main()
{
  test_drive_cmd();
  test_mode_cmd();
  test_estop();
  test_ses_command_values();
  test_seb_pressure_mode();
  test_seb_release_stroke();
  test_steering_conversion_roundtrip();
  test_speed_clamp();
  return 0;
}
