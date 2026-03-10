<template>
  <aside :class="[
    'h-screen text-white d-flex flex-column transition-all duration-300',
    isOpen ? 'w-64' : 'w-20'
  ]" style="background-color: #191970;">

    <v-container fluid :class="isOpen ? 'pa-0 flex-grow-0 border-b background_image' : 'pa-0 flex-grow-0 border-b'"
      style="background-color: #191970;">
      <v-row v-if="isOpen" no-gutters class="ma-0 pa-14 justify-center border-b"
        style="border-color: rgba(255,255,255,0.1);">
        <v-col cols="12" class="pa-0 text-center">
          <div class="font-weight-bold text-body-2 mb-1">Nome da Empresa</div>
          <div class="text-caption">CRM</div>
        </v-col>
      </v-row>
    </v-container>

    <v-container fluid class="flex-grow-1 ma-0 overflow-hidden" style="background-color: #191970;">
      <v-row no-gutters class="ma-0 justify-center">
        <v-col cols="12" class="pa-0 text-center">
          <v-btn @click="emit('toggle')" block class="mb-4 pa-4 ma-0 white--text" color="purple" variant="text"
            elevation="0" :class="isOpen ? 'bg-transparent' : 'bg-transparent'" rounded>
            ☰
          </v-btn>
        </v-col>
      </v-row>
      <nav class="d-flex flex-column gap-2">
        <RouterLink to="/"
          class="d-flex align-center  pa-3 rounded hover:bg-purple-700 transition text-decoration-none">
          <span class="text-h5 mr-3">📊</span>
          <span v-if="isOpen" class="text-body-1">Dashboard</span>
        </RouterLink>

        <RouterLink to="/pipeline"
          class="d-flex align-center pa-3 rounded hover:bg-purple-700 transition text-decoration-none">
          <span class="text-h5 mr-3">📈</span>
          <span v-if="isOpen" class="text-body-1">Pipeline</span>
        </RouterLink>

        <RouterLink to="/metas"
          class="d-flex align-center pa-3 rounded hover:bg-purple-700 transition text-decoration-none">
          <span class="text-h5 mr-3">🎯</span>
          <span v-if="isOpen" class="text-body-1">Metas</span>
        </RouterLink>

        <RouterLink to="/conversas"
          class="d-flex align-center pa-3 rounded hover:bg-purple-700 transition text-decoration-none">
          <span class="text-h5 mr-3">💬</span>
          <span v-if="isOpen" class="text-body-1">Conversas</span>
        </RouterLink>

        <RouterLink to="/leads"
          class="d-flex align-center pa-3 rounded hover:bg-purple-700 transition text-decoration-none">
          <span class="text-h5 mr-3">👥</span>
          <span v-if="isOpen" class="text-body-1">Leads</span>
        </RouterLink>

        <RouterLink to="/configuracoes"
          class="d-flex align-center pa-3 rounded hover:bg-purple-700 transition text-decoration-none">
          <span class="text-h5 mr-3">⚙️</span>
          <span v-if="isOpen" class="text-body-1">Configurações</span>
        </RouterLink>
      </nav>
    </v-container>

    <v-divider thickness="2" class="mx-0" style="background-color: #f5f5f5 !important;"></v-divider>

    <v-container fluid class="pa-4 ma-0 flex-grow-0 border-t d-flex align-center justify-space-between"
      style="background-color: #191970; border-color: rgba(255,255,255,0.1);">
      <v-row no-gutters align="center" class="flex-grow-1">
        <v-col cols="auto" class="pa-0">
          <span class="text-h4">👤</span>
        </v-col>
        <v-col v-if="isOpen" class="pa-0 pl-3">
          <div class="text-body-1 font-weight-medium truncate-line">{{ auth.user.username.toUpperCase() }}</div>
          <div class="text-caption text-purple-400 truncate-line">{{ auth.user.role.toUpperCase() }}</div>
        </v-col>
      </v-row>

      <v-col cols="auto" class="pa-0">
        <v-btn v-if="isOpen" @click="logout" size="small" variant="text" color="#8B0000" icon="mdi-logout">
        </v-btn>
      </v-col>
    </v-container>

  </aside>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue'
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

<style scoped>
.background_image {
  background-image: url('@/assets/crm2.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 120px;
}
</style>
