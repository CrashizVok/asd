import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The proxy lets the frontend call /api during development without CORS.
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },
});
