# Status line Context N/A 设计

- 日期：2026-05-27
- 范围：仅修改全局 status line 脚本输出文案，不改 settings 配置，不改刷新频率，不改字段读取逻辑。

## 背景

当前 Claude Code 的 status line 通过全局配置调用 `C:\Users\11143\.claude\statusline-context.js`，脚本会尝试读取宿主提供的上下文占比字段并输出模型名与上下文状态。

现状问题不是脚本无法运行，而是当宿主没有提供可用的 context percentage 时，脚本当前显示为 `Context n/a`。用户希望统一改成更清晰的 `Context N/A`，同时继续保留当前模型名与百分比展示。

## 目标

在不扩大改动范围的前提下，把 status line 输出统一为以下两种形式：

- 有百分比：`<模型名> | Context 37.2%`
- 无百分比：`<模型名> | Context N/A`

## 非目标

本次不处理以下内容：

- 不修改 `settings.json` 中的 `statusLine` 配置
- 不调整 `refreshInterval`
- 不增加更多诊断文案
- 不排查 VS Code 扩展为什么偶发不渲染 status line
- 不改变现有兼容字段名的读取逻辑

## 方案选择

### 方案 1：最小改动，直接改缺省文案（推荐）

仅修改 `statusline-context.js` 中缺失值时的显示文本：

- 把百分比缺失时的 `n/a` 改为 `N/A`
- 保留 JSON 解析、模型名解析、上下文字段兼容逻辑不变

**优点：** 改动最小，风险最低，完全匹配本次诉求。

**缺点：** 不能帮助区分“宿主没传字段”和“解析失败”等更细原因。

### 方案 2：增加诊断型输出

在缺失时区分显示诸如 `host missing context_window`、`invalid status payload` 等文案。

**优点：** 更利于排查问题。

**缺点：** 超出用户当前要求，也会让 status line 更长。

### 方案 3：同时调整脚本与配置

在脚本文案之外，再调整 `statusLine` 配置，例如刷新频率、padding 或展示格式。

**优点：** 可以顺手优化显示体验。

**缺点：** 超出当前需求，增加不必要变更面。

## 决策

采用方案 1。

## 具体改动

修改文件：`C:\Users\11143\.claude\statusline-context.js`

保留以下逻辑不变：

- 从 stdin 读取 JSON
- 解析模型名
- 从 `context_window` / `context` 中兼容读取百分比字段
- 百分比为数字时格式化为一位小数

仅修改这一处行为：

- 当没有拿到有效百分比数字时，输出 `Context N/A`

## 验证方式

本轮验证以静态脚本行为为主：

1. 脚本读取到数字百分比时，应输出 `<模型名> | Context xx.x%`
2. 脚本读取不到有效百分比时，应输出 `<模型名> | Context N/A`
3. 不修改 settings，因此现有 status line 调用路径保持不变

## 风险与回退

风险很低，因为：

- 仅改一处展示文案
- 不改配置入口
- 不改字段解析逻辑

若不满意，可直接把文案改回原值，回退成本极低。
