<template>
    <div class="ml-4 mr-4 mb-4 mt-8">
        <v-data-table :headers="headers" :items="users" :search="search" v-model:expanded="expanded" item-value="id"
            :item-props="getRowProps" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat class="toolbar-custom">
                    <v-toolbar-title class="mb-2">
                        <v-icon color="primary" icon="mdi-account-multiple" size="small" start></v-icon>
                        Usuários
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" label="Buscar" prepend-inner-icon="mdi-magnify" variant="outlined"
                        hide-details single-line density="compact" style="max-width: 300px;"></v-text-field>

                    <v-btn class="ms-2 mb-0" prepend-icon="mdi-plus" rounded="lg" text="Adicionar" color="primary"
                        @click="add"></v-btn>
                </v-toolbar>
            </template>

            <template v-slot:expanded-row="{ columns, item }">
                <tr>
                    <td :colspan="columns.length" class="py-3 px-4">
                        <v-sheet rounded="lg" border class="pa-4 bg-grey-50">
                            <div class="d-grid gap-2"
                                style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));">
                                <v-btn prepend-icon="mdi-account-group" variant="outlined" color="primary" size="small"
                                    text="Grupos" @click="openActionModal('grupos', item)"></v-btn>
                                <v-btn prepend-icon="mdi-shield-check" variant="outlined" color="primary" size="small"
                                    text="Permissões" @click="openActionModal('permissoes', item)"></v-btn>
                                <v-btn prepend-icon="mdi-network" variant="outlined" color="primary" size="small"
                                    text="Canais" @click="openActionModal('canais', item)"></v-btn>
                                <v-btn prepend-icon="mdi-lock-reset" variant="outlined" color="warning" size="small"
                                    text="Alterar Senha" @click="openActionModal('senha', item)"></v-btn>
                                <v-btn prepend-icon="mdi-pencil" variant="outlined" color="info" size="small"
                                    text="Editar" @click="edit(item)"></v-btn>
                                <v-btn prepend-icon="mdi-delete" variant="outlined" color="error" size="small"
                                    text="Deletar" @click="openDeleteConfirmation(item)"></v-btn>
                            </div>
                        </v-sheet>
                    </td>
                </tr>
            </template>

            <template v-slot:item.actions="{ item }">
                <v-btn :append-icon="expanded.includes(item.id) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                    :text="expanded.includes(item.id) ? 'Compactar' : 'Mais'" size="x-small" variant="text"
                    @click="toggleRow(item)" />
            </template>
        </v-data-table>

        <!-- Modal de Adicionar/Editar Usuário -->
        <v-dialog v-model="dialog" max-width="600" persistent>
            <v-card :title="`${isEditing ? 'Editar' : 'Adicionar'} Usuário`">
                <v-divider></v-divider>
                <template v-slot:text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="formModel.name" label="Nome" density="compact" :rules="nameRules"
                                    outlined></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="formModel.email" label="E-mail" density="compact"
                                    :rules="emailRules" outlined></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="formModel.celular" label="Celular" density="compact"
                                    outlined></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="formModel.departament" label="Departamento" density="compact"
                                    outlined></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-select v-model="formModel.perfil" label="Perfil" :items="perfis" density="compact"
                                    outlined></v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="formModel.password" label="Senha"
                                    :type="showPassword ? 'text' : 'password'"
                                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                    @click:append-inner="showPassword = !showPassword" hint="Mínimo 8 caracteres"
                                    density="compact" outlined :rules="!isEditing ? passwordRules : []"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="formModel.outOfMenssage" label="Mensagem de Ausência"
                                    density="compact" outlined></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-checkbox v-model="formModel.reciveTicket" color="primary"
                                    label="Não receber tickets via distribuição automática"></v-checkbox>
                                <v-checkbox v-model="formModel.viewTicket" color="primary"
                                    label="Visualizar tickets de outros usuários dos seus departamentos"></v-checkbox>
                            </v-col>
                        </v-row>
                    </v-container>
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

        <!-- Modal Genérico para Ações -->
        <v-dialog v-model="actionDialog" max-width="500" persistent>
            <v-card :title="getActionTitle()">
                <v-divider></v-divider>
                <template v-slot:text>
                    <v-container>
                        <div v-if="currentAction === 'grupos'">
                            <p class="text-subtitle2 mb-3">Selecione os grupos para o usuário <strong>{{
                                selectedUser?.name }}</strong></p>
                            <v-checkbox v-for="grupo in availableGroups" :key="grupo.id" v-model="selectedGroups"
                                :value="grupo.id" :label="grupo.name" color="primary"></v-checkbox>
                        </div>

                        <div v-if="currentAction === 'permissoes'">
                            <p class="text-subtitle2 mb-3">Selecione as permissões para <strong>{{ selectedUser?.name
                            }}</strong></p>
                            <v-checkbox v-for="perm in availablePermissions" :key="perm.id"
                                v-model="selectedPermissions" :value="perm.id" :label="perm.name"
                                color="primary"></v-checkbox>
                        </div>

                        <div v-if="currentAction === 'canais'">
                            <p class="text-subtitle2 mb-3">Selecione os canais para <strong>{{ selectedUser?.name
                            }}</strong></p>
                            <v-checkbox v-for="canal in availableChannels" :key="canal.id" v-model="selectedChannels"
                                :value="canal.id" :label="canal.name" color="primary"></v-checkbox>
                        </div>

                        <div v-if="currentAction === 'senha'">
                            <p class="text-subtitle2 mb-3">Alterar senha de <strong>{{ selectedUser?.name }}</strong>
                            </p>
                            <v-text-field v-model="newPassword" label="Nova Senha" type="password" density="compact"
                                :rules="passwordRules" outlined class="mb-3"></v-text-field>
                            <v-text-field v-model="confirmPassword" label="Confirmar Senha" type="password"
                                density="compact" :rules="passwordRules" outlined></v-text-field>
                            <v-alert v-if="newPassword && confirmPassword && newPassword !== confirmPassword"
                                type="error" class="mt-2" dense>As senhas não conferem</v-alert>
                        </div>
                    </v-container>
                </template>

                <v-divider></v-divider>

                <v-card-actions class="pa-4">
                    <v-btn text="Cancelar" variant="plain" @click="closeActionDialog"></v-btn>
                    <v-spacer></v-spacer>
                    <v-btn text="Salvar" color="primary" variant="elevated" @click="saveAction"
                        :loading="loading"></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Snackbar para feedback -->
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
    email: string
    celular: string
    departament: string
    perfil: string
    uLogin: string
    uLogout: string
    online: string
    grupos?: number[]
    permissoes?: number[]
    canais?: number[]
}

