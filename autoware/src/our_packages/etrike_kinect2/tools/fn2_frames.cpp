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

// Standalone libfreenect2 frame-streaming check for the Kinect v2.
// Usage: fn2_frames [num_frames]   (default 30)
// Build: g++ -std=c++17 -I/usr/include tools/fn2_frames.cpp -o /tmp/fn2_frames \
//          -lfreenect2 -lpthread
//
// A healthy device delivers color (1920x1080) + depth (512x424) at ~30 Hz
// with "GOT=N LOST=0". If LOST > 0 while GOT>0, the depth/ir USB interface is
// dropping packets (classic Jetson tegra-xusb issue) — fix USB / kernel /
// usbfs_memory_mb rather than the ROS driver.

#include <libfreenect2/libfreenect2.hpp>
#include <libfreenect2/frame_listener_impl.h>
#include <libfreenect2/packet_pipeline.h>
#include <cstdio>

using namespace libfreenect2;

int main(int argc, char ** argv)
{
  const int target = (argc > 1) ? atoi(argv[1]) : 30;

  Freenect2 fn2;
  std::string serial = fn2.getDefaultDeviceSerialNumber();
  PacketPipeline * p = new CpuPacketPipeline();
  Freenect2Device * dev = fn2.openDevice(serial, p);
  if (!dev) {
    printf("OPEN FAILED\n");
    return 1;
  }

  SyncMultiFrameListener listener(Frame::Color | Frame::Ir | Frame::Depth);
  dev->setColorFrameListener(&listener);
  dev->setIrAndDepthFrameListener(&listener);

  if (!dev->start()) {
    printf("START FAILED\n");
    return 2;
  }
  printf("START OK\n");

  int got = 0, lost = 0;
  for (int i = 0; i < target; ++i) {
    FrameMap fm;
    if (listener.waitForNewFrame(fm, 2000)) {
      ++got;
      if (fm[Frame::Color]) {
        printf("frame %d color=%dx%d\n", got, fm[Frame::Color]->width,
               fm[Frame::Color]->height);
      }
      if (fm[Frame::Depth]) {
        printf("  depth=%dx%d\n", fm[Frame::Depth]->width,
               fm[Frame::Depth]->height);
      }
      listener.release(fm);
    } else {
      ++lost;
      printf("TIMEOUT %d\n", i);
    }
  }

  printf("GOT=%d LOST=%d\n", got, lost);
  dev->stop();
  dev->close();
  printf("DONE\n");
  return 0;
}
