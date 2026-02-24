<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="bg-white rounded-xl shadow-md p-6">
    
    <div class="flex justify-between items-center mb-4">
      <h3 class="font-semibold text-gray-700">
        {{ title }}
      </h3>
      <span class="text-gray-400">≡</span>
    </div>

    <!-- IMPORTANTE -->
    <div class="w-full" style="height:300px;">
      <slot />
    </div>

  </div>
</template>