import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  // Pin the dev port so Vite never silently jumps to 5174 when 5173 is taken.
  // The backend CORS only allows http://localhost:5173; a different origin gets
  // blocked and login "fails". strictPort makes a busy port fail loudly instead.
  server: {
    port: 5173,
    strictPort: true,
  },

  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router/')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/@radix-ui/')) {
            return 'radix-ui';
          }
          if (id.includes('node_modules/recharts/') || id.includes('node_modules/d3-')) {
            return 'charts';
          }
        },
      },
    },
  },
})
