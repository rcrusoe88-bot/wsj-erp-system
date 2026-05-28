# Materia ERP 迁移实施提纲

## 1. 文档目标

本文档不写真实 DDL，只定义阶段 4 把数据库设计转成真实 PostgreSQL / Prisma 结构时的落地顺序，避免后端实现时无序建表。

## 2. 推荐迁移顺序

### 第一批：基础主表
1. `users`
2. `materials`
3. `warehouses`

### 第二批：业务主表与明细表
4. `stock_in_orders`
5. `stock_in_order_items`
6. `stock_out_orders`
7. `stock_out_order_items`

### 第三批：库存与审批审计表
8. `approval_records`
9. `inventory_balances`
10. `inventory_transactions`

### 第四批：追溯与 P1 预留表
11. `batch_trace_links`
12. `stock_count_tasks`
13. `stock_count_items`
14. `audit_logs`

## 3. 实施原则

1. 先落基础主表，再落业务主表和明细表。
2. `inventory_balances` 必须在业务主表存在后再建唯一键与外键。
3. `inventory_transactions` 与 `approval_records` 要等业务主表命名稳定后再接。
4. 多态关联字段先用类型 + ID，不在迁移期强行做跨表硬外键。
5. 所有状态字段在第一版就锁定枚举集合，避免后端阶段再次改名。

## 4. 阶段 4 落地提醒

- 先把 schema 与 migration 拆开做，不要一边改模型一边写业务逻辑。
- 先验证表结构和约束，再写库存事务。
- 先跑空库迁移，再补种子用户和基础主数据。
- 调拨仍然只按 `transfer` 出库落地，不要提前扩目标仓签收闭环。
