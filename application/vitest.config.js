import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        coverage: {
            reporter: ['text', 'html'],
            exclude: [
                'src/components/ui/**',
                '**/*.config.js',
                'src/lib/**',
                'src/main.jsx',
                'src/App.jsx',
            ],
        },
    },
});
