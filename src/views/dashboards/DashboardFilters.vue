<template>
  <div>
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
    <v-row dense class="mt-2 mb-4">
      <v-col cols="12">
        <v-card rounded="xl" elevation="3" class="pa-4">
          <v-row class="pt-4">

            <v-col cols="12" lg="2" md="3" sm="12">
              <v-text-field v-model="startDate" label="Data Início" type="datetime-local" variant="outlined"
                density="comfortable" />
            </v-col>

            <v-col cols="12" lg="2" md="3" sm="12">
              <v-text-field v-model="endDate" label="Data Fim" type="datetime-local" variant="outlined"
                density="comfortable" />
            </v-col>

            <v-col cols="12" lg="2" md="2" sm="12">
              <v-select v-model="user" :items="users" label="Usuário" variant="outlined" density="comfortable"
                clearable />
            </v-col>

            <v-col cols="12" lg="2" md="2" sm="12">
              <v-select v-model="department" :items="departments" label="Departamento" variant="outlined"
                density="comfortable" clearable />
            </v-col>

            <v-col cols="12" lg="2" md="2" sm="12">
              <v-select v-model="channel" :items="channels" label="Canal" variant="outlined" density="comfortable"
                clearable />
            </v-col>

            <v-col cols="12" lg="2" md="6" sm="12" class="d-flex text-left">
              <v-btn color="primary" size="large" @click="updateDashboard">
                Atualizar
              </v-btn>
            </v-col>
          </v-row>

        </v-card>

      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const startDate = ref('')
const endDate = ref('')
const user = ref('')
const department = ref('')
const channel = ref('')

const users = ['Administrador', 'Alfredo', 'Glauber']
const departments = ['SDR', 'Vendas', 'Suporte']
const channels = ['WhatsApp', 'Instagram', 'Email']

interface FilterData {
  startDate: string,
  endDate: string,
  user: string,
  department: string,
  channel: string
}

const emit = defineEmits<{
  (e: 'valorAEnviar', payload: FilterData): void
}>()


const updateDashboard = () => {

  const filterData: FilterData = {
    startDate: startDate.value,
    endDate: endDate.value,
    user: user.value,
    department: department.value,
    channel: channel.value
  }

  // console.log(filterData)

  emit('valorAEnviar', filterData)

}
</script>

<style></style>