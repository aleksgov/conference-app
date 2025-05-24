import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
    base: './',
    plugins: [
        react(),
        tailwindcss(),
    ],
    server: {
        proxy: {
            '/status': 'http://localhost:8080',
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, '')
            }
        }
    },
    define: {
        'process.env.VITE_DEV_SERVER_URL': command === 'serve' ? '"http://localhost:5173"' : '""'
    },
    build: {
        outDir: 'dist'
    }
}));
