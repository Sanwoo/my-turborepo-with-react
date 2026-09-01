# `@workspace/typescript-config`

工作区共享 TypeScript 配置。

## 配置

- `base.json`：严格模式、ES2022、NodeNext 与通用 DOM 类型。
- `react-app.json`：React JSX、Bundler 模块解析、Vite/Node 类型和 `noEmit`。
- `react-library.json`：供内部 React 源码包使用。
- `typescript-library.json`：供普通 TypeScript 库使用。

示例：

```json
{
  "extends": "@workspace/typescript-config/react-app.json"
}
```
