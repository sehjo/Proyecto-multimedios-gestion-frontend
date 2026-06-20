import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import importX from 'eslint-plugin-import-x';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Ignore build output and the legacy mock/JS API layer (migrated incrementally).
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'import-x': importX,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // bulletproof-react unidirectional architecture: shared -> features -> app.
      // Features (modules) must not import each other; the app layer composes them.
      'import-x/no-restricted-paths': [
        'error',
        {
          zones: [
            // No cross-feature imports (each module only imports its own files).
            { target: './src/app/modules/auth', from: './src/app/modules', except: ['./auth'] },
            { target: './src/app/modules/users', from: './src/app/modules', except: ['./users'] },
            // The app shell (routes/App) is the top layer: modules can't import it.
            { target: './src/app/modules', from: './src/app/App.tsx' },
            { target: './src/app/modules', from: './src/app/routes.ts' },
          ],
        },
      ],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // The codebase uses `any` in a few error handlers; warn instead of error
      // so lint stays actionable without a noisy first run.
      '@typescript-eslint/no-explicit-any': 'warn',
      // Allow intentionally-unused names prefixed with _ (e.g. placeholder args).
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // react-hooks v7 ships strict React-Compiler rules that flag valid existing
      // patterns (init from storage/URL in a mount effect, useRef(Date.now()),
      // controlled mutations). Keep them as hints, not build-breaking errors.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/immutability': 'warn',
    },
  }
);
