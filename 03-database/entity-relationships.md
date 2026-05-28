# Materia ERP 实体关系说明

## 1. 文档目标

本文档用非 SQL 方式解释阶段 3 的核心实体如何关联，方便产品、后端、前端在同一口径上理解系统结构。

## 2. 五层关系图思路

以下内容是“五层分层说明”，用于帮助理解关系结构，不是图示。

### 身份与权限层
- `users` 负责登录与角色权限；每个用户固定绑定一个角色（`admin` / `reviewer` / `operator`）
- 所有业务单据中的申请人、审核人、创建人、更新人都从 `users` 引用

### 主数据层
- `materials` 定义物料主数据口径
- `warehouses` 定义仓库主数据口径
- 所有库存余额、库存流水和业务单据都依赖这两张主数据表

### 业务单据层
- `stock_in_orders` / `stock_in_order_items` 承载入库业务单据
- `stock_out_orders` / `stock_out_order_items` 承载出库业务单据
- 业务单据先提交审核，审批通过后才影响库存

### 审批与库存层
- `approval_records` 记录审批记录
- `inventory_balances` 记录当前库存余额
- `inventory_transactions` 记录历史库存流水
- 库存余额回答“现在剩多少”，库存流水回答“为什么会变成这样”

### 追溯与预留层
- `batch_trace_links` 记录批次追溯关系
- `stock_count_tasks` / `stock_count_items` 为阶段 3 的盘点预留
- `audit_logs` 为阶段 3 的系统审计留痕预留

## 3. 关键业务关系

### 入库链路
`users (申请人)` -> `stock_in_orders` -> `stock_in_order_items` -> `approval_records` -> `inventory_balances` / `inventory_transactions`

### 出库链路
`users (申请人)` -> `stock_out_orders` -> `stock_out_order_items` -> `approval_records` -> `inventory_balances` / `inventory_transactions`

### 追溯链路
生产入库形成的产出批次，先落在对应的 `stock_in_order_items` 记录中；这些产出批次再通过 `batch_trace_links` 连接到上游原料批次或中间体批次。

## 4. 关系理解原则

1. `users` 管身份与角色权限，不管库存。
2. `materials` / `warehouses` 管主数据，不管审批记录。
3. `approval_records` 管审批记录，不直接代替业务单据状态。
4. `inventory_balances` 管当前库存余额，`inventory_transactions` 管历史库存流水。
5. `batch_trace_links` 负责追溯关系，不负责库存计算。
6. 调拨关系仍归在出库链路内理解，不扩展独立的目标仓签收关系。
