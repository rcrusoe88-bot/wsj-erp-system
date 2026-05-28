# Status line Context N/A Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the global Claude Code status line script so it always shows the model name and displays `Context N/A` whenever no usable context percentage is available.

**Architecture:** Keep the existing single-file Node script and its current field compatibility logic. Make the smallest possible change: stop returning early on JSON parse failure, let the existing default model fallback apply, and normalize the non-numeric/missing context display to `N/A`.

**Tech Stack:** Node.js, Claude Code statusLine command, PowerShell for local verification

---

## File Structure

- `C:\Users\11143\.claude\statusline-context.js`
  - Global status line script invoked by `statusLine.command` in `C:\Users\11143\.claude\settings.json`
  - Reads JSON from stdin, extracts model/context data, prints one-line status text

## Git Note

This task does **not** include a git commit. The target file lives in the user-global Claude directory (`C:\Users\11143\.claude\`), and the current workspace is not a git repository.

### Task 1: Update the global status line script

**Files:**
- Modify: `C:\Users\11143\.claude\statusline-context.js`
- Reference only: `C:\Users\11143\.claude\settings.json:468-473`

- [ ] **Step 1: Verify the current missing-context behavior**

Run:

```powershell
$json = '{"model":{"display_name":"Claude Opus"}}'; $json | node "C:\Users\11143\.claude\statusline-context.js"
```

Expected before change:

```text
Claude Opus | Context n/a
```

- [ ] **Step 2: Verify the current percentage behavior**

Run:

```powershell
$json = '{"model":{"display_name":"Claude Opus"},"context_window":{"used_percentage":42.1}}'; $json | node "C:\Users\11143\.claude\statusline-context.js"
```

Expected before change:

```text
Claude Opus | Context 42.1%
```

- [ ] **Step 3: Replace the script with the minimal updated implementation**

Write this exact file content to `C:\Users\11143\.claude\statusline-context.js`:

```js
let input = "";

process.stdin.setEncoding("utf8");

process.stdin.on("data", chunk => {
  input += chunk;
});

process.stdin.on("end", () => {
  let data = {};

  try {
    data = JSON.parse((input || "{}").replace(/^﻿/, ""));
  } catch {
    data = {};
  }

  const model =
    data.model?.display_name ||
    data.model?.name ||
    data.model?.id ||
    data.model ||
    "Claude";

  const ctx = data.context_window || data.context || {};
  const used =
    ctx.used_percentage ??
    ctx.usedPercent ??
    ctx.percent_used ??
    ctx.percentage;

  const percent = typeof used === "number" ? `${used.toFixed(1)}%` : "N/A";

  console.log(`${model} | Context ${percent}`);
});
```

- [ ] **Step 4: Re-run the missing-context check**

Run:

```powershell
$json = '{"model":{"display_name":"Claude Opus"}}'; $json | node "C:\Users\11143\.claude\statusline-context.js"
```

Expected after change:

```text
Claude Opus | Context N/A
```

- [ ] **Step 5: Re-run the percentage check**

Run:

```powershell
$json = '{"model":{"display_name":"Claude Opus"},"context_window":{"used_percentage":42.1}}'; $json | node "C:\Users\11143\.claude\statusline-context.js"
```

Expected after change:

```text
Claude Opus | Context 42.1%
```

- [ ] **Step 6: Verify the parse-failure fallback still produces a valid status line**

Run:

```powershell
'{invalid-json' | node "C:\Users\11143\.claude\statusline-context.js"
```

Expected after change:

```text
Claude | Context N/A
```
