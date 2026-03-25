/**
 * tool-utils.js — Shared utilities for AI for Social Impact tools
 * Loaded by all tool pages via <script src="/tool-utils.js">
 */

const TOOL_WORKER_URL    = 'https://ask-panos.panagiotis-kokmotoss.workers.dev/tool';
const TOOL_NOTIFY_WORKER = 'https://ask-panos.panagiotis-kokmotoss.workers.dev/notify';
const TOOL_NOTIFY_SECRET = 'panos-notify-2026-xyz';

/** POST to the /tool endpoint; returns result text or throws. */
async function callWorker(systemPrompt, userMessage) {
  const res = await fetch(TOOL_WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemPrompt, userMessage }),
  });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

/** Convert markdown bold and newlines to HTML. */
function formatMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

/** Fire-and-forget notification when a tool produces a result. */
function notifyToolUsed(toolName) {
  if (!TOOL_NOTIFY_SECRET) return;
  fetch(TOOL_NOTIFY_WORKER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: TOOL_NOTIFY_SECRET, event: 'AI Tool Used', data: { tool: toolName } }),
  }).catch(() => {});
}

/** Default loading state using standard tool IDs (#submitBtn, #loading).
 *  Complex tools override this by redefining setLoading locally. */
function setLoading(on) {
  const btn = document.getElementById('submitBtn');
  const loadingEl = document.getElementById('loading');
  if (btn) btn.disabled = on;
  if (loadingEl) loadingEl.classList.toggle('visible', on);
}

/** Default error display using #errorBox. */
function showError(msg) {
  const errorBox = document.getElementById('errorBox');
  if (!errorBox) return;
  errorBox.textContent = msg;
  errorBox.classList.add('visible');
}

function hideError() {
  const el = document.getElementById('errorBox');
  if (el) el.classList.remove('visible');
}

/** Show result section using standard IDs (#result, #resultBody). */
function showResult(text) {
  const result = document.getElementById('result');
  const resultBody = document.getElementById('resultBody');
  if (!result || !resultBody) return;
  resultBody.innerHTML = formatMarkdown(text);
  result.classList.add('visible');
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideResult() {
  const el = document.getElementById('result');
  if (el) el.classList.remove('visible');
}

/** Wire the standard #copyBtn to copy text from #resultBody. */
function initCopyBtn() {
  const copyBtn    = document.getElementById('copyBtn');
  const resultBody = document.getElementById('resultBody');
  if (!copyBtn || !resultBody) return;
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(resultBody.textContent).then(() => {
      copyBtn.textContent = 'Copied!';
      setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
    });
  });
}

/** Wire tab switcher for tabbed tool pages (.tool-tab / .tool-tab-panel). */
function initTabSwitcher() {
  document.querySelectorAll('.tool-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tool-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tool-tab-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('panel-' + tab.dataset.tab);
      if (panel) panel.classList.add('active');
    });
  });
}
