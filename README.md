# Moon Colony Bloodbath — Resource Tracker

A tiny single-page app to track one player's resources in the *Moon Colony Bloodbath*
board game: **People**, **Money** 🪙, **Food** 🍎, and **Boxes** 📦.

- Adjust each resource up/down by **1** or **5**, or tap the number to type an exact value.
- Resources can never go negative.
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
