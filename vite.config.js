import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {NodeGlobalsPolyfillPlugin} from '@esbuild-plugins/node-globals-polyfill'
import {NodeModulesPolyfillPlugin} from "@esbuild-plugins/node-modules-polyfill";
import nodePolyfills from "rollup-plugin-polyfill-node";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            url: "rollup-plugin-node-polyfills/polyfills/url",
            util: "rollup-plugin-node-polyfills/polyfills/util",
            querystring: "rollup-plugin-node-polyfills/polyfills/qs",
        },
    },
    optimizeDeps: {
        esbuildOptions: {
            // Node.js global to browser globalThis
            define: {
                global: 'globalThis'
            },
            // Enable esbuild polyfill plugins
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    buffer: true,
                    process: true
                }),
                NodeModulesPolyfillPlugin()
            ]
        }
    },
    build: {
        rollupOptions: {
            // Enable rollup polyfills plugin
            // used during production bundling
            plugins: [nodePolyfills()],
        },
        commonjsOptions: {
            esmExternals: true
        },
    },

})
