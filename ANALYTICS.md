# Pick5Go analytics (Umami Cloud)

Umami pageviews and privacy-minimized workout lifecycle events use website ID `789229c5-0473-4aab-bdfb-cddc54b1c37d`.

## What is measured

- Pageviews (automatic Umami script) for `pick5go.com` and `www.pick5go.com` only.
- `workout_started`: interval engine successfully started.
- `workout_completed`: interval engine reached completion (may include skipped phases).
- `workout_abandoned`: user confirmed the explicit exit button, **not** tab/browser closure.
- `workout_restarted`: user starts again from the completed-workout view; it also counts as a `workout_started` event.

Event properties: `environment` (`production` or `preview`), preset ID, difficulty, exercise count, rounds, configured planned minutes, whether selection was customized, and number of skipped phases. No names, emails, unique user IDs, or lists of chosen exercise IDs are sent. No `umami.identify` calls are used.

The same website ID measures both production and preview. Filter by `environment` on the Events page (or the page URL `/preview/v1.3/`) to avoid interpreting testing as production usage.

## Reliability

Analytics is deliberately optional. If an ad blocker, offline mode, or network failure prevents Umami from loading or sending an event, the workout timer must continue working. Analytics calls are fire-and-forget with handled rejections. Browser or tab closure does not reliably produce an abandonment event, so reported abandonment is a strict lower bound. Completion means the interval engine reached its final phase, **not proof of physical exercise**. Review `skipped_phases` before interpreting completion rate.

## Activation / privacy

The tracking script is restricted to the public domain by `data-domains`. Local development should not count in Umami. Review the privacy notice, third-party processing and whether consent is required under applicable EU/German privacy rules **before merging production tracking**. A cookieless implementation is not automatically exempt from all legal requirements.

## Quick verification

1. On the live preview URL, open a fresh browser session, temporarily disable blockers, and verify a pageview in Umami under the preview URL.
2. Start a short workout. Check `workout_started` and `environment=preview`.
3. Finish one workout and explicitly cancel another; check `workout_completed` and `workout_abandoned`.
4. From the finish screen choose restart; check `workout_restarted`.
5. Disconnect from the network or block Umami and verify the timer still works.

