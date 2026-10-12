/**
 * The Kortext design system's tokens and base controls, embedded in the
 * \`setup --web\` page. Copied from kortext-tokens.css (2026-09-21); its rules
 * are in that system's DESIGN.md. Kortext's own state tags and badges are
 * left out. Build the page from these tokens; add no new colour or size.
 */
export const DESIGN_TOKENS = `/* Kortext design tokens + base controls — lifted from kortext/ui/src/index.css (2026-09-21).
   The rules behind it: dev/DESIGN.md §0–7, §10, §16. Theme: <html data-theme="light|dark">,
   no attribute = follow the OS. Build the rest from the tokens; add no new colour. */

/* Panel styles and design tokens; see dev/DESIGN.md. */

:root {
  /* The page's own answer to "light or dark" — what an <img> hands the SVG
     inside it, so the wordmark's palette follows the panel's theme, not the OS. */
  color-scheme: light;
  /* Neutral colors */

  --gray-300: #e0e0e4;
  --gray-400: #c6c6cc;

  /* semantic surfaces */
  --bg: #ffffff;
  --bg-subtle: #fbfbfc;
  --bg-muted: #f5f5f6;
  --bg-inset: #f7f7f8;
  --bg-hover: #f2f2f4;
  --bg-active: #ececef;
  --border: #eaeaec;
  --border-strong: #dcdce0;

  /* text */
  --fg: #18181b;
  --fg-secondary: #51515a;
  --fg-muted: #76767f;
  --fg-faint: #a3a3ad;

  /* Primary action colors */
  --accent: #18181b;
  --accent-hover: #000000;
  --accent-fg: #ffffff;
  --accent-tint: #f4f4f5;
  --accent-tint-border: #e2e2e6;
  --accent-ring: rgba(24, 24, 27, 0.16);

  /* status — bare colour + bg + border */
  --green: #157a52;
  --green-bg: #eaf5ef;
  --green-border: #cfe9dd;
  --amber: #9a6a16;
  --amber-bg: #faf2e2;
  --amber-border: #ecdcb8;
  --red: #c5392f;
  --red-bg: #fbeceb;
  --red-border: #f1cfcc;
  --blue: #2563c9;
  --blue-bg: #eaf1fc;
  --blue-border: #cbdcf6;
  --violet: #5b4bcc;
  --violet-bg: #efedfb;
  --violet-border: #dad5f4;
  --pink: #c02a72;
  --pink-bg: #fdebf3;
  --pink-border: #f6cede;

  /* radius */
  --r-sm: 4px;
  --r-md: 6px;
  --r-lg: 9px;
  --r-pill: 999px;

  /* control heights */
  --control-h: 30px;

  /* Typography roles */
  --fs-title: 21px;
  --fs-section: 19px;
  --fs-heading: 17px;
  --fs-body: 14px;
  --fs-ui: 13px;
  --fs-label: 12px;
  --fs-micro: 11px;
  --fs-doc: 15px;
  /* Spacing scale */
  --sp-1: 4px;
  --sp-2: 8px;
  --sp-3: 12px;
  --sp-4: 16px;
  --sp-5: 24px;
  --sp-6: 32px;

  --border-hover: #c6c6cc;

  /* type */
  --font-sans: -apple-system, system-ui, 'Segoe UI', sans-serif;
  --font-mono: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;

  /* shadow */
  --shadow-xs: 0 1px 1px rgba(24, 24, 27, 0.04);

  --shadow-lg: 0 12px 32px rgba(24, 24, 27, 0.12), 0 2px 6px rgba(24, 24, 27, 0.06);

  --speed: 130ms;
  --ease: cubic-bezier(0.2, 0, 0, 1);

}
/* ---------- dark theme ---------- */
/* Repeat dark values for explicit and OS-selected themes to avoid a script-dependent theme flash. */
:root[data-theme='dark'] {
  color-scheme: dark;
  --border-hover: #3a3a40;

  --gray-300: #2c2c31;
  --gray-400: #3a3a40;

  --bg: #0a0a0b;
  --bg-subtle: #0e0e10;
  --bg-muted: #161618;
  --bg-inset: #121214;
  --bg-hover: #1a1a1d;
  --bg-active: #212126;
  --border: #2a2a30;
  --border-strong: #3a3a42;

  --fg: #ededef;
  --fg-secondary: #9c9ca5;
  --fg-muted: #6e6e77;
  --fg-faint: #54545c;

  /* Dark-theme primary action colors */
  --accent: #ededef;
  --accent-hover: #cfcfd4;
  --accent-fg: #0a0a0b;
  --accent-tint: #1c1c20;
  --accent-tint-border: #2a2a30;
  --accent-ring: rgba(237, 237, 239, 0.16);

  --green: #46c08a;
  --green-bg: #10231b;
  --green-border: #1d3b2e;
  --amber: #d3a55e;
  --amber-bg: #241c0e;
  --amber-border: #3a2e16;
  --red: #e0726a;
  --red-bg: #26120f;
  --red-border: #3d201c;
  --blue: #5e9bf0;
  --blue-bg: #0f1c30;
  --blue-border: #1c3050;
  --violet: #8b7df0;
  --violet-bg: #171530;
  --violet-border: #272350;
  --pink: #ee7bb0;
  --pink-bg: #2b1220;
  --pink-border: #4a2038;

  --shadow-xs: 0 1px 1px rgba(0, 0, 0, 0.4);

  --shadow-lg: 0 14px 36px rgba(0, 0, 0, 0.6);
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    color-scheme: dark;
    --border-hover: #3a3a40;

    --gray-300: #2c2c31;
    --gray-400: #3a3a40;

    --bg: #0a0a0b;
    --bg-subtle: #0e0e10;
    --bg-muted: #161618;
    --bg-inset: #121214;
    --bg-hover: #1a1a1d;
    --bg-active: #212126;
    --border: #2a2a30;
    --border-strong: #3a3a42;

    --fg: #ededef;
    --fg-secondary: #9c9ca5;
    --fg-muted: #6e6e77;
    --fg-faint: #54545c;

    /* Dark-theme primary action colors */
    --accent: #ededef;
    --accent-hover: #cfcfd4;
    --accent-fg: #0a0a0b;
    --accent-tint: #1c1c20;
    --accent-tint-border: #2a2a30;
    --accent-ring: rgba(237, 237, 239, 0.16);

    --green: #46c08a;
    --green-bg: #10231b;
    --green-border: #1d3b2e;
    --amber: #d3a55e;
    --amber-bg: #241c0e;
    --amber-border: #3a2e16;
    --red: #e0726a;
    --red-bg: #26120f;
    --red-border: #3d201c;
    --blue: #5e9bf0;
    --blue-bg: #0f1c30;
    --blue-border: #1c3050;
    --violet: #8b7df0;
    --violet-bg: #171530;
    --violet-border: #272350;
    --pink: #ee7bb0;
    --pink-bg: #2b1220;
    --pink-border: #4a2038;

    --shadow-xs: 0 1px 1px rgba(0, 0, 0, 0.4);

    --shadow-lg: 0 14px 36px rgba(0, 0, 0, 0.6);
  }
}
* {
  box-sizing: border-box;
  border-color: var(--border);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
html,
body,
#root {
  height: 100%;
  margin: 0;
}
body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-sans);
  font-size: var(--fs-body);
  line-height: 1.5;
  font-feature-settings: 'cv01', 'ss01', 'tnum';
}
.mono {
  font-family: var(--font-mono);
  letter-spacing: 0;
  font-feature-settings: 'tnum' 1;
}
::selection {
  background: var(--accent-tint);
}
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-thumb {
  background: var(--border-strong);
  border-radius: 999px;
  border: 3px solid var(--bg);
  background-clip: padding-box;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--border-hover);
  background-clip: padding-box;
}
/* ---------- generic ---------- */


/* Loading spinner */

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.spin {
  animation: spin 0.9s linear infinite;
}
.ring {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
}
/* Buttons */
/* Shared button sizing, typography, focus and disabled states; variants define appearance. */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: var(--control-h);
  padding: 0 11px;
  font-size: var(--fs-body);
  font-weight: 500;
  line-height: 1;
  border-radius: var(--r-md);
  border: 1px solid transparent;
  background: var(--bg);
  color: var(--fg);
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  font-family: inherit;
  transition:
    background var(--speed) var(--ease),
    border-color var(--speed) var(--ease),
    box-shadow var(--speed) var(--ease),
    color var(--speed) var(--ease);
}
.btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--accent-ring);
}
.btn .ic {
  width: 14px;
  height: 14px;
  flex: none;
}
/* Define hover styling per variant to avoid base-rule overrides. */
.btn:hover {
  background: none;
  border-color: transparent;
}
.btn[disabled] {
  opacity: 0.45;
  pointer-events: none;
}
/* Solid buttons */
.btn-primary {
  background: var(--accent);
  color: var(--accent-fg);
  border-color: var(--accent);
}
.btn-primary:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}
.btn-secondary {
  background: var(--bg);
  color: var(--fg);
  border-color: var(--border-strong);
  box-shadow: var(--shadow-xs);
}
.btn-secondary:hover {
  background: var(--bg-active);
  border-color: var(--border-hover);
}
.btn-success {
  background: var(--green-bg);
  color: var(--green);
  border-color: var(--green-border);
}
.btn-success:hover {
  background: var(--green-bg);
  color: var(--green);
  border-color: var(--green);
}
.btn-danger {
  background: var(--red-bg);
  color: var(--red);
  border-color: var(--red-border);
}
.btn-danger:hover {
  background: var(--red-bg);
  color: var(--red);
  border-color: var(--red);
}
/* Link buttons */
.btn-link-primary,
.btn-link-success,
.btn-link-warning,
.btn-link-danger {
  height: var(--control-h);
  padding: 0 12px;
  border-radius: var(--r-sm);
  background: none;
  border-color: transparent;
}
.btn-link-primary {
  color: var(--fg-secondary);
}
.btn-link-primary:hover {
  background: var(--bg-active);
  border-color: var(--border-strong);
  color: var(--fg);
}
.btn-link-success {
  color: var(--green);
}
.btn-link-success:hover {
  background: var(--green-bg);
  border-color: var(--green-border);
  color: var(--green);
}
.btn-link-warning {
  color: var(--amber);
}
.btn-link-warning:hover {
  background: var(--amber-bg);
  border-color: var(--amber-border);
  color: var(--amber);
}
.btn-link-danger {
  color: var(--red);
}
.btn-link-danger:hover {
  background: var(--red-bg);
  border-color: var(--red-border);
  color: var(--red);
}
/* Replace the native select arrow with a chevron that inherits the text color. */
.select {
  height: var(--control-h);
  padding: 0 30px 0 12px;
  font-family: inherit;
  font-size: var(--fs-ui);
  font-weight: 500;
  line-height: 1;
  color: var(--fg);
  background-color: var(--bg);
  border: 1px solid var(--border-strong);
  border-radius: var(--r-md);
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2.25' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>");
  background-repeat: no-repeat;
  background-position: right 8px center;
  transition:
    background-color var(--speed) var(--ease),
    border-color var(--speed) var(--ease),
    box-shadow var(--speed) var(--ease);
}
.select:hover {
  background-color: var(--bg-active);
  border-color: var(--border-hover);
}
.select:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--accent-ring);
  border-color: var(--accent);
}
.select[disabled] {
  opacity: 0.45;
  pointer-events: none;
}
.seg {
  display: inline-flex;
  padding: 2px;
  gap: 2px;
  background: var(--bg-muted);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
}
.seg button {
  height: calc(var(--control-h) - 6px);
  padding: 0 10px;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: var(--fs-ui);
  font-weight: 500;
  color: var(--fg-muted);
  border-radius: calc(var(--r-md) - 2px);
  cursor: pointer;
  white-space: nowrap;
  transition:
    background var(--speed) var(--ease),
    color var(--speed) var(--ease);
}
.seg button:hover {
  color: var(--fg-secondary);
}
.seg button.on {
  background: var(--bg);
  color: var(--fg);
  box-shadow: var(--shadow-xs);
}
/* Inputs */
.input {
  height: var(--control-h);
  width: 100%;
  padding: 0 10px;
  font-size: var(--fs-body);
  color: var(--fg);
  background: var(--bg);
  border: 1px solid var(--border-strong);
  border-radius: var(--r-md);
  outline: none;
  font-family: inherit;
  transition:
    border-color var(--speed) var(--ease),
    box-shadow var(--speed) var(--ease);
}
.input::placeholder {
  color: var(--fg-faint);
}
.input:hover {
  border-color: var(--border-hover);
}
.input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-ring);
}
.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
/* Status colors: approved green, writing blue, pending violet, paused amber and failed red. */
/* Every state is the same pill, sized to the longest word it can carry, so a
   column of them reads as one column rather than a ragged edge. */
.kx-req-check {
  cursor: pointer;
  margin: 0;
  position: relative;
  top: 2px;
}
/* One drawn box for both the list and the body: a hairline square that fills
   with the accent when it is on. The browser's own box ignores the theme. */
.kx-req-check,
.kx-task-box {
  appearance: none;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: var(--r-sm);
  border: 1px solid var(--border-strong);
  background: var(--bg);
  flex: none;
  transition:
    background var(--speed) var(--ease),
    border-color var(--speed) var(--ease);
}
.kx-req-check:checked,
.kx-task-box:checked {
  background-color: var(--accent);
  border-color: var(--accent);
  /* The tick is a mask, not an image: an image cannot read a token, and the
     dark theme's accent is light, so a white tick vanished there. */
  background-image: none;
}
.kx-req-check:checked::after,
.kx-task-box:checked::after {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background: var(--accent-fg);
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><path d='M20 6 9 17l-5-5'/></svg>")
    center / 11px 11px no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><path d='M20 6 9 17l-5-5'/></svg>")
    center / 11px 11px no-repeat;
}
`;
