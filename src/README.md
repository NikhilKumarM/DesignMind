# System Design Daily — Chrome Extension

A Chrome extension that replaces your new tab page with daily system design quotes and tips.

## Features

- **Daily Quote** — A deterministic system design quote that changes each day
- **Daily Tip** — A practical system design tip that rotates daily
- **Copy Quote** — One-click copy to clipboard
- **Random Quote** — Load a new random quote on demand
- **Offline-first** — All data is bundled locally, no network needed

## Screenshots

> _Add screenshots here after loading the extension._

## Installation (Developer Mode)

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer Mode** (toggle in the top-right corner).
4. Click **Load Unpacked** and select the `src` folder.
5. Open a new tab — you should see the extension!

## Project Structure

```
src/
├── manifest.json    # Chrome extension manifest (v3)
├── newtab.html      # New tab replacement page
├── style.css        # Dark-themed styling
├── script.js        # Quote/tip logic and button handlers
├── quotes.json      # 25 system design quotes
├── tips.json        # 25 system design tips
└── README.md        # This file
```

## Publishing to Chrome Web Store

1. Zip the extension folder contents.
2. Go to the [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole).
3. Pay the one-time $5 registration fee (if not already registered).
4. Upload the zip, add screenshots and a store listing description.
5. Submit for review.

## Tech Stack

- HTML, CSS, JavaScript (vanilla)
- Chrome Manifest V3
- No external dependencies

## License

MIT

