<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  color: string
  icon: string
}>()
</script>

<template>
  <v-card rounded="xl" elevation="3" class="pa-5 position-relative">

    <v-avatar
      size="44"
      :style="{ backgroundColor: color }"
      class="metric-avatar"
    >
      <v-icon color="white">
        {{ icon }}
      </v-icon>
    </v-avatar>

    <div class="text-center mt-6">
      <div class="text-h4 font-weight-bold">
        {{ value }}
      </div>
      <div class="text-subtitle-2 text-medium-emphasis mt-2">
        {{ title }}
      </div>
    </div>

  </v-card>
</template>

<style scoped>
.metric-avatar {
  position: absolute;
  top: 5px;
  left: 10px;
}
</style>