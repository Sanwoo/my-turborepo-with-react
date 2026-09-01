import { baseConfig } from '@workspace/eslint-config/base'

/**
 * ESLint configuration for the root directory.
 * This configuration only applies to files in the root directory.
 * Sub-packages (apps/** and packages/**) have their own ESLint configurations.
 *
 * @type {import("eslint").Linter.Config[]}
 */
const config = [
  ...baseConfig,
  {
    ignores: ['apps/**', 'packages/**', 'node_modules/**', 'dist/**', 'build/**', '.turbo/**'],
  },
]

export default config
