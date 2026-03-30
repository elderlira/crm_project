<template>
  <v-container fluid>
    <v-card elevation="2" rounded="xl">
      <v-toolbar flat color="white">
        <v-toolbar-title>Gestão de Usuários</v-toolbar-title>
        <v-spacer />
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog">
          Novo Usuário
        </v-btn>
      </v-toolbar>

      <v-data-table :headers="headers" :items="users" :loading="loading">
        <template v-slot:item.actions="{ item }">
          <v-icon size="small" color="blue" class="me-2" @click="editItem(item)">mdi-pencil</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card rounded="xl">
        <v-card-title class="pa-4 bg-primary text-white">{{ formTitle }}</v-card-title>
        <v-card-text class="pa-6">
          <v-form v-model="isFormValid">
            <v-row>
              <v-col cols="12" sm="6"><v-text-field v-model="editedItem.username" label="Usuário" variant="outlined" density="compact" /></v-col>
              <v-col cols="12" sm="6"><v-text-field v-model="editedItem.email" label="E-mail" variant="outlined" density="compact" /></v-col>
              
              <v-col cols="12" sm="6">
                <v-select v-model="editedItem.company" :items="companiesList" item-title="name" item-value="id" label="Empresa" variant="outlined" density="compact" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="editedItem.department" :items="deptsList" item-title="name" item-value="id" label="Departamento" variant="outlined" density="compact" />
              </v-col>
              <v-col cols="12">
                <v-select v-model="editedItem.role" :items="rolesList" item-title="name" item-value="id" label="Cargo" variant="outlined" density="compact" />
              </v-col>
              
              <v-col cols="12" v-if="!editedItem.id">
                <v-text-field v-model="editedItem.password" label="Senha" type="password" variant="outlined" density="compact" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" variant="elevated" @click="save">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios' 

const dialog = ref(false)
const loading = ref(false)
const search = ref("")
const isFormValid = ref(false)

// Listas inicializadas vazias para evitar erros de undefined
const users = ref([])
const rolesList = ref([])      
const companiesList = ref([])  
const deptsList = ref([])      

const headers = [
  { title: 'Usuário', key: 'username' },
  { title: 'E-mail', key: 'email' },
  { title: 'Empresa', key: 'company_name' },
  { title: 'Departamento', key: 'department_name' },
  { title: 'Cargo', key: 'role_name' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' },
]

const editedItem = ref({
  id: null,
  username: '',
  email: '',
  password: '',
  role: null,
  company: null,
  department: null
})

const formTitle = computed(() => editedItem.value.id ? 'Editar Usuário' : 'Novo Usuário')

// DENTRO DO UserRegister.vue
const fetchData = async () => {
  loading.value = true
  try {
    // Chamadas limpas, o Axios completa com a baseURL
    const [uRes, rRes, cRes, dRes] = await Promise.all([
      api.get('users/'),      
      api.get('roles/'),      
      api.get('companies/'),  
      api.get('departments/') 
    ])
    
    users.value = uRes.data.results || uRes.data
    rolesList.value = rRes.data.results || rRes.data
    companiesList.value = cRes.data.results || cRes.data
    deptsList.value = dRes.data.results || dRes.data
  } catch (error) {
    console.error("Erro ao carregar dados:", error)
  } finally {
    loading.value = false
  }
}

// FUNÇÃO DO BOTÃO - COM LOG PARA TESTE
const openDialog = () => {
  console.log("BOTÃO CLICADO!"); 
  editedItem.value = { id: null, username: '', email: '', password: '', role: null, company: null, department: null }
  dialog.value = true
}

const save = async () => {
  try {
    if (editedItem.value.id) {
      await api.put(`auth/users/${editedItem.value.id}/`, editedItem.value)
    } else {
      await api.post('auth/users/', editedItem.value)
    }
    dialog.value = false
    fetchData()
  } catch (error) {
    console.error("Erro ao salvar:", error)
  }
}

const editItem = (item: any) => {
  editedItem.value = { ...item }
  dialog.value = true
}

onMounted(() => {
  fetchData()
})
</script>
<style scoped>
.v-data-table :deep(td) {
  white-space: nowrap;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>