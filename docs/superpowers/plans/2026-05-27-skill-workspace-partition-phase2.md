# Skill Workspace Partition Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Physically move content and development skills out of `~/.claude/skills` into the corresponding workspace `.claude/skills/` directories, while preserving global baseline skills and keeping settings aligned.

**Architecture:** Use a copy-verify-delete workflow. First create workspace-local skill directories, then copy pre-approved skill sets into the content and development workspaces, verify each copied skill has a valid `SKILL.md`, delete only the migrated global copies, and finally trim global `skillOverrides` while keeping workspace-level settings as the second filter layer.

**Tech Stack:** Claude Code settings JSON, filesystem directory operations, PowerShell verification commands

---

### Task 1: Create workspace skill directories and verify current state

**Files:**
- Create: `C:/Users/11143/.claude/项目部署/内容工作区/.claude/skills/`
- Create: `C:/Users/11143/.claude/项目部署/开发工作区/.claude/skills/`
- Verify: `C:/Users/11143/.claude/settings.json:474-518`
- Verify: `C:/Users/11143/.claude/项目部署/内容工作区/.claude/settings.json:16-42`
- Verify: `C:/Users/11143/.claude/项目部署/开发工作区/.claude/settings.json:23-45`

- [ ] **Step 1: Verify the workspace roots exist before creating skill directories**

Run:
```powershell
Test-Path "C:\Users\11143\.claude\项目部署\内容工作区\.claude"; Test-Path "C:\Users\11143\.claude\项目部署\开发工作区\.claude"
```

Expected:
```text
True
True
```

- [ ] **Step 2: Create the two workspace-local skills directories**

Run:
```powershell
New-Item -ItemType Directory -Force "C:\Users\11143\.claude\项目部署\内容工作区\.claude\skills" | Out-Null; New-Item -ItemType Directory -Force "C:\Users\11143\.claude\项目部署\开发工作区\.claude\skills" | Out-Null
```

Expected:
```text
(no output)
```

- [ ] **Step 3: Re-check that both directories now exist**

Run:
```powershell
Test-Path "C:\Users\11143\.claude\项目部署\内容工作区\.claude\skills"; Test-Path "C:\Users\11143\.claude\项目部署\开发工作区\.claude\skills"
```

Expected:
```text
True
True
```

- [ ] **Step 4: Verify the current global settings block still contains the phase-1 baseline**

Run:
```powershell
Get-Content "C:\Users\11143\.claude\settings.json" | Select-Object -Skip 473 -First 45
```

Expected:
```text
Contains enabledPlugins and the global skillOverrides block with many user-invocable-only entries.
```

- [ ] **Step 5: Commit the directory bootstrap state**

```bash
git add docs/superpowers/plans/2026-05-27-skill-workspace-partition-phase2.md
git commit -m "chore: add phase 2 skill partition plan"
```

### Task 2: Copy content skills into the content workspace and verify each copy

**Files:**
- Create: `C:/Users/11143/.claude/项目部署/内容工作区/.claude/skills/book-pdf/`
- Create: `C:/Users/11143/.claude/项目部署/内容工作区/.claude/skills/docx/`
- Create: `C:/Users/11143/.claude/项目部署/内容工作区/.claude/skills/docx-md/`
- Create: `C:/Users/11143/.claude/项目部署/内容工作区/.claude/skills/pdf/`
- Create: `C:/Users/11143/.claude/项目部署/内容工作区/.claude/skills/pdf-extraction/`
- Create: `C:/Users/11143/.claude/项目部署/内容工作区/.claude/skills/pptx/`
- Create: `C:/Users/11143/.claude/项目部署/内容工作区/.claude/skills/wechat-title-summary/`
- Create: `C:/Users/11143/.claude/项目部署/内容工作区/.claude/skills/rnascript-wechat/`
- Create: `C:/Users/11143/.claude/项目部署/内容工作区/.claude/skills/mrna-cmc-web-search/`
- Create: `C:/Users/11143/.claude/项目部署/内容工作区/.claude/skills/xlsx/`
- Create: `C:/Users/11143/.claude/项目部署/内容工作区/.claude/skills/huashu-design/`
- Create: `C:/Users/11143/.claude/项目部署/内容工作区/.claude/skills/yilanhui-source-retrieval/`
- Create: `C:/Users/11143/.claude/项目部署/内容工作区/.claude/skills/banner-design/`
- Create: `C:/Users/11143/.claude/项目部署/内容工作区/.claude/skills/brand/`
- Create: `C:/Users/11143/.claude/项目部署/内容工作区/.claude/skills/slides/`

