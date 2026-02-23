<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['toggle'])
</script>

<template>
  <aside :class="[
    'h-screen bg-black text-white flex flex-col transition-all duration-300',
    isOpen ? 'w-64' : 'w-20'
  ]" style="background-color: #552F9B;">
    <div class="aside-color">
      <button @click="emit('toggle')" class="w-full p-3 hover:bg-purple-700 transition"
        :style="{ backgroundColor: '552F9B' }">
        ☰
      </button>
      <div class="flex items-center gap-3 pt-6 pb-4 px-4 border-b">
        <div class="bg-purple-600 w-10 h-10 rounded flex items-center justify-center">
          🚀
        </div>

        <div v-if="isOpen">
          <div class="font-bold text-sm">Nome da Empresa</div>
          <div class="text-xs text-purple-400">CRM</div>
        </div>
      </div>

      <nav class="mt-4 space-y-2 px-2">
        <RouterLink to="/" class="flex items-center gap-3 p-3 rounded hover:bg-purple-700 transition">
          📊 <span v-if="isOpen">Dashboard</span>
        </RouterLink>

        <RouterLink to="/pipeline" class="flex items-center gap-3 p-3 rounded hover:bg-purple-700 transition">
          📈 <span v-if="isOpen">Pipeline</span>
        </RouterLink>

        <RouterLink to="/conversas" class="flex items-center gap-3 p-3 rounded hover:bg-purple-700 transition">
          💬 <span v-if="isOpen">Conversas</span>
        </RouterLink>

        <RouterLink to="/leads" class="flex items-center gap-3 p-3 rounded hover:bg-purple-700 transition">
          👥 <span v-if="isOpen">Leads</span>
        </RouterLink>

        <RouterLink to="/configuracoes" class="flex items-center gap-3 p-3 rounded hover:bg-purple-700 transition">
          ⚙️ <span v-if="isOpen">Configurações</span>
        </RouterLink>
      </nav>
    </div>

    <!-- RODAPÉ -->
    <div class="p-4 border-t flex items-center gap-3 mt-auto rodape">
      👤
      <div v-if="isOpen">
        <div class="text-sm">João Silva</div>
        <div class="text-xs text-purple-400">Administrador</div>
      </div>
    </div>
  </aside>
</template>

<style>
.rodape {
  background-color: black;
}

.aside-color {
  background-color: #552F9B;

}
</style>