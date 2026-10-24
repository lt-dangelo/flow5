# Flow5 v1.3 – visual concept preview

**Preview:** https://lt-dangelo.github.io/flow5/preview/v1.3/

This **independent preview** experiments with the artwork-first workout screen. The public Flow5 v1.2 at https://lt-dangelo.github.io/flow5/ is not changed.

### Scope
- Compact work/rest countdown, total remaining time and overall progress bar.
- A large parchment panel with warm sepia vector anatomical studies.
- Three custom concept illustrations: **Squats (two poses), Push-ups (two poses), Plank (one pose with alignment guide)**.
- Terracotta arrows for motion, sage alignment indicators, pistachio primary controls.
- During rest, the illustration shows the upcoming exercise.
- One-tap *Try Squats · Push-ups · Plank* demo from setup.
- All other exercises intentionally keep a color-adjusted version of the original illustration.
- English/German switching, interval settings, audio cues, pause, skip and automatic progression preserved.

### Important
This is a design-validation build, not 22 finalized anatomical illustrations. Pose accuracy, line detail, legibility and iPhone layout need user review. The SVG concepts are editable and offline-ready, but not yet professional anatomical renderings.

The preview uses a separate local settings key (`flow5-prefs-v13-preview`) and a distinct service-worker scope and cache so it cannot overwrite production settings or offline assets.

### Developer test
```bash
npm test
```

To preview locally, use a static HTTP server within this directory, for example `python3 -m http.server 8080`.
