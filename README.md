# Flow5 – Calisthenics Timer

**Flow5** is a lightweight, installable Progressive Web App (PWA) for guided bodyweight interval training. No account, backend, tracking, or app-store registration is required.

**Live app:** https://lt-dangelo.github.io/flow5/

## Features

- **English by default**, with a German/English language switch in the upper-right corner of the setup screen. The language choice is saved on your device.
- Five ready-made workouts: Full body, Beginner, Core & stability, Upper body, and Legs & glutes.
- **One to five exercises per round**. Each preset starts with five; swap, remove, or add exercises, or reset the preset to its original five exercises.
- Library of 22 exercises with illustrations, difficulty levels, form instructions, and practical tips in both languages.
- Configurable work intervals (5–600 seconds), rests (0–300 seconds), and rounds (1–20), using touch-friendly native pickers and plus/minus controls.
- Optional final rest, accurate total duration, and work-versus-rest breakdown.
- Hands-free workout transitions with audible cues, exercise previews, remaining-time indicator, pause/resume, and skip controls.
- Screen Wake Lock on supported devices while the app is visible.
- Offline support after the initial installation and asset caching.
- Preset changes, interval preferences, and language settings stored locally in the browser.

## Use Flow5 on iPhone

1. Open **https://lt-dangelo.github.io/flow5/** in Safari.
2. Tap **Share → Add to Home Screen** and enable **Open as Web App** if shown.
3. Launch Flow5 from the Home Screen and choose a preset.
4. Optionally swap/remove/add exercises. Configure intervals and press **Start workout**.

The interface is in English on first use. Tap the **🇬🇧 EN** button to switch to **🇩🇪 DE** and back.

## Duration examples

Three rounds of five exercises with 40 seconds of work and 20 seconds of rest each gives **15:00** total with final rest enabled. Switching to two exercises per round yields **06:00** with the same interval settings and three rounds. Disabling final rest removes the last rest phase, but not rests between exercises or rounds.

At least one exercise is required; at most five exercises can be selected. Stored customizations remain independent for each preset. Existing Flow5 v1.0/v1.1 settings are preserved.

## Development

This project uses plain HTML, CSS and JavaScript ES modules, without frameworks or third-party dependencies. Run locally through a static HTTP server (ES modules and service workers do not reliably work from `file://`):

```bash
python3 -m http.server 8080
```

Open http://localhost:8080 in your browser.

Tests require Node.js 20 or newer:

```bash
npm test
```

### Repository structure

| Path | Purpose |
| --- | --- |
| `index.html`, `styles.css` | Accessible responsive interface |
| `src/app.js` | User interface, persistence, and session controls |
| `src/data.js` | Exercise and preset IDs with original German text |
| `src/i18n.js` | English exercise text and bilingual interface strings |
| `src/selection.js` | Validated add/remove/swap logic for 1–5 exercises |
| `src/engine.js` | Clock-based workout interval scheduler |
| `src/config.js` | Picker values and increment/decrement controls |
| `src/audio.js`, `audio/` | Local sound cues |
| `src/art.js` | Local SVG exercise illustrations |
| `sw.js`, `manifest.webmanifest`, `icons/` | Offline caching and PWA installation |
| `tests/` | Automated tests |

### GitHub Pages deployment

In your repository, open **Settings → Pages**, select **Deploy from a branch**, then set **main** and **/(root)**. Any commit to the main branch is published automatically by GitHub Pages. The service-worker cache version is incremented when deploying application changes so installed PWAs can update.

## Platform notes

- Keep the app visible during workouts. Browser background throttling and iOS screen-lock behaviour limit reliability with the screen off.
- iOS sound playback is subject to device volume, audio routing, user interaction, and browser policies.
- Workouts are local-only. Clearing website data may erase saved customizations.
- Flow5 is a training aid; it does not provide medical advice or assess technique.

## License

No software license has been specified yet. Copyright and reuse permissions remain with the repository owner.
