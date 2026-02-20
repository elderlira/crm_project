import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        // 2. Resolver ícones automaticamente
        IconsResolver({
          prefix: 'i', // prefixo para usar no template: <i-mdi-account />
        }),
      ],
      dts: true, // Gera componentes.d.ts para TypeSupport
    }),
    // 3. Plugin de ícones
    Icons({
      compiler: 'vue3',
      autoInstall: true, // Instala o pacote de ícones automaticamente se faltar
    }),
  ],
})