- [ ] **Step 1: Verify every source content skill exists in the global skill directory**

Run:
```powershell
$skills = @('book-pdf','docx','docx-md','pdf','pdf-extraction','pptx','wechat-title-summary','rnascript-wechat','mrna-cmc-web-search','xlsx','huashu-design','yilanhui-source-retrieval','banner-design','brand','slides'); $skills | ForEach-Object { $p = "C:\Users\11143\.claude\skills\$_"; "$_=" + (Test-Path $p) }
```

Expected:
```text
Each listed skill prints True.
```

- [ ] **Step 2: Copy the content skill set into the content workspace**

Run:
```powershell
$skills = @('book-pdf','docx','docx-md','pdf','pdf-extraction','pptx','wechat-title-summary','rnascript-wechat','mrna-cmc-web-search','xlsx','huashu-design','yilanhui-source-retrieval','banner-design','brand','slides'); foreach ($name in $skills) { Copy-Item -Recurse -Force "C:\Users\11143\.claude\skills\$name" "C:\Users\11143\.claude\项目部署\内容工作区\.claude\skills\$name" }
```

Expected:
```text
(no output)
```

- [ ] **Step 3: Verify each copied content skill contains a SKILL.md file**

Run:
```powershell
$skills = @('book-pdf','docx','docx-md','pdf','pdf-extraction','pptx','wechat-title-summary','rnascript-wechat','mrna-cmc-web-search','xlsx','huashu-design','yilanhui-source-retrieval','banner-design','brand','slides'); $skills | ForEach-Object { $p = "C:\Users\11143\.claude\项目部署\内容工作区\.claude\skills\$_\SKILL.md"; "$_=" + (Test-Path $p) }
```

Expected:
```text
Each listed skill prints True.
```

- [ ] **Step 4: Spot-check the content workspace directory listing**

Run:
```powershell
Get-ChildItem "C:\Users\11143\.claude\项目部署\内容工作区\.claude\skills" -Directory | Select-Object -ExpandProperty Name
```

Expected:
```text
Contains the 15 content skill directory names copied in this task.
```

- [ ] **Step 5: Commit the content workspace skill import**

```bash
git add .
git commit -m "chore: import content skills into content workspace"
```

### Task 3: Copy development skills into the development workspace and verify each copy

**Files:**
- Create: `C:/Users/11143/.claude/项目部署/开发工作区/.claude/skills/frontend-design/`
- Create: `C:/Users/11143/.claude/项目部署/开发工作区/.claude/skills/ui-ux-pro-max/`
- Create: `C:/Users/11143/.claude/项目部署/开发工作区/.claude/skills/ui-styling/`
- Create: `C:/Users/11143/.claude/项目部署/开发工作区/.claude/skills/playwright-cli/`
- Create: `C:/Users/11143/.claude/项目部署/开发工作区/.claude/skills/design/`
- Create: `C:/Users/11143/.claude/项目部署/开发工作区/.claude/skills/design-system/`

- [ ] **Step 1: Verify every source development skill exists in the global skill directory**

Run:
```powershell
$skills = @('frontend-design','ui-ux-pro-max','ui-styling','playwright-cli','design','design-system'); $skills | ForEach-Object { $p = "C:\Users\11143\.claude\skills\$_"; "$_=" + (Test-Path $p) }
```

Expected:
```text
Each listed skill prints True.
```

- [ ] **Step 2: Copy the development skill set into the development workspace**

Run:
```powershell
$skills = @('frontend-design','ui-ux-pro-max','ui-styling','playwright-cli','design','design-system'); foreach ($name in $skills) { Copy-Item -Recurse -Force "C:\Users\11143\.claude\skills\$name" "C:\Users\11143\.claude\项目部署\开发工作区\.claude\skills\$name" }
```

Expected:
```text
(no output)
```

- [ ] **Step 3: Verify each copied development skill contains a SKILL.md file**

