<template>
  <v-sheet border rounded>
    <v-data-table :headers="headers" :hide-default-footer="books.length < 11" :items="books">
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
      <template v-slot:item.ativo="{ item }">
        <v-icon :color="item.ativo ? 'success' : 'error'">
          {{ item.ativo ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline' }}
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
import { onMounted, ref, shallowRef, toRef } from 'vue'

const currentYear = new Date().getFullYear()

function createNewRecord() {
  return {
    motivo: '',
    funil: '',
    departamento: '',
    ativo: ref(false),
    mensagem: '',
  }
}

const books = ref([])
const formModel = ref(createNewRecord())
const dialog = shallowRef(false)
const isEditing = toRef(() => !!formModel.value.id)

const headers = [
  { title: 'Id', key: 'id', align: 'start' },
  { title: 'Motivo', key: 'motivo' },
  { title: 'Funil', key: 'funil' },
  { title: 'Departamentos', key: 'departamento', align: 'ceenter' },
  { title: 'Ativo', key: 'ativo', align: 'center' },
  { title: 'Mensagem de fechamento', key: 'mensagem', align: 'center' },
  { title: 'Ações', key: 'actions', align: 'end', sortable: false },
]

const funilItens = ['CALL AGENDADA', 'SEM FUNIL', 'CALL REALIZADA', 'LEADS RETORNO']

const departamentosItens = ['DEPARTAMENTO 1', 'DEPARTAMENTO 2', 'DEPARTAMENTO 3']

onMounted(() => {
  reset()
})

function add() {
  formModel.value = createNewRecord()
  dialog.value = true
}

function edit(id) {
  const found = books.value.find(book => book.id === id)

  formModel.value = {
    id: found.id,
    motivo: found.motivo,
    funil: found.funil,
    departamento: found.departamento,
    ativo: found.ativo,
    mensagem: found.mensagem,
  }

  dialog.value = true
}

function remove(id) {
  const index = books.value.findIndex(book => book.id === id)
  books.value.splice(index, 1)
}

function save() {
  if (isEditing.value) {
    const index = books.value.findIndex(book => book.id === formModel.value.id)
    books.value[index] = formModel.value
  } else {
    formModel.value.id = books.value.length + 1
    books.value.push(formModel.value)
  }

  dialog.value = false
}

function reset() {
  dialog.value = false
  formModel.value = createNewRecord()
  books.value = [
    { id: 1, motivo: 'fechamento 1', funil: 'call agendada', departamento: 'Fiction', ativo: true, mensagem: 'texto 1' },
    { id: 2, motivo: 'fechamento 2', funil: 'call realizada', departamento: 'Dystopian', ativo: true, mensagem: 'texto 2' },
    { id: 3, motivo: 'fechamento 3', funil: 'retorno', departamento: 'Fiction', ativo: true, mensagem: 'texto 3' },
    { id: 4, motivo: 'fechamento 4', funil: 'sem funil', departamento: 'Non-Fiction', ativo: true, mensagem: 'texto 4' },
    { id: 5, motivo: 'fechamento 5', funil: 'sem agenda', departamento: 'Sci-Fi', ativo: true, mensagem: 'texto 5' },
  ]
}

</script>