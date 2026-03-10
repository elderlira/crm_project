import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import path from 'path'

export default defineConfig({
  plugins: [
    vue({
      template: {
        transformAssetUrls
      }
    }),
    vuetify({ autoImport: true }),
    Components({
      resolvers: [
        IconsResolver({
          prefix: 'i',
        }),
      ],
      dts: true,
    }),
    Icons({
      compiler: 'vue3',
      autoInstall: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.svg']
})

