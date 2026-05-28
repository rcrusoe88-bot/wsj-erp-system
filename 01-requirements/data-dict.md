# Materia ERP 数据字典

> 说明：以下为 MVP 阶段核心业务实体的数据字典建议，字段命名统一采用英文 snake_case，类型以 PostgreSQL 为参考。

## 1. 物料（materials）

| 字段名 | 中文名 | 数据类型建议 | 必填 | 约束/说明 |
| --- | --- | --- | --- | --- |
| id | 主键 | UUID | 是 | 系统主键 |
| material_code | 物料编码 | VARCHAR(64) | 是 | 手动填写，唯一 |
| material_name | 物料名称 | VARCHAR(255) | 是 | |
| material_category | 物料类别 | VARCHAR(50) | 是 | 原辅料/脂质原料/中间体/成品/实验耗材/仪器设备 |
| specification | 规格 | VARCHAR(255) | 否 | |
| unit | 单位 | VARCHAR(32) | 是 | 如 g、mg、mL、vial |
| batch_managed | 是否批次管理 | BOOLEAN | 是 | 默认 true |
| expiry_managed | 是否效期管理 | BOOLEAN | 是 | 对酶、脂质等通常为 true |
| storage_condition | 存储条件 | VARCHAR(255) | 否 | 如 2-8℃、-20℃ |
| status | 状态 | VARCHAR(20) | 是 | active/inactive |
| remark | 备注 | TEXT | 否 | |
| created_at | 创建时间 | TIMESTAMP | 是 | |
| created_by | 创建人 | UUID | 是 | 关联 users.id |
| updated_at | 更新时间 | TIMESTAMP | 是 | |
| updated_by | 更新人 | UUID | 是 | 关联 users.id |

## 2. 仓库（warehouses）

| 字段名 | 中文名 | 数据类型建议 | 必填 | 约束/说明 |
| --- | --- | --- | --- | --- |
| id | 主键 | UUID | 是 | |
| warehouse_code | 仓库编码 | VARCHAR(64) | 是 | 唯一 |
| warehouse_name | 仓库名称 | VARCHAR(255) | 是 | |
| location | 位置 | VARCHAR(255) | 否 | |
| status | 状态 | VARCHAR(20) | 是 | active/inactive |
| remark | 备注 | TEXT | 否 | |
| created_at | 创建时间 | TIMESTAMP | 是 | |
| created_by | 创建人 | UUID | 是 | |
| updated_at | 更新时间 | TIMESTAMP | 是 | |
| updated_by | 更新人 | UUID | 是 | |

## 3. 库存余额（inventory_balances）

| 字段名 | 中文名 | 数据类型建议 | 必填 | 约束/说明 |
| --- | --- | --- | --- | --- |
| id | 主键 | UUID | 是 | |
| material_id | 物料ID | UUID | 是 | 关联 materials.id |
| warehouse_id | 仓库ID | UUID | 是 | 关联 warehouses.id |
| lot_number | 批号 | VARCHAR(128) | 是 | 不可为空 |
| quantity_on_hand | 账面数量 | NUMERIC(18,6) | 是 | 当前库存总量 |
| quantity_available | 可用数量 | NUMERIC(18,6) | 是 | 可用于出库的数量 |
| quantity_locked | 锁定数量 | NUMERIC(18,6) | 是 | 可选，默认 0 |
| production_date | 生产日期 | DATE | 否 | 效期物料建议必填 |
| expiry_date | 有效期至 | DATE | 否 | 过期后不可出库 |
| expiry_status | 效期状态 | VARCHAR(20) | 是 | normal/warning/expired |
| stock_status | 库存状态 | VARCHAR(20) | 是 | active/locked |
| last_transaction_at | 最近变更时间 | TIMESTAMP | 否 | |
| created_at | 创建时间 | TIMESTAMP | 是 | |
| updated_at | 更新时间 | TIMESTAMP | 是 | |

**唯一约束建议**：`material_id + warehouse_id + lot_number` 唯一。

## 4. 入库单主表（stock_in_orders）

| 字段名 | 中文名 | 数据类型建议 | 必填 | 约束/说明 |
| --- | --- | --- | --- | --- |
| id | 主键 | UUID | 是 | |
| order_no | 入库单号 | VARCHAR(64) | 是 | 唯一 |
| stock_in_type | 入库类型 | VARCHAR(30) | 是 | purchase/production/return |
| status | 单据状态 | VARCHAR(20) | 是 | draft/pending_review/approved/rejected |
| applicant_id | 申请人 | UUID | 是 | 关联 users.id |
| warehouse_id | 仓库ID | UUID | 是 | |
| source_reference | 来源单号 | VARCHAR(128) | 否 | 如采购单号/生产批记录 |
| submitted_at | 提交时间 | TIMESTAMP | 否 | |
| approved_at | 审批通过时间 | TIMESTAMP | 否 | |
| rejected_at | 驳回时间 | TIMESTAMP | 否 | |
| remark | 备注 | TEXT | 否 | |
| created_at | 创建时间 | TIMESTAMP | 是 | |
| updated_at | 更新时间 | TIMESTAMP | 是 | |

