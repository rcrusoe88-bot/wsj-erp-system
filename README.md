# materia-erp-ui

前端独立仓库，用于承载 MATERIA ERP 的交互式 HTML 原型与后续界面模块。

## 当前内容

- `erp-materials-ledger-module.html`：物料台账模块交互 Demo

## 使用方式

直接在浏览器中打开 `erp-materials-ledger-module.html`，或使用本地静态服务器预览。

示例：

```bash
python -m http.server 8000
```

然后访问：

```text
http://127.0.0.1:8000/erp-materials-ledger-module.html
```

## 说明

- 当前仓库仅放前端原型 / UI Demo
- 后端接口、数据库与部署将拆分到独立仓库
- 现阶段以模块化迭代方式推进，每次确认一个模块后再进入下一个模块
