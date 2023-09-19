const path = require('path')

export default {
    root: path.resolve(__dirname, 'src'),
    resolve: {
        alias: {
            '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
        }
    },
    build: {
        outDir: '../dist',
        manifest: true,
        minify: true,
        reportCompressedSize: true,
        lib: {
            entry: path.resolve(__dirname, "src/js/main.js"),
            fileName: "main",
            formats: ["es", "cjs"],
        },
        rollupOptions: {
            external: [],
        }
    },
    server: {
        port: 8080,
        hot: true
    }
}
