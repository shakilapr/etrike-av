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

class Kinect2Device
{
public:
  Kinect2Device();
  ~Kinect2Device();

  Kinect2Device(const Kinect2Device &) = delete;
  Kinect2Device & operator=(const Kinect2Device &) = delete;

  static std::vector<DeviceInfo> enumerateDevices();

  bool open(const std::string & serial);
  bool start();
  void stop();
  void close();

  bool isOpen() const;
  bool isStreaming() const;
  std::string serial() const;

  bool wait_for_frames(FrameSet & frames, unsigned int timeout_ms = 10000);
  void release_frames(FrameSet & frames);

  libfreenect2::Registration * registration() const;

private:
  std::unique_ptr<libfreenect2::Freenect2> freenect2_;
  libfreenect2::Freenect2Device * device_;
  std::unique_ptr<libfreenect2::PacketPipeline> pipeline_;
  std::unique_ptr<libfreenect2::SyncMultiFrameListener> listener_;
  std::unique_ptr<libfreenect2::Registration> registration_;

  std::string serial_;
  bool streaming_;
};

}  // namespace etrike_kinect2

#endif  // ETRIKE_KINECT2__KINECT2_DEVICE_HPP_
