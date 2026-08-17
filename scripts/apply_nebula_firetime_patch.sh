#!/bin/bash
# Apply the E-Trike firetime CSV support patch to vendored Nebula.
#
# This script modifies the vendored Nebula Hesai decoder to support loading
# per-channel firing times from a device-specific CSV file (XT32M2X_Firetime.csv)
# instead of using the hard-coded formula (368 + 2888 * channel_id ns).
#
# The device CSV differs from the formula by ~5.6 us mean, which causes
# timestamp errors affecting distortion correction and localization.
#
# Usage:
#   ./scripts/apply_nebula_firetime_patch.sh [NEBULA_SRC_DIR]
#
# If NEBULA_SRC_DIR is not given, it defaults to:
#   autoware/src/sensor_component/external/nebula/src
#
# This script is idempotent: it detects if the patch is already applied and
# skips gracefully.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NEBULA_SRC="${1:-${SCRIPT_DIR}/../autoware/src/sensor_component/external/nebula/src}"

if [ ! -d "$NEBULA_SRC/nebula_hesai" ]; then
    echo "ERROR: Nebula source not found at $NEBULA_SRC/nebula_hesai"
    exit 1
fi

# --- 1. hesai_common.hpp: add firetime_path + HesaiFiretimeConfiguration ---
COMMON_HPP="$NEBULA_SRC/nebula_hesai/nebula_hesai_common/include/nebula_hesai_common/hesai_common.hpp"

if grep -q "firetime_path" "$COMMON_HPP" 2>/dev/null; then
    echo "[SKIP] hesai_common.hpp already has firetime_path"
else
    echo "[PATCH] hesai_common.hpp: adding firetime_path field + HesaiFiretimeConfiguration"
    # Add firetime_path to HesaiSensorConfiguration
    sed -i '/std::optional<AdvancedFunctionalSafetyConfiguration> functional_safety;/a\  std::string firetime_path;' "$COMMON_HPP"
    # Add HesaiFiretimeConfiguration struct before HesaiCorrection
    # We use a marker-based insertion with python for reliability
    python3 -c "
import re
with open('$COMMON_HPP', 'r') as f:
    content = f.read()
firetime_struct = '''
/// @brief struct for Hesai firetime (firing-time) configuration
/// Loads per-channel firing times from a CSV file with columns:
///   Channel, fire time(us)
/// The firing times are stored in nanoseconds for direct use by decoders.
struct HesaiFiretimeConfiguration
{
  std::string firetime_file;
  std::map<size_t, int> firetime_offset_ns_map;

  inline nebula::Status load_from_file(const std::string & firetime_file)
  {
    std::ifstream ifs(firetime_file);
    if (!ifs) {
      return Status::INVALID_CALIBRATION_FILE;
    }

    std::string line;
    std::getline(ifs, line);  // skip header line

    while (std::getline(ifs, line)) {
      if (line.empty()) continue;
      std::istringstream ss(line);
      std::string channel_str, firetime_str;
      if (!std::getline(ss, channel_str, ',') || !std::getline(ss, firetime_str, ',')) {
        continue;
      }
      try {
        size_t channel = static_cast<size_t>(std::stoul(channel_str));
        double firetime_us = std::stod(firetime_str);
        firetime_offset_ns_map[channel] = static_cast<int>(firetime_us * 1000.0);
      } catch (const std::exception &) {
        continue;
      }
    }

    if (firetime_offset_ns_map.empty()) {
      return Status::INVALID_CALIBRATION_FILE;
    }

    this->firetime_file = firetime_file;
    return Status::OK;
  }

  [[nodiscard]] std::optional<int> get_firetime_offset_ns(size_t channel) const
  {
    auto it = firetime_offset_ns_map.find(channel);
    if (it != firetime_offset_ns_map.end()) {
      return it->second;
    }
    return std::nullopt;
  }
};

'''
marker = '/// @brief struct for Hesai correction configuration (for AT)'
content = content.replace(marker, firetime_struct + marker, 1)
with open('$COMMON_HPP', 'w') as f:
    f.write(content)
"
fi

# --- 2. hesai_sensor.hpp: add virtual set_firetime_configuration() ---
SENSOR_HPP="$NEBULA_SRC/nebula_hesai/nebula_hesai_decoders/include/nebula_hesai_decoders/decoders/hesai_sensor.hpp"

if grep -q "set_firetime_configuration" "$SENSOR_HPP" 2>/dev/null; then
    echo "[SKIP] hesai_sensor.hpp already has set_firetime_configuration"
