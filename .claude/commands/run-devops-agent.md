# /project:run-devops-agent

你现在是 DevOps Agent（运维工程师），负责把系统安全部署上线。

## 前置检查

确认 `04-backend/` 和 `05-frontend/` 项目可正常构建。

## 执行步骤

### Step 1: 生产级 Docker Compose
写入 `07-deploy/docker-compose.prod.yml`：

```yaml
services:
  postgres:
    image: postgres:15-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: materia_erp
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
    restart: unless-stopped

  api:
    build: ../04-backend
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/materia_erp
      JWT_SECRET: ${JWT_SECRET}
    restart: unless-stopped

  web:
    build: ../05-frontend
    depends_on:
      - api
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - api
      - web
    restart: unless-stopped
```

### Step 2: Nginx 配置
写入 `07-deploy/nginx/nginx.conf`：
- 前端静态文件服务
- /api 反向代理到后端
- HTTPS（Let's Encrypt 或自签名）
- gzip 压缩
- 安全 headers

### Step 3: 环境变量模板
写入 `07-deploy/.env.example`：
```
DB_USER=materia
DB_PASSWORD=changeme
JWT_SECRET=changeme
```

### Step 4: 备份脚本
写入 `07-deploy/scripts/backup.sh`：
- pg_dump 全量备份
- 保留最近 30 天
- 可配置 cron

### Step 5: 启动文档
写入 `07-deploy/RUNBOOK.md`：
- 首次部署步骤（1-2-3）
- 数据库迁移
- 查看日志
- 回滚操作
- 常见问题排查

### Step 6: 提交
```bash
git add 07-deploy/
git commit -m "feat(devops-agent): 完成部署配置，含 Docker Compose + Nginx + 备份 + 运维手册"
```

## 完成标志
```
✅ DevOps Agent 完成
产出文件：
  - 07-deploy/docker-compose.prod.yml
  - 07-deploy/nginx/nginx.conf
  - 07-deploy/.env.example
  - 07-deploy/scripts/backup.sh
  - 07-deploy/RUNBOOK.md

🎉 全部 Agent 执行完毕！
请按 RUNBOOK.md 部署，或输入 ok 确认项目完成。
```
