# Syncthing run and verification

Syncthing should run automatically when the Windows user logs on. The Windows GUI is available at:

<http://127.0.0.1:8384>

## Windows to Linux test

On Windows PowerShell:

```powershell
Set-Content -LiteralPath "E:\work\av_project\sync-test.txt" -Value "windows sync test"
```

Then, from a terminal with SSH access to the Linux machine:

```bash
ssh med1@172.16.25.67 "cat ~/av_project/sync-test.txt"
```

Expected output:

```text
windows sync test
```

## Linux to Windows test

On Linux:

```bash
printf 'linux sync test\n' > ~/av_project/sync-test-linux.txt
```

Confirm that `sync-test-linux.txt` appears in `E:\work\av_project` on Windows.

## Important exclusions

The `.stignore` file excludes generated Autoware build outputs, bags, Git metadata, caches, and generated AWSIM folders. Those files should not be used as sync health indicators.
