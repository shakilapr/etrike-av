# Changelog

## [0.1.0] — 2026-08-10

Initial project setup.

### Infrastructure
- Project directory structure created at `~/av_project/`
- Docker development environment configured (`ghcr.io/autowarefoundation/autoware:universe-cuda-humble`)
- Syncthing v2.1.3 installed and running as systemd service
- `.stignore` configured with build/data/git exclusions

### Source
- Full Autoware source pulled via `vcs import` (33 repos, 1.9GB)
- `autoware.repos`, `simulator.repos`, `tools.repos` manifests saved
- AWSIM-Labs v1.6.1 cloned (1.7GB)

### Build
- Initial colcon build: 38 packages succeeded
- Overlay verified: `/opt/autoware/` (base) + `install/` (our workspace)
- `--symlink-install` configured for fast edit-test cycles

### Docker scripts
- `docker/build.sh` — full workspace build
- `docker/shell.sh` — interactive container shell
- `docker/run.sh` — launch with overlay

### Git
- Config repo initialized with `.gitignore`
- 7-line `.gitignore` blocks 33 source repos, build artifacts, AWSIM, data
- Copied sample vehicle files removed (exact duplicates of upstream)

### Documentation
- `SETUP.md` — project design
- `SETUP_COMPLETE.md` — master reference
- `HOW_BUILD_WORKS.md` — overlay/build explanation
- `GIT_STRATEGY.md` — multi-repo strategy
- `GITHUB_SETUP.md` — GitHub org setup
- `SYNCTHING_SETUP.md` — Linux-Windows sync
- `ETRIKE_AV_GIT_WORKFLOW.md` — daily workflow + FAQ
