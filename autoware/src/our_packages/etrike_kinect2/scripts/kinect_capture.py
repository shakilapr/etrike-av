#!/usr/bin/env python3
"""Capture video (mp4) + PNG snapshots from a Kinect color topic.

Usage:
    python3 kinect_capture.py /kinect_front/color/image_raw front_full_color \
        --seconds 6 --snaps 3
"""
import argparse
import time

import cv2
import numpy as np
import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile, ReliabilityPolicy, DurabilityPolicy
from sensor_msgs.msg import Image


class Capture(Node):
    def __init__(self, topic, out, seconds, snaps):
        super().__init__("kinect_capture")
        self.out = out
        self.seconds = seconds
        self.snaps = snaps
        self.frame = None
        self.count = 0
        self.start = time.time()
        self.snap_interval = seconds / max(snaps, 1)
        self.last_snap = 0.0
        self.writer = None
        qos = QoSProfile(
            depth=2, reliability=ReliabilityPolicy.BEST_EFFORT,
            durability=DurabilityPolicy.VOLATILE)
        self.sub = self.create_subscription(Image, topic, self.cb, qos)
        self.timer = self.create_timer(1.0, self.check)

    def cb(self, msg):
        arr = np.frombuffer(msg.data, dtype=np.uint8).reshape(msg.height, msg.width, -1)
        if msg.encoding == "bgr8":
            self.frame = arr
        elif msg.encoding == "rgb8":
            self.frame = cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)
        else:
            return
        if self.writer is None:
            path = f"{self.out}.mp4"
            self.writer = cv2.VideoWriter(
                path, cv2.VideoWriter_fourcc(*"mp4v"), 30,
                (msg.width, msg.height))
            print(f"[capture] writing {path} {msg.width}x{msg.height}", flush=True)
        self.writer.write(self.frame)
        self.count += 1
        now = time.time()
        if now - self.last_snap >= self.snap_interval:
            snap = f"{self.out}_snap{self.count}.png"
            cv2.imwrite(snap, self.frame)
            print(f"[capture] snap {snap}", flush=True)
            self.last_snap = now

    def check(self):
        if time.time() - self.start >= self.seconds:
            if self.writer:
                self.writer.release()
                print(f"[capture] done: {self.out}.mp4 frames={self.count}", flush=True)
            rclpy.shutdown()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("topic")
    parser.add_argument("out")
    parser.add_argument("--seconds", type=float, default=10.0)
    parser.add_argument("--snaps", type=int, default=3)
    args = parser.parse_args()

    rclpy.init()
    node = Capture(args.topic, args.out, args.seconds, args.snaps)
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    if node.writer:
        node.writer.release()
    node.destroy_node()
    rclpy.shutdown()
    print("[capture] finished")


if __name__ == "__main__":
    main()
