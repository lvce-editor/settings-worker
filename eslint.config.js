import * as config from '@lvce-editor/eslint-config'

export default [
  ...config.default,
  ...config.recommendedVirtualDom,
  {
    rules: {
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      '@cspell/spellchecker': 'off',
      'jest/no-disabled-tests': 'off',
    },
  },
  {
    files: [
      'packages/settings-worker/src/parts/GetSettingItemsEditor/GetSettingItemsEditor.ts',
      'packages/settings-worker/src/parts/GetSettingItemsWindow/GetSettingItemsWindow.ts',
    ],
    rules: {
      'virtual-dom/no-object-attribute-values': 'off',
    },
  },
  {
    files: ['packages/settings-worker/test/**/*.ts'],
    rules: {
      'virtual-dom/no-object-attribute-values': 'off',
      'virtual-dom/prefer-constants': 'off',
    },
  },
]
