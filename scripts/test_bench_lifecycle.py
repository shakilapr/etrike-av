import rclpy
from autoware.src.our_packages.etrike_common_launch.scripts.bench_perception_node import BenchPerceptionNode

def main():
    rclpy.init()
    node = BenchPerceptionNode()
    print("Node created successfully.")
    res_c = node.trigger_configure()
    print("trigger_configure result:", res_c)
    res_a = node.trigger_activate()
    print("trigger_activate result:", res_a)
    print("objects publisher is_activated:", node._pub_objects.is_activated)
    print("status publisher is_activated:", node._pub_status.is_activated)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == "__main__":
    main()
