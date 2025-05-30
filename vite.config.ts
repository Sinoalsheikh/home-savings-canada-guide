
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      // Security headers for development
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      // CSP for development (more restrictive in production)
      'Content-Security-Policy': mode === 'development' 
        ? "default-src 'self' 'unsafe-eval' 'unsafe-inline' data: blob: wss: ws: https://cdn.gpteng.co; object-src 'none'; base-uri 'self';"
        : "default-src 'self'; script-src 'self' https://cdn.gpteng.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none';"
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Only apply production optimizations in production mode
    ...(mode === 'production' && {
      minify: 'terser',
      sourcemap: false,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    }),
    ...(mode === 'development' && {
      minify: false,
      sourcemap: true
    }),
    rollupOptions: {
      output: {
        // Code splitting for better performance
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-toast', '@radix-ui/react-dialog', '@radix-ui/react-checkbox'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query']
        }
      }
    },
    target: 'es2020',
    cssCodeSplit: true,
    assetsInlineLimit: 4096
  },
  define: {
    __DEV__: mode === 'development'
  }
}));
