<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['toggle'])
</script>

<template>
  <aside
    :class="[
      'bg-black text-white flex flex-col justify-between transition-all duration-300',
      isOpen ? 'w-64' : 'w-20'
    ]"
  >
    <!-- TOPO -->
    <div>
      <!-- Header -->
      <div class="flex items-center gap-3 p-4 border-b border-purple-600">
        <div class="bg-purple-600 w-10 h-10 rounded flex items-center justify-center">
          🚀
        </div>

        <div v-if="isOpen">
          <div class="font-bold text-sm">Nome da Empresa</div>
          <div class="text-xs text-purple-400">CRM</div>
        </div>
      </div>

      <!-- BOTÃO TOGGLE -->
      <button
        @click="emit('toggle')"
        class="w-full p-3 hover:bg-purple-700 transition"
      >
        ☰
      </button>

      <!-- MENU -->
      <nav class="mt-4 space-y-2 px-2">
        <RouterLink
          to="/"
          class="flex items-center gap-3 p-3 rounded hover:bg-purple-700 transition"
        >
          📊 <span v-if="isOpen">Dashboard</span>
        </RouterLink>

        <RouterLink
          to="/pipeline"
          class="flex items-center gap-3 p-3 rounded hover:bg-purple-700 transition"
        >
          📈 <span v-if="isOpen">Pipeline</span>
        </RouterLink>

        <RouterLink
          to="/conversas"
          class="flex items-center gap-3 p-3 rounded hover:bg-purple-700 transition"
        >
          💬 <span v-if="isOpen">Conversas</span>
        </RouterLink>

        <RouterLink
          to="/leads"
          class="flex items-center gap-3 p-3 rounded hover:bg-purple-700 transition"
        >
          👥 <span v-if="isOpen">Leads</span>
        </RouterLink>

        <RouterLink
          to="/configuracoes"
          class="flex items-center gap-3 p-3 rounded hover:bg-purple-700 transition"
        >
          ⚙️ <span v-if="isOpen">Configurações</span>
        </RouterLink>
      </nav>
    </div>

    <!-- RODAPÉ -->
    <div class="p-4 border-t border-purple-600 flex items-center gap-3">
      👤
      <div v-if="isOpen">
        <div class="text-sm">João Silva</div>
        <div class="text-xs text-purple-400">Administrador</div>
      </div>
    </div>
  </aside>
</template>
