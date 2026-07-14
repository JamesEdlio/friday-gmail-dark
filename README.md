# Friday Gmail Dark ⚡

A custom Chrome extension that darkens Gmail's email body, compose window, and reply editor — the parts Gmail's built-in dark theme leaves white.

## Install

1. Download or clone this repo
2. Open `chrome://extensions/` in Chrome
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked**
5. Select the `friday-gmail-dark` folder
6. Hard-refresh Gmail (`Ctrl+Shift+R`)

## What it darkens

- ✅ Email reading pane (the white box)
- ✅ New message / compose window
- ✅ Reply & forward editors
- ✅ Images preserved (counter-inverted)

## Customize

Open `gmail-dark.css` and edit the CSS variables at the top:

```css
--fgd-bg:          #1a1b26;  /* main background */
--fgd-text:        #c0caf5;  /* email text color */
--fgd-accent:      #7aa2f7;  /* selection / links */
```

Reload the extension in `chrome://extensions/` and refresh Gmail.

## License

MIT
