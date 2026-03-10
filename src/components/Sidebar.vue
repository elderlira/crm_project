<template>
  <aside :class="[
    'h-screen bg-black text-white flex flex-col transition-all duration-300',
    isOpen ? 'w-64' : 'w-20'
  ]" style="background-color: #191970;">
    <div class="aside-color">
      <div :class="isOpen ? 'd-flex justify-center teste' : 'd-flex justify-center'">
        <button @click="emit('toggle')"
          :class="isOpen ? 'w - full p - 3 hover: bg - purple - 700 transition' : 'w - full p - 3 '"
          :style="isOpen ? '' : { backgroundColor: '#191970' }">
          ☰
        </button>
        <div :class="isOpen ? 'd-flex justify-center items-center gap-3 pt-15 pb-4 px-4 border-b' : ''">

          <div v-if="isOpen">
            <div class="font-bold text-sm">Nome da Empresa</div>
            <div :class="isOpen ? 'text-xs' : 'text-xs text-purple-400'">CRM</div>
          </div>
        </div>
      </div>
      <nav class="mt-4 space-y-2 px-2">
        <RouterLink to="/" class="flex items-center gap-3 p-3 rounded hover:bg-purple-700 transition">
          📊 <span v-if="isOpen">Dashboard</span>
        </RouterLink>

        <RouterLink to="/pipeline" class="flex items-center gap-3 p-3 rounded hover:bg-purple-700 transition">
          📈 <span v-if="isOpen">Pipeline</span>
        </RouterLink>

        <RouterLink to="/metas" class="flex items-center gap-3 p-3 rounded hover:bg-purple-700 transition">
          🎯 <span v-if="isOpen">Metas</span>
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

    <v-divider :thickness="2" class="bg-grey-lighten-3" /> <!-- ou a cor que preferir -->

    <div class="p-4 border-t flex items-center justify-between gap-3 rodape">
      <div class="flex items-center gap-3 flex-1">
        <span class="text-xl">👤</span>
        <div v-if="isOpen" class="min-w-0">
          <div class="text-sm font-medium truncate">{{ auth.user.username.toUpperCase() }}</div>
          <div class="text-xs text-purple-400 truncate">{{ auth.user.role.toUpperCase() }}</div>
        </div>
      </div>
      <div v-if="isOpen">
        <v-btn @click="logout" size="small" variant="text" color="#8B0000" icon="mdi-logout"></v-btn>
      </div>
    </div>


  </aside>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../services/authStore';

const auth = useAuthStore()

const router = useRouter()

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['toggle'])

const logout = () => {
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")

  router.push("/login")
}
</script>

<style>
.rodape {
  background-color: 191970;
}

.aside-color {
  background-color: #191970;
}

.teste {
  background-image: url('@/assets/crm2.png');
  background-size: cover;
}
</style>