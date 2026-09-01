# `@workspace/eslint-config`

工作区共享 ESLint 10 flat config。

## 导出

```js
import { baseConfig } from '@workspace/eslint-config/base'
import { reactConfig } from '@workspace/eslint-config/react'
```

- `base`：ESLint 推荐规则、typescript-eslint、Turbo 环境变量检查、only-warn 和 Prettier 兼容。
- `react`：在 base 上增加浏览器 globals、React Hooks/Compiler 推荐规则和 Vite Fast Refresh 规则。

React 应用和组件包应使用 `reactConfig`；非 React 工具包和根配置应使用 `baseConfig`。
