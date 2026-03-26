/**
 * tool-utils.js — Shared utilities for AI for Social Impact tools
 * Loaded by all tool pages via <script src="/tool-utils.js">
 */

/* ── Constants ── */
const TOOL_WORKER_URL    = 'https://ask-panos.panagiotis-kokmotoss.workers.dev/tool';
const TOOL_NOTIFY_WORKER = 'https://ask-panos.panagiotis-kokmotoss.workers.dev/notify';
const TOOL_NOTIFY_SECRET = 'panos-notify-2026-xyz';

/* ── Related tools map ── */
const _RELATED_TOOLS = {
  '/what-would-x-do.html': [
    { url: '/why-should-i-give.html',         icon: '❤️',  name: '"Why Should I Give?"',    chip: 'Donors',     cls: 'tuc-d' },
    { url: '/charity-comparison-engine.html', icon: '⚖️',  name: 'Charity Comparison',      chip: 'Donors',     cls: 'tuc-d' },
    { url: '/first-time-donor-coach.html',    icon: '🧭',  name: 'First-Time Donor Coach',  chip: 'Donors',     cls: 'tuc-d' },
  ],
  '/why-should-i-give.html': [
    { url: '/what-would-x-do.html',           icon: '💸',  name: '"What Would $X Do?"',     chip: 'Donors',     cls: 'tuc-d' },
    { url: '/first-time-donor-coach.html',    icon: '🧭',  name: 'First-Time Donor Coach',  chip: 'Donors',     cls: 'tuc-d' },
    { url: '/charity-comparison-engine.html', icon: '⚖️',  name: 'Charity Comparison',      chip: 'Donors',     cls: 'tuc-d' },
  ],
  '/first-time-donor-coach.html': [
    { url: '/why-should-i-give.html',         icon: '❤️',  name: '"Why Should I Give?"',    chip: 'Donors',     cls: 'tuc-d' },
    { url: '/what-would-x-do.html',           icon: '💸',  name: '"What Would $X Do?"',     chip: 'Donors',     cls: 'tuc-d' },
    { url: '/charity-comparison-engine.html', icon: '⚖️',  name: 'Charity Comparison',      chip: 'Donors',     cls: 'tuc-d' },
  ],
  '/charity-comparison-engine.html': [
    { url: '/nonprofit-health-checker.html',  icon: '🔍',  name: 'Nonprofit Health Checker',chip: 'Donors',     cls: 'tuc-d' },
    { url: '/scam-nonprofit-detector.html',   icon: '🚨',  name: 'Scam Detector',           chip: 'Donors',     cls: 'tuc-d' },
    { url: '/what-would-x-do.html',           icon: '💸',  name: '"What Would $X Do?"',     chip: 'Donors',     cls: 'tuc-d' },
  ],
  '/nonprofit-health-checker.html': [
    { url: '/scam-nonprofit-detector.html',   icon: '🚨',  name: 'Scam Detector',           chip: 'Donors',     cls: 'tuc-d' },
    { url: '/charity-comparison-engine.html', icon: '⚖️',  name: 'Charity Comparison',      chip: 'Donors',     cls: 'tuc-d' },
    { url: '/first-time-donor-coach.html',    icon: '🧭',  name: 'First-Time Donor Coach',  chip: 'Donors',     cls: 'tuc-d' },
  ],
  '/scam-nonprofit-detector.html': [
    { url: '/nonprofit-health-checker.html',  icon: '🔍',  name: 'Nonprofit Health Checker',chip: 'Donors',     cls: 'tuc-d' },
    { url: '/charity-comparison-engine.html', icon: '⚖️',  name: 'Charity Comparison',      chip: 'Donors',     cls: 'tuc-d' },
    { url: '/first-time-donor-coach.html',    icon: '🧭',  name: 'First-Time Donor Coach',  chip: 'Donors',     cls: 'tuc-d' },
  ],
  '/volunteer-match.html': [
    { url: '/what-can-i-donate.html',         icon: '📦',  name: '"What Can I Donate?"',    chip: 'Donors',     cls: 'tuc-v' },
    { url: '/community-needs-map.html',       icon: '🗺️', name: 'Community Needs Map',     chip: 'Nonprofits', cls: 'tuc-n' },
    { url: '/why-should-i-give.html',         icon: '❤️',  name: '"Why Should I Give?"',    chip: 'Donors',     cls: 'tuc-d' },
  ],
  '/what-can-i-donate.html': [
    { url: '/volunteer-match.html',           icon: '🤝',  name: 'Volunteer Match',         chip: 'Volunteers', cls: 'tuc-v' },
    { url: '/first-time-donor-coach.html',    icon: '🧭',  name: 'First-Time Donor Coach',  chip: 'Donors',     cls: 'tuc-d' },
    { url: '/neighborhood-giving-map.html',   icon: '🏙️', name: 'Neighborhood Giving Map', chip: 'Nonprofits', cls: 'tuc-n' },
  ],
  '/impact-story-generator.html': [
    { url: '/community-needs-map.html',       icon: '🗺️', name: 'Community Needs Map',     chip: 'Nonprofits', cls: 'tuc-n' },
    { url: '/neighborhood-giving-map.html',   icon: '🏙️', name: 'Neighborhood Giving Map', chip: 'Nonprofits', cls: 'tuc-n' },
    { url: '/volunteer-match.html',           icon: '🤝',  name: 'Volunteer Match',         chip: 'Volunteers', cls: 'tuc-v' },
  ],
  '/community-needs-map.html': [
    { url: '/neighborhood-giving-map.html',   icon: '🏙️', name: 'Neighborhood Giving Map', chip: 'Nonprofits', cls: 'tuc-n' },
    { url: '/impact-story-generator.html',    icon: '✍️',  name: 'Impact Story Generator',  chip: 'Nonprofits', cls: 'tuc-n' },
    { url: '/volunteer-match.html',           icon: '🤝',  name: 'Volunteer Match',         chip: 'Volunteers', cls: 'tuc-v' },
  ],
  '/neighborhood-giving-map.html': [
    { url: '/community-needs-map.html',       icon: '🗺️', name: 'Community Needs Map',     chip: 'Nonprofits', cls: 'tuc-n' },
    { url: '/charity-comparison-engine.html', icon: '⚖️',  name: 'Charity Comparison',      chip: 'Donors',     cls: 'tuc-d' },
    { url: '/impact-story-generator.html',    icon: '✍️',  name: 'Impact Story Generator',  chip: 'Nonprofits', cls: 'tuc-n' },
  ],
};

