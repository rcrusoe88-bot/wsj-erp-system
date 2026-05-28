# Materia ERP 数据模型说明

## 1. 文档目标

本文档只定义阶段 3 的数据库实体模型边界，不写真实 SQL 和 Prisma schema。目标是让阶段 4 后端实现时，能够直接依据本文档把表结构和关系落下来，而不用重新讨论主表边界。

## 2. P0 核心实体

### 2.1 users
- 作用：登录身份与单角色 RBAC 基础表
- 核心字段：`username`、`password_hash`、`full_name`、`role`、`status`、`last_login_at`
- 说明：每个用户只有一个 `role`，固定为 `admin / reviewer / operator`

### 2.2 materials
- 作用：物料主数据表
- 核心字段：`material_code`、`material_name`、`material_category`、`specification`、`unit`、`batch_managed`、`expiry_managed`、`storage_condition`、`status`
- 说明：只存主数据，不存动态库存

### 2.3 warehouses
- 作用：仓库主数据表
- 核心字段：`warehouse_code`、`warehouse_name`、`location`、`status`
- 说明：只定义仓库，不存汇总库存值

### 2.4 stock_in_orders
- 作用：入库单主表
- 核心字段：`order_no`、`stock_in_type`、`status`、`applicant_id`、`warehouse_id`、`source_reference`、`submitted_at`、`approved_at`、`rejected_at`
- 说明：只存单头，不存逐行物料

### 2.5 stock_in_order_items
- 作用：入库单明细表
- 核心字段：`stock_in_order_id`、`material_id`、`lot_number`、`quantity`、`unit`、`production_date`、`expiry_date`
- 说明：生产入库的上游批号与消耗数量关联由追溯链承接，不把审批结果写进明细表

### 2.6 stock_out_orders
- 作用：出库单主表
- 核心字段：`order_no`、`stock_out_type`、`status`、`applicant_id`、`warehouse_id`、`destination`、`submitted_at`、`approved_at`、`rejected_at`
- 说明：`destination` 统一承载用途、报废原因或调拨去向

### 2.7 stock_out_order_items
- 作用：出库单明细表
- 核心字段：`stock_out_order_id`、`material_id`、`lot_number`、`quantity`、`unit`
- 说明：调拨仍然只是 `transfer` 类型的出库单，不单独拆调拨表

### 2.8 approval_records
- 作用：审批留痕表
- 核心字段：`business_type`、`business_id`、`review_step`、`reviewer_id`、`decision`、`decision_reason`、`reviewed_at`
- 说明：采用多态关联承接入库、出库、盘点调整审批

### 2.9 inventory_balances
- 作用：库存当前余额表
- 核心字段：`material_id`、`warehouse_id`、`lot_number`、`quantity_on_hand`、`quantity_available`、`quantity_locked`、`production_date`、`expiry_date`、`expiry_status`、`stock_status`
- 说明：唯一粒度固定为 `material + warehouse + lot_number`

### 2.10 inventory_transactions
- 作用：库存历史流水表
- 核心字段：`material_id`、`warehouse_id`、`lot_number`、`transaction_type`、`direction`、`quantity`、`quantity_before`、`quantity_after`、`source_type`、`source_id`、`operated_by`、`operated_at`
- 说明：所有真实库存变化都要能追到这里

### 2.11 batch_trace_links
- 作用：批次追溯关系表
- 核心字段：`upstream_material_id`、`upstream_lot_number`、`downstream_material_id`、`downstream_lot_number`、`consumed_quantity`、`produced_quantity`、`reference_type`、`reference_id`
- 说明：表达原料 / 中间体 / 成品的上下游批次关系，不承载库存余额

## 3. P1 预留实体

### 3.1 stock_count_tasks
- 作用：盘点任务主表
- 核心字段：`task_no`、`warehouse_id`、`task_scope`、`status`、`applicant_id`

### 3.2 stock_count_items
- 作用：盘点明细与差异表
- 核心字段：`stock_count_task_id`、`inventory_balance_id`、`system_quantity`、`counted_quantity`、`variance_quantity`、`variance_reason`

### 3.3 audit_logs
- 作用：系统审计日志预留表
- 核心字段：`action_type`、`target_type`、`target_id`、`operator_id`、`result`、`operated_at`、`summary`

## 4. 主从关系

- `stock_in_orders` 1 -> n `stock_in_order_items`
- `stock_out_orders` 1 -> n `stock_out_order_items`
- `stock_count_tasks` 1 -> n `stock_count_items`
- `materials` / `warehouses` 是库存、单据、追溯链的基础主数据
- `inventory_balances` 是当前结果表，`inventory_transactions` 是历史审计表

## 5. 边界原则

1. 主数据不存动态库存。
2. 单据主表不存逐行明细。
3. 审批表只存审批动作，不存库存结果。
4. 余额表只存当前值，不存历史轨迹。
5. 追溯关系单独成层，不从库存表反推。
6. 调拨在 MVP 只保留 `transfer` 出库，不扩展目标仓签收闭环。
