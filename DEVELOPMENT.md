# Pick5Go development and release workflow

## Websites and source branches

GitHub Pages publishes a **single composed artifact** containing two independent apps:
- **Production** at `https://lt-dangelo.github.io/flow5/` comes exclusively from the protected `main` branch.
- **Preview** at `https://lt-dangelo.github.io/flow5/preview/v1.3/` comes exclusively from the `v1.3-visual-preview` branch, copied into that URL path at deployment time.

The `preview/v1.3` snapshot still committed inside `main` is excluded from the published artifact. It is retained in Git history/repository for compatibility only; the standalone preview branch is the source of truth for the live preview.

## Automated deployment

`.github/workflows/publish-pages.yml` runs when:
- `main` changes (production release);
- `Preview branch checks` finishes successfully on `v1.3-visual-preview` (preview release);
- an administrator manually runs the workflow.

The deployment always checks out the **current `main` and the current preview branch** separately, runs both test suites, builds one static Pages artifact, then deploys. A failing preview test prevents both applications from being redeployed; the previous website remains served. The production files are never replaced by the preview branch.

**One-time GitHub UI setting required:** In repository **Settings → Pages → Build and deployment → Source**, select **GitHub Actions** rather than **Deploy from a branch**. This cannot be changed through the installed GitHub integration. Do this only after the PR containing the deployment workflow has been merged; otherwise the existing branch-based deployment continues.

The GitHub Pages environment must permit deployment from `main`. Preview updates are deployed by a workflow running on `main` after preview tests pass, not by directly deploying from the preview branch.

## Change process

1. Commit design and feature experiments to `v1.3-visual-preview`. Its test workflow runs automatically.
2. Once preview tests pass, the default-branch publisher deploys the updated public preview path automatically, leaving production code unchanged.
3. When you approve a feature for production, create a focused feature branch from `main`, port the approved changes and open a pull request. **Never merge the heavily diverged preview branch wholesale into `main`.**
4. The mandatory `test` status check must pass before merging. After merge, the publisher deploys the updated production application along with the latest preview.

## Known limitations

- GitHub Pages uses one configured source per repository. Both applications share the same Pages deployment and domain even though they come from separate source branches.
- Publishing preview automatically means preview changes become public without a production pull request. Do not push unreviewed secrets or sensitive content.
- The preview PWA has its own service-worker scope and settings key. Cached pages on installed devices may require a normal reload/update to display new assets.
- GitHub Free supports public-repository Pages; do not make this repository private without addressing hosting.


## Pick5Go v1.3 production release

The first 1.3 release promotes the reviewed v1.3 preview application into production by copying the approved source modules, artwork, translations, icons, sound assets and tests to the repository root via a protected-branch pull request. The dedicated preview branch remains independent for later development. The production PWA retains its original manifest ID `./`, updates branding and scope-aware service-worker caching, and migrates existing Flow5 or preview preferences locally. New production changes must still pass the `test` status check through a pull request.
