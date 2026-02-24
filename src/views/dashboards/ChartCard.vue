<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <v-card
    rounded="xl"
    elevation="3"
    class="pa-5"
  >
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-subtitle-1 font-weight-semibold">
        {{ title }}
      </div>

      <v-btn
        icon
        variant="text"
        size="small"
      >
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </div>

    <!-- Área do gráfico -->
    <div style="height: 300px;">
      <slot />
    </div>
  </v-card>
</template>