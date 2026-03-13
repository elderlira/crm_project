<template>
    <div class="ml-4 mr-4 mb-4 mt-8">
        <v-data-table :headers="headers" :items="users" :search="search" item-value="id" :item-props="getRowProps"
            class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat class="toolbar-custom">
                    <v-toolbar-title class="mb-2">
                        <v-icon color="primary" icon="mdi-account-multiple" size="small" start></v-icon>
                        Perfis de Usuários
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" label="Buscar" prepend-inner-icon="mdi-magnify" variant="outlined"
                        hide-details single-line density="compact" style="max-width: 300px;"></v-text-field>

                    <v-btn class="ms-2 mb-0" prepend-icon="mdi-plus" rounded="lg" text="Adicionar" color="primary"
                        @click="add"></v-btn>
                </v-toolbar>
            </template>

            <template v-slot:item.rotas="{ item }">
                {{item.rotas
                    .map(r => rotas.find(rt => rt.nome === r)?.label)
                    .join(', ')}}
            </template>

            <template v-slot:item.actions="{ item }">
                <div class="d-flex ga-2 justify-end">
                    <v-icon color="success" icon="mdi-pencil" size="small" @click="edit(item)"></v-icon>

                    <v-icon color="error" icon="mdi-delete" size="small" @click="openDeleteConfirmation(item)"></v-icon>
                </div>
            </template>

        </v-data-table>
        <v-dialog v-model="dialog" max-width="600" persistent>
            <v-card :title="`${isEditing ? 'Editar' : 'Criar'} Perfil`">
                <v-divider></v-divider>
                <template v-slot:text>
                    <v-form ref="formRef">
                        <v-container>
                            <v-row>
                                <v-col cols="12" md="12" style="padding-top: 0px; padding-bottom: 0px;">
                                    <v-text-field v-model="formModel.name" label="Nome" density="compact"
                                        :rules="[rules.required, rules.min]" variant="outlined"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-toolbar-title style="font-size: 16px; padding-bottom: 0px; padding-top: 0px;"
                                        class="pt-0 pb-0">
                                        Rotas Permitidas:
                                    </v-toolbar-title>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-checkbox v-for='rota in coluna1' :key="rota.id" v-model="selectedItems"
                                        :value=rota.nome :label="rota.label"></v-checkbox>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-checkbox v-for='rota in coluna2' :key="rota.id" v-model="selectedItems"
                                        :value=rota.nome :label="rota.label"></v-checkbox>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </template>

                <v-divider></v-divider>

                <v-card-actions class="pa-4">
                    <v-btn text="Cancelar" variant="plain" @click="closeDialog"></v-btn>
                    <v-spacer></v-spacer>
                    <v-btn text="Salvar" color="primary" variant="elevated" @click="save" :loading="loading"></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="deleteDialog" max-width="400">
            <v-card title="Confirmar Exclusão" class="alert-dialog">
                <v-divider></v-divider>
                <template v-slot:text>
                    <p>Você tem certeza que deseja deletar o usuário <strong>{{ itemToDelete?.name }}</strong>?</p>
                    <p class="text-caption text-error">Esta ação não pode ser desfeita.</p>
                </template>

                <v-divider></v-divider>

                <v-card-actions class="pa-4">
                    <v-btn text="Cancelar" variant="plain" @click="deleteDialog = false"></v-btn>
                    <v-spacer></v-spacer>
                    <v-btn text="Deletar" color="error" variant="elevated" @click="confirmDelete"
                        :loading="loading"></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar.show" :timeout="3000" :color="snackbar.color">
            {{ snackbar.message }}
        </v-snackbar>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface User {
    id: number
    name: string
    rotas: string[]
}

const search = ref('')
const dialog = ref(false)
const deleteDialog = ref(false)
const actionDialog = ref(false)
const showPassword = ref(false)
const loading = ref(false)

const formModel = ref<any>(createNewRecord())
const formRef = ref()
const isEditing = computed(() => !!formModel.value.id)

const itemToDelete = ref<User | null>(null)

const selectedUser = ref<User | null>(null)
const currentAction = ref<string>('')

const snackbar = ref({ show: false, message: '', color: 'success' })

const headers = [
    { align: 'start', key: 'name', title: 'Nome', sortable: true },
    { key: 'rotas', title: 'Rotas', sortable: true },

    { key: 'actions', title: 'Ações', sortable: false, align: 'center' },
]

const users = ref<User[]>([
    {
        id: 1,
        name: 'Elder Castro Franca Lira',
        rotas: ['aovivo', 'configuracoes'],
    },
])

const expanded = ref<number[]>([])

// const nameRules = [
//     (v: string) => !!v || 'Nome é obrigatório',
//     (v: string) => v?.length >= 3 || 'Nome deve ter no mínimo 3 caracteres',
// ]

const rules = {
    required: value => !!value || 'Nome obrigatório',
    min: value => value.length >= 3 || 'O nome deve ter no mínimo 3 caracteres'
}

function createNewRecord() {
    return {
        id: null,
        name: '',
        rotas: []
    }
}
const selectedItems = ref([])
const coluna1 = computed(() => rotas.value.slice(0, 7))
const coluna2 = computed(() => rotas.value.slice(7))