## 5. 入库单明细（stock_in_order_items）

| 字段名 | 中文名 | 数据类型建议 | 必填 | 约束/说明 |
| --- | --- | --- | --- | --- |
| id | 主键 | UUID | 是 | |
| stock_in_order_id | 入库单ID | UUID | 是 | 关联 stock_in_orders.id |
| material_id | 物料ID | UUID | 是 | |
| lot_number | 批号 | VARCHAR(128) | 是 | 不可为空 |
| quantity | 入库数量 | NUMERIC(18,6) | 是 | > 0 |
| unit | 单位 | VARCHAR(32) | 是 | |
| production_date | 生产日期 | DATE | 否 | |
| expiry_date | 有效期至 | DATE | 否 | |
| remark | 备注 | TEXT | 否 | |

## 6. 出库单主表（stock_out_orders）

| 字段名 | 中文名 | 数据类型建议 | 必填 | 约束/说明 |
| --- | --- | --- | --- | --- |
| id | 主键 | UUID | 是 | |
| order_no | 出库单号 | VARCHAR(64) | 是 | 唯一 |
| stock_out_type | 出库类型 | VARCHAR(30) | 是 | production_issue/scrap/transfer |
| status | 单据状态 | VARCHAR(20) | 是 | draft/pending_review/approved/rejected |
| applicant_id | 申请人 | UUID | 是 | |
| warehouse_id | 仓库ID | UUID | 是 | 源仓库 |
| destination | 去向/用途 | VARCHAR(255) | 是 | 生产线、报废原因或调拨去向 |
| submitted_at | 提交时间 | TIMESTAMP | 否 | |
| approved_at | 审批通过时间 | TIMESTAMP | 否 | |
| rejected_at | 驳回时间 | TIMESTAMP | 否 | |
| remark | 备注 | TEXT | 否 | |
| created_at | 创建时间 | TIMESTAMP | 是 | |
| updated_at | 更新时间 | TIMESTAMP | 是 | |

## 7. 出库单明细（stock_out_order_items）

| 字段名 | 中文名 | 数据类型建议 | 必填 | 约束/说明 |
| --- | --- | --- | --- | --- |
| id | 主键 | UUID | 是 | |
| stock_out_order_id | 出库单ID | UUID | 是 | 关联 stock_out_orders.id |
| material_id | 物料ID | UUID | 是 | |
| lot_number | 批号 | VARCHAR(128) | 是 | 不可为空 |
| quantity | 出库数量 | NUMERIC(18,6) | 是 | > 0 |
| unit | 单位 | VARCHAR(32) | 是 | |
| purpose | 用途 | VARCHAR(255) | 是 | 生产、报废、调拨等用途说明 |
| remark | 备注 | TEXT | 否 | |

## 8. 审批记录（approval_records）

| 字段名 | 中文名 | 数据类型建议 | 必填 | 约束/说明 |
| --- | --- | --- | --- | --- |
| id | 主键 | UUID | 是 | |
| business_type | 业务类型 | VARCHAR(30) | 是 | stock_in/stock_out/stock_count_adjustment |
| business_id | 业务单ID | UUID | 是 | 对应主表 ID |
| review_step | 审批步骤 | SMALLINT | 是 | MVP 固定为 1 |
| reviewer_id | 审核人 | UUID | 是 | 关联 users.id |
| decision | 审批结果 | VARCHAR(20) | 是 | approved/rejected |
| decision_reason | 审批意见/驳回原因 | TEXT | 否 | 驳回时必填 |
| reviewed_at | 审批时间 | TIMESTAMP | 是 | |
| created_at | 创建时间 | TIMESTAMP | 是 | |

## 9. 用户（users）

| 字段名 | 中文名 | 数据类型建议 | 必填 | 约束/说明 |
| --- | --- | --- | --- | --- |
| id | 主键 | UUID | 是 | |
| username | 用户名 | VARCHAR(64) | 是 | 唯一，用于登录 |
| full_name | 姓名 | VARCHAR(100) | 是 | |
| password_hash | 密码哈希 | VARCHAR(255) | 是 | 不存明文 |
| role | 角色 | VARCHAR(20) | 是 | admin/reviewer/operator |
| email | 邮箱 | VARCHAR(255) | 否 | |
| phone | 手机号 | VARCHAR(32) | 否 | |
| status | 状态 | VARCHAR(20) | 是 | active/inactive |
| last_login_at | 最近登录时间 | TIMESTAMP | 否 | |
| created_at | 创建时间 | TIMESTAMP | 是 | |
| updated_at | 更新时间 | TIMESTAMP | 是 | |

