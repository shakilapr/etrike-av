# E-Trike Coding Guide

Rules for contributing to `etrike-av`. Read before writing code.

## Where code lives

| Type | Location | Tracked? |
|------|----------|----------|
| Our ROS packages | `autoware/src/our_packages/` | Yes (subtree) |
| Upstream Autoware | `autoware/src/` (everything else) | No (gitignored) |
| Patches to upstream | `scripts/apply_*_patch.sh` + `patches/` | Yes |
| Build/test scripts | `scripts/`, `docker/`, `run_tests.sh` | Yes |
| Docs | `docs/` | Yes |

**Rule:** Never edit files under `autoware/src/` outside `our_packages/` without
a committed patch script. If you need upstream changes, either:
1. Implement in a new `our_packages/` package (preferred), or
2. Create a versioned patch script under `scripts/` (for small upstream deltas),
   or
3. Fork the upstream repo and pin by SHA (for large/long-term changes).

## Adding a new package

```
autoware/src/our_packages/your_package/
├── CMakeLists.txt        # or setup.py for Python
├── package.xml
├── launch/
├── config/
├── src/                  # C++
├── test/
└── README.md
```

- Use `ament_cmake` for C++ packages, `ament_python` for pure Python.
- Package name must start with `etrike_` (except `autoware_vehicle_bridge`).
- Add the package name to:
  - `docker/build.sh` (`--packages-up-to` list)
  - `run_tests.sh` (`--packages-select` list)
  - `scripts/bootstrap_workspace.sh` (if it needs upstream deps)

## Code style

**C++ (ROS nodes):**
- Apache-2.0 header on every file.
- Follow existing style in `autoware_vehicle_bridge/` — 2-space indent, `snake_case` functions, `PascalCase` classes.
- No comments unless the *why* is non-obvious.
- Use `rclcpp_lifecycle::LifecycleNode` for vehicle-facing nodes (see bridge).

**Python (ROS nodes, tests, scripts):**
- Apache-2.0 header.
- 4-space indent, `snake_case` functions, `PascalCase` classes.
- Type hints on all function signatures.
- `pytest` for tests; no unittest.TestCase.
- No comments unless the *why* is non-obvious.

**Launch files:**
- XML (`.launch.xml`) preferred over Python (`.launch.py`) unless logic requires it.
- Declare all args with `default_value`.
- Remap topics explicitly; don't rely on global defaults.

## Safety-critical code

Any node that can affect vehicle motion (`autoware_vehicle_bridge`,
`etrike_stability_guard`, future controllers):

- **Fail-closed:** on startup, timeout, or error, send safe/neutral commands.
- **Lifecycle:** use `LifecycleNode`; deactivate must stop all communication.
- **Timeouts:** every subscription must have a timeout; stale data = stop.
- **No silent failures:** log every error; publish diagnostics.
- **Tests required:** unit tests for threshold logic, sign handling, edge cases.
  See `etrike_stability_guard/test/` for an example.

## Testing

```bash
# Run all E-Trike tests (from host)
./run_tests.sh

# Run one package (inside container)
colcon test --packages-select etrike_stability_guard
colcon test-result --verbose

# Run pure-math tests (no ROS needed)
python -m pytest autoware/src/our_packages/etrike_stability_guard/test/ -v
```

- Every package must have at least a `test/` directory.
- Safety-critical nodes need comprehensive unit tests (thresholds, signs,
  hysteresis, zero input, missing input, enable/disable).
- Launch tests: verify nodes start without crash (`ros2 launch` + timeout).

## Commits

- One logical change per commit. Each commit should build and pass tests.
- Commit message format: `type(scope): description`
  - `feat(etrike_stability_guard): add lateral-acceleration tip-over guard`
  - `fix(docker/build): selective packages-up-to build`
  - `docs(README): fix recovery instructions`
  - `test(etrike_vehicle_bridge): add steering sign conversion tests`
  - `ci: add GitHub Actions workflow`
- Types: `feat`, `fix`, `docs`, `test`, `ci`, `chore`, `refactor`
- No secrets, keys, or passwords in any file.

## Branching

- `main` = stable, deployable, CI-green.
- Feature branches: `feat/short-description` → PR → merge to `main`.
- Never force-push `main`.

## Recovery after upstream update

When Autoware upstream is updated (new version tag):

1. Update `repositories/autoware.repos` with new version SHAs.
2. Run `./scripts/bootstrap_workspace.sh` — patches may fail if upstream changed.
3. If patch fails: update the patch script to match new source markers.
4. Update `UPSTREAM_MODIFICATIONS.md` with the new base version.
5. Rebuild + test.

## Checklist before merging to main

- [ ] Code follows style guide
- [ ] Apache-2.0 headers on new files
- [ ] Unit tests for new/changed logic
- [ ] `./run_tests.sh` passes
- [ ] `./scripts/bootstrap_workspace.sh` succeeds (fresh-clone test)
- [ ] No secrets or credentials committed
- [ ] `UPSTREAM_MODIFICATIONS.md` updated if upstream patches changed
