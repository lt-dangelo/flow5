# Pick5Go development and release workflow

## Branches and deployment

- `main` is the protected production branch. GitHub Pages publishes the repository root.
- `v1.3-visual-preview` is an **independent development branch**, containing a stand-alone app at its repository root. Changes pushed here do **not** publish to GitHub Pages automatically.
- `main/preview/v1.3/` is a separately scoped, *published snapshot* accessible at `https://lt-dangelo.github.io/flow5/preview/v1.3/`. It is **not live-linked** to the preview branch. New edits on the preview branch will not appear at this URL until explicitly copied/promoted to the snapshot via a PR to `main`.
- GitHub Pages normally publishes one chosen source per repository. Do not point Pages at `v1.3-visual-preview`, since that would replace the production root.

## Checks

- Pull requests targeting `main`: GitHub Actions **Test Flow5 / test** validates both production and the published preview snapshot, plus JavaScript syntax.
- Changes to `v1.3-visual-preview`: GitHub Actions **Preview branch checks / preview-test** validates its independent app.
- The existing `test-flow5-preview.yml` checks changes to the published snapshot in `main/preview/v1.3/`.

## Safe changes

1. Develop and test experimental features on the visual-preview branch (or a new feature branch).
2. Review its check results in **Actions**. Preview-branch commits must not be assumed to update the public preview URL.
3. For a shareable public preview, explicitly copy the approved preview files into `main/preview/v1.3/` on a new branch and open a pull request to `main`. This changes the public preview URL but not the production root application.
4. To release approved features, prepare a **focused** pull request to `main`, review the diff, and wait for CI. Do **not** merge the divergent `v1.3-visual-preview` branch wholesale into `main`: it contains independent preview-only files and differs extensively from production.
5. Merge the reviewed pull request. GitHub Pages then publishes the updated files.

## Protection

Protect `main` with required pull requests and select the `test` status check after it has appeared from a successful PR run. Solo owners should not enable a requirement for another person's approval. Do not allow force pushes or branch deletion.

The GitHub Free public-repository setup keeps GitHub Pages available. Do not make this repository private without first checking hosting implications.
