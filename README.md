# Materia ERP 物料管理系统

<p align="center">
  <img src="https://img.shields.io/github/license/rcrusoe88-bot/wsj-erp-system?style=flat-square" alt="License">
  <img src="https://img.shields.io/github/stars/rcrusoe88-bot/wsj-erp-system?style=flat-square" alt="Stars">
  <img src="https://img.shields.io/github/last-commit/rcrusoe88-bot/wsj-erp-system?style=flat-square" alt="Last Commit">
  <img src="https://img.shields.io/github/repo-size/rcrusoe88-bot/wsj-erp-system?style=flat-square" alt="Repo Size">
</p>

<p align="center">
  <img src="https://github-readme-stats-eight-theta.vercel.app/api/pin/?username=rcrusoe88-bot&repo=wsj-erp-system&theme=vue&show_owner=true" alt="wsj-erp-system 仓库数据">
</p>

mRNA/LNP 生产物料管理系统（MVP）。管理原辅料、脂质、中间体、成品、耗材、设备的出入库、库存、批次追溯与效期管理。

## 技术栈

- **前端**：React + Ant Design（Umi 框架）
- **后端**：NestJS + TypeScript + Prisma
- **数据库**：PostgreSQL 15+
- **部署**：Docker Compose 单机

## 项目结构

```
01-requirements/   ← PRD、用户故事、数据字典
02-design/         ← 页面原型、组件设计
03-database/       ← DDL、迁移、ER图、Prisma Schema
04-backend/        ← NestJS 源码（8个模块）
05-frontend/       ← React 源码（10个P0页面）
06-tests/          ← Jest API 集成测试（6套件24用例）
07-deploy/         ← Docker、Nginx、部署脚本
```

## 快速启动

### 后端

```bash
cd 04-backend
cp .env.example .env  # 配置数据库连接
npm install
npx prisma migrate dev
npm run start:dev
```

### 前端

```bash
cd 05-frontend
npm install
npm start
```

### Docker Compose 一键部署

```bash
cd 07-deploy
cp .env.example .env  # 配置环境变量
docker-compose up -d
```

## 核心功能

- 物料主数据管理（编码、分类、规格、供应商）
- 仓库与库位管理
- 出入库流程（创建 → 审核 → 执行）
- 库存实时查询与预警
- 批次追溯与效期管理（≤30天预警，过期锁定）
- 用户与角色权限（管理员/审核员/操作员）

## 环境变量

参考 `07-deploy/.env.example`，生产环境请勿提交 `.env.production`。

## License

MIT

---

## 📊 作者 GitHub 数据

<p align="center">
  <img src="https://github-readme-stats-eight-theta.vercel.app/api?username=rcrusoe88-bot&show_icons=true&theme=vue" alt="rcrusoe88-bot 的 GitHub 统计">
  <img src="https://github-readme-stats-eight-theta.vercel.app/api/top-langs/?username=rcrusoe88-bot&layout=compact&theme=vue" alt="rcrusoe88-bot 的常用语言">
</p>

<!-- probe -->