// States
const search = ref('')
const dialog = ref(false)
const deleteDialog = ref(false)
const actionDialog = ref(false)
const showPassword = ref(false)
const loading = ref(false)

const formModel = ref<any>(createNewRecord())
const isEditing = computed(() => !!formModel.value.id)

const itemToDelete = ref<User | null>(null)

const selectedUser = ref<User | null>(null)
const currentAction = ref<string>('')
const selectedGroups = ref<number[]>([])
const selectedPermissions = ref<number[]>([])
const selectedChannels = ref<number[]>([])
const newPassword = ref('')
const confirmPassword = ref('')

const snackbar = ref({ show: false, message: '', color: 'success' })

const headers = [
    { align: 'start', key: 'name', title: 'Nome', sortable: true },
    { key: 'email', title: 'E-mail', sortable: true },
    { key: 'celular', title: 'Celular', sortable: false },
    { key: 'departament', title: 'Departamento', sortable: true },
    { key: 'perfil', title: 'Perfil', sortable: true },
    { key: 'uLogin', title: 'Último Login', sortable: true },
    { key: 'uLogout', title: 'Último Logout', sortable: true },
    { key: 'online', title: 'Online', sortable: false },
    { key: 'actions', title: 'Ações', sortable: false, align: 'center' },
]

const users = ref<User[]>([
    {
        id: 1,
        name: 'Elder Castro Franca Lira',
        email: 'elderfranca@hotmail.com',
        celular: '71986325411',
        departament: 'SUPORTE AO TIME - CS',
        perfil: 'Administrador',
        uLogin: '02/03/2026 00:10',
        uLogout: '02/03/2026 00:45',
        online: 'Sim',
    },
    {
        id: 2,
        name: 'João Silva Santos',
        email: 'joao.silva@hotmail.com',
        celular: '71987654321',
        departament: 'SUPORTE AO TIME - CS',
        perfil: 'Usuário',
        uLogin: '01/03/2026 14:30',
        uLogout: '01/03/2026 18:15',
        online: 'Não',
    },
    {
        id: 3,
        name: 'Maria Oliveira Costa',
        email: 'maria.oliveira@hotmail.com',
        celular: '71988776655',
        departament: 'VENDAS',
        perfil: 'Supervisor',
        uLogin: '02/03/2026 08:00',
        uLogout: '02/03/2026 12:00',
        online: 'Sim',
    }
])

const perfis = ['Usuário', 'Administrador', 'Supervisor']

const availableGroups = [
    { id: 1, name: 'Suporte Geral' },
    { id: 2, name: 'Administradores' },
    { id: 3, name: 'Vendas' },
    { id: 4, name: 'Financeiro' },
]

