import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import svgLoader from 'vite-svg-loader';

const projectRoot = path.resolve(__dirname, '../..');
const rendererRoot = __dirname;
const distPath = path.resolve(projectRoot, 'dist/renderer');
const sharePath = path.resolve(projectRoot, 'src/share');

export default defineConfig({
    plugins: [
        vue(),
        svgLoader(),
    ],
    root: rendererRoot,
    resolve: {
        alias: {
            '@': rendererRoot,
            '@share': sharePath,
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use '@/styles/variables' as *;`,
                api: 'modern',
            },
        },
    },
    build: {
        outDir: distPath,
        emptyOutDir: true,
        rollupOptions: {
            input: path.resolve(rendererRoot, 'index.html'),
        },
    },
    base: '',
    server: {
        port: 3000,
    },
});
