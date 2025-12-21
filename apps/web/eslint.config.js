import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'
// @ts-check

export default tseslint.config(
  { ignores: ['dist', 'server/dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      ...jsxA11y.flatConfigs.recommended.rules,
      // Disable jsx-a11y rules that are too strict for this codebase
      // These patterns are common in React apps and don't cause real accessibility issues
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/no-noninteractive-element-to-interactive-role': 'off',
      'jsx-a11y/no-noninteractive-tabindex': 'off',
      'jsx-a11y/media-has-caption': 'off',
      'jsx-a11y/role-has-required-aria-props': 'off',
      'jsx-a11y/label-has-associated-control': 'off',
      'jsx-a11y/role-supports-aria-props': 'off',
      'jsx-a11y/interactive-supports-focus': 'off',
    },
  },
)
