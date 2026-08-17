from setuptools import setup

package_name = "etrike_stability_guard"

setup(
    name=package_name,
    version="0.1.0",
    packages=[package_name],
    data_files=[
        ("share/ament_index/resource_index/packages", ["resource/" + package_name]),
        ("share/" + package_name, ["package.xml"]),
        ("share/" + package_name + "/launch", ["launch/stability_guard.launch.py"]),
    ],
    install_requires=["setuptools"],
    zip_safe=True,
    maintainer="E-Trike Dev",
    maintainer_email="dev@etrike.local",
    description="Roll/tip-over stability guard for the E-Trike three-wheeler.",
    license="Apache-2.0",
    tests_require=["pytest"],
    entry_points={
        "console_scripts": [
            "stability_guard_node = etrike_stability_guard.stability_guard_node:main",
        ],
    },
)
