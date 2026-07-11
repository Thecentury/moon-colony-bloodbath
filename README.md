# Moon Colony Bloodbath — Resource Tracker

A tiny single-page app to track one player's resources in the *Moon Colony Bloodbath*
board game: **People**, **Money** 🪙, **Food** 🍎, and **Boxes** 📦.

- Tap **−** or **+** on a resource to open a numeric keypad, type any amount
  (shown signed, e.g. `+12` or `−12`), then **Confirm** or **Cancel**.
- Resources can never go negative (subtracting past zero stops at zero).
- New games start at People **30**, Money **4**, Food **4**, Boxes **0**.
  **Reset** restores those starting values.
- State is saved automatically in the browser (`localStorage`), so it survives reloads.
- Designed for an iPhone screen (large tap targets, safe-area aware).

No build step, no dependencies — just static `index.html`, `style.css`, and `app.js`.

## Run locally

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

Deployment is automatic via GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)).

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
3. Every push to `main` publishes the site.
