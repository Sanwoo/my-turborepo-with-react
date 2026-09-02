# React + Vite Turborepo

以 React 19 和 Vite 8 为核心的 pnpm/Turborepo 工作区模板，内置 React Router、React Compiler、Tailwind CSS 4 和共享 shadcn/ui 组件包。

## 技术栈

- React 19.2
- Vite 8（Rolldown 构建链）
- React Router 8 Data Router
- React Compiler（Babel 稳定实现）
- TypeScript 6
- Tailwind CSS 4
- ESLint 10 flat config
- pnpm workspace 与 Turborepo

## 目录结构

```text
.
├── apps/
│   └── react-template/          # 可运行、可复制的 React SPA 模板
├── packages/
│   ├── ui/                      # 直接导出 TS/TSX 源码的内部组件包
│   ├── eslint-config/           # base 与 react ESLint 配置
│   └── typescript-config/       # 共享 TypeScript 配置
└── turbo/
    └── generators/              # React 应用生成器
```

## 环境要求

- Node.js 24 或更高版本
- pnpm 10.33.2

安装依赖：

```bash
pnpm install
```

## 常用命令

```bash
pnpm dev                    # 启动所有应用的开发任务
pnpm dev:react-template     # 只启动模板应用（http://localhost:5173）
pnpm build                  # 类型检查并构建所有应用
pnpm lint                   # 检查所有工作区包
pnpm check-types            # 运行 TypeScript 检查
pnpm format                 # 格式化 TS、TSX 和 Markdown
pnpm format:check           # 检查格式
pnpm clean                  # 清理各包的生成目录
pnpm gen:app                # 从模板创建新应用
```

应用自身还提供 `pnpm preview`，用于本地预览生产构建结果。

## React 应用约定

应用入口位于 `apps/react-template/src/main.tsx`。入口使用 `createRoot` 与 `StrictMode`，并挂载 `AppRouter`。

路由集中定义在 `src/app/router.tsx`：

- `/` 渲染首页。
- `*` 渲染 404 页面。
- 根布局通过 `Outlet` 承载子路由。

新增页面时，在 `src/pages` 下创建组件，再将其注册到路由对象。大型页面或重型依赖应使用路由级懒加载，普通小页面无需为了拆包而额外异步化。

应用内导入使用 `@/*` 别名：

```tsx
import { HomePage } from '@/pages/home'
```

## React Compiler

模板通过 Vite 的 Babel/Rolldown 插件启用官方 React Compiler：

```ts
plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()]
```

共享 UI 源码同样进入应用构建图，因此会一起接受编译。组件应保持常规 React 写法，不需要主动添加无意义的 `memo` 或 `useMemo`。

为了保持 Fast Refresh 稳定，组件文件应主要导出组件；需要共享的复杂常量或工具函数应放到独立模块。ESLint 允许与组件一起导出稳定常量，以兼容组件样式变体。

## 共享 UI 包

`@workspace/ui` 是私有源码包，不生成单独的 `dist`。Vite 直接处理它导出的 TS、TSX 和 CSS。

使用具体子路径导入组件，避免聚合入口扩大模块解析范围：

```tsx
import { Button } from '@workspace/ui/components/button'
```

添加 shadcn/ui 组件：

```bash
pnpm dlx shadcn@latest add button -c apps/react-template
```

生成的共享组件位于 `packages/ui/src/components`。

## Tailwind CSS 4

Tailwind 通过 `@tailwindcss/vite` 参与应用构建，不使用独立的 PostCSS 配置。

共享主题、颜色变量和组件扫描路径位于：

```text
packages/ui/src/styles/globals.css
```

应用入口先导入共享样式，再导入应用级覆盖：

```ts
import '@workspace/ui/globals.css'
import '@/styles/globals.css'
```

## 创建新应用

运行：

```bash
pnpm gen:app
```

生成器会：

1. 复制 `apps/react-template`。
2. 校验应用名称只能包含小写字母、数字和连字符。
3. 从 `5174` 开始选择首个未占用端口。
4. 更新应用包名和 `vite --port` 脚本。
5. 在根 `package.json` 注册 `dev:<应用名>` 命令。

生成完成后：

```bash
cd apps/my-app
pnpm dev
```

## 环境变量

可暴露给浏览器的变量必须使用 `VITE_` 前缀，并通过 `import.meta.env` 读取：

```ts
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
```

`.env*` 文件和外部注入的 `VITE_*` 值都会参与 Turborepo 构建缓存计算。不要把密钥放进客户端环境变量。

## 静态部署

生产构建输出到应用的 `dist` 目录：

```bash
pnpm build
```

模板默认部署在站点根路径 `/`。由于它是浏览器端路由 SPA，静态托管平台必须将未知路径回退到 `index.html`，否则直接访问嵌套路由会返回服务器 404。

## 共享配置

ESLint：

- `@workspace/eslint-config/base`：通用 JavaScript/TypeScript、Turbo 与 Prettier 规则。
- `@workspace/eslint-config/react`：在 base 上增加浏览器、Hooks、Compiler 与 Fast Refresh 规则。

TypeScript：

- `base.json`：严格通用配置。
- `react-app.json`：Vite React SPA 配置。
- `react-library.json`：React 源码包配置。
- `typescript-library.json`：普通 TypeScript 包配置。

Vite 构建本身不负责完整类型检查，因此应用的 `build` 脚本会先运行 `tsc --noEmit`。

## 提交前检查

```bash
pnpm format:check
pnpm lint
pnpm check-types
pnpm build
```
