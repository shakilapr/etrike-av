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
        info.firmware = fn2.getDefaultDeviceLinkType() == libfreenect2::UsbBus
            ? "usb" : "unknown";
        devices.push_back(info);
    }
    return devices;
}

bool Kinect2Device::open(const std::string & serial)
{
    freenect2_ = std::make_unique<libfreenect2::Freenect2>();

    libfreenect2::setGlobalLogger(libfreenect2::createConsoleLogger(libfreenect2::Logger::Info));

    if (freenect2_->enumerateDevices() == 0) {
        return false;
    }

    pipeline_.reset(new libfreenect2::CpuPacketPipeline());

    device_ = freenect2_->openDevice(serial, pipeline_.get());
    if (!device_) {
        return false;
    }

    serial_ = serial;
    registration_.reset(new libfreenect2::Registration(
        device_->getIrCameraParams(), device_->getColorCameraParams()));

    listener_.reset(new libfreenect2::SyncMultiFrameListener(
        libfreenect2::Frame::Color | libfreenect2::Frame::Ir | libfreenect2::Frame::Depth));

    device_->setColorFrameListener(listener_.get());
    device_->setIrAndDepthFrameListener(listener_.get());

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
    bool ok = device_->start();
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
    listener_.reset();
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
    if (!listener_ || !streaming_) {
        return false;
    }
    libfreenect2::FrameMap frame_map;
    if (!listener_->waitForNewFrame(frame_map, timeout_ms)) {
        return false;
    }
    frames.color = frame_map[libfreenect2::Frame::Color];
    frames.ir = frame_map[libfreenect2::Frame::Ir];
    frames.depth = frame_map[libfreenect2::Frame::Depth];
    return true;
}

void Kinect2Device::release_frames(FrameSet & frames)
{
    if (listener_ && frames.color) {
        libfreenect2::FrameMap frame_map;
        frame_map[libfreenect2::Frame::Color] = frames.color;
        frame_map[libfreenect2::Frame::Ir] = frames.ir;
        frame_map[libfreenect2::Frame::Depth] = frames.depth;
        listener_->release(frame_map);
        frames.color = nullptr;
        frames.ir = nullptr;
        frames.depth = nullptr;
    }
}

libfreenect2::Registration * Kinect2Device::registration() const
{
    return registration_.get();
}

}  // namespace etrike_kinect2
