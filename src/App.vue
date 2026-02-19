<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'

const isSidebarOpen = ref(true)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <Sidebar :isOpen="isSidebarOpen" @toggle="toggleSidebar" />

    <!-- CONTEÚDO -->
    <main class="flex-1 bg-gray-100 p-6 overflow-y-auto">
      <router-view />
    </main>
  </div>

  <div class="flex h-screen overflow-hidden">
  <!-- Sidebar Desktop -->
  <div class="hidden md:block">
    <Sidebar :isOpen="isSidebarOpen" @toggle="toggleSidebar" />
  </div>

  <!-- Conteúdo -->
  <main class="flex-1 bg-gray-100 p-6 overflow-y-auto">
    <router-view />
  </main>
</div>

</template>
