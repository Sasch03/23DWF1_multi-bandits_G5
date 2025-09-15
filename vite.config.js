import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const repoName = '23DWF1_multi-bandits_G5' // dein GitHub-Repo-Name
// eslint-disable-next-line no-undef
const base = process.env.NODE_ENV === 'production' ? `/${repoName}/` : '/'

export default defineConfig({
    plugins: [tailwindcss(), react()],
    resolve: {
        alias: { "@": path.resolve(__dirname, "./src") }
    },
    base
})