Run:
```powershell
$skills = @('frontend-design','ui-ux-pro-max','ui-styling','playwright-cli','design','design-system'); $skills | ForEach-Object { $p = "C:\Users\11143\.claude\项目部署\开发工作区\.claude\skills\$_\SKILL.md"; "$_=" + (Test-Path $p) }
```

Expected:
```text
Each listed skill prints True.
```

- [ ] **Step 4: Spot-check the development workspace directory listing**

Run:
```powershell
Get-ChildItem "C:\Users\11143\.claude\项目部署\开发工作区\.claude\skills" -Directory | Select-Object -ExpandProperty Name
```

Expected:
```text
Contains the 6 development skill directory names copied in this task.
```

- [ ] **Step 5: Commit the development workspace skill import**

```bash
git add .
git commit -m "chore: import development skills into dev workspace"
```

### Task 4: Delete migrated global skill directories while keeping the global baseline

**Files:**
- Delete: `C:/Users/11143/.claude/skills/book-pdf/`
- Delete: `C:/Users/11143/.claude/skills/docx/`
- Delete: `C:/Users/11143/.claude/skills/docx-md/`
- Delete: `C:/Users/11143/.claude/skills/pdf/`
- Delete: `C:/Users/11143/.claude/skills/pdf-extraction/`
- Delete: `C:/Users/11143/.claude/skills/pptx/`
- Delete: `C:/Users/11143/.claude/skills/wechat-title-summary/`
- Delete: `C:/Users/11143/.claude/skills/rnascript-wechat/`
- Delete: `C:/Users/11143/.claude/skills/mrna-cmc-web-search/`
- Delete: `C:/Users/11143/.claude/skills/xlsx/`
- Delete: `C:/Users/11143/.claude/skills/huashu-design/`
- Delete: `C:/Users/11143/.claude/skills/yilanhui-source-retrieval/`
- Delete: `C:/Users/11143/.claude/skills/banner-design/`
- Delete: `C:/Users/11143/.claude/skills/brand/`
- Delete: `C:/Users/11143/.claude/skills/slides/`
- Delete: `C:/Users/11143/.claude/skills/frontend-design/`
- Delete: `C:/Users/11143/.claude/skills/ui-ux-pro-max/`
- Delete: `C:/Users/11143/.claude/skills/ui-styling/`
- Delete: `C:/Users/11143/.claude/skills/playwright-cli/`
- Delete: `C:/Users/11143/.claude/skills/design/`
- Delete: `C:/Users/11143/.claude/skills/design-system/`
- Keep: `C:/Users/11143/.claude/skills/using-superpowers/`
- Keep: `C:/Users/11143/.claude/skills/brainstorming/`
- Keep: `C:/Users/11143/.claude/skills/find-skills/`
- Keep: `C:/Users/11143/.claude/skills/skills/`
- Keep: `C:/Users/11143/.claude/skills/update-config/`
- Keep: `C:/Users/11143/.claude/skills/web-access/`

- [ ] **Step 1: Re-verify one content copy and one development copy before deletion**

Run:
```powershell
Test-Path "C:\Users\11143\.claude\项目部署\内容工作区\.claude\skills\docx\SKILL.md"; Test-Path "C:\Users\11143\.claude\项目部署\开发工作区\.claude\skills\frontend-design\SKILL.md"
```

Expected:
```text
True
True
```

- [ ] **Step 2: Delete only the migrated global skill directories**

Run:
```powershell
$skills = @('book-pdf','docx','docx-md','pdf','pdf-extraction','pptx','wechat-title-summary','rnascript-wechat','mrna-cmc-web-search','xlsx','huashu-design','yilanhui-source-retrieval','banner-design','brand','slides','frontend-design','ui-ux-pro-max','ui-styling','playwright-cli','design','design-system'); foreach ($name in $skills) { Remove-Item -LiteralPath "C:\Users\11143\.claude\skills\$name" -Recurse -Force -Confirm:$false }
```

Expected:
```text
(no output)
```

- [ ] **Step 3: Verify the deleted global directories are gone**

Run:
```powershell
$skills = @('book-pdf','docx','docx-md','pdf','pdf-extraction','pptx','wechat-title-summary','rnascript-wechat','mrna-cmc-web-search','xlsx','huashu-design','yilanhui-source-retrieval','banner-design','brand','slides','frontend-design','ui-ux-pro-max','ui-styling','playwright-cli','design','design-system'); $skills | ForEach-Object { $p = "C:\Users\11143\.claude\skills\$_"; "$_=" + (Test-Path $p) }
```