/* ── Usage counter seeds ── */
const _USAGE_SEEDS = {
  '/what-would-x-do.html':           2847,
  '/why-should-i-give.html':         1923,
  '/first-time-donor-coach.html':    1456,
  '/charity-comparison-engine.html': 1289,
  '/nonprofit-health-checker.html':  1034,
  '/scam-nonprofit-detector.html':    978,
  '/volunteer-match.html':           1102,
  '/what-can-i-donate.html':          834,
  '/impact-story-generator.html':     672,
  '/community-needs-map.html':        589,
  '/neighborhood-giving-map.html':    543,
};

/* ── Loading messages ── */
const _DEFAULT_LOADING_MSGS = [
  'Analyzing your inputs…',
  'Building your personalized response…',
  'Connecting the dots…',
  'Almost there…',
];
let _loadingMsgTimer = null;

function startLoadingMessages(customMsgs) {
  const el = document.getElementById('loadingText');
  if (!el) return;
  const msgs = customMsgs || _DEFAULT_LOADING_MSGS;
  let i = 0;
  el.textContent = msgs[0];
  clearInterval(_loadingMsgTimer);
  _loadingMsgTimer = setInterval(() => {
    i = (i + 1) % msgs.length;
    el.style.opacity = '0';
    setTimeout(() => { el.textContent = msgs[i]; el.style.opacity = '1'; }, 180);
  }, 2200);
}

function stopLoadingMessages() {
  clearInterval(_loadingMsgTimer);
  _loadingMsgTimer = null;
}

/* ── Core API ── */
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

function formatMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

function notifyToolUsed(toolName) {
  /* Increment local counter */
  const key = 'tuc_' + window.location.pathname.replace(/[^a-z0-9]/gi, '_');
  try {
    const n = parseInt(localStorage.getItem(key) || '0', 10);
    localStorage.setItem(key, n + 1);
  } catch {}
  _renderUsageCount();

  /* Fire-and-forget notification */
  if (!TOOL_NOTIFY_SECRET) return;
  fetch(TOOL_NOTIFY_WORKER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: TOOL_NOTIFY_SECRET, event: 'AI Tool Used', data: { tool: toolName } }),
  }).catch(() => {});
}

