import { reactConfig } from '@workspace/eslint-config/react'

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...reactConfig,
  {
    files: ['src/components/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
          allowExportNames: ['buttonVariants'],
        },
      ],
    },
  },
]
