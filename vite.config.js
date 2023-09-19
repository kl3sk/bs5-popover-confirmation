import {resolve} from 'path'
import {defineConfig} from 'vite'

export default defineConfig({
    root: resolve(__dirname, 'src'),
    resolve: {
        alias: {
            '~bootstrap': resolve(__dirname, 'node_modules/bootstrap'),
        }
    },
    build: {
        outDir: '../dist',
        manifest: true,
        minify: true,
        reportCompressedSize: true,
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, 'src/js/confirmation.js'),
            name: 'Bs popover confirmation',
            // the proper extensions will be added
            fileName: 'bs5-popover-confirmation',
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: ['vue', 'bootstrap', 'popperjs'],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    vue: 'Vue',
                    bootstrap: 'bootstrap',
                    popperjs: 'popperjs',
                },
            },
        },
    },
    server: {
        port: 8080,
        hot: true
    }
})