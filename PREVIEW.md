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

### Visual review 2 — simplified workout composition
- The Flow5 wordmark has no subtitle or preview badge in workout mode.
- Exercise title and coaching cue now live inside the parchment illustration card.
- The separate caption/instructions block and study-category banner have been removed.
- Round/exercise position is combined with the compact timer rather than using a separate row.
- The progress strip, next exercise, sound cues, pause/skip controls and screen wake behaviour are preserved.
- Production v1.2 remains unchanged.

### iOS cache fix (v1.3.4)
The preview stylesheet and entry JavaScript now carry versioned URLs. The preview service worker fetches HTML, JS and CSS using a network-first strategy with an offline fallback; all other static assets remain cached. This resolves an iOS WebKit case where reloading the preview could retain outdated JS/CSS.
For a fresh iPhone launch, open `https://lt-dangelo.github.io/flow5/preview/v1.3/?refresh=1.3.4` in Safari, then fully close and reopen the installed preview if used.

### v1.3 refinement – anatomy and end-of-workout recovery
The Squats, Push-ups and Plank vector studies now have additional contour, muscle and cross-hatching detail, while retaining their start/end positions, movement arrows and alignment guides. The final rest phase (when no more work intervals follow) displays a dedicated calm breathing study and localized final-recovery instruction rather than repeating the preceding exercise. Ordinary recovery intervals continue to preview the next exercise. Both views remain available offline.

### v1.3.6 image-based artwork validation
Squats, Push-ups, Plank, and Final Rest now use optimized WebP anatomical illustrations cropped from the approved user-provided mockup, rather than programmatic sketch SVGs. Source artwork is retained in the project conversation. This produces markedly more detailed anatomy and natural engraving lines. The motion arrows in these temporary reference crops are part of the images; we can separate them for the final production originals. The other 19 exercises still use schematic SVG fallbacks.

### v1.3.7 – Independent image files with full-body safe margins
The preview uses four new standalone 1440×960 WebP images (Squats, Push-ups, Forearm plank, Final recovery). Each composition includes the complete figure and wider safe margins, with app text kept outside the artwork. The images are **carefully recomposed from the approved visual mockup artwork**, not entirely new AI-generated anatomical originals. Previous v1.3.6 crops remain in the repository for comparison and rollback. The standard app is unchanged.\n
### v1.3.8 – Bring back water-bottle recovery illustration
User preferred the earlier recovery study showing a person drinking water. The final-rest artwork now uses the previous `artwork/recovery.webp`, with its original aspect ratio, while Squats, Push-ups and Plank retain the uncropped master illustrations. Both English and German coaching copy, timer behaviour and offline support are unchanged. The PWA cache has been incremented to v1.3-preview-8.

### v1.3.9 – Four enhanced exercise studies
Four 1440×960 parchment image compositions were prepared for reverse lunges, mountain climbers, glute bridge and drinking-water final rest, with enlarged and feathered anatomical reference drawings. They use optimized WebP images and safe margins, but their original source drawings were lower-resolution composites and may retain some softness. The exercise image registry includes the corresponding new filenames; missing preview images fall back gracefully to the existing SVG studies (or previous hydration image). The optional asset cache supports staged upload without breaking installation. No production app changes.
