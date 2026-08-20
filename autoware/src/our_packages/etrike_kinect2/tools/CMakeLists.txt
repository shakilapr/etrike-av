# Standalone libfreenect2 bring-up / verification tools (no ROS 2).
#
# These tiny C++ programs talk to the Kinect v2 directly through libfreenect2
# and prove the hardware + USB + libfreenect2 stack works on the Jetson
# *without* the ROS node in the way. Use them whenever the ROS driver behaves
# oddly but you need to know whether the problem is the camera itself or our
# wrapping code.
#
# Build (inside the etrike-kinect-build container, /workspace/autoware):
#
#     g++ -std=c++17 -I/usr/include tools/fn2_open.cpp -o /tmp/fn2_open \
#         -lfreenect2 -lpthread
#     ./tmp/fn2_open
#
# Expected: OPEN OK -> START OK -> DONE. If this works but the ROS node does
# not, the bug is in etrike_kinect2; if this also fails, it is a libfreenect2 /
# USB / udev / Jetson kernel problem.
#
# Programs:
#   fn2_open.cpp      open + start + stop + close (sanity of the USB interface)
#   fn2_frames.cpp    open + start + loop waitForNewFrame() for N frames,
#                     prints color/depth resolution and how many frames were
#                     lost. This is the definitive "is the Kinect streaming?"
#                     check (a healthy device delivers 30 Hz with 0 lost).

cmake_minimum_required(VERSION 3.8)
project(etrike_kinect2_tools)

find_package(PkgConfig REQUIRED)
pkg_check_modules(LIBFREENECT2 REQUIRED freenect2)

# Plain native binaries (not ROS nodes) — handy for hardware bring-up.
add_executable(fn2_open tools/fn2_open.cpp)
target_include_directories(fn2_open PRIVATE ${LIBFREENECT2_INCLUDE_DIRS})
target_link_libraries(fn2_open PRIVATE ${LIBFREENECT2_LIBRARIES} pthread)

add_executable(fn2_frames tools/fn2_frames.cpp)
target_include_directories(fn2_frames PRIVATE ${LIBFREENECT2_INCLUDE_DIRS})
target_link_libraries(fn2_frames PRIVATE ${LIBFREENECT2_LIBRARIES} pthread)

install(TARGETS fn2_open fn2_frames
  RUNTIME DESTINATION lib/${PROJECT_NAME}/tools
)
