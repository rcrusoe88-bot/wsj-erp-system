# CLAUDE.md — Materia ERP 物料管理系统

## 项目身份

mRNA/LNP 生产物料管理系统（MVP）。管理原辅料、脂质、中间体、成品、耗材、设备的出入库、库存、批次追溯与效期管理。

## 技术栈

- 前端：React + Ant Design（已有部分页面，仓库 materia-erp-ui）
- 后端：NestJS + TypeScript + Prisma
- 数据库：PostgreSQL 15+
- 部署：Docker Compose 单机

## 目录契约（每个 Agent 只写自己的目录）

```
01-requirements/   ← PO Agent 产出（PRD、用户故事、数据字典）
02-design/         ← Design Agent 产出（页面原型、组件）
03-database/       ← DBA Agent 产出（DDL、迁移、ER图）
04-backend/        ← Backend Agent 产出（NestJS 源码）
05-frontend/       ← Frontend Agent 产出（React 源码）
06-tests/          ← QA Agent 产出（测试用例、报告）
07-deploy/         ← DevOps Agent 产出（Docker、Nginx、CI/CD）
```

## 强制规范（所有 Agent 必须遵守）

### 数据安全
- 库存变更必须用 PostgreSQL 事务（SERIALIZABLE 隔离级别）
- 不允许负库存：出库前必须 SELECT ... FOR UPDATE 检查余额
- 金额用 NUMERIC(18,4)，数量用 NUMERIC(18,6)，禁止 FLOAT
- 批号字段不可为空（物料系统核心）

### 业务规则
- 三角色 RBAC：管理员 / 审核员 / 操作员
- 所有出入库必须经过审核员一级审批
- 效期 ≤30 天预警，过期物料锁定不可出库
- 物料编码手动填写，系统强制唯一

### 代码规范
- 每个阶段完成后 git commit，格式：feat(agent-name): 描述
- 写代码前先读对应 SKILL.md
- Controller 不写业务逻辑，全部放 Service
- 所有 API 必须有 Zod/class-validator 参数校验

### 前端约束
- 沿用已有 React + Ant Design 技术栈，不要换框架
- 列表页必须用 Ant Design Table + 虚拟滚动
- 所有页面支持 Loading / Error / Empty 三态

## 当前阶段

- Step 1 ✅ PO Agent — 需求文档（PRD、用户故事、数据字典、术语表、流程图）
- Step 2 ✅ Design Agent — 页面设计（页面地图、页面规格、关键任务流程）
- Step 3 ✅ DBA Agent — 数据库设计（数据模型、ER关系、约束索引、Prisma Schema + 迁移）
- Step 4 ✅ Backend Agent — 后端开发（NestJS 10个模块骨架完成，待联调）
- Step 5 🔄 Frontend Agent — 前端开发（当前阶段）
