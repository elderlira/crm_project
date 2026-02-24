<script setup lang="ts">
import { ref } from 'vue'

const startDate = ref('')
const endDate = ref('')
const user = ref('')
const department = ref('')
const channel = ref('')
</script>

<template>
    <div class="mb-8">
      <h1 class="text-h4 font-weight-black mb-2">Dashboard</h1>
      <p class="text-medium-emphasis">
        Acompanhe sua operação comercial em tempo real
      </p>
    </div>

  <div class="bg-white p-4 rounded-xl shadow-md flex flex-wrap gap-4 items-end">
    
    <div>
      <label class="block text-sm text-gray-500">Dt Início</label>
      <input type="datetime-local" v-model="startDate"
        class="border rounded-lg px-3 py-2" />
    </div>

    <div>
      <label class="block text-sm text-gray-500">Dt Fim</label>
      <input type="datetime-local" v-model="endDate"
        class="border rounded-lg px-3 py-2" />
    </div>

    <div>
      <label class="block text-sm text-gray-500">Usuário</label>
      <select v-model="user" class="border rounded-lg px-3 py-2">
        <option value="">Todos</option>
      </select>
    </div>

    <div>
      <label class="block text-sm text-gray-500">Departamento</label>
      <select v-model="department" class="border rounded-lg px-3 py-2">
        <option value="">Todos</option>
      </select>
    </div>

    <div>
      <label class="block text-sm text-gray-500">Canal</label>
      <select v-model="channel" class="border rounded-lg px-3 py-2">
        <option value="">Todos</option>
      </select>
    </div>

    <button
      class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
    >
      Atualizar
    </button>

  </div>
</template>