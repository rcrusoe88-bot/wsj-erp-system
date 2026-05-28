# Materia ERP 术语表

> 说明：以下术语为本项目统一口径，后续 Agent 在数据库、接口、前端字段命名时应优先沿用，避免同义词漂移。

| 中文术语 | 英文术语 | 推荐字段/命名 | 说明 |
| --- | --- | --- | --- |
| 物料 | Material | material | 系统管理对象的统称 |
| 物料编码 | Material Code | material_code | 手动填写、系统唯一 |
| 物料名称 | Material Name | material_name | |
| 物料类别 | Material Category | material_category | 如原辅料、脂质原料、中间体、成品 |
| 仓库 | Warehouse | warehouse | 存放物料的实体仓 |
| 仓库编码 | Warehouse Code | warehouse_code | 唯一 |
| 批号 | Lot Number | lot_number | 本项目统一不用 batch_id、batch_code 作为业务批号主字段 |
| 批次管理 | Lot Management | batch_managed | 是否按批号管理 |
| 批次追溯 | Batch Traceability | batch_traceability / trace | 批号之间的上下游关系 |
| 上游批次 | Upstream Lot | upstream_lot_number | 原料或中间体来源批号 |
| 下游批次 | Downstream Lot | downstream_lot_number | 中间体或成品去向批号 |
| 生产日期 | Production Date | production_date | |
| 有效期至 | Expiry Date | expiry_date | 不是 expiration_time |
| 临期预警 | Expiry Warning | expiry_warning | 指 ≤30 天提醒 |
| 过期锁定 | Expiry Lock | expiry_lock / stock_status=locked | 过期后不可出库 |
| 库存余额 | Inventory Balance | inventory_balance | 当前库存记录 |
| 账面数量 | Quantity On Hand | quantity_on_hand | 当前库存总量 |
| 可用数量 | Available Quantity | quantity_available | 可出库数量 |
| 锁定数量 | Locked Quantity | quantity_locked | 被占用或冻结数量 |
| 入库单 | Stock-in Order | stock_in_order | 入库业务单据 |
| 出库单 | Stock-out Order | stock_out_order | 出库业务单据 |
| 入库类型 | Stock-in Type | stock_in_type | purchase / production / return |
| 出库类型 | Stock-out Type | stock_out_type | production_issue / scrap / transfer |
| 采购入库 | Purchase Receipt | purchase | 外部采购入库 |
| 生产入库 | Production Receipt | production | 生产产物入库 |
| 退货入库 | Return Receipt | return | 退回物料入库 |
| 生产领料 | Production Issue | production_issue | 用于生产消耗的出库 |
| 报废出库 | Scrap Issue | scrap | 不可用物料报废 |
| 调拨出库 | Transfer Issue | transfer | 从源仓库移出 |
| 盘点 | Stock Count | stock_count | 实盘与系统库存比对 |
| 盘点任务 | Stock Count Task | stock_count_task | 盘点业务主单 |
| 盘点调整 | Stock Count Adjustment | stock_count_adjustment | 差异修正动作 |
| 审批记录 | Approval Record | approval_record | 审核留痕 |
| 审核员 | Reviewer | reviewer | 审批角色 |
| 操作员 | Operator | operator | 发起业务角色 |
| 管理员 | Administrator | admin / administrator | 系统管理角色 |
| 待审核 | Pending Review | pending_review | 单据状态 |
| 已通过 | Approved | approved | 单据状态 |
| 已驳回 | Rejected | rejected | 单据状态 |
| 草稿 | Draft | draft | 尚未提交 |
| 库存流水 | Inventory Transaction | inventory_transaction | 库存变更明细 |
| 来源单据 | Source Document | source_reference / source_id | 库存变化来源 |
| 去向/用途 | Destination / Purpose | destination / purpose | 出库目标说明 |
| 审计日志 | Audit Log | audit_log | 系统关键动作日志 |
| 角色权限控制 | Role-Based Access Control | RBAC | 基于角色的权限管理 |

## 命名统一规则

1. “批号”统一使用 `lot_number`，不要混用 `batch_id`、`batch_no`、`batch_code`。  
2. “入库单/出库单”主表统一使用 `stock_in_orders`、`stock_out_orders`。  
3. “库存余额”统一使用 `inventory_balances`，不要写成 `stocks` 这种过泛命名。  
4. “审批记录”统一使用 `approval_records`。  
5. “盘点任务”统一使用 `stock_count_tasks`，盘点差异明细使用 `stock_count_items`。  
6. “正向追踪/逆向追溯”都归入 `batch traceability` 范畴，关系表推荐命名 `batch_trace_links`。  
