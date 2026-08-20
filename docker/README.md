# E-Trike Docker images

The Autoware driver packages need dependencies that are not in the stock
Autoware image. To keep builds reproducible, we layer those dependencies on
top of the official base image.

## etrike-kinect-build

`Dockerfile.kinect` extends `ghcr.io/autowarefoundation/autoware:universe-cuda-humble`
with everything `etrike_kinect2` needs:

- libfreenect2 (CPU pipeline) built from source, installed to `/usr`
  (pkg-config module `freenect2`)
- Kinect v2 udev rules (`/etc/udev/rules.d/90-kinect2.rules`)

Build it once on the Jetson (or after the Autoware base tag changes):

```bash
./docker/make_image.sh
# tags etrike-kinect-build:latest
```

Use it for builds and shells:

```bash
IMAGE=etrike-kinect-build:latest ./docker/build.sh
IMAGE=etrike-kinect-build:latest ./docker/shell.sh
./run_tests.sh            # already defaults to etrike-kinect-build:latest
```

`build.sh`, `shell.sh`, and `run_tests.sh` all honor the `IMAGE` env var and
default to `etrike-kinect-build:latest`.

> Note: the udev rules only matter on the host/Jetson where the Kinect is
> physically plugged in. Inside the container they are harmless (no Kinect
> device nodes until the USB device is passed through).
