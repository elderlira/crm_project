<template>
  <!-- Título -->
  <div class="mb-6">
    <div class="text-h4 font-weight-bold">
      Dashboard
    </div>
    <div class="text-subtitle-2 text-medium-emphasis">
      Acompanhe sua operação comercial em tempo real
    </div>
  </div>

  <!-- Card de filtros -->
  <v-card rounded="xl" elevation="3" class="pa-4">
    <v-row dense align="end">

      <v-col cols="12" sm="6" md="3">
        <v-text-field v-model="startDate" label="Data Início" type="datetime-local" variant="outlined"
          density="comfortable" />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-text-field v-model="endDate" label="Data Fim" type="datetime-local" variant="outlined"
          density="comfortable" />
      </v-col>

      <v-col cols="12" sm="6" md="2">
        <v-select v-model="user" :items="users" label="Usuário" variant="outlined" density="comfortable" clearable />
      </v-col>

      <v-col cols="12" sm="6" md="2">
        <v-select v-model="department" :items="departments" label="Departamento" variant="outlined"
          density="comfortable" clearable />
      </v-col>

      <v-col cols="12" sm="6" md="2">
        <v-select v-model="channel" :items="channels" label="Canal" variant="outlined" density="comfortable"
          clearable />
      </v-col>
    </v-row>
  </v-card>
  <v-col cols="12" md="12" class="text-left">
    <v-btn color="primary" size="large" class="mt-2" @click="updateDashboard">
      Atualizar
    </v-btn>
  </v-col>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const startDate = ref<string | null>(null)
const endDate = ref<string | null>(null)
const user = ref<string | null>(null)
const department = ref<string | null>(null)
const channel = ref<string | null>(null)

const users = ['Administrador', 'Alfredo', 'Glauber']
const departments = ['SDR', 'Vendas', 'Suporte']
const channels = ['WhatsApp', 'Instagram', 'Email']

const updateDashboard = () => {
  console.log({
    startDate: startDate.value,
    endDate: endDate.value,
    user: user.value,
    department: department.value,
    channel: channel.value
  })
}
</script>