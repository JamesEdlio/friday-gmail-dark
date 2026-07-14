// Popup script — toggle dark mode on/off

const toggle = document.getElementById('toggle');
const status = document.getElementById('status');

async function init() {
  const result = await chrome.storage.sync.get('enabled');
  const enabled = result.enabled !== false; // default true
  toggle.checked = enabled;
  updateStatus(enabled);
}

function updateStatus(enabled) {
  status.textContent = enabled ? '✅ Enabled — refresh Gmail' : '⬛ Disabled — refresh Gmail';
}

toggle.addEventListener('change', async () => {
  const enabled = toggle.checked;
  await chrome.storage.sync.set({ enabled });
  updateStatus(enabled);
});

init();