Expected:
```text
Each listed skill prints False.
```

- [ ] **Step 4: Verify one baseline global skill still exists**

Run:
```powershell
Test-Path "C:\Users\11143\.claude\skills\using-superpowers\SKILL.md"; Test-Path "C:\Users\11143\.claude\skills\web-access\SKILL.md"
```

Expected:
```text
True
True
```

- [ ] **Step 5: Commit the global skill cleanup**

```bash
git add .
git commit -m "chore: remove migrated skills from global directory"
```

### Task 5: Trim the global settings noise and keep workspace settings aligned

**Files:**
- Modify: `C:/Users/11143/.claude/settings.json:478-515`
- Verify: `C:/Users/11143/.claude/项目部署/内容工作区/.claude/settings.json:16-42`
- Verify: `C:/Users/11143/.claude/项目部署/开发工作区/.claude/settings.json:23-45`

- [ ] **Step 1: Replace the global skillOverrides block with only the non-migrated entries that still need hiding**

Replace this block in `C:\Users\11143\.claude\settings.json`:
```json
  "skillOverrides": {
    "algorithmic-art": "off",
    "babysit": "user-invocable-only",
    "banner-design": "user-invocable-only",
    "book-pdf": "user-invocable-only",
    "brand": "user-invocable-only",
    "build-mcp-server": "user-invocable-only",
    "design": "user-invocable-only",
    "design-system": "user-invocable-only",
    "docx": "user-invocable-only",
    "docx-md": "user-invocable-only",
    "do": "user-invocable-only",
    "frontend-design": "user-invocable-only",
    "gh-skill-installer": "user-invocable-only",
    "how-it-works": "user-invocable-only",
    "huashu-design": "user-invocable-only",
    "karpathy-guidelines": "user-invocable-only",
    "knowledge-agent": "user-invocable-only",
    "learn-codebase": "user-invocable-only",
    "make-plan": "user-invocable-only",
    "mem-search": "user-invocable-only",
    "mrna-cmc-web-search": "user-invocable-only",
    "pathfinder": "user-invocable-only",
    "pdf": "user-invocable-only",
    "pdf-extraction": "user-invocable-only",
    "playwright-cli": "user-invocable-only",
    "pptx": "user-invocable-only",
    "rnascript-wechat": "user-invocable-only",
    "self-improving-agent": "user-invocable-only",
    "slides": "user-invocable-only",
    "smart-explore": "user-invocable-only",
    "timeline-report": "user-invocable-only",
    "ui-styling": "user-invocable-only",
    "ui-ux-pro-max": "user-invocable-only",
    "version-bump": "user-invocable-only",
    "wechat-title-summary": "user-invocable-only",
    "xlsx": "user-invocable-only",
    "yilanhui-source-retrieval": "user-invocable-only"
  }
```
with:
```json
  "skillOverrides": {
    "algorithmic-art": "off",
    "babysit": "user-invocable-only",
    "build-mcp-server": "user-invocable-only",
    "do": "user-invocable-only",
    "gh-skill-installer": "user-invocable-only",
    "how-it-works": "user-invocable-only",
    "karpathy-guidelines": "user-invocable-only",
    "knowledge-agent": "user-invocable-only",
    "learn-codebase": "user-invocable-only",
    "make-plan": "user-invocable-only",
    "mem-search": "user-invocable-only",
    "pathfinder": "user-invocable-only",
    "self-improving-agent": "user-invocable-only",
    "smart-explore": "user-invocable-only",
    "timeline-report": "user-invocable-only",
    "version-bump": "user-invocable-only"
  }
```

- [ ] **Step 2: Verify the global settings file still contains enabledPlugins and the shortened skillOverrides block**

Run:
```powershell
Get-Content "C:\Users\11143\.claude\settings.json" | Select-Object -Skip 473 -First 30
```

Expected:
```text
Shows enabledPlugins plus the shortened 16-entry skillOverrides block.
```

- [ ] **Step 3: Verify the content workspace settings still expose content skills and hide development ones**