## 10. 盘点任务（stock_count_tasks）

| 字段名 | 中文名 | 数据类型建议 | 必填 | 约束/说明 |
| --- | --- | --- | --- | --- |
| id | 主键 | UUID | 是 | |
| task_no | 盘点任务号 | VARCHAR(64) | 是 | 唯一 |
| warehouse_id | 仓库ID | UUID | 是 | |
| task_scope | 盘点范围 | VARCHAR(20) | 是 | warehouse/material/category |
| status | 状态 | VARCHAR(20) | 是 | draft/pending_review/approved/rejected |
| applicant_id | 发起人 | UUID | 是 | |
| submitted_at | 提交时间 | TIMESTAMP | 否 | |
| approved_at | 审批通过时间 | TIMESTAMP | 否 | |
| remark | 备注 | TEXT | 否 | |
| created_at | 创建时间 | TIMESTAMP | 是 | |
| updated_at | 更新时间 | TIMESTAMP | 是 | |

## 11. 盘点明细（stock_count_items）

| 字段名 | 中文名 | 数据类型建议 | 必填 | 约束/说明 |
| --- | --- | --- | --- | --- |
| id | 主键 | UUID | 是 | |
| stock_count_task_id | 盘点任务ID | UUID | 是 | |
| inventory_balance_id | 库存记录ID | UUID | 是 | |
| system_quantity | 系统数量 | NUMERIC(18,6) | 是 | |
| counted_quantity | 实盘数量 | NUMERIC(18,6) | 是 | |
| variance_quantity | 差异数量 | NUMERIC(18,6) | 是 | 实盘 - 系统 |
| variance_reason | 差异原因 | TEXT | 否 | |

## 12. 库存流水（inventory_transactions）

| 字段名 | 中文名 | 数据类型建议 | 必填 | 约束/说明 |
| --- | --- | --- | --- | --- |
| id | 主键 | UUID | 是 | |
| material_id | 物料ID | UUID | 是 | |
| warehouse_id | 仓库ID | UUID | 是 | |
| lot_number | 批号 | VARCHAR(128) | 是 | |
| transaction_type | 变更类型 | VARCHAR(30) | 是 | stock_in/stock_out/count_adjustment |
| direction | 方向 | VARCHAR(10) | 是 | in/out/adjust |
| quantity | 变更数量 | NUMERIC(18,6) | 是 | |
| quantity_before | 变更前数量 | NUMERIC(18,6) | 是 | |
| quantity_after | 变更后数量 | NUMERIC(18,6) | 是 | |
| source_type | 来源类型 | VARCHAR(30) | 是 | stock_in_order/stock_out_order/stock_count_task |
| source_id | 来源ID | UUID | 是 | |
| operated_by | 操作人 | UUID | 是 | 申请或系统执行责任人 |
| operated_at | 变更时间 | TIMESTAMP | 是 | |

## 13. 批次追溯关系（batch_trace_links）

| 字段名 | 中文名 | 数据类型建议 | 必填 | 约束/说明 |
| --- | --- | --- | --- | --- |
| id | 主键 | UUID | 是 | |
| upstream_material_id | 上游物料ID | UUID | 是 | 原料/中间体 |
| upstream_lot_number | 上游批号 | VARCHAR(128) | 是 | |
| downstream_material_id | 下游物料ID | UUID | 是 | 中间体/成品 |
| downstream_lot_number | 下游批号 | VARCHAR(128) | 是 | |
| consumed_quantity | 消耗数量 | NUMERIC(18,6) | 是 | |
| produced_quantity | 产出数量 | NUMERIC(18,6) | 否 | 可选 |
| reference_type | 来源类型 | VARCHAR(30) | 是 | production_inbound/production_issue |
| reference_id | 来源单据ID | UUID | 是 | |
| created_at | 创建时间 | TIMESTAMP | 是 | |

## 14. 关键约束汇总

1. `materials.material_code` 唯一。
2. `warehouses.warehouse_code` 唯一。
3. `inventory_balances(material_id, warehouse_id, lot_number)` 唯一。
4. 所有出入库明细 `lot_number` 必填。
5. 所有数量字段统一使用 `NUMERIC(18,6)`。
6. 审批通过后才允许写入 `inventory_transactions` 并更新 `inventory_balances`。
7. 出库执行必须校验 `quantity_available >= quantity`。
