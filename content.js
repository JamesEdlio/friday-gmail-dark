// Friday Gmail Dark — content script
// Injects/removes dark mode CSS based on toggle state

const STYLE_ID = 'friday-gmail-dark-style';

async function getEnabled() {
  const result = await chrome.storage.sync.get('enabled');
  return result.enabled !== false; // default to true
}

async function applyStyle() {
  const enabled = await getEnabled();

  const existing = document.getElementById(STYLE_ID);

  if (enabled && !existing) {
    // Fetch the CSS file from the extension
    try {
      const url = chrome.runtime.getURL('gmail-dark.css');
      const res = await fetch(url);
      const css = await res.text();
      const style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = css;
      (document.head || document.documentElement).appendChild(style);
    } catch (e) {
      console.error('[Friday Gmail Dark] Failed to inject CSS:', e);
    }
  } else if (!enabled && existing) {
    existing.remove();
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

// Also re-apply on dynamic page navigation (Gmail is a SPA)
let lastUrl = location.href;
const observer = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    applyStyle();
  }
});
observer.observe(document.documentElement, { childList: true, subtree: true });
