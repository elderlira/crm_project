<template>
  <div class="flex h-screen overflow-hidden">
    <Sidebar :isOpen="isOpen" @toggle="isOpen = !isOpen" v-if="!$route.meta.hideSidebar" />

    <main class="flex-1 bg-gray-100 overflow-auto">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import { useAuthStore } from './services/authStore'

const auth = useAuthStore()

onMounted(() => {
  if (auth.token) {
    auth.loadUser()
  }
})

const isOpen = ref(true)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}
</script>