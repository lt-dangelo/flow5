# Pick5Go — Fitness, simplified.

Pick five exercises, set your pace, and go. Pick5Go is a lightweight, bilingual-plus calisthenics progressive web app (PWA) with no registration, no account and no workout tracking.

**Production:** https://lt-dangelo.github.io/flow5/  
**Development preview:** https://lt-dangelo.github.io/flow5/preview/v1.3/

## Features

- 27 illustrated exercises with short form instructions and technique tips.
- Four focuses: Full Body, Core & Stability, Upper Body, Legs & Glutes.
- Beginner and Intermediate filters independently customize the five exercises in each focus, while all difficulty levels remain available when manually swapping.
- Five interface and exercise-description languages: English, German, Italian, French and Spanish.
- Swap, remove, and add exercises to customize a round of 1–5 unique exercises. Personal configurations are stored locally by focus and level.
- Flexible work, rest and round durations. Rest after the final work interval is included when the rest duration is greater than zero.
- Hands-free transitions with audio cues, pause, skip, progress indication and screen wake lock when supported.
- Offline usage once the site has loaded and its assets have been cached.
- Only one exercise (Resistance-band Row) requires an elastic band, with a long-towel isometric alternative. Assisted squats use a stable support.

## Getting started

1. Open the production address in your mobile browser.
2. Select the language, training level and focus.
3. Optionally swap or remove exercises, and adjust work, rest and rounds.
4. Start training. At the end, save or share a screenshot of the workout summary.

### Add to the iPhone home screen

Open Pick5Go in Safari, choose **Share → Add to Home Screen**, then launch the icon. For offline use, reopen the app once while online to ensure assets are cached. Sound and screen-awake behavior depend on iOS/browser support.

## Privacy

**Your workout stays on your device. No registration, no setup, no workout tracking.**

Preferences such as language, workout configuration and timers are saved in local browser storage. The app has no backend user account or workout-history database.

## Development

Plain HTML, CSS, JavaScript modules and a small service worker. No external dependencies are needed to run the site.

```bash
python3 -m http.server 8080
# open http://localhost:8080/
npm test
```

Node.js 20 or later is required for automated tests. The GitHub Actions publisher assembles production from the protected `main` branch and the independently tested `v1.3-visual-preview` branch; see `DEVELOPMENT.md`.

## Release history

- **v1.3.0:** Full Pick5Go visual redesign, 27 exercise illustrations, five languages, level-dependent presets, accessibility and offline enhancements.
- **v1.2.0:** Original Flow5 workout application.

The v1.3 release upgrades the existing production PWA in place, retaining its manifest identity and migrating locally stored preferences when available.
