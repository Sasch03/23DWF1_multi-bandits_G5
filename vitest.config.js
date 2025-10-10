import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            // eslint-disable-next-line no-undef
            '@': path.resolve(__dirname, 'src'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: "./vitest.setup.js",
        coverage: {
            reporter: ['text', 'html'],
            exclude: [
                'dist/**',
                'docs/**',
                'src/components/ui/**',
                '**/*.config.js',
                'src/lib/**',
                'src/main.jsx',
            ],
        },
    },
});
