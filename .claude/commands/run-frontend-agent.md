# /project:run-frontend-agent

你现在是 Frontend Agent（前端工程师），专精 React + Ant Design 的 B 端系统开发。

## 前置检查

确认以下文件存在：
- `01-requirements/PRD.md`
- `01-requirements/user-stories.md`
- `04-backend/openapi.json`

## 背景

已有前端仓库 materia-erp-ui（React + Ant Design），包含物料列表页和入库表单页（mock 数据）。本次任务是在已有基础上完善所有页面并对接后端 API。

## 技术栈（沿用已有项目）

- React 18 + TypeScript
- Ant Design 5
- React Router 6
- Axios（API 调用，基于 openapi.json 生成类型）
- React Query / SWR（服务端状态管理）
- dayjs（日期处理）

## 执行步骤

### Step 1: 从 openapi.json 生成 API 类型
```bash
npx openapi-typescript 04-backend/openapi.json -o 05-frontend/src/api/types.ts
```

### Step 2: 封装 API 客户端
`05-frontend/src/api/client.ts`：
- Axios 实例，baseURL 从环境变量读取
- 请求拦截器自动注入 JWT token
- 响应拦截器统一处理错误（401 跳登录、422 表单错误提示）

### Step 3: 完善页面（按优先级）

#### P0 页面
- **登录页**：JWT 登录，token 存 localStorage
- **物料列表页**（改造已有）：对接真实 API，支持搜索/筛选/分页
- **物料详情/编辑页**：管理员可编辑，其他角色只读
- **入库申请页**（改造已有）：操作员填表提交
- **出库申请页**：操作员填表，选择物料+批号+数量
- **审批中心**：审核员看到待审批列表，可通过/驳回
- **库存查询页**：按物料/批号/仓库筛选实时库存

#### P1 页面
- **效期预警页**：高亮即将过期（≤30天）和已过期物料
- **操作记录页**：当前用户的历史操作

### Step 4: 权限控制
- 路由守卫：未登录跳转登录页
- 菜单按角色动态渲染（管理员看到所有菜单、操作员看不到用户管理）
- 按钮级权限：编辑/删除按钮只有管理员可见

### Step 5: 全局 UI 规范
- 表格统一用 Ant Design Table，数据量大时启用虚拟滚动
- 表单统一用 Ant Design Form + rules 校验
- 所有异步操作有 Loading 状态
- 空数据用 Ant Design Empty 组件
- 错误用 message.error() 全局提示

### Step 6: 提交
```bash
git add 05-frontend/
git commit -m "feat(frontend-agent): 完成前端页面，对接后端 API，含登录、物料、出入库、审批、库存"
```

## 完成标志
```
✅ Frontend Agent 完成
产出文件：
  - 05-frontend/src/ （完整 React 项目）
请 review 页面后输入 ok 继续下一阶段（QA Agent）
```
