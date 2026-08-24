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

#ifndef ETRIKE_KINECT2__KINECT2_DEVICE_HPP_
#define ETRIKE_KINECT2__KINECT2_DEVICE_HPP_

#include <libfreenect2/frame_listener_impl.h>
#include <libfreenect2/registration.h>

#include <memory>
#include <string>
#include <vector>

#include <libfreenect2/libfreenect2.hpp>

namespace etrike_kinect2
{

struct FrameSet
{
  libfreenect2::Frame * color;
  libfreenect2::Frame * ir;
  libfreenect2::Frame * depth;
};

struct DeviceInfo
{
  std::string serial;
  std::string firmware;
};

// Depth-processing pipeline selection (see libfreenect2 packet_pipeline.h).
// Only entries that are actually compiled into the linked libfreenect2 build
// are usable at runtime; unknown/unsupported entries fall back to CPU.
enum class PipelineType
{
  AUTO,
  CPU,
  CUDA,
  CUDA_KDE,
  OPENCL,
  OPENCL_KDE,
};

// libfreenect2 depth-processing configuration (Freenect2Device::Config).
struct DepthConfig
{
  bool bilateral_filter = true;
  bool edge_aware_filter = true;
  double min_depth_m = 0.5;
  double max_depth_m = 4.5;
};

class Kinect2Device
{
public:
  Kinect2Device();
  ~Kinect2Device();

  Kinect2Device(const Kinect2Device &) = delete;
  Kinect2Device & operator=(const Kinect2Device &) = delete;

  static std::vector<DeviceInfo> enumerateDevices();

  bool open(
    const std::string & serial,
    bool enable_color = true,
    bool enable_depth = true,
    bool enable_ir = false,
    PipelineType pipeline = PipelineType::AUTO,
    const DepthConfig & config = DepthConfig());
  bool start();
  void stop();
  void close();

  bool isOpen() const;
  bool isStreaming() const;
  std::string serial() const;

  bool wait_for_frames(FrameSet & frames, unsigned int timeout_ms = 10000);
  void release_frames(FrameSet & frames);

  libfreenect2::Registration * registration() const;
  libfreenect2::Freenect2Device::ColorCameraParams color_params() const;
  libfreenect2::Freenect2Device::IrCameraParams ir_params() const;

private:
  std::unique_ptr<libfreenect2::Freenect2> freenect2_;
  libfreenect2::Freenect2Device * device_;
  std::unique_ptr<libfreenect2::PacketPipeline> pipeline_;
  std::unique_ptr<libfreenect2::SyncMultiFrameListener> listener_color_;
  std::unique_ptr<libfreenect2::SyncMultiFrameListener> listener_irdepth_;
  std::unique_ptr<libfreenect2::Registration> registration_;

  std::string serial_;
  bool streaming_;
  bool enable_color_;
  bool enable_depth_;
  bool enable_ir_;
};

}  // namespace etrike_kinect2

#endif  // ETRIKE_KINECT2__KINECT2_DEVICE_HPP_
