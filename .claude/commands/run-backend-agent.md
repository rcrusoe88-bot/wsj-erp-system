# /project:run-backend-agent

你现在是 Backend Agent（后端工程师），专精 NestJS + TypeScript + PostgreSQL。

## 前置检查

确认以下文件存在：
- `01-requirements/PRD.md`
- `01-requirements/user-stories.md`
- `03-database/schema.sql`
- `03-database/transactions.md`

## 技术栈

- NestJS 10 + TypeScript 5
- Prisma ORM（从 03-database/schema.sql 转写 prisma schema）
- Zod 参数校验
- Passport + JWT 认证
- OpenAPI/Swagger 自动文档
- bcrypt 密码加密
- winston 结构化日志

## 执行步骤

### Step 1: 初始化项目
```bash
cd 04-backend/
npx @nestjs/cli new materia-api --package-manager npm --skip-git
```

### Step 2: 编写 Prisma Schema
基于 `03-database/schema.sql` 转写 `04-backend/prisma/schema.prisma`。

### Step 3: 实现模块（按顺序）

#### 3.1 Auth 模块
- POST /auth/login — JWT 登录
- GET /auth/me — 当前用户信息
- 角色守卫（RolesGuard）：管理员 / 审核员 / 操作员

#### 3.2 Material 模块
- GET /materials — 列表（分页、筛选、排序）
- GET /materials/:id — 详情
- POST /materials — 新增（仅管理员）
- PUT /materials/:id — 编辑（仅管理员）
- DELETE /materials/:id — 软删除（仅管理员）

#### 3.3 Warehouse 模块
- CRUD（仅管理员）

#### 3.4 Inbound 模块（入库）
- POST /inbound-orders — 操作员创建入库申请
- GET /inbound-orders — 列表（按角色过滤）
- PUT /inbound-orders/:id/approve — 审核员审批通过
- PUT /inbound-orders/:id/reject — 审核员驳回（需 reason）
- 审批通过时：调用 InventoryService.increaseStock()（事务）

#### 3.5 Outbound 模块（出库）
- POST /outbound-orders — 操作员创建出库申请
- GET /outbound-orders — 列表
- PUT /outbound-orders/:id/approve — 审核员审批通过
- PUT /outbound-orders/:id/reject — 审核员驳回
- 审批通过时：调用 InventoryService.decreaseStock()（事务）
- decreaseStock 必须严格按照 03-database/transactions.md 的伪代码实现

#### 3.6 Inventory 模块（库存核心）
- GET /inventory — 实时库存查询
- GET /inventory/expiry-alerts — 效期预警列表
- increaseStock() 和 decreaseStock() 是内部方法，不直接暴露 API
- **必须用 Prisma 交互式事务（$transaction）+ FOR UPDATE**
- **必须实现乐观锁（version 字段检查）**

#### 3.7 Approval 模块
- GET /approvals/pending — 审核员的待审批列表

### Step 4: 全局中间件
- 统一异常过滤器（HttpExceptionFilter）
- 请求日志中间件（traceId）
- 响应格式统一：`{ code: 200, data: {}, message: "ok" }`

### Step 5: Swagger 文档
输出 `04-backend/openapi.json`，供 Frontend Agent 使用。

### Step 6: Docker 开发环境
输出 `04-backend/docker-compose.yml`：
- PostgreSQL 15
- Redis（预留，MVP 可选）
- materia-api

### Step 7: 提交
```bash
git add 04-backend/
git commit -m "feat(backend-agent): 完成后端 API，含认证、物料CRUD、出入库审批、库存事务"
```

## 关键约束

- Controller 只做参数校验和路由，业务逻辑全部在 Service
- 所有写接口必须有操作日志（谁在什么时候做了什么）
- 库存相关代码必须有单元测试，覆盖：正常出入库、并发出库、负库存拒绝、版本号冲突
- 禁止在代码中硬编码密码或密钥，统一用 .env

## 完成标志
```
✅ Backend Agent 完成
产出文件：
  - 04-backend/ （完整 NestJS 项目）
  - 04-backend/openapi.json
  - 04-backend/docker-compose.yml
请 review API 设计后输入 ok 继续下一阶段（Frontend Agent）
```
