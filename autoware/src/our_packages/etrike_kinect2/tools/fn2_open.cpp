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

// Standalone libfreenect2 sanity check for the Kinect v2 on the Jetson.
// Usage: fn2_open   (no args). Prints OPEN OK / START OK / DONE.
// Build: g++ -std=c++17 -I/usr/include tools/fn2_open.cpp -o /tmp/fn2_open \
//          -lfreenect2 -lpthread

#include <libfreenect2/packet_pipeline.h>

#include <cstdio>

#include <libfreenect2/libfreenect2.hpp>

int main()
{
  libfreenect2::Freenect2 fn2;
  printf("devices=%d\n", fn2.enumerateDevices());
  std::string serial = fn2.getDefaultDeviceSerialNumber();
  printf("default serial=%s\n", serial.c_str());

  libfreenect2::PacketPipeline * p = new libfreenect2::CpuPacketPipeline();
  libfreenect2::Freenect2Device * dev = fn2.openDevice(serial, p);
  if (!dev) {
    printf("OPEN FAILED\n");
    return 1;
  }
  printf("OPEN OK serial=%s\n", dev->getSerialNumber().c_str());

  if (!dev->start()) {
    printf("START FAILED\n");
    return 2;
  }
  printf("START OK\n");

  dev->stop();
  dev->close();
  printf("DONE\n");
  return 0;
}
