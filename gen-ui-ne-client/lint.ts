import type { OxlintOverride } from 'vite-plus/lint';

export const clientLint = {
  plugins: ['typescript', 'react', 'unicorn', 'oxc'],
  rules: {
    'react/rules-of-hooks': 'error',
    'react/exhaustive-deps': 'warn',
    'react/only-export-components': ['warn', { allowConstantExport: true }],
  },
} satisfies Omit<OxlintOverride, 'files'>;
