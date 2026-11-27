# Publication

CI publishes the package to npm after a merge to `main`. The workflow is `.github/workflows/release.yml`.
You set the version. CI checks it, builds the package and publishes it.

## During the development

The changes go under `### Unpublished` at the top of `CHANGELOG.md`. The developer or the agent writes them there with each change.
The rules of the section are in `.claude/rules/docs.md`.

## Before the merge

1. Set the next version:

   ```bash
   npm run version:bump -- patch
   ```

   Use `minor` or `major` for a larger change, or give the version: `2.4.0`.
   The script changes `package.json` and `package-lock.json`. It renames `### Unpublished` in `CHANGELOG.md` to `### Version <version>`.
   The section becomes the notes of the GitHub Release. The script fails when `### Unpublished` does not exist or is empty.

2. Run the checks:

   ```bash
   npm run release:check
   ```

   It runs `scripts/check-release.mjs`, then `npm run prod`, then `scripts/check-package.mjs`. It stops at the first check that fails.
   A problem of the version or of `CHANGELOG.md` is a warning here, so the command goes on to the build. CI makes it an error.
   Run the command also before the bump.
   After the bump, the command shows no warning of `check-release`.

3. Commit and open a pull request from `dev` to `main`.

- Run `npm run lockfile` after a change in `dependencies` or `devDependencies`. Commit the new `package-lock.json`.
- Do not bump the version for each pull request to `dev`. Bump it once, before the pull request to `main`.

## What CI does

On a pull request to `main`, CI does the checks only. On a push to `main`, CI does the checks and the release.

| Step                        | Fails when                                                                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Check the release           | The version is not higher than on npm. `package-lock.json` has another version. No changelog. Changes under `### Unpublished`. |
| Install dependencies        | `package-lock.json` does not match `package.json`.                                                                             |
| Build                       | `npm run prod`: the format check, lint, typecheck or build fails.                                                              |
| Verify the package contents | `scripts/check-package.mjs`: a file of `exports` does not exist or does not import, or `npm pack` holds a source file.         |
| Create the GitHub Release   | Push only. It creates the tag `v<version>` and the release with the notes and `dist`.                                          |
| Publish to npm              | Push only. It publishes with npm trusted publishing.                                                                           |

Each push to `main` must carry a new version. A merge without a new version fails the run.
The run page shows the error, and GitHub sends an email about the failed run.

## When a run fails

- **Check the release fails on a pull request.** Run `npm run version:bump` in the branch, then push.
- **Check the release fails on `main`.** Nothing is published. Bump the version in a new pull request to `main`.
- **Publish to npm fails.** The GitHub Release exists, and npm does not have the version. Fix the cause, then select `Re-run failed jobs` on the run page. The run finds the release and does not create it again.
- **A step before the release fails on `main`.** Nothing is published. Fix the cause in a new pull request with the same version.

## Publish from a local machine

Caution: Do not publish from a local machine. A local publish skips the checks and the GitHub Release, and it contains the local `dist` as it is.
