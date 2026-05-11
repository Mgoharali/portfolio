import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      // Babel fast-refresh only in dev; production gets full optimization
      babel: {
        plugins: [
          // Remove prop-types in production (saves ~3KB)
          ...(process.env.NODE_ENV === 'production'
            ? [['babel-plugin-transform-react-remove-prop-types', { removeImport: true }]]
            : []),
        ],
      },
    }),
  ],

  build: {
    // Target modern browsers — smaller output, no legacy polyfills
    target: 'es2020',

    // Warn if any chunk exceeds 400KB (default 500KB)
    chunkSizeWarningLimit: 400,

    // Enable CSS code splitting — each async chunk gets its own CSS
    cssCodeSplit: true,

    // Minification: esbuild is faster, terser is smaller
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,   // removes console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },

    rollupOptions: {
      output: {
        // Manual chunk splitting — keeps vendor code separate so
        // users don't re-download React when only your code changes
        manualChunks: {
          // React core — changes rarely, cached aggressively
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],

          // UI utilities
          'vendor-ui': ['lucide-react', 'react-hot-toast'],

          // Blog/markdown — only loaded on blog pages
          'vendor-markdown': ['react-markdown', 'remark-gfm'],

          // Date utility
          'vendor-date': ['date-fns'],
        },

        // Content-hash filenames → perfect long-term caching
        entryFileNames:   'assets/[name].[hash].js',
        chunkFileNames:   'assets/[name].[hash].js',
        assetFileNames:   'assets/[name].[hash].[ext]',
      },
    },

    // Generate source maps for production error tracking (optional: set false to save size)
    sourcemap: false,

    // Asset inlining threshold: files < 4KB become base64 inline
    assetsInlineLimit: 4096,
  },

  // Dependency pre-bundling optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-hot-toast',
      'lucide-react',
    ],
    // Exclude heavy optional deps from pre-bundle
    exclude: ['@uiw/react-md-editor'],
  },

  // Path alias — cleaner imports, avoids deep relative paths
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages':      '/src/pages',
      '@hooks':      '/src/hooks',
      '@utils':      '/src/utils',
      '@context':    '/src/context',
    },
  },
})