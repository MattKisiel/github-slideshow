# Espresso Shot Logger

A local-first web app for prosumer espresso tracking with deep shot analytics.

## This is intended to be its own repository

If you want this project separated from the current monorepo, run:

```bash
# from /workspace/github-slideshow
mkdir -p /workspace/espresso-shot-logger-repo
cp -R espresso-shot-logger/. /workspace/espresso-shot-logger-repo/
cd /workspace/espresso-shot-logger-repo
git init
git add .
git commit -m "Initial commit: Espresso Shot Logger"
```

Then create a new GitHub repository and push:

```bash
git branch -M main
git remote add origin <YOUR_NEW_REPO_URL>
git push -u origin main
```

## Features

- Local storage (`localStorage`) for private on-device shot history.
- Deep shot logging with required + optional fields.
- Value-add calculations:
  - Brew ratio
  - Flow rate
  - Extraction yield (when TDS entered)
  - Composite shot quality score
- KPI dashboard and trend charts.
- JSON export for backups.

## Field model

### Core catalog entities
- Coffee Beans
- Coffee Bags
- Espresso Machines
- Grinders
- Portafilters
- Tampers
- Puck Screens

### Espresso Shot Data (captured in app)
- Espresso machine
- Grinder
- Portafilter
- Coffee bag ID
- Grind setting
- Puck prep notes
- Puck weight in (dose)
- Shot time
- Shot weight out (yield)
- Shot max pressure
- TDS (optional)
- Satisfaction score
- Flavor notes
- Visual notes

## Run locally

Open `index.html` directly, or run:

```bash
npm run dev
```

## Deploy

### GitHub Pages
A workflow is included at `.github/workflows/deploy-pages.yml`.

1. Push this repository to GitHub as `main`.
2. In repo settings, enable Pages source as **GitHub Actions**.
3. Every push to `main` deploys automatically.

### Netlify/Vercel
Deploy as a static site with project root set to repository root.

## Research references used for shot-result metrics

- SCA extraction/TDS framing: https://sca.coffee/sca-news/25/issue-13/towards-a-new-brewing-chart
- Espresso extraction modeling: https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0219906
- SCA espresso workflow context: https://sca.coffee/s/Competition-Espresso-Machine-Specifications-2021.pdf
