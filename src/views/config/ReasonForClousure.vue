<template>
  <v-sheet border rounded>
    <v-data-table :headers="headers" :hide-default-footer="reasons.length < 11" :items="reasons">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon color="medium-emphasis" icon="mdi-book-multiple" size="x-small" start></v-icon>

            Motivo de fechamento
          </v-toolbar-title>

          <v-btn class="me-2" prepend-icon="mdi-plus" rounded="lg" text="ADICIONAR" border @click="add"
            style="background-color: dodgerblue;"></v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.title="{ value }">
        <v-chip :text="value" border="thin opacity-25" prepend-icon="mdi-book" label>
          <template v-slot:prepend>
            <v-icon color="medium-emphasis"></v-icon>
          </template>
        </v-chip>
      </template>
      <template v-slot:item.active="{ item }">
        <v-icon :color="item.active ? 'success' : 'error'">
          {{ item.active ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline' }}
        </v-icon>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-icon color="success" icon="mdi-pencil" size="small" @click="edit(item.id)"></v-icon>

          <v-icon color="error" icon="mdi-delete" size="small" @click="remove(item.id)"></v-icon>
        </div>
      </template>

      <template v-slot:no-data>
        <v-btn prepend-icon="mdi-backup-restore" rounded="lg" text="Reset data" variant="text" border
          @click="reset"></v-btn>
      </template>
    </v-data-table>
  </v-sheet>

  <v-dialog v-model="dialog" max-width="500">
    <v-card :subtitle="`${isEditing ? 'Update' : 'Create'} your favorite book`"
      :title="`${isEditing ? 'Editar' : 'Adicionar'} fechamento`">
      <template v-slot:text>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="formModel.motivo" label="Motivo"></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-select v-model="formModel.funil" :items="funilItens" label="Funil"></v-select>
          </v-col>

          <v-col cols="12" md="6">
            <v-select v-model="formModel.departamento" :items="departamentosItens" label="Departamentos"></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            {{ formModel.ativo ? 'Ativo' : 'Inativo' }}
            <v-switch v-model="formModel.ativo" color='primary' hide-details inset></v-switch>
          </v-col>

        </v-row>
        <v-row>
          <v-col cols="12" md="12">
            <v-text-field v-model="formModel.mensagem" label="Mensagem"></v-text-field>
          </v-col>
        </v-row>
      </template>

      <v-divider></v-divider>

      <v-card-actions class="bg-surface-light">
        <v-btn text="Cancel" variant="plain" @click="dialog = false"></v-btn>

        <v-spacer></v-spacer>

        <v-btn text="Save" @click="save"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script setup lang="ts">
import { onMounted, ref, shallowRef, computed } from 'vue'
import api from "../../api/axios"

const currentYear = new Date().getFullYear()

function createNewRecord() {
  return {
    motivo: '',
    funil: '',
    departamento: '',
    ativo: false,
    mensagem: '',
  }
}

const reasons = ref([])
const formModel = ref(createNewRecord())
const dialog = shallowRef(false)
const isEditing = computed(() => !!formModel.value.id)

const headers = [
  { title: 'Id', key: 'id', align: 'start' },
  { title: 'Motivo', key: 'reason' },
  { title: 'Funil', key: 'funnel' },
  { title: 'Departamentos', key: 'department', align: 'center' },
  { title: 'Ativo', key: 'active', align: 'center' },
  { title: 'Mensagem de fechamento', key: 'message', align: 'center' },
  { title: 'Ações', key: 'actions', align: 'end', sortable: false },
]

const funilItens = ['CALL AGENDADA', 'SEM FUNIL', 'CALL REALIZADA', 'LEADS RETORNO']

const departamentosItens = ['DEPARTAMENTO 1', 'DEPARTAMENTO 2', 'DEPARTAMENTO 3']

onMounted(() => {
  loadReasons()
})

function add() {
  formModel.value = createNewRecord()
  dialog.value = true
}

function edit(id) {
  const found = reasons.value.find(reason => reason.id === id)

  formModel.value = {
    id: found.id,
    motivo: found.reason,
    funil: found.funnel,
    departamento: found.department,
    ativo: found.active,
    mensagem: found.message,
  }

  dialog.value = true
}

async function remove(id) {

  try {
    await api.delete(`/closing-reasons/${id}/`)
    await loadReasons()
  } catch (e) {
    console.error("Motivo de erro na exclusao: ", e)
  }
}

async function save() {

  const payload = {
    reason: formModel.value.motivo,
    funnel: formModel.value.funil,
    department: formModel.value.departamento,
    message: formModel.value.mensagem,
    active: formModel.value.ativo
  }

  try {

    if (isEditing.value) {

      await api.put(`/closing-reasons/${formModel.value.id}/`, payload)

    } else {

      await api.post(`/closing-reasons/`, payload)

    }

    await loadReasons()

  } catch (e) {

    console.error("Erro ao salvar:", e)

  }

  dialog.value = false
}

function reset() {
  dialog.value = false
  formModel.value = createNewRecord()
}

const loadReasons = async () => {
  try {
    const response = await api.get("/closing-reasons/")
    reasons.value = response.data
  } catch (e) {
    console.error("motivo do erro", e)
  }
}

</script>