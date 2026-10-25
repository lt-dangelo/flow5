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

### v1.3.10 – HD artwork successfully uploaded to GitHub
All four v1.3.9 prepared images are committed to the preview (`lunge-master.webp`, `mountain-master.webp`, `bridge-master.webp`, and `recovery-hydration-master.webp`). They are now precached as mandatory offline PWA assets. Update cache version to preview-10 and app CSS/JS query parameters to 1.3.10. Existing production app remains unchanged.

### v1.3.11 – Three more anatomical exercise illustrations
Added Standing Knee Raises (march), Bicycle Crunches and Side Plank, with 1440×960 WebP assets. The figures were recomposed from generated Renaissance-inspired anatomical exercise sheets, with full hands, feet and safe margins; note they are upscaled source illustrations, not independently generated native-resolution figures. The image displayed for Side Plank Left is mirrored horizontally relative to Side Plank Right. All three are included in the preview's offline cache. The production app remains unchanged.

### v1.3.12 – Four additional exercise images
The preview includes **Plank Shoulder Taps**, **Bird Dog**, **Dead Bug**, and **Superman Hold**, each with a dedicated 1440×960 WebP canvas. Movement figures come from detailed Renaissance-inspired generated anatomical panels, composed with safe margins, no embedded text and no clipped limbs; these source drawings are upscaled rather than native-resolution master engravings. SVG fallbacks remain for other exercises. **Reverse Snow Angels** previously shared the pose ID 'superman'; it deliberately retains its original SVG until appropriate snow-angel-specific artwork exists. The service worker's offline asset cache and HTML build queries are updated to v1.3.12. The production app is unchanged.

### v1.3.13 – Follow-through cue and corrected artwork
- Dead Bug now instructs users in both English and German to return the extended arm and leg to the starting position **before switching sides**. The form cue about keeping the lower back grounded is unchanged.
- Shoulder Tap replaces the old same-side gesture: the arm farther from the viewer reaches across the chest while the hand closest to the viewer supports the plank. Movement cue and anatomy stay in a text-free image.
- Final Rest now uses a new full-length drinking-water study with complete shoes and added safety margins. The previous faded/cropped source is retained for rollback.
- Two new image filenames and a fresh service-worker cache make the corrections visible on iOS; the production release remains unchanged.

### v1.3.14 – Shoulder Tap palette harmonization
The corrected Shoulder Tap illustration was rebalanced to match the lighter cream parchment and softer sepia linework of the other workout illustrations, without changing the poses, arrows or dimensions. A distinct asset filename (`shouldertap-neutral.webp`) and updated preview cache avoid outdated artwork on iOS. The separate final-rest water-bottle image (`recovery-hydration-corrected.webp`) remains unchanged by design. Production v1.2 remains unchanged.

### v1.3.15 – Clean Dead Bug and Shoulder Tap illustrations
The two 1440 × 960 WebP studies have been reconstructed using full-body anatomical drawings rather than blended fragments. The Shoulder Tap no longer shows vertical smears near the head or the planted hand; Dead Bug now shows distinct hands and full limb extensions. The near hand stays planted and the far hand crosses toward the near shoulder. The new filenames are versioned to avoid stale iOS artwork. All other illustrations and production Flow5 remain unchanged.

### v1.3.16 – Wall Push-ups anatomical illustration
- Replaces the schematic wall-push-up placeholder (pose key `wall`) with a standalone 1440 × 960 WebP drawing.
- Two side-view positions, with hands supported on vertical walls, feet fully on the floor and body aligned: straight elbows then flexed elbows and a controlled return.
- Full figures with safe margins, Renaissance-style sepia contours and warm cream parchment. No embedded text or cropped/stitched anatomy.
- Published only in the v1.3 preview, cached offline under a new service-worker revision.

### v1.3.17 – Wall Push-ups parchment harmonization
The Wall Push-ups illustration now uses a color-matched 1440 × 960 WebP master (`wallpushup-master-v1317.webp`), adjusted against the Bird Dog reference. The light parchment areas are less amber and closely match the standard illustration background, while anatomical drawing, hands and feet, action arrows and the original 2-pose composition are preserved. Versioned URLs and the preview service-worker cache were updated so installed iPhone PWAs receive the new image. The previous wall-push-ups WebP is kept for rollback.

### v1.3.18 – Pike Push-ups original illustration
- Added `artwork/pikepushup-master-v1318.webp` (1440 × 960 WebP): anatomically recognizable pike starting position with arms extended and a second lowered position with elbows bent, showing movement arrows.
- Warm parchment matched against the approved Bird Dog reference; full hands, feet and head remain within the image bounds.
- Updated preview artwork map, offline cache and versioned page assets; production Flow5 remains unchanged.

