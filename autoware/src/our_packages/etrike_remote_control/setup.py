from setuptools import find_packages, setup

package_name = "etrike_remote_control"

setup(
    name=package_name,
    version="0.1.0",
    packages=find_packages(exclude=["test"]),
    data_files=[
        ("share/ament_index/resource_index/packages", ["resource/" + package_name]),
        ("share/" + package_name, ["package.xml"]),
        (
            "share/" + package_name + "/launch",
            [
                "launch/remote_control.launch.py",
                "launch/bench_remote_control.launch.py",
            ],
        ),
        ("share/" + package_name + "/config", ["config/remote_control.param.yaml"]),
    ],
    install_requires=["setuptools"],
    zip_safe=True,
    maintainer="E-Trike Dev",
    maintainer_email="dev@etrike.local",
    description="Remote control cockpit GUI for E-Trike vehicle bridge using Python, PySide6, and rclpy.",
    license="Apache-2.0",
    tests_require=["pytest"],
    entry_points={
        "console_scripts": [
            "remote_control_gui = etrike_remote_control.remote_control_gui:main",
            "remote_control_node = etrike_remote_control.remote_control_node:main",
        ],
    },
)
