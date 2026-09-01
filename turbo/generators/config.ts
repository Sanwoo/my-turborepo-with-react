import type { PlopTypes } from '@turbo/gen'
import fs from 'node:fs'
import path from 'node:path'

interface TurboAnswers {
  name: string
  port: number
}

interface TurboPlop extends PlopTypes.NodePlopAPI {
  turbo: {
    paths: {
      root: string
    }
  }
}

const templateName = 'react-template'
const firstGeneratedPort = 5174
const ignoredDirectories = new Set(['node_modules', '.turbo', 'dist'])

function findAvailablePort(appsDir: string): number {
  const usedPorts = new Set<number>()

  for (const entry of fs.readdirSync(appsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue

    const packagePath = path.join(appsDir, entry.name, 'package.json')
    if (!fs.existsSync(packagePath)) continue

    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8')) as {
      scripts?: { dev?: string }
    }
    const portMatch = packageJson.scripts?.dev?.match(/--port\s+(\d+)/)

    if (portMatch?.[1]) {
      usedPorts.add(Number(portMatch[1]))
    }
  }

  let port = firstGeneratedPort
  while (usedPorts.has(port)) port += 1
  return port
}

export default function generator(plop: TurboPlop): void {
  const getRootPath = () => plop.turbo?.paths?.root || process.cwd()
  const getAppsDir = () => path.join(getRootPath(), 'apps')

  plop.setActionType('copy-react-template', (answers) => {
    const typedAnswers = answers as TurboAnswers
    const rootPath = getRootPath()
    const sourceDir = path.join(rootPath, 'apps', templateName)
    const appsDir = getAppsDir()
    const appName = plop.renderString('{{dashCase name}}', answers)
    const destDir = path.join(appsDir, appName)

    if (!fs.existsSync(sourceDir)) {
      throw new Error(`应用模板 apps/${templateName} 不存在`)
    }

    if (fs.existsSync(destDir)) {
      throw new Error(`应用 apps/${appName} 已存在，请换一个名称或先手动处理该目录`)
    }

    typedAnswers.port = findAvailablePort(appsDir)
    fs.mkdirSync(destDir, { recursive: true })
    fs.cpSync(sourceDir, destDir, {
      recursive: true,
      filter: (source) => {
        const relativePath = path.relative(sourceDir, source)
        return !relativePath.split(path.sep).some((part) => ignoredDirectories.has(part))
      },
    })

    return `成功从模板复制到 apps/${appName}（端口：${typedAnswers.port}）`
  })

  plop.setGenerator('react-app', {
    description: `从 ${templateName} 创建新的 React + Vite 应用`,
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: '应用名称（例如：my-app）：',
        validate: (input: string) => {
          if (!input) return '应用名称不能为空'
          if (!/^[a-z0-9-]+$/.test(input)) {
            return '应用名称只能包含小写字母、数字和连字符'
          }

          const appName = plop.renderString('{{dashCase name}}', { name: input })
          if (fs.existsSync(path.join(getAppsDir(), appName))) {
            return `应用 apps/${appName} 已存在，请换一个名称`
          }

          return true
        },
      },
    ],
    actions: [
      {
        type: 'copy-react-template',
      },
      {
        type: 'modify',
        path: '{{ turbo.paths.root }}/apps/{{ dashCase name }}/package.json',
        pattern: /"name": "react-template"/g,
        template: '"name": "{{ dashCase name }}"',
      },
      {
        type: 'modify',
        path: '{{ turbo.paths.root }}/apps/{{ dashCase name }}/package.json',
        pattern: /"dev": "vite --port 5173"/g,
        template: '"dev": "vite --port {{port}}"',
      },
      {
        type: 'modify',
        path: '{{ turbo.paths.root }}/package.json',
        pattern: /"dev:react-template": "turbo dev --filter=react-template",/g,
        template: '"dev:react-template": "turbo dev --filter=react-template",\n    "dev:{{ dashCase name }}": "turbo dev --filter={{ dashCase name }}",',
      },
      (answers) => {
        const { name, port } = answers as TurboAnswers
        const appName = plop.renderString('{{dashCase name}}', { name })
        console.log(`\n✅ 成功创建应用：apps/${appName}`)
        console.log(`🚀 自动分配端口：${port}`)
        console.log('\n后续步骤：')
        console.log(`1. cd apps/${appName}`)
        console.log('2. pnpm dev')
        console.log(`3. 在 http://localhost:${port} 打开应用\n`)
        return '应用创建完成！'
      },
    ],
  })
}