### v1.3.20 – Wall Sit and Jumping Jacks illustration integration
- Two standalone 1440×960 WebP exercise illustrations: Wall Sit (upright stance and neutral wall-supported static squat hold) and Jumping Jacks (closed stance and wide stance with arms overhead).
- Anatomical poses and complete body margins inspected before integration. New Jumping Jacks art is color matched to the approved cream parchment, with terracotta motion arrows.
- Image registry and offline cache contain both assets. Changed CSS/JS build marker to 1.3.20 for iPhone cache refresh. Production application unchanged.

### v1.3.21 – Calf Raises master
- Original standalone 1440 × 960 WebP illustration with side-view positions: heels down and raised onto the balls of both feet. Knees and torso stay nearly straight.
- Exercise form checked against ACE Fitness and Heart & Stroke Foundation instructions.
- Warm parchment hue normalized against the approved exercise library; figures retain safe margins.
- `calf` maps to `calfraise-master-v1321.webp` and is precached for offline use. Production remains unchanged.

### v1.3.22 – Complete illustration coverage (22/22)
- Three original exercise illustration assets, each 1440 × 960 WebP with safe margins and lighter parchment matched to the Bird Dog reference:
  - `bear-master-v1322.webp`: a neutral quadruped with hands and toes supporting weight, knees hovering above the ground; static hold.
  - `heeltouch-master-v1322.webp`: supine with bent knees and feet on the floor, alternating same-side reaching of hands toward heels.
  - `snowangel-master-v1322.webp`: prone with legs kept resting and straight arms sweeping from the sides toward overhead.
- Exercise-specific reference checks: ACE Fitness describes reverse snow angels; Ohio University/UCLA Health detail bear hold; heel-touch form follows documented oblique heel touches. Heart & Stroke Foundation provides general strength-training guidance, not validated exercise-specific cues for all three.
- The legacy Snow Angel pose key `superman` is now overridden by exercise ID so Superman Hold and Reverse Snow Angels receive different images.
- New images are precached; HTML, JS and CSS are versioned to 1.3.22 for iOS refresh. Production v1.2 is unchanged.

### v1.3.23 – Complete exercise-technique audit (22 exercises)
All current active illustrations were individually examined against ACE Fitness, NASM, Harvard Health, Cleveland Clinic and Ohio University exercise technique references where applicable. No illustration was judged to depict a materially different exercise; artistic and minor visual imperfections are not grounds for replacement in this audit. Nine English/German coaching cues were minimally clarified to specify pressing back up, returning from a repetition, opposing limb movements, feet positioning, or a static hold. Image assets and the production app remain unchanged. PWA cache bumped to `flow5-v1.3-preview-23`.

### v1.3.24 – Level-first, equipment-minimal programmes
Four focus presets (Full Body, Core & Stability, Upper Body, Legs & Glutes) now adapt independently to Beginner/Intermediate selection. All five slots remain customizable, with separate saved lineups for each focus+level combination. Five new exercises have deliberately generic placeholders pending anatomical artwork: Bodyweight Hip Hinge, Resistance-band Row, Knee Push-ups, Single-leg Glute Bridge, Assisted Single-leg Squat. The band row is the only exercise requiring special equipment; its requirement is clearly shown in the picker and selected workout. Exercises still carry Beginner/Intermediate/Advanced technique/strength labels, and Advanced exercises can be swapped in manually. Removed the special test preset, banner and reset-button action. Timer interval defaults, audio, translation and production app remain unchanged. Offline cache updated to preview-24.

### v1.3.25 — Exercise picker order, readiness notice and shareable workout record
- Exercise picker remains strictly unique: selected exercises (including the edited slot) are excluded; choices are sorted by Beginner/Intermediate/Advanced then Upper Body/Core/Legs/Cardio and localized name.
- Workout title is given a full-width row below index and UP NEXT badge, avoiding awkward wraps on iPhone; next exercise name is allowed two lines rather than forced to ellipsis.
- Short bilingual health-readiness reminder sits below the setup header; by Lorenzo D'Angelo credited at the bottom and in the completed-workout record.
- Completion screen shows dated focus/level, captured plan duration, rounds × exercises, work/rest interval, ordered exercise list and final rest option, designed for screenshots.
- Duration is labeled **planned** (not actual elapsed time); skips/pauses are not presented as completed active exercise measurements.
- Timer duration options, preset choices and image files remain unchanged. Preview-only PWA cache version updated.

### v1.3.26 — Simplified workout and summary
Removed the redundant next-exercise text and audio icon between the exercise illustration and controls without changing the audible cues. Removed the focus/level line under Well Done and the final-rest-included note, retaining the exercise list and author credit. PWA cache bumped to v1.3-preview-26. Production remains unchanged.