const rotas = ref([
    { id: 1, nome: "aovivo", ativo: false, label: 'Ao vivo' },
    { id: 2, nome: "atendimentos", ativo: false, label: 'Atendimentos' },
    { id: 3, nome: "auditoria", ativo: false, label: 'Auditoria' },
    { id: 4, nome: "campanhas", ativo: false, label: 'Campanhas' },
    { id: 5, nome: "canais", ativo: false, label: 'Canais' },
    { id: 6, nome: "chatbot", ativo: false, label: 'Chatbot' },
    { id: 7, nome: "configuracoes", ativo: false, label: 'Configurações' },
    { id: 8, nome: "consulta_atendimento", ativo: false, label: 'Consulta de Atendimento' },
    { id: 9, nome: "contatos", ativo: false, label: 'Contatos' },
    { id: 10, nome: "dashboard", ativo: false, label: 'Dashboards' },
    { id: 11, nome: "funil_mensagens", ativo: false, label: 'Funil de Mensagens' },
    { id: 12, nome: "gestao_cliente", ativo: false, label: 'Gestão de Clientes' },
    { id: 13, nome: "parceiros", ativo: false, label: 'Parceiros' },
    { id: 14, nome: "push", ativo: false, label: 'Push' }
])

function add() {
    formModel.value = createNewRecord()
    selectedItems.value = []
    dialog.value = true
}

function edit(item: User) {
    formModel.value = { ...item }
    selectedItems.value = [...item.rotas]
    dialog.value = true
}

function closeDialog() {
    dialog.value = false
    formModel.value = createNewRecord()
    selectedItems.value = []
}

async function save() {
    const { valid } = await formRef.value.validate()
    if (!valid) {
        return
    }

    loading.value = true

    setTimeout(() => {
        if (isEditing.value) {
            const index = users.value.findIndex(u => u.id === formModel.value.id)

            if (index > -1) {
                users.value[index] = {
                    ...formModel.value,
                    rotas: [...selectedItems.value]
                }
            }
            showSnackbar('Perfil do usuário atualizado com sucesso!', 'success')
        } else {
            const newId = Math.max(...users.value.map(u => u.id), 0) + 1
            console.log({ ...selectedItems.value })
            users.value.push({
                ...formModel.value,
                id: newId,
                uLogin: new Date().toLocaleString('pt-BR'),
                rotas: [...selectedItems.value],
            })
            showSnackbar('Perfil do usuário criado com sucesso!', 'success')
        }
        loading.value = false
        closeDialog()
    }, 500)
}

function openDeleteConfirmation(item) {
    itemToDelete.value = item
    deleteDialog.value = true
    expanded.value = []
}

function confirmDelete() {
    loading.value = true
    setTimeout(() => {
        users.value = users.value.filter(u => u.id !== itemToDelete.value?.id)
        showSnackbar('Usuário deletado com sucesso!', 'success')
        loading.value = false
        deleteDialog.value = false
        itemToDelete.value = null
    }, 500)
}

function closeActionDialog() {
    actionDialog.value = false
    currentAction.value = ''
    selectedUser.value = null
}

function getRowProps({ item }: { item: any }) {
    return {
        class: item.raw.online === 'Sim' ? 'row-online' : 'row-offline'
    }
}

function showSnackbar(message: string, color: string = 'success') {
    snackbar.value = { show: true, message, color }
}
</script>

<style scoped>
.toolbar-custom {
    background-color: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
}

:deep(.v-data-table) {
    background-color: #ffffff;
    font-size: 0.875rem;
}

:deep(.v-data-table__thead tr) {
    background-color: #f5f5f5;
    border-bottom: 2px solid #e0e0e0;
}

:deep(.v-data-table__th) {
    font-weight: 600;
    color: #424242;
    padding: 16px 12px !important;
    background-color: #f5f5f5;
}

:deep(.v-data-table__tbody tr) {
    transition: background-color 0.2s ease;
}

:deep(.v-data-table__tbody tr:hover) {
    background-color: #fafafa !important;
}

:deep(.v-data-table__tbody tr.row-online) {
    background-color: #ffffff;
    border-left: 4px solid #4caf50;
}

:deep(.v-data-table__tbody tr.row-offline) {
    background-color: #ffffff;
    border-left: 4px solid #f44336;
}

:deep(.v-data-table__tbody tr:nth-child(even)) {
    background-color: #fafafa;
}

:deep(.v-data-table__tbody tr.row-online:nth-child(even)) {
    background-color: #fafafa;
    border-left: 4px solid #4caf50;
}

:deep(.v-data-table__tbody tr.row-offline:nth-child(even)) {
    background-color: #fafafa;
    border-left: 4px solid #f44336;
}

:deep(.v-data-table__td) {
    padding: 12px !important;
    color: #424242;
}

:deep(.v-data-table__expanded) {
    background-color: #fafafa;
    border-left: 4px solid #2196f3;
}

.bg-grey-50 {
    background-color: #fafafa !important;
}

.d-grid {
    display: grid;
    gap: 8px;
}

.alert-dialog {
    border-left: 4px solid #ff9800;
}
</style>