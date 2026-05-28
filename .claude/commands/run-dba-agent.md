# /project:run-dba-agent

你现在是 DBA Agent（数据库架构师），专精事务型 OLTP 系统，熟悉 mRNA/LNP 生产物料管理的业务语义。

## 前置检查

确认以下文件存在且不为空，否则停止并提示先运行 PO Agent：
- `01-requirements/data-dict.md`
- `01-requirements/workflows.md`
- `01-requirements/glossary.md`

## 执行步骤

### Step 1: 设计数据库 Schema
读取 `01-requirements/data-dict.md` 和 `01-requirements/glossary.md`，输出 `03-database/schema.sql`。

强制规范：
- 主键统一用 BIGINT（雪花 ID 或应用层生成），不用自增
- 所有表必须有：id, created_at, updated_at, created_by, updated_by, deleted_at（软删除）
- 数量字段用 NUMERIC(18,6)
- 批号字段 batch_no VARCHAR(100) NOT NULL
- stock_balance 表必须有 version INT DEFAULT 0（乐观锁）
- stock_balance 唯一约束：(material_id, batch_no, warehouse_id)
- stock_balance 添加 CHECK (quantity >= 0) 防止负库存
- 字段命名参考 glossary.md 的统一术语

必须包含的表：
```
materials              -- 物料主数据
material_categories    -- 物料分类
warehouses             -- 仓库
stock_balance          -- 实时库存余额
stock_transactions     -- 库存流水（append-only，不可变）
inbound_orders         -- 入库单头
inbound_order_items    -- 入库单明细
outbound_orders        -- 出库单头
outbound_order_items   -- 出库单明细
approval_records       -- 审批记录
inventory_checks       -- 盘点任务
inventory_check_items  -- 盘点明细
users                  -- 用户
roles                  -- 角色
user_roles             -- 用户-角色关联
```

### Step 2: 设计索引
输出 `03-database/indexes.md`，说明每个索引的理由。

必须索引：
- materials(material_code) UNIQUE
- stock_balance(material_id, batch_no, warehouse_id) UNIQUE
- stock_transactions(material_id, created_at)
- inbound_orders(status, created_at)
- outbound_orders(status, created_at)

### Step 3: 编写关键事务伪代码
输出 `03-database/transactions.md`。

必须覆盖：
1. 入库审批通过 → 增加库存（事务）
2. 出库审批通过 → 扣减库存（事务 + 乐观锁 + 负库存检查）
3. 盘点调整 → 修正库存（事务）

每个事务用伪 SQL 写清楚：
```sql
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
-- 1. 锁定库存行
SELECT quantity, version FROM stock_balance
  WHERE material_id = ? AND batch_no = ? AND warehouse_id = ?
  FOR UPDATE;
-- 2. 检查余额（出库场景）
-- 3. 插入流水
-- 4. 更新余额 + version
-- 5. 更新单据状态
COMMIT;
```

### Step 4: 生成 ER 图
输出 `03-database/er-diagram.mmd`（Mermaid erDiagram 格式）。

### Step 5: 生成测试数据
输出 `03-database/seed.sql`。

包含：
- 3 个用户（管理员、审核员、操作员各一）
- 10 条物料主数据（覆盖原辅料、脂质、中间体、成品、耗材）
- 2 个仓库
- 若干库存余额和流水记录

### Step 6: 语法校验
```bash
# 如果有 psql 可用，做 dry-run 校验
# 否则至少检查 SQL 语法完整性（分号、括号配对）
```

### Step 7: 提交
```bash
git add 03-database/
git commit -m "feat(dba-agent): 完成数据库设计，含 schema + 索引 + 事务 + ER图 + 种子数据"
```

## 完成标志
```
✅ DBA Agent 完成
产出文件：
  - 03-database/schema.sql
  - 03-database/indexes.md
  - 03-database/transactions.md
  - 03-database/er-diagram.mmd
  - 03-database/seed.sql
请 review ER 图和 schema 后输入 ok 继续下一阶段（Backend Agent）
```
