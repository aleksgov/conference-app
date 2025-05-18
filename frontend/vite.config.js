import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
    return {
        plugins: [react()],
        server: {
            proxy: {
                '/status': 'http://localhost:8080',
            }
        },
        define: {
            'process.env.VITE_DEV_SERVER_URL': command === 'serve' ? '"http://localhost:5173"' : '""',
        }
    }
})
