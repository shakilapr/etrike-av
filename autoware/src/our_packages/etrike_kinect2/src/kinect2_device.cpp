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

#include "etrike_kinect2/kinect2_device.hpp"

#include <libfreenect2/logger.h>
#include <libfreenect2/packet_pipeline.h>

#include <cstdio>
#include <exception>

namespace etrike_kinect2
{

Kinect2Device::Kinect2Device()
: device_(nullptr), streaming_(false)
{
}

Kinect2Device::~Kinect2Device()
{
  stop();
  close();
}

std::vector<DeviceInfo> Kinect2Device::enumerateDevices()
{
  libfreenect2::Freenect2 fn2;
  std::vector<DeviceInfo> devices;
  for (int i = 0; i < static_cast<int>(fn2.enumerateDevices()); ++i) {
    DeviceInfo info;
    info.serial = fn2.getDeviceSerialNumber(i);
    info.firmware = "unknown";
    devices.push_back(info);
  }
  return devices;
}

bool Kinect2Device::open(
  const std::string & serial,
  bool enable_color,
  bool enable_depth,
  bool enable_ir,
  PipelineType pipeline,
  const DepthConfig & config)
{
  freenect2_ = std::make_unique<libfreenect2::Freenect2>();

  libfreenect2::setGlobalLogger(libfreenect2::createConsoleLogger(libfreenect2::Logger::Warning));

  if (freenect2_->enumerateDevices() == 0) {
    return false;
  }

  // Build the requested depth pipeline. libfreenect2 exposes several depth
  // reconstruction processors; the KDE variants use kernel-density estimation
  // to improve phase unwrapping / outlier rejection on Kinect v2 ToF data.
  // Only pipelines compiled into the linked build are available (see
  // /usr/include/libfreenect2/config.h), so each case falls back to CPU when
  // its feature macro is undefined. A constructor throw (e.g. CUDA context
  // failure) also falls back to CPU.
  try {
    switch (pipeline) {
      case PipelineType::CUDA_KDE:
#ifdef LIBFREENECT2_WITH_CUDA_SUPPORT
        pipeline_.reset(new libfreenect2::CudaKdePacketPipeline());
#else
        pipeline_.reset(new libfreenect2::CpuPacketPipeline());
#endif
        break;
      case PipelineType::CUDA:
#ifdef LIBFREENECT2_WITH_CUDA_SUPPORT
        pipeline_.reset(new libfreenect2::CudaPacketPipeline());
#else
        pipeline_.reset(new libfreenect2::CpuPacketPipeline());
#endif
        break;
      case PipelineType::OPENCL_KDE:
#ifdef LIBFREENECT2_WITH_OPENCL_SUPPORT
        pipeline_.reset(new libfreenect2::OpenCLKdePacketPipeline());
#else
        pipeline_.reset(new libfreenect2::CpuPacketPipeline());
#endif
        break;
      case PipelineType::OPENCL:
#ifdef LIBFREENECT2_WITH_OPENCL_SUPPORT
        pipeline_.reset(new libfreenect2::OpenCLPacketPipeline());
#else
        pipeline_.reset(new libfreenect2::CpuPacketPipeline());
#endif
        break;
      case PipelineType::AUTO:
        // Prefer CUDA, then KDE-CUDA; fall back to CPU on exception.
#ifdef LIBFREENECT2_WITH_CUDA_SUPPORT
        pipeline_.reset(new libfreenect2::CudaPacketPipeline());
#else
        pipeline_.reset(new libfreenect2::CpuPacketPipeline());
#endif
        break;
      case PipelineType::CPU:
      default:
        pipeline_.reset(new libfreenect2::CpuPacketPipeline());
        break;
    }
  } catch (const std::exception & e) {
    fprintf(
      stderr, "[kinect2_device] pipeline unavailable (%s) — falling back to CPU\n",
      e.what());
    pipeline_.reset(new libfreenect2::CpuPacketPipeline());
  }

  device_ = freenect2_->openDevice(serial, pipeline_.get());
  if (!device_) {
    return false;
  }

  serial_ = serial;
  enable_color_ = enable_color;
  enable_depth_ = enable_depth;
  enable_ir_ = enable_ir;

  // Apply the depth-processing configuration (bilateral / edge-aware filters,
  // min/max range). Safe before start() (libfreenect2 requires configuration
  // before start or after stop).
  libfreenect2::Freenect2Device::Config device_config;
  device_config.EnableBilateralFilter = config.bilateral_filter;
  device_config.EnableEdgeAwareFilter = config.edge_aware_filter;
  device_config.MinDepth = static_cast<float>(config.min_depth_m);
  device_config.MaxDepth = static_cast<float>(config.max_depth_m);
  device_->setConfiguration(device_config);

  registration_.reset(
    new libfreenect2::Registration(
      device_->getIrCameraParams(), device_->getColorCameraParams()));

  // Separate listeners for RGB and IR+depth (the proven kinect2_bridge
  // design): each returns at its own cadence instead of forcing all three
  // streams to synchronize.
  listener_color_.reset(
    new libfreenect2::SyncMultiFrameListener(libfreenect2::Frame::Color));
  listener_irdepth_.reset(
    new libfreenect2::SyncMultiFrameListener(
      libfreenect2::Frame::Ir | libfreenect2::Frame::Depth));

  device_->setColorFrameListener(listener_color_.get());
  device_->setIrAndDepthFrameListener(listener_irdepth_.get());

  return true;
}

bool Kinect2Device::start()
{
  if (!device_) {
    return false;
  }
  if (streaming_) {
    return true;
  }
  // Start only the requested hardware streams. Disabled streams are not
  // acquired at all, saving USB bandwidth and CPU on a dual-camera setup.
  bool ok = device_->startStreams(enable_color_, enable_depth_);
  streaming_ = ok;
  return ok;
}

void Kinect2Device::stop()
{
  if (device_ && streaming_) {
    device_->stop();
    streaming_ = false;
  }
}

void Kinect2Device::close()
{
  stop();
  listener_color_.reset();
  listener_irdepth_.reset();
  registration_.reset();
  if (device_) {
    device_->close();
    device_ = nullptr;
  }
  pipeline_.reset();
  freenect2_.reset();
  serial_.clear();
}

bool Kinect2Device::isOpen() const
{
  return device_ != nullptr;
}

bool Kinect2Device::isStreaming() const
{
  return streaming_;
}

std::string Kinect2Device::serial() const
{
  return serial_;
}

bool Kinect2Device::wait_for_frames(FrameSet & frames, unsigned int timeout_ms)
{
  if (streaming_ && enable_depth_) {
    libfreenect2::FrameMap frame_map;
    if (!listener_irdepth_->waitForNewFrame(frame_map, timeout_ms)) {
      return false;
    }
    frames.ir = frame_map[libfreenect2::Frame::Ir];
    frames.depth = frame_map[libfreenect2::Frame::Depth];
  } else {
    frames.ir = nullptr;
    frames.depth = nullptr;
  }

  if (streaming_ && enable_color_) {
    libfreenect2::FrameMap frame_map;
    if (!listener_color_->waitForNewFrame(frame_map, timeout_ms)) {
      // If color is enabled but we time out, drop the depth pair already
      // pulled so the caller's release path stays consistent.
      if (frames.depth) {
        release_frames(frames);
      }
      return false;
    }
    frames.color = frame_map[libfreenect2::Frame::Color];
  } else {
    frames.color = nullptr;
  }

  return frames.color != nullptr || frames.depth != nullptr;
}

void Kinect2Device::release_frames(FrameSet & frames)
{
  if (frames.color) {
    libfreenect2::FrameMap frame_map;
    frame_map[libfreenect2::Frame::Color] = frames.color;
    listener_color_->release(frame_map);
    frames.color = nullptr;
  }
  if (frames.ir || frames.depth) {
    libfreenect2::FrameMap frame_map;
    frame_map[libfreenect2::Frame::Ir] = frames.ir;
    frame_map[libfreenect2::Frame::Depth] = frames.depth;
    listener_irdepth_->release(frame_map);
    frames.ir = nullptr;
    frames.depth = nullptr;
  }
}

libfreenect2::Registration * Kinect2Device::registration() const
{
  return registration_.get();
}

libfreenect2::Freenect2Device::ColorCameraParams Kinect2Device::color_params() const
{
  if (!device_) {
    return libfreenect2::Freenect2Device::ColorCameraParams{};
  }
  return device_->getColorCameraParams();
}

libfreenect2::Freenect2Device::IrCameraParams Kinect2Device::ir_params() const
{
  if (!device_) {
    return libfreenect2::Freenect2Device::IrCameraParams{};
  }
  return device_->getIrCameraParams();
}

}  // namespace etrike_kinect2
