
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
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Security enhancements for production
    rollupOptions: {
      output: {
        // Remove comments and console.logs in production
        compact: true,
      }
    },
    // Enable source maps for debugging but exclude sensitive info
    sourcemap: mode === 'development',
  }
}));