Run:
```powershell
Get-Content "C:\Users\11143\.claude\项目部署\内容工作区\.claude\settings.json"
```

Expected:
```text
Contains docx/pdf/pptx/wechat-title-summary/rnascript-wechat as on, and frontend-design/playwright-cli/ui-ux-pro-max as off.
```

- [ ] **Step 4: Verify the development workspace settings still expose development skills and hide content ones**

Run:
```powershell
Get-Content "C:\Users\11143\.claude\项目部署\开发工作区\.claude\settings.json"
```

Expected:
```text
Contains frontend-design/playwright-cli/design/design-system/ui-styling/ui-ux-pro-max as on, and docx/pdf/pptx/wechat-title-summary as off.
```

- [ ] **Step 5: Commit the settings cleanup**

```bash
git add .
git commit -m "chore: trim global skill overrides after workspace migration"
```

### Task 6: Produce the final migration inventory and verify the end state

**Files:**
- Verify: `C:/Users/11143/.claude/skills/`
- Verify: `C:/Users/11143/.claude/项目部署/内容工作区/.claude/skills/`
- Verify: `C:/Users/11143/.claude/项目部署/开发工作区/.claude/skills/`
- Verify: `C:/Users/11143/.claude/settings.json`
- Verify: `C:/Users/11143/.claude/项目部署/内容工作区/.claude/settings.json`
- Verify: `C:/Users/11143/.claude/项目部署/开发工作区/.claude/settings.json`

- [ ] **Step 1: List the remaining global skill directories**

Run:
```powershell
Get-ChildItem "C:\Users\11143\.claude\skills" -Directory | Select-Object -ExpandProperty Name
```

Expected:
```text
Does not include the 21 migrated skills, but still includes the global baseline skills and the non-migrated general-purpose skills.
```

- [ ] **Step 2: List the content workspace skill directories**

Run:
```powershell
Get-ChildItem "C:\Users\11143\.claude\项目部署\内容工作区\.claude\skills" -Directory | Select-Object -ExpandProperty Name
```

Expected:
```text
Contains exactly the 15 migrated content skills.
```

- [ ] **Step 3: List the development workspace skill directories**

Run:
```powershell
Get-ChildItem "C:\Users\11143\.claude\项目部署\开发工作区\.claude\skills" -Directory | Select-Object -ExpandProperty Name
```

Expected:
```text
Contains exactly the 6 migrated development skills.
```

- [ ] **Step 4: Write the final human-readable inventory into the session response**

```text
Global kept:
using-superpowers, brainstorming, find-skills, skills, update-config, web-access, plus non-migrated general-purpose skills.

Content workspace:
book-pdf, docx, docx-md, pdf, pdf-extraction, pptx, wechat-title-summary, rnascript-wechat, mrna-cmc-web-search, xlsx, huashu-design, yilanhui-source-retrieval, banner-design, brand, slides.

Development workspace:
frontend-design, ui-ux-pro-max, ui-styling, playwright-cli, design, design-system.
```

- [ ] **Step 5: Commit the final verified migration state**

```bash
git add .
git commit -m "chore: finish phase 2 workspace skill partition"
```

## Spec coverage self-review

- Global baseline preservation is covered by Task 4 step 4 and Task 6 step 1.
- Content-skill physical migration is covered by Task 2.
- Development-skill physical migration is covered by Task 3.
- Copy-verify-delete sequencing from the spec is covered by Tasks 2, 3, and 4.
- Global settings cleanup is covered by Task 5 step 1.
- Workspace settings alignment is covered by Task 5 steps 3 and 4.
- Final migration inventory and end-state verification are covered by Task 6.

## Placeholder self-review

- No `TBD`, `TODO`, or deferred implementation placeholders remain.
- All steps contain exact commands, exact paths, and explicit expected outcomes.
- The migration skill lists are repeated where needed instead of referencing another task.

## Type and naming consistency self-review

- Content workspace path is consistently `C:\Users\11143\.claude\项目部署\内容工作区\.claude\skills`.
- Development workspace path is consistently `C:\Users\11143\.claude\项目部署\开发工作区\.claude\skills`.
- The migrated content skill list and migrated development skill list are consistent across copy, verify, delete, and final inventory tasks.
- The shortened global `skillOverrides` block matches the declared “not migrated this round” strategy from the approved spec.