const availablePermissions = [
    { id: 1, name: 'Criar Tickets' },
    { id: 2, name: 'Editar Tickets' },
    { id: 3, name: 'Deletar Tickets' },
    { id: 4, name: 'Gerenciar Usuários' },
    { id: 5, name: 'Visualizar Relatórios' },
]

const availableChannels = [
    { id: 1, name: 'Email' },
    { id: 2, name: 'WhatsApp' },
    { id: 3, name: 'Chat' },
    { id: 4, name: 'Telefone' },
]

const expanded = ref<number[]>([])

// Validation rules
const nameRules = [
    (v: string) => !!v || 'Nome é obrigatório',
    (v: string) => v?.length >= 3 || 'Nome deve ter no mínimo 3 caracteres',
]

const emailRules = [
    (v: string) => !!v || 'E-mail é obrigatório',
    (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'E-mail inválido',
]

const passwordRules = [
    (v: string) => !!v || 'Senha é obrigatória',
    (v: string) => v?.length >= 8 || 'Senha deve ter no mínimo 8 caracteres',
]

// Functions
function createNewRecord() {
    return {
        id: null,
        name: '',
        email: '',
        celular: '',
        departament: '',
        perfil: '',
        uLogin: '',
        uLogout: '',
        online: '',
        password: '',
        outOfMenssage: '',
        reciveTicket: false,
        viewTicket: false,
    }
}

function toggleRow(item: User) {
    const index = expanded.value.indexOf(item.id)
    if (index > -1) {
        expanded.value.splice(index, 1)
    } else {
        expanded.value.push(item.id)
    }
}

function add() {
    formModel.value = createNewRecord()
    showPassword.value = false
    dialog.value = true
}

function edit(item: User) {
    formModel.value = { ...item }
    showPassword.value = false
    dialog.value = true
    expanded.value = []
}

function closeDialog() {
    dialog.value = false
    formModel.value = createNewRecord()
    showPassword.value = false
}

function save() {
    loading.value = true
    setTimeout(() => {
        if (isEditing.value) {
            const index = users.value.findIndex(u => u.id === formModel.value.id)
            if (index > -1) {
                users.value[index] = { ...formModel.value }
            }
            showSnackbar('Usuário atualizado com sucesso!', 'success')
        } else {
            const newId = Math.max(...users.value.map(u => u.id), 0) + 1
            users.value.push({
                ...formModel.value,
                id: newId,
                uLogin: new Date().toLocaleString('pt-BR'),
                online: 'Sim',
            })
            showSnackbar('Usuário criado com sucesso!', 'success')
        }
        loading.value = false
        closeDialog()
    }, 500)
}

function openDeleteConfirmation(item: User) {
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

function openActionModal(action: string, item: User) {
    currentAction.value = action
    selectedUser.value = item
    selectedGroups.value = item.grupos || []
    selectedPermissions.value = item.permissoes || []
    selectedChannels.value = item.canais || []
    newPassword.value = ''
    confirmPassword.value = ''
    actionDialog.value = true
}

function closeActionDialog() {
    actionDialog.value = false
    currentAction.value = ''
    selectedUser.value = null
}

function saveAction() {
    if (currentAction.value === 'senha') {
        if (newPassword.value !== confirmPassword.value) {
            showSnackbar('As senhas não conferem!', 'error')
            return
        }
        if (!newPassword.value || newPassword.value.length < 8) {
            showSnackbar('Senha deve ter no mínimo 8 caracteres!', 'error')
            return
        }
    }

    loading.value = true
    setTimeout(() => {
        if (selectedUser.value) {
            if (currentAction.value === 'grupos') {
                selectedUser.value.grupos = [...selectedGroups.value]
            } else if (currentAction.value === 'permissoes') {
                selectedUser.value.permissoes = [...selectedPermissions.value]
            } else if (currentAction.value === 'canais') {
                selectedUser.value.canais = [...selectedChannels.value]
            }
        }
        const actionLabels: Record<string, string> = {
            grupos: 'Grupos',
            permissoes: 'Permissões',
            canais: 'Canais',
            senha: 'Senha',
        }
        showSnackbar(`${actionLabels[currentAction.value]} atualizados com sucesso!`, 'success')
        loading.value = false
        closeActionDialog()
    }, 500)
}

function getActionTitle(): string {
    const titles: Record<string, string> = {
        grupos: 'Grupos do Usuário',
        permissoes: 'Permissões do Usuário',
        canais: 'Gestão de Canais',
        senha: 'Alterar Senha',
    }
    return titles[currentAction.value] || ''
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

/* Estilos profissionais da tabela */
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