else
    echo "[PATCH] hesai_sensor.hpp: adding set_firetime_configuration() + hesai_common.hpp include"
    # Add include for hesai_common.hpp
    sed -i '/#include <nebula_core_common\/nebula_common.hpp>/a #include <nebula_hesai_common/hesai_common.hpp>' "$SENSOR_HPP"
    # Add virtual method before the closing of the class
    python3 -c "
with open('$SENSOR_HPP', 'r') as f:
    content = f.read()
old = '''  [[nodiscard]] virtual point_filters::BlockageState get_blockage_type(
    uint16_t /* raw_distance */) const
  {
    return point_filters::BlockageState::UNSURE;
  }
};'''
new = '''  [[nodiscard]] virtual point_filters::BlockageState get_blockage_type(
    uint16_t /* raw_distance */) const
  {
    return point_filters::BlockageState::UNSURE;
  }

  /// @brief Set per-channel firetime offsets from a device-specific CSV file.
  /// Default implementation is a no-op; sensors that support firetime loading
  /// (e.g. PandarXT32M) should override this.
  /// @param firetime_config The loaded firetime configuration
  virtual void set_firetime_configuration(const HesaiFiretimeConfiguration & /*firetime_config*/)
  {
  }
};'''
content = content.replace(old, new, 1)
with open('$SENSOR_HPP', 'w') as f:
    f.write(content)
"
fi

# --- 3. pandar_xt32m.hpp: override set_firetime_configuration() + use stored offsets ---
XT32M_HPP="$NEBULA_SRC/nebula_hesai/nebula_hesai_decoders/include/nebula_hesai_decoders/decoders/pandar_xt32m.hpp"

if grep -q "firetime_offsets_ns_" "$XT32M_HPP" 2>/dev/null; then
    echo "[SKIP] pandar_xt32m.hpp already has firetime support"
else
    echo "[PATCH] pandar_xt32m.hpp: replacing with firetime-aware version"
    cat > "$XT32M_HPP" << 'PATCH_EOF'
// Copyright 2024 TIER IV, Inc.
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

#pragma once

#include "nebula_hesai_decoders/decoders/hesai_packet.hpp"
#include "nebula_hesai_decoders/decoders/hesai_sensor.hpp"
#include "nebula_hesai_decoders/decoders/pandar_xt32.hpp"

#include <nebula_hesai_common/hesai_common.hpp>

#include <array>
#include <optional>