/* ── Standard UI helpers (complex tools override with local versions) ── */
function setLoading(on) {
  const btn       = document.getElementById('submitBtn');
  const loadingEl = document.getElementById('loading');
  if (btn) btn.disabled = on;
  if (loadingEl) loadingEl.classList.toggle('visible', on);
  const hasText = !!document.getElementById('loadingText');
  if (on && hasText) startLoadingMessages();
  else if (!on) stopLoadingMessages();
}

function showError(msg) {
  const el = document.getElementById('errorBox');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('visible');
}

function hideError() {
  const el = document.getElementById('errorBox');
  if (el) el.classList.remove('visible');
}

function showResult(text) {
  const result     = document.getElementById('result');
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

/* ── Copy button ── */
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

/* ── Tab switcher ── */
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

/* ── Example chips ── */
function initExampleChips() {
  document.querySelectorAll('.tool-example-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      /* Fill form fields from data-fill-* attributes */
      Object.keys(chip.dataset).forEach(key => {
        if (!key.startsWith('fill')) return;
        /* dataset converts data-fill-org-name → fillOrgName; reverse to orgName */
        const raw = key.slice(4); /* strip 'fill' */
        const fieldId = raw.charAt(0).toLowerCase() + raw.slice(1);
        const el = document.getElementById(fieldId);
        if (el) el.value = chip.dataset[key];
      });
      /* Active state */
      document.querySelectorAll('.tool-example-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      /* Scroll toward submit */
      const submit = document.getElementById('submitBtn');
      if (submit) submit.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
}

/* ── Try-another button ── */
function initTryAnother() {
  const btn = document.getElementById('tryAnotherBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    hideResult();
    hideError();
    const form = document.getElementById('toolForm');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const first = form.querySelector('input[type="text"], input:not([type]), textarea');
        if (first) first.focus();
      }, 420);
    }
  });
}

/* ── Share buttons ── */
function initShareBtns() {
  const xBtn    = document.getElementById('shareXBtn');
  const linkBtn = document.getElementById('shareLinkBtn');

  if (xBtn) {
    xBtn.addEventListener('click', () => {
      const title = document.querySelector('h1.tool-title')?.textContent?.trim() || document.title;
      const url   = window.location.href;
      const text  = `Just tried "${title}" — free AI tool for social impact by @panoskokmotoss`;
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        '_blank', 'noopener,width=600,height=420'
      );
    });
  }

  if (linkBtn) {
    const _linkIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>`;
    const _checkIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13"><path d="M20 6L9 17l-5-5"/></svg>`;
    linkBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        linkBtn.innerHTML = _checkIcon + ' Copied!';
        setTimeout(() => { linkBtn.innerHTML = _linkIcon + ' Copy link'; }, 2200);
      });
    });
  }
}

/* ── Usage counter (render) ── */
function _renderUsageCount() {
  const el = document.getElementById('toolUsageCount');
  if (!el) return;
  const path  = window.location.pathname;
  const seed  = _USAGE_SEEDS[path] || 500;
  const key   = 'tuc_' + path.replace(/[^a-z0-9]/gi, '_');
  const local = parseInt(localStorage.getItem(key) || '0', 10);
  const total = seed + local;
  const fmt   = total >= 10000
    ? Math.round(total / 1000) + 'K'
    : total.toLocaleString();
  el.innerHTML = `<span class="tuc-icon">✓</span> Used <strong>${fmt} times</strong> by donors &amp; changemakers`;
}

function initUsageCounter() { _renderUsageCount(); }

/* ── Related tools (auto-inject) ── */
function initRelatedTools() {
  const wrap = document.getElementById('toolRelated');
  if (!wrap) return;
  const items = _RELATED_TOOLS[window.location.pathname];
  if (!items || !items.length) return;
  wrap.innerHTML = `
    <div class="trel-inner">
      <span class="trel-label">Also try</span>
      <div class="trel-grid">
        ${items.map(t => `
          <a href="${t.url}" class="trel-card">
            <span class="trel-icon">${t.icon}</span>
            <span class="trel-name">${t.name}</span>
            <span class="trel-chip ${t.cls}">${t.chip}</span>
          </a>`).join('')}
      </div>
    </div>`;
}

