# 第二阶段设计：按工作区物理迁移 Claude Code skills

## 目标

在已经完成第一阶段 `skillOverrides` 分区的基础上，继续进行第二阶段优化：

1. 将全局 `~/.claude/skills/` 中的内容类与开发类专项 skills 从全局目录移出。
2. 将这些 skills 按用途分别迁移到对应工作区的 `.claude/skills/` 目录。
3. 仅保留少量基础流程类 skills 在全局，使 Claude Code 在任意目录下仍能正常启动、发现技能、进行基础调度。
4. 进一步减少每次对话自动注入的全局 skill 列表，从而降低 token 消耗。

本次设计遵循用户已确认的边界：

- 采用“极致瘦身”策略。
- 基础流程类 skills 继续全局保留。
- 内容类与开发类专项 skills 不再全局保留。

## 设计原则

### 1. 全局只保留基础流程能力

全局 `~/.claude/skills/` 只保留跨目录、跨项目都需要的基础能力，例如：

- `using-superpowers`
- `brainstorming`
- `find-skills`
- `skills`
- `update-config`
- `web-access`

如有必要，可保留极少数真正跨项目高频的通用能力，但本轮不主动扩充。

### 2. 专项 skill 进入对应工作区

内容生产链路使用的 skills 放入：

- `C:\Users\11143\.claude\项目部署\内容工作区\.claude\skills\`

开发与验证链路使用的 skills 放入：

- `C:\Users\11143\.claude\项目部署\开发工作区\.claude\skills\`

### 3. settings 继续做第二层筛选

物理迁移并不替代 `skillOverrides`，而是与其配合：

- 全局 settings 负责缩小默认可见 skill 面。
- 工作区 settings 负责在本工作区内进一步声明哪些 skill 应打开、关闭或保留兜底规则。

### 4. 执行方式以“复制 → 校验 → 删除”替代“直接移动”

为了降低误操作风险，不直接从全局目录硬切：

1. 先复制到目标工作区。
2. 校验目标目录结构完整，至少包含 `SKILL.md`。
3. 再删除全局副本。
4. 最后清理全局 settings 中已无必要的 `skillOverrides`。

## 迁移分组

## A. 全局保留 skill

以下 skills 保留在全局目录，不迁移：

- `using-superpowers`
- `brainstorming`
- `find-skills`
- `skills`
- `update-config`
- `web-access`

这些技能承担基础流程、技能发现、配置调整和联网访问能力，适合作为全局最小基线。

## B. 迁移到内容工作区的 skills

建议迁移至内容工作区：

- `book-pdf`
- `docx`
- `docx-md`
- `pdf`
- `pdf-extraction`
- `pptx`
- `wechat-title-summary`
- `rnascript-wechat`
- `mrna-cmc-web-search`
- `xlsx`
- `huashu-design`
- `yilanhui-source-retrieval`
- `banner-design`
- `brand`
- `slides`

这些 skills 主要服务于文档交付、公众号内容生产、信息检索和内容包装。

## C. 迁移到开发工作区的 skills

建议迁移至开发工作区：

- `frontend-design`
- `ui-ux-pro-max`
- `ui-styling`
- `playwright-cli`
- `design`
- `design-system`

这些 skills 主要服务于界面设计、前端开发、浏览器验证和开发交互流程。

## D. 本轮不迁移或延后处理的 skills

以下 skills 暂不纳入本轮物理迁移：

- `algorithmic-art`
- `babysit`
- `build-mcp-server`
- `do`
- `how-it-works`
- `karpathy-guidelines`
- `knowledge-agent`
- `learn-codebase`
- `make-plan`
- `mem-search`
- `pathfinder`
- `self-improving-agent`
- `smart-explore`
- `timeline-report`
- `version-bump`

原因：

- 有的偏底层方法论或工程流程，未明确归属到内容或开发单一工作区。
- 有的当前已通过全局 `skillOverrides` 隐藏，短期内并不是主要 token 来源。
- 本轮优先处理最影响上下文体积、且最容易按工作区归类的专项 skill。

## settings 调整方案

### 1. 全局 settings

全局 `~/.claude/settings.json` 需要做两类调整：

1. 保留基础插件启用配置，例如：
   - `superpowers@claude-plugins-official`
   - `frontend-design@claude-plugins-official` 是否继续保留，需要根据插件是否仅提供 skill 决定。
2. 清理已经被物理迁移出全局目录的那些 skill 对应的 `skillOverrides` 条目，避免留下无效配置噪音。

预期结果：

- 全局 skill 列表更短。
- 全局 settings 更接近“最小基线”。

### 2. 内容工作区 settings

内容工作区 `.claude/settings.json`：

- 保留现有 `enabledPlugins` 与 `skillOverrides`。
- 按已迁入的内容类 skills 继续显式设置为 `on`。
- 明确关闭开发链路相关项，例如 `frontend-design`、`playwright-cli`、`ui-ux-pro-max`。

### 3. 开发工作区 settings

开发工作区 `.claude/settings.json`：

- 保留现有 `skillOverrides`。
- 按已迁入的开发类 skills 继续显式设置为 `on`。
- 明确关闭内容链路相关项，例如 `docx`、`pdf`、`wechat-title-summary` 等。

## 执行步骤

1. 创建以下目录（若不存在）：
   - `C:\Users\11143\.claude\项目部署\内容工作区\.claude\skills\`
   - `C:\Users\11143\.claude\项目部署\开发工作区\.claude\skills\`
2. 将内容类 skills 从全局复制到内容工作区。
3. 将开发类 skills 从全局复制到开发工作区。
4. 校验每个迁入目录都包含 `SKILL.md`。
5. 删除全局中已迁移的 skill 目录。
6. 更新全局 `~/.claude/settings.json`，移除对应 `skillOverrides` 噪音项。
7. 保留并必要时微调两个工作区的 `.claude/settings.json`。
8. 输出迁移清单，明确：
   - 全局保留哪些
   - 内容工作区承载哪些
   - 开发工作区承载哪些

## 风险与控制

### 风险 1：误删全局基础 skill

影响：在任意目录启动 Claude Code 时，基础调度能力下降。

控制：

- 对基础 skill 建立明确白名单。
- 删除阶段只针对预定义迁移集合执行。

### 风险 2：某 skill 跨工作区复用

影响：进入某个非主工作区时 skill 不可用。

控制：

- 本轮按“主用途优先”归类。
- 若后续发现确有跨工作区高频使用，再考虑双放或回退为全局保留。

### 风险 3：settings 与目录不一致

影响：工作区声明了某个 skill 为 `on`，但目录中并不存在对应 skill。

控制：

- 先复制后删除。
- 删除前做目录级校验。
- 迁移完成后重新读取 3 份 settings 进行核对。

### 风险 4：当前会话不立即反映最终 skill 列表

影响：你可能在当前会话里仍看到旧的加载结果。

控制：

- 明确要求迁移后重新进入对应工作区验证。
- 将“新开会话验证”视为最终生效校验步骤。

## 成功标准

本轮完成后，满足以下标准：

1. 全局 `~/.claude/skills/` 中仅剩基础流程类 skills 与本轮暂不处理的其他通用项。
2. 内容类专项 skills 仅存在于内容工作区 `.claude/skills/`。
3. 开发类专项 skills 仅存在于开发工作区 `.claude/skills/`。
4. 全局与工作区 settings 保持一致，没有明显无效项堆积。
5. 未来从对应工作区启动 Claude Code 时，只加载与该工作区相关的 skills，从而减少默认上下文负担。

## 推荐结论

执行方案采用“方案 B：复制到工作区 → 校验 → 删除全局副本 → 清理 settings”。

这是本轮最稳妥的方案。它保留了极致瘦身目标，又避免了一步硬切造成误删或目录失配。后续如果验证稳定，可以再做第三阶段清理，把本轮暂未处理但低频的全局 skills 继续归档或进一步分区。