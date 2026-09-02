# 仓库协作规范

- 保留现有应用目录名和 package name。
- 每个应用保持独立构建和部署，不直接导入其他应用源码。
- 多个子项目真正需要共享的内容统一放入 `packages/shared`，不要提前拆分更多共享包。
- 避免无关重构和依赖大版本升级。
- 禁止提交 Secret、构建产物、本地环境变量文件或生成的 Runtime 二进制。
- 除了packages/ui文件夹内的组件代码，其他TS、TSX 和 JS 代码优先使用箭头函数；仅在需要动态 `this`、构造器、生成器或框架明确要求时使用 `function`。

交付前从仓库根目录运行：

1. `pnpm lint`
2. `pnpm typecheck`
3. `pnpm test`
4. `pnpm build`
