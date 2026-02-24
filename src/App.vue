<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'

const isOpen = ref(true)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <Sidebar :isOpen="isOpen" @toggle="isOpen = !isOpen" />
    
    <main class="flex-1 bg-gray-100 overflow-auto">
      <router-view />
    </main>
  </div>
</template>
