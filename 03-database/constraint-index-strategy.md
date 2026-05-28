# Materia ERP 约束、索引与事务策略

## 1. 文档目标

本文档定义阶段 3 的数据库规则基线：哪些约束要下沉到数据库层，哪些校验保留在事务逻辑里，哪些查询路径需要索引，库存变更事务如何收口。

## 2. 唯一约束

- `users.username` 唯一
- `materials.material_code` 唯一
- `warehouses.warehouse_code` 唯一
- `stock_in_orders.order_no` 唯一
- `stock_out_orders.order_no` 唯一
- `stock_count_tasks.task_no` 唯一
- `inventory_balances(material_id, warehouse_id, lot_number)` 唯一

## 3. 非空与数值约束

### 非空字段
- 所有主键
- 所有关键外键
- 所有状态字段
- 所有数量字段
- 所有出入库明细 `lot_number`
- 所有库存余额 `lot_number`
- 所有追溯关系中的上下游 `lot_number`

具体列名清单在阶段 4 落 Prisma 模型与 DDL 时逐字段展开，本阶段只定义 NOT NULL 的策略边界。

### 数值约束
- 数量统一使用 `NUMERIC(18,6)`
- 金额若后续进入系统，统一使用 `NUMERIC(18,4)`
- 出入库数量必须 `> 0`
- `quantity_on_hand >= 0`
- `quantity_available >= 0`
- `quantity_locked >= 0`
- `variance_quantity` 可为负值

### 日期约束
- 若 `production_date` 和 `expiry_date` 同时存在，则 `expiry_date >= production_date`

## 4. 外键策略

### 强外键
- 明细表 -> 主表
- 业务表 -> `users`
- 业务表 -> `materials`
- 业务表 -> `warehouses`
- `inventory_balances` -> `materials`
- `inventory_balances` -> `warehouses`
- `stock_count_items` -> `stock_count_tasks`
- `stock_count_items` -> `inventory_balances`
- `batch_trace_links.upstream_material_id` -> `materials`
- `batch_trace_links.downstream_material_id` -> `materials`

**ON DELETE 约定**：明细表对主表的外键使用 `ON DELETE CASCADE`；其余强外键默认使用 `ON DELETE RESTRICT`，禁止级联删除核心业务数据。

### 多态关联
- `approval_records.business_type + business_id`
- `inventory_transactions.source_type + source_id`
- `audit_logs.target_type + target_id`

说明：多态关联不做数据库硬外键，由应用层保证合法性。

## 5. 索引策略

### 库存查询
- `inventory_balances(material_id, warehouse_id, lot_number)` 唯一索引
- `inventory_balances(material_id)`
- `inventory_balances(warehouse_id)`
- `inventory_balances(expiry_status, expiry_date)`

### 单据列表
- `stock_in_orders(status, submitted_at DESC)`
- `stock_out_orders(status, submitted_at DESC)`
- `stock_in_orders(applicant_id, created_at DESC)`
- `stock_out_orders(applicant_id, created_at DESC)`
- `stock_in_order_items(stock_in_order_id)`
- `stock_out_order_items(stock_out_order_id)`

### 审批中心
- `approval_records(business_type, business_id)`
- `approval_records(reviewer_id, reviewed_at DESC)`

### 库存流水
- `inventory_transactions(material_id, warehouse_id, lot_number, operated_at DESC)`
- `inventory_transactions(source_type, source_id)`

### 追溯查询
- `batch_trace_links(upstream_material_id, upstream_lot_number)`
- `batch_trace_links(downstream_material_id, downstream_lot_number)`

## 6. 事务边界

### 提交申请
- 只写单据主表和明细表
- 单据状态进入 `pending_review`
- 不改库存
- 不写库存流水

### 驳回审批
- 写 `approval_records`
- 更新单据状态为 `rejected`
- 不改库存
- 不写库存流水

### 入库审批通过
1. 开启事务
2. 锁定或创建目标库存行
3. 增加 `quantity_on_hand` 与 `quantity_available`
4. 更新效期状态和最近变更时间
5. 写入 `inventory_transactions`
6. 写入 `approval_records`
7. 更新单据状态为 `approved`

### 出库审批通过
1. 开启事务
2. `SELECT ... FOR UPDATE` 锁定目标库存行
3. 再次校验 `quantity_available >= quantity`
4. 再次校验物料未过期
5. 扣减 `quantity_on_hand` 与 `quantity_available`
6. 更新最近变更时间
7. 写入 `inventory_transactions`
8. 写入 `approval_records`
9. 更新单据状态为 `approved`

### 盘点（P1 预留）
- 无差异：直接 `completed`
- 有差异：进入审批流程
- 审批通过后才改库存并写流水

## 7. 并发原则

- 库存变更事务按 PostgreSQL `SERIALIZABLE` 设计
- 出库审批前必须锁定库存行并再次校验
- 不允许依赖前端缓存库存结论直接放行
