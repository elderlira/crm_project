<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title class="d-flex justify-space-between align-center">
        Gerenciamento de Usuários
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog">
          Novo Usuário
        </v-btn>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="users"
        :loading="loading"
        class="elevation-1 mt-4"
      >
      <template v-slot:item.phone="{ item }">
        {{ item.phone || '---' }}
      </template>

      <template v-slot:item.is_online="{ item }">
    <v-chip
      :color="item.is_online ? 'success' : 'grey-lighten-1'"
      size="small"
      class="font-weight-bold"
      label
    >
      <v-icon start icon="mdi-circle" size="10" v-if="item.is_online"></v-icon>
      {{ item.is_online ? 'ON' : 'OFF' }}
    </v-chip>
  </template>

  <template v-slot:item.last_login_at="{ item }">
    <span class="text-caption">{{ item.last_login_at || 'Nunca' }}</span>
  </template>

  <template v-slot:item.last_logout_at="{ item }">
    <span class="text-caption">{{ item.last_logout_at || '---' }}</span>
  </template>

    <template v-slot:item.actions="{ item }">
      <v-icon size="small" class="me-2" color="blue" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon size="small" color="red" @click="deleteItem(item)">mdi-delete</v-icon>
    </template>
  </v-data-table>
      
    </v-card>

    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="pa-4 bg-primary text-white">
          <span class="text-h6">{{ editedItem.id ? 'Editar Usuário' : 'Novo Usuário' }}</span>
        </v-card-title>

        <v-card-text class="pa-4">
          <v-form ref="formRef">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.username" label="Nome" variant="outlined"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.email" label="E-mail" variant="outlined"></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
              <v-text-field
                v-model="editedItem.phone"
                label="Celular (Apenas números)"
                placeholder="71988887777"
                variant="outlined"
                maxlength="11"
                counter
              ></v-text-field>
            </v-col>

              <v-col cols="12" sm="6" v-if="!editedItem.id">
                <v-text-field v-model="editedItem.password" label="Senha" type="password" variant="outlined"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="editedItem.role" :items="roles" item-title="name" item-value="id" label="Cargo" variant="outlined"></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="editedItem.company"
                  :items="companies"
                  item-title="name"
                  item-value="id"
                  label="Empresa"
                  variant="outlined"
                  @update:model-value="onCompanyChange"
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="editedItem.department"
                  :items="filteredDepartments"
                  item-title="name"
                  item-value="id"
                  label="Departamento"
                  variant="outlined"
                  :disabled="!editedItem.company"
                  :no-data-text="editedItem.company ? 'Nenhum departamento nesta empresa' : 'Selecione uma empresa primeiro'"
                ></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="close">Cancelar</v-btn>
          <v-btn color="primary" @click="save">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'
import { title } from 'process'

const dialog = ref(false)
const loading = ref(false)
const users = ref([])
const roles = ref([])
const companies = ref([])
const allDepartments = ref([]) // Lista completa do backend

const headers = [
  { title: 'Usuário', key: 'username' },
  {title:'Celular',key:'phone'},
  { title: 'Cargo', key: 'role_name' },
  { title: 'Empresa', key: 'company_name' },
  { title: 'Departamento', key: 'department_name' },
  { title: 'Online', key: 'is_online' }, 
  { title: 'Último Login', key: 'last_login_at' }, 
  { title: 'Último Logout', key: 'last_logout_at' },
  { title: 'Ações', key: 'actions', sortable: false },
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

// Lógica de Filtro em Cascata
const filteredDepartments = computed(() => {
  if (!editedItem.value.company) return []
  return allDepartments.value.filter(d => d.company === editedItem.value.company)
})

// Quando mudar a empresa, limpa o departamento selecionado
const onCompanyChange = () => {
  editedItem.value.department = null
}

async function fetchData() {
  loading.value = true
  try {
    const [u, r, c, d] = await Promise.all([
      api.get('users/'),
      api.get('roles/'),
      api.get('companies/'),
      api.get('departments/')
    ])
    users.value = u.data
    roles.value = r.data
    companies.value = c.data
    allDepartments.value = d.data
  } catch (err) { console.error(err) }
  finally { loading.value = false }
}

const openDialog = () => {
  editedItem.value = { id: null, username: '', email: '', password: '', role: null, company: null, department: null }
  dialog.value = true
}

const editItem = (item) => {
  editedItem.value = { ...item }
  dialog.value = true
}

const close = () => { dialog.value = false }

const save = async () => {
  try {
    if (editedItem.value.id) {
      await api.put(`users/${editedItem.value.id}/`, editedItem.value)
    } else {
      await api.post('users/', editedItem.value)
    }
    fetchData()
    close()
  } catch (err) { alert("Erro ao salvar usuário.") }
}

onMounted(fetchData)

// DENTRO DO <script setup lang="ts">

// Verifique se o nome está exatamente igual ao que você colocou no @click da tabela
const deleteItem = async (item: any) => {
  if (confirm(`Deseja realmente excluir o usuário ${item.username}?`)) {
    try {
      // Chamada para o seu backend Django
      await api.delete(`users/${item.id}/`);
      
      // Mensagem de sucesso e atualiza a lista
      alert("Usuário excluído com sucesso!");
      fetchData(); 
    } catch (error: any) {
      console.error("Erro ao excluir usuário:", error);
      if (error.response?.status === 403) {
        alert("Você não tem permissão para excluir (Apenas Admins).");
      } else {
        alert("Ocorreu um erro ao tentar excluir.");
      }
    }
  }
};
</script>