/* ── Embed widget (auto-inject) ── */
function initEmbed() {
  const wrap = document.getElementById('toolEmbed');
  if (!wrap) return;
  const url = window.location.origin + window.location.pathname;

  const platforms = [
    {
      id: 'html',
      label: 'Custom HTML',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>`,
      code: `<iframe src="${url}" width="100%" height="700" frameborder="0" loading="lazy" style="border-radius:12px;border:1px solid #eee"></iframe>`,
      instruction: 'Paste anywhere in your HTML page.',
    },
    {
      id: 'wp',
      label: 'WordPress',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM3.5 12c0-1.15.22-2.25.61-3.26L7.86 19.6A8.51 8.51 0 0 1 3.5 12zm8.5 8.5c-.78 0-1.53-.11-2.24-.31l2.38-6.9 2.44 6.68c.02.04.04.08.06.11A8.54 8.54 0 0 1 12 20.5zm1.17-12.45l2.03 6.07-2.84.08-.06-.18-1.82-5.19c.46-.02.9-.05 1.35-.08.48-.03.94-.08 1.34-.7zm1.41 8.33l2.44-7.08c.38-.97.51-1.74.51-2.43 0-.25-.02-.47-.05-.68A8.51 8.51 0 0 1 20.5 12a8.5 8.5 0 0 1-5.92 8.38z"/></svg>`,
      code: `<iframe src="${url}" width="100%" height="700" frameborder="0" loading="lazy" style="border-radius:12px;border:1px solid #eee"></iframe>`,
      instruction: 'In the WordPress editor, add a <strong>Custom HTML</strong> block and paste the code.',
    },
    {
      id: 'wix',
      label: 'Wix',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M21 5H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 11l-5-5 1.4-1.4L12 13.2l7.6-7.6L21 7l-9 9z"/></svg>`,
      code: `<iframe src="${url}" width="100%" height="700" frameborder="0" loading="lazy" style="border-radius:12px;border:1px solid #eee"></iframe>`,
      instruction: 'In Wix Editor, add an <strong>Embed &gt; HTML iframe</strong> element, then paste the code.',
    },
    {
      id: 'webflow',
      label: 'Webflow',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M17.114 0S13.8 7.116 10.097 9.68H4.743L3 15.998h4.057l-1.828 8.002S15.22 12.587 19.714 7.988h-5.23L17.113 0z"/></svg>`,
      code: `<iframe src="${url}" width="100%" height="700" frameborder="0" loading="lazy" style="border-radius:12px;border:1px solid #eee"></iframe>`,
      instruction: 'In Webflow, add an <strong>HTML Embed</strong> element from the Add panel (+), then paste the code.',
    },
  ];

  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  wrap.innerHTML = `
    <button class="temb-toggle" id="_embToggle">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
      Embed this tool on your site
    </button>
    <div class="temb-body" id="_embBody">
      <p class="temb-desc">Add this free tool to your nonprofit website — no account needed.</p>
      <div class="temb-tabs" id="_embTabs">
        ${platforms.map((p, i) => `
          <button class="temb-tab${i === 0 ? ' active' : ''}" data-tab="${p.id}">
            ${p.icon} ${p.label}
          </button>`).join('')}
      </div>
      ${platforms.map((p, i) => `
        <div class="temb-tab-panel${i === 0 ? ' active' : ''}" id="_embPanel_${p.id}">
          <p class="temb-instruction">${p.instruction}</p>
          <div class="temb-code"><code id="_embCode_${p.id}">${esc(p.code)}</code></div>
          <button class="temb-copy" data-platform="${p.id}">Copy code</button>
        </div>`).join('')}
    </div>`;

  document.getElementById('_embToggle').addEventListener('click', function () {
    const body = document.getElementById('_embBody');
    const open = body.classList.toggle('visible');
    this.classList.toggle('open', open);
  });

  // Tab switching
  document.getElementById('_embTabs').addEventListener('click', function(e) {
    const btn = e.target.closest('.temb-tab');
    if (!btn) return;
    const tab = btn.dataset.tab;
    wrap.querySelectorAll('.temb-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    wrap.querySelectorAll('.temb-tab-panel').forEach(p => p.classList.toggle('active', p.id === `_embPanel_${tab}`));
  });

  // Copy buttons
  wrap.addEventListener('click', function(e) {
    const btn = e.target.closest('.temb-copy');
    if (!btn) return;
    const pid = btn.dataset.platform;
    const platform = platforms.find(p => p.id === pid);
    if (!platform) return;
    navigator.clipboard.writeText(platform.code).then(() => {
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = 'Copy code'; }, 2200);
    });
  });
}

/* ── Auto-init on DOM ready ── */
document.addEventListener('DOMContentLoaded', () => {
  initExampleChips();
  initTryAnother();
  initShareBtns();
  initUsageCounter();
  initRelatedTools();
  initEmbed();
});
