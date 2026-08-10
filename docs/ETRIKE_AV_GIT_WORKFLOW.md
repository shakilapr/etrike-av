# etrike-av Git workflow

This document records how the Windows project repository was initialized and how future changes should be saved and published.

## Repository identity

The project repository is named `etrike-av` on GitHub:

```text
https://github.com/shakilapr/etrike-av.git
```

The local checkout is `E:\work\av_project`, on branch `main`, with `origin` configured as:

```powershell
git remote set-url origin https://github.com/shakilapr/etrike-av.git
```

## Initial setup

The first commit was created because `git push -u origin main` cannot work until `main` contains at least one commit:

```powershell
cd E:\work\av_project
git add -A
git commit -m "Initial project setup"
```

The initial commit is `9ed5d87`. Once the GitHub repository exists, publish it with:

```powershell
git push -u origin main
```

## Future changes

After editing or adding files, review, commit, and push:

```powershell
cd E:\work\av_project
git status
git diff
git add -A
git commit -m "Describe the change"
git push
```

Use short, specific commit messages such as `Add vehicle network configuration` or `Update Autoware repository manifest`.

## Before committing

- Do not commit generated Autoware outputs: `autoware/build`, `autoware/install`, or `autoware/log`.
- Do not commit bags under `data/bags` or AWSIM generated folders listed in `.stignore`.
- Review `git status` and `git diff --cached` before committing.
- Keep credentials, private keys, tokens, and local secrets out of the repository.

## Checking state

```powershell
git status --short --branch
git log --oneline --decorate -5
git remote -v
```

If the remote contains commits not present locally, inspect first, then integrate deliberately:

```powershell
git fetch origin
git log --oneline --decorate --all
git pull --rebase origin main
git push
```

Do not use `git reset --hard` unless the possible data loss is understood and explicitly intended.
