# Materia ERP 项目状态

## 当前阶段

- 当前阶段：阶段 4 — Backend 后端实现
- 阶段状态：阶段 2 页面设计已确认；阶段 3 数据库设计基线已确认完成，当前进入阶段 4 后端设计与实现准备。
- 当前成果页：`stage-3-database-overview.html`（阶段 3 归档评审页）

## 已完成内容

阶段 1 需求基线、阶段 2 页面设计基线已获确认，阶段 3 当前已完成以下数据库设计产物：

- `03-database/data-model.md`：核心表职责、字段边界与主从关系说明。
- `03-database/entity-relationships.md`：实体关系说明。
- `03-database/constraint-index-strategy.md`：约束、索引与事务策略说明。
- `03-database/migration-outline.md`：阶段 4 落真实数据库结构与后端实现前的迁移提纲。
- `stage-3-database-overview.html`：阶段 3 可视化成果页。

本轮继续保持的关键业务口径：

- 用户采用单角色模型，每个用户只有一个 `role`
- 批号统一使用 `lot_number`
- 库存最小粒度为“物料 + 仓库 + 批号”
- 所有出入库都必须先提交审核，审核通过后才改变库存
- 出库必须拦截负库存，过期物料不可出库
- MVP 调拨只做“调拨出库登记”，不做目标仓签收闭环，不增加目标仓库存
- 生产入库必须记录上游批号与消耗数量，用于批次追溯
- 盘点无差异时可直接进入 `completed`

## 当前用户可 review 内容

请优先打开根目录下的：

- `stage-3-database-overview.html`

同时可配合查看：

- `03-database/data-model.md`
- `03-database/entity-relationships.md`
- `03-database/constraint-index-strategy.md`
- `03-database/migration-outline.md`

用户可重点确认：

1. 单角色 `users.role` 是否继续保持不变。
2. 调拨是否继续保持“只做 transfer 出库，不做目标仓签收”。
3. 库存主链是否接受“单据表 / 审批表 / 流水表 / 余额表”分层。
4. 盘点任务与审计日志相关数据库结构，是否继续只做预留，不纳入本阶段交付，也不在本阶段做深设计。
5. 下一阶段 Backend 是否可以基于这一版直接进入真实数据库结构与后端实现。

## 下一步

阶段 3 数据库设计基线已确认完成，当前默认下一步进入阶段 4 Backend：

- 基于 `03-database/` 文档把设计转成真实 PostgreSQL / Prisma 结构。
- 先完成阶段 4 后端设计说明与实施计划，再进入真实 NestJS 后端实现。
- 阶段 4 保持既定业务边界，不推翻单角色 RBAC、`lot_number` 口径、库存分层结构与调拨 MVP 边界。

## 当前阶段重点

- 阶段 4 将落地真实 DDL / Prisma schema / NestJS 后端模块。
- 优先完成用户与 RBAC、主数据、出入库、审批、库存余额/流水、批次追溯主链。
- 盘点与审计日志继续按 P1 预留策略处理，不在本轮过度展开。
