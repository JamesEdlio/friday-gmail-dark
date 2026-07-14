// Friday Gmail Dark — content script
// Injects/removes dark mode CSS based on toggle state

const STYLE_ID = 'friday-gmail-dark-style';

const DARK_CSS = `
/* ── Palette ─────────────────────────────────────────────── */
:root {
  --fgd-bg:           #1a1b26;
  --fgd-bg-elevated:  #24253a;
  --fgd-text:         #c0caf5;
  --fgd-text-muted:   #7a82a6;
  --fgd-border:       #2e3045;
  --fgd-accent:       #7aa2f7;
  --fgd-accent-bg:    #1f2335;
  --fgd-highlight:    #e0a020;
  --fgd-highlight-2:  #f0b030;
}

/* ── Email viewer container ──────────────────────────────── */
.iY { background: transparent !important; }

/* ── Email cards / conversation panes ────────────────────── */
.nH.qY {
  background-color: var(--fgd-bg) !important;
  border: 1px solid var(--fgd-border) !important;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
}
span.gD { color: var(--fgd-highlight) !important; }   /* sender name */
h2.hP { color: var(--fgd-highlight-2) !important; }    /* subject (capital P) */
span.g2, span.g3 { color: var(--fgd-text-muted) !important; } /* "to me" + date */
.nH.qY .t2, .nH.qY .vL { color: var(--fgd-text-muted) !important; }
.nH.qY .vU { color: var(--fgd-text) !important; }
.nH.qY .tk > div:first-child { filter: invert(100%) hue-rotate(180deg); }

/* ── Email body ──────────────────────────────────────────── */
.gs .ii.gt { filter: invert(92%) hue-rotate(180deg) saturate(110%); }
.gs .ii.gt img { filter: invert(100%) hue-rotate(180deg) contrast(110%) saturate(115%); }
.gs .ii.gt ::selection { color: var(--fgd-accent) !important; background: var(--fgd-accent-bg) !important; }

/* ── Reply button strip ─────────────────────────────────── */
/* Transparent, not painted: Gmail's own dark background shows through
   so the reply band always matches its surroundings. (.nH.btDi4d and
   .nr.wR default to white in Gmail dark mode; .btDi4d / .Kz7eFc /
   .tcJTwd are minified classes — may churn with Gmail builds.) */
.gA, .gA .gB, .gA .gK, .hq, .dC, .amn, .nH.btDi4d, .nr.wR {
  background-color: transparent !important;
}
/* Compose/editor surfaces keep the themed background */
.aoI, .aSt, .aAb, .arC { background-color: var(--fgd-bg) !important; }
.Kz7eFc { border-color: var(--fgd-border) !important; }   /* suggested-reply box border */
span.tcJTwd { color: var(--fgd-text-muted) !important; }  /* "Suggested reply" label */
.gA .az2, .gA .az2 *, .hq .az2, .hq .az2 *, .dC .az2, .dC .az2 * {
  background-color: transparent !important;
  color: var(--fgd-text) !important;
}
.gA .I5 {
  background-color: var(--fgd-bg) !important;
  filter: invert(92%) hue-rotate(180deg) saturate(110%);
  border-radius: 8px;
}

/* ── New Message / Reply / Forward editors ───────────────── */
.AD, .aSt {
  background-color: var(--fgd-bg) !important;
  filter: invert(92%) hue-rotate(180deg) saturate(110%);
  border-radius: 8px;
}
.AD .az2 .J-JN-M-I-Jm, .aSt .az2 .J-JN-M-I-Jm, .gA .I5 .az2 .J-JN-M-I-Jm { color: #1a1b26; }
.AD .J-M, .aSt .J-M, .gA .I5 .J-M { filter: invert(92%) hue-rotate(180deg) saturate(110%); }
.AD img:not(.uC > img), .aSt img:not(.uC > img), .gA .I5 img:not(.uC > img) {
  filter: invert(100%) hue-rotate(180deg) contrast(110%) saturate(115%);
}
.AD ::selection, .aSt ::selection, .gA .I5 ::selection {
  color: var(--fgd-accent) !important;
  background: var(--fgd-accent-bg) !important;
}

/* ── Floating compose / popout window ────────────────────── */
.afC {
  background-color: var(--fgd-bg) !important;
  filter: invert(92%) hue-rotate(180deg) saturate(110%);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important;
}
.afC .afH { filter: invert(100%) hue-rotate(180deg) contrast(110%) saturate(115%); }

/* ── Smooth transitions ──────────────────────────────────── */
.nH.qY, .AD, .aSt, .afC { transition: background-color 0.2s ease, border-color 0.2s ease; }
`;

async function getEnabled() {
  const result = await chrome.storage.sync.get('enabled');
  return result.enabled !== false;
}

function injectCSS() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = DARK_CSS;
  (document.head || document.documentElement).appendChild(style);
}

function removeCSS() {
  const existing = document.getElementById(STYLE_ID);
  if (existing) existing.remove();
}

async function applyStyle() {
  const enabled = await getEnabled();
  if (enabled) {
    injectCSS();
  } else {
    removeCSS();
  }
}

// Listen for toggle changes from popup
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && 'enabled' in changes) {
    applyStyle();
  }
});

// Inject as early as possible
applyStyle();

// Re-apply on SPA navigation
let lastUrl = location.href;
const observer = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    applyStyle();
  }
});
observer.observe(document.documentElement, { childList: true, subtree: true });
