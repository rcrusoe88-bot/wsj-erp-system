# /project:run-pipeline

Materia ERP 全流程 Pipeline。按顺序执行每个 Agent，每步完成后等待用户确认再继续。

## 执行顺序

```
Step 1 → /project:run-po-agent
         等待用户输入 ok

Step 2 → /project:run-dba-agent
         等待用户输入 ok

Step 3 → /project:run-backend-agent
         等待用户输入 ok

Step 4 → /project:run-frontend-agent
         等待用户输入 ok

Step 5 → /project:run-qa-agent
         等待用户输入 ok

Step 6 → /project:run-devops-agent
         等待用户输入 ok
```

## 规则

- 每一步执行前，先打印当前步骤编号和 Agent 名称
- 每一步执行后，打印产出文件清单
- 用户说 ok 才进入下一步，说 fix xxx 则修改后重新提交当前步骤
- 如果用户说 skip 则跳过当前步骤
- 全部完成后打印项目总结
