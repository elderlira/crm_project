<template>
    <v-container>
      <v-sheet border rounded>
        <v-data-table 
          :headers="headers" 
          :items="departments" 
          :loading="loading"
          hover
          no-data-text="Sem departamentos cadastrados"
        >
          <template v-slot:item.company_name="{ item }">
            <v-chip color="primary" size="small" label>
              <v-icon start icon="mdi-domain" size="14"></v-icon>
              {{ item.company_name || 'Não vinculada' }}
            </v-chip>
          </template>
  
          <template v-slot:item.is_active="{ item }">
            <v-chip
              :color="item.is_active ? 'success' : 'error'"
              size="x-small"
              label
            >
              {{ item.is_active ? 'Ativo' : 'Inativo' }}
            </v-chip>
          </template>
  
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>
                <v-icon color="primary" icon="mdi-office-building-marker" size="small" start></v-icon>
                Gestão de Departamentos
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn color="primary" prepend-icon="mdi-plus" rounded="lg" variant="elevated" @click="add">
                ADICIONAR
              </v-btn>
            </v-toolbar>
          </template>
  
          <template v-slot:item.actions="{ item }">
            <div class="d-flex ga-2">
              <v-icon color="success" icon="mdi-pencil" size="small" @click="edit(item)"></v-icon>
              <v-icon color="error" icon="mdi-delete" size="small" @click="remove(item.id)"></v-icon>
            </div>
          </template>
        </v-data-table>
      </v-sheet>
  
      <v-dialog v-model="dialog" max-width="500px" persistent>
        <v-card>
          <v-card-title class="pa-4 bg-primary text-white">
            <span class="text-h6">{{ isEditing ? 'Editar Departamento' : 'Novo Departamento' }}</span>
          </v-card-title>
  
          <v-card-text class="pa-4">
            <v-form>
              <v-row>
                <v-col cols="12">
                  <v-text-field 
                    v-model="formModel.name" 
                    label="Nome do Departamento"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12">
                  <v-select
                    v-model="formModel.company"
                    :items="companies"
                    item-title="name"
                    item-value="id"
                    label="Vincular Empresa"
                    variant="outlined"
                    prepend-inner-icon="mdi-domain"
                    :loading="loadingCompanies"
                  ></v-select>
                </v-col>
                
                <v-col cols="12">
                  <v-switch 
                    v-model="formModel.is_active" 
                    :label="formModel.is_active ? 'Status: Ativo' : 'Status: Inativo'"
                    color="success" 
                    inset
                    hide-details
                  ></v-switch>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
  
          <v-divider></v-divider>
  
          <v-card-actions class="pa-4">
            <v-btn text="Cancelar" variant="plain" @click="dialog = false"></v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="elevated" @click="save">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref, computed } from 'vue'
  import api from '@/api/axios'
  
  const departments = ref([])
  const companies = ref([]) // Lista de empresas para o select
  const loading = ref(false)
  const loadingCompanies = ref(false)
  const dialog = ref(false)
  
  const headers = [
    { title: 'ID', key: 'id', align: 'start' },
    { title: 'Departamento', key: 'name' },
    { title: 'Empresa', key: 'company_name' },
    { title: 'Status', key: 'is_active', align: 'center' },
    { title: 'Ações', key: 'actions', align: 'center', sortable: false },
  ]
  
  const defaultItem = {
    id: null,
    name: '',
    is_active: true,
    company: null // Começa vazio para obrigar a escolha
  }
  
  const formModel = ref({ ...defaultItem })
  const isEditing = computed(() => !!formModel.value.id)
  
  // --- BUSCA DE DADOS ---
  
  async function fetchDepartments() {
    loading.value = true
    try {
      const response = await api.get('departments/')
      departments.value = response.data
    } catch (error) {
      console.error("Erro ao carregar departamentos:", error)
    } finally {
      loading.value = false
    }
  }
  
  async function fetchCompanies() {
    loadingCompanies.value = true
    try {
      const response = await api.get('companies/') // Rota que criamos no urls.py
      companies.value = response.data
    } catch (error) {
      console.error("Erro ao carregar empresas:", error)
    } finally {
      loadingCompanies.value = false
    }
  }
  
  onMounted(() => {
    fetchDepartments()
    fetchCompanies() // Carrega as empresas ao abrir a página
  })
  
  // --- AÇÕES ---
  
  function add() {
    formModel.value = { ...defaultItem }
    dialog.value = true
  }
  
  function edit(item: any) {
    formModel.value = { ...item }
    dialog.value = true
  }
  
  async function remove(id: number) {
    if (confirm('Deseja realmente excluir este departamento?')) {
      try {
        await api.delete(`departments/${id}/`)
        fetchDepartments()
      } catch (error) {
        alert("Erro ao excluir.")
      }
    }
  }
  
  async function save() {
    if (!formModel.value.company) {
      alert("Selecione uma empresa antes de salvar.");
      return;
    }
  
    try {
      const data = {
        name: formModel.value.name,
        is_active: formModel.value.is_active,
        company: formModel.value.company // Envia apenas o ID da empresa
      }
  
      if (isEditing.value) {
        await api.put(`departments/${formModel.value.id}/`, data)
      } else {
        await api.post('departments/', data)
      }
      
      dialog.value = false
      fetchDepartments()
    } catch (error: any) {
      console.error("Erro ao salvar:", error.response?.data)
      alert("Erro ao salvar. Verifique se o nome é único.")
    }
  }
  </script>