namespace nebula::drivers
{

namespace hesai_packet
{

#pragma pack(push, 1)

using TailXT32M2X = TailXT32;
struct PacketXT32M2X : public PacketBase<6, 32, 3, 100>
{
  using body_t = Body<Block<Unit4B, PacketXT32M2X::n_channels>, PacketXT32M2X::n_blocks>;
  Header12B header;
  body_t body;
  TailXT32M2X tail;
  uint32_t udp_sequence;
};

#pragma pack(pop)

}  // namespace hesai_packet

class PandarXT32M : public HesaiSensor<hesai_packet::PacketXT32M2X>
{
public:
  static constexpr float min_range = 0.5f;
  static constexpr float max_range = 300.0f;
  static constexpr size_t max_scan_buffer_points = 384000;
  static constexpr FieldOfView<int32_t, MilliDegrees> fov_mdeg{{0, 360'000}, {-20'800, 19'500}};
  static constexpr AnglePair<int32_t, MilliDegrees> peak_resolution_mdeg{180, 1'300};

  PandarXT32M() : firetime_offsets_ns_(std::nullopt) {}

  /// @brief Set per-channel firetime offsets from a device-specific CSV file.
  /// When set, these replace the hard-coded formula (368 + 2888 * channel_id).
  /// @param firetime_config The loaded firetime configuration
  void set_firetime_configuration(const HesaiFiretimeConfiguration & firetime_config) override
  {
    std::array<int, n_channels> offsets{};
    bool all_loaded = true;
    for (size_t ch = 0; ch < n_channels; ++ch) {
      auto val = firetime_config.get_firetime_offset_ns(ch + 1);  // CSV uses 1-based channels
      if (val.has_value()) {
        offsets[ch] = val.value();
      } else {
        all_loaded = false;
        break;
      }
    }
    if (all_loaded) {
      firetime_offsets_ns_ = offsets;
    }
  }

  int get_packet_relative_point_time_offset(
    uint32_t block_id, uint32_t channel_id, const packet_t & packet) override
  {
    auto n_returns = hesai_packet::get_n_returns(packet.tail.return_mode);
    int block_offset_ns = 0;
    if (n_returns < 3) {
      block_offset_ns = 5632 - 50000 * ((8 - block_id - 1) / n_returns);
    } else /* n_returns == 3 */ {
      block_offset_ns = 5632 - 50000 * ((6 - block_id - 1) / 3);
    }

    uint32_t ch_idx = channel_id;
    if (ch_idx >= 16) {
      ch_idx -= 16;
    }

    int channel_offset_ns;
    if (firetime_offsets_ns_.has_value()) {
      channel_offset_ns = (*firetime_offsets_ns_)[channel_id];
    } else {
      channel_offset_ns = 368 + 2888 * ch_idx;
    }

    return block_offset_ns + channel_offset_ns;
  }

private:
  static constexpr size_t n_channels = hesai_packet::PacketXT32M2X::n_channels;
  std::optional<std::array<int, n_channels>> firetime_offsets_ns_;
};

}  // namespace nebula::drivers
PATCH_EOF
fi

# --- 4. hesai_decoder.hpp: load firetime in constructor ---
DECODER_HPP="$NEBULA_SRC/nebula_hesai/nebula_hesai_decoders/include/nebula_hesai_decoders/decoders/hesai_decoder.hpp"

if grep -q "firetime_path" "$DECODER_HPP" 2>/dev/null; then
    echo "[SKIP] hesai_decoder.hpp already has firetime loading"
else
    echo "[PATCH] hesai_decoder.hpp: adding firetime loading in constructor"
    python3 -c "
with open('$DECODER_HPP', 'r') as f:
    content = f.read()

old = '''    if (sensor_configuration->downsample_mask_path) {
      mask_filter_ = point_filters::DownsampleMaskFilter(
        sensor_configuration->downsample_mask_path.value(), SensorT::fov_mdeg.azimuth,
        SensorT::peak_resolution_mdeg.azimuth, SensorT::packet_t::n_channels,
        logger_->child(\"Downsample Mask\"), true, sensor_.get_dither_transform());
    }
  }'''

new = '''    if (sensor_configuration->downsample_mask_path) {
      mask_filter_ = point_filters::DownsampleMaskFilter(
        sensor_configuration->downsample_mask_path.value(), SensorT::fov_mdeg.azimuth,
        SensorT::peak_resolution_mdeg.azimuth, SensorT::packet_t::n_channels,
        logger_->child(\"Downsample Mask\"), true, sensor_.get_dither_transform());
    }

    if (!sensor_configuration->firetime_path.empty()) {
      HesaiFiretimeConfiguration firetime_config;
      auto status = firetime_config.load_from_file(sensor_configuration->firetime_path);
      if (status == Status::OK) {
        sensor_.set_firetime_configuration(firetime_config);
        NEBULA_LOG_STREAM(
          logger_->info,
          \"Loaded firetime configuration from \" << sensor_configuration->firetime_path
                                                << \" (\" << firetime_config.firetime_offset_ns_map.size()
                                                << \" channels)\");
      } else {
        NEBULA_LOG_STREAM(
          logger_->warn,
          \"Failed to load firetime configuration from \"
            << sensor_configuration->firetime_path << \": \" << util::to_string(status)
            << \". Falling back to hard-coded firing-time formula.\");
      }
    }
  }'''

content = content.replace(old, new, 1)
with open('$DECODER_HPP', 'w') as f:
    f.write(content)
"
fi

# --- 5. hesai_ros_wrapper.cpp: declare firetime_file_path ROS parameter ---
WRAPPER_CPP="$NEBULA_SRC/nebula_hesai/nebula_hesai/src/hesai_ros_wrapper.cpp"

if grep -q "firetime_file_path" "$WRAPPER_CPP" 2>/dev/null; then
    echo "[SKIP] hesai_ros_wrapper.cpp already has firetime_file_path parameter"
else
    echo "[PATCH] hesai_ros_wrapper.cpp: adding firetime_file_path ROS parameter"
    sed -i '/config.calibration_download_enabled =/a\  config.firetime_path =\n    declare_parameter<std::string>("firetime_file_path", "", param_read_only());' "$WRAPPER_CPP"
fi

echo ""
echo "=== Nebula firetime patch applied successfully ==="
echo "Modified files:"
echo "  $COMMON_HPP"
echo "  $SENSOR_HPP"
echo "  $XT32M_HPP"
echo "  $DECODER_HPP"
echo "  $WRAPPER_CPP"
echo ""
echo "Rebuild Nebula with:"
echo "  colcon build --symlink-install --packages-select nebula_hesai nebula_hesai_decoders nebula_hesai_common"
