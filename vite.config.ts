import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true, // Enable defineModel macro support
        propsDestructure: true, // Enable reactive props destructuring
      },
    }),
    tailwindcss(),
  ],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  // Build optimizations for production
  build: {
    target: 'esnext', // Modern browsers = smaller bundle
    minify: true, // Use default minifier (oxc in rolldown-vite)
    
    // Smart code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split vendor dependencies into separate chunks
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('pinia')) {
              return 'vue-vendor'
            }
            if (id.includes('@kitbag/router')) {
              return 'router'
            }
            if (id.includes('@vueuse') || id.includes('zod')) {
              return 'utils'
            }
          }
        },
      },
    },
    
    // Disable source maps in production for smaller size
    sourcemap: false,
    
    // Enable CSS code splitting per component
    cssCodeSplit: true,
    
    // Skip compression reporting for faster builds
    reportCompressedSize: false,
    
    chunkSizeWarningLimit: 1000,
  },

  // Development server optimizations
  server: {
    hmr: {
      overlay: true, // Show errors as overlay
    },
  },

  // Dependency pre-bundling optimization
  optimizeDeps: {
    include: [
      'vue',
      'pinia',
      '@kitbag/router',
      '@vueuse/core',
      'zod',
    ],
    // Icons work better without pre-bundling
    exclude: ['@vue-hero-icons/outline'],
  },
})
