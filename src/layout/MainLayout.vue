<template>
  <div class="flex h-screen overflow-hidden">

    <div
      v-if="isMobileOpen"
      class="fixed inset-0 bg-black/50 z-20 md:hidden"
      @click="isMobileOpen = false"
    ></div>

    <!-- Sidebar -->
    <Sidebar
      :collapsed="isCollapsed"
      :mobileOpen="isMobileOpen"
      @toggleMobile="toggleMobile"
      class="z-30"
    />

    <div class="flex-1 flex flex-col">

      <header class="h-16 bg-white border-b flex items-center justify-between px-6">

        <button
          class="hidden md:block text-gray-700"
          @click="toggleCollapse"
        >
          ☰
        </button>

        <button
          class="md:hidden text-gray-700"
          @click="toggleMobile"
        >
          ☰
        </button>

        <span class="font-semibold">CRM</span>
      </header>

      <main class="flex-1 bg-gray-100 p-6 overflow-auto">
        <router-view />
      </main>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '../components/Sidebar.vue'

const isCollapsed = ref(false)
const isMobileOpen = ref(false)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const toggleMobile = () => {
  isMobileOpen.value = !isMobileOpen.value
}
</script>
