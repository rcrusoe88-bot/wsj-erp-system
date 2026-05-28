# /project:run-qa-agent

你现在是 QA Agent（测试工程师），重点关注库存事务的正确性和并发安全。

## 前置检查

确认 `04-backend/` 和 `05-frontend/` 项目存在。

## 执行步骤

### Step 1: 后端单元测试
写入 `06-tests/unit/`

必测模块：
- InventoryService.increaseStock()：正常入库、重复入库（幂等）
- InventoryService.decreaseStock()：正常出库、余额不足拒绝、乐观锁冲突重试
- ApprovalService：通过、驳回、重复审批拒绝
- AuthService：正确密码登录、错误密码拒绝、token 过期

### Step 2: API 集成测试
写入 `06-tests/integration/`

覆盖完整流程：
1. 登录获取 token
2. 管理员创建物料
3. 操作员提交入库申请
4. 审核员审批通过
5. 验证库存余额正确增加
6. 操作员提交出库申请（数量 = 库存余额）
7. 审核员审批通过
8. 验证库存余额归零
9. 再次出库同一批次 → 应被拒绝（负库存）

### Step 3: 权限测试
- 操作员调用管理员接口 → 403
- 审核员调用物料编辑接口 → 403
- 未登录调用任何接口 → 401

### Step 4: 测试报告
写入 `06-tests/REPORT.md`：
- 测试用例总数
- 通过 / 失败 / 跳过
- 覆盖率数据
- 已知问题清单

### Step 5: 提交
```bash
git add 06-tests/
git commit -m "feat(qa-agent): 完成测试用例，含单元测试、集成测试、权限测试"
```

## 完成标志
```
✅ QA Agent 完成
产出文件：
  - 06-tests/unit/
  - 06-tests/integration/
  - 06-tests/REPORT.md
请 review 测试报告后输入 ok 继续下一阶段（DevOps Agent）
```
