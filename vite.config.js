import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(), // no babel plugin — keeps it simple and build-safe
  ],

  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,
    minify: 'esbuild', // esbuild is built into Vite — always available, no extra install
    sourcemap: false,
    assetsInlineLimit: 4096,

    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':    ['react', 'react-dom', 'react-router-dom'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'vendor-ui':       ['lucide-react', 'react-hot-toast'],
          'vendor-markdown': ['react-markdown', 'remark-gfm'],
          'vendor-date':     ['date-fns'],
        },
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'react-hot-toast', 'lucide-react'],
    exclude: ['@uiw/react-md-editor'],
  },

  resolve: {
    alias: {
      '@':            '/src',
      '@components':  '/src/components',
      '@pages':       '/src/pages',
      '@hooks':       '/src/hooks',
      '@utils':       '/src/utils',
      '@firebase':    '/src/firebase',
      '@context':     '/src/context',
    },
  },
})