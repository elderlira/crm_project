<template>
    <div class="ml-4 mr-4 mb-4 mt-8">
        <v-data-table 
            :headers="headers" 
            :items="users" 
            :search="search" 
            v-model:expanded="expanded" 
            item-value="id"
        >
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title class="mb-2">
                        <v-icon color="medium-emphasis" icon="mdi-book-multiple" size="x-small" start></v-icon>
                        Usuários
                    </v-toolbar-title>
                    <v-text-field 
                        v-model="search" 
                        label="Pesquisar" 
                        prepend-inner-icon="mdi-magnify"
                        variant="outlined" 
                        hide-details 
                        single-line 
                        density="compact" 
                        class="mr-10"
                    ></v-text-field>
                    <v-btn class="me-2 mb-2" color="primary" prepend-icon="mdi-plus" rounded="lg" text="Adicionar" border @click="add"></v-btn>
                </v-toolbar>
            </template>

            <template v-slot:expanded-row="{ columns, item }">
                <tr>
                    <td :colspan="columns.length" class="py-2">
                        <v-sheet rounded="lg" border shadow="sm">
                            <v-table density="compact">
                                <tbody>
                                    <tr>
                                        <th><v-btn text variant="plain" size="small"><v-icon icon="mdi-account-group" color="primary" class="mr-1"/>Grupos</v-btn></th>
                                        <th><v-btn text variant="plain" size="small"><v-icon icon="mdi-shield-lock" class="mr-1"/>Permissões</v-btn></th>
                                        <th><v-btn text variant="plain" size="small"><v-icon icon="mdi-vector-link" class="mr-1"/>Canais</v-btn></th>
                                    </tr>
                                    <tr>
                                        <th>
                                            <v-btn text variant="plain" size="small" @click="preparePasswordChange(item)">
                                                <v-icon icon="mdi-key" class="mr-1"/>Alterar Senha
                                            </v-btn>
                                        </th>
                                        <th><v-btn text variant="plain" size="small" @click="editItem(item)"><v-icon icon="mdi-pencil" class="mr-1" color="orange"/>Editar</v-btn></th>
                                        <th>
                                            <v-btn text variant="plain" color="error" size="small" @click="prepareDelete(item)">
                                                <v-icon icon="mdi-delete" class="mr-1"/>Deletar
                                            </v-btn>
                                        </th>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-sheet>
                    </td>
                </tr>
            </template>

            <template v-slot:item.company="{ item }">
                <span class="text-subtitle-2 font-weight-bold">{{ item.company_info?.name || '—' }}</span>
            </template>

            <template v-slot:item.department="{ item }">
                <div v-if="item.department?.length">
                    <v-chip v-for="d in item.department" :key="d.id" size="x-small" color="primary" variant="tonal" class="mr-1">
                        {{ d.name }}
                    </v-chip>
                </div>
                <span v-else class="text-caption text-grey">—</span>
            </template>

            <template v-slot:item.last_login="{ item }">
                <span class="text-caption">{{ item.last_login ? new Date(item.last_login).toLocaleString('pt-BR') : '-' }}</span>
            </template>

            <template v-slot:item.last_logout="{ item }">
                <span class="text-caption">
                    <v-chip v-if="item.is_online" size="x-small" color="success" variant="text">Conectado agora</v-chip>
                    <span v-else>{{ item.last_logout ? new Date(item.last_logout).toLocaleString('pt-BR') : '-' }}</span>
                </span>
            </template>

            <template v-slot:item.is_online="{ item }">
                <v-chip :color="item.is_online ? 'success' : 'error'" size="x-small" label>
                    {{ item.is_online ? 'Online' : 'Offline' }}
                </v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
                <v-btn 
                    :append-icon="expanded.includes(item.id) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                    :text="expanded.includes(item.id) ? 'Compactar' : 'Mais informações'" 
                    size="small" 
                    variant="text"
                    @click="toggleRow(item)" 
                />
            </template>
        </v-data-table>

        <v-dialog v-model="passwordDialog" max-width="400">
    <v-card title="Alterar Senha">
        <v-card-text>
            <p class="text-caption mb-4">Alterando senha para: <b>{{ userToPassword?.username }}</b></p>
            <v-text-field 
                v-model="newPassword" 
                label="Nova Senha" 
                :type="showPass ? 'text' : 'password'"
                :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPass = !showPass"
                variant="outlined" 
                density="compact"
            ></v-text-field>
        </v-card-text>

        <v-card-actions>
            <v-btn text="Cancelar" @click="passwordDialog = false"></v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="elevated" :loading="loadingPass" @click="confirmPasswordChange">Atualizar</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>

        <v-dialog v-model="dialog" max-width="750" persistent v-if="formModel">
            <v-card :title="`${formModel.id ? 'Editar' : 'Adicionar'} Usuário`">
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" md="6" class="pa-1"><v-text-field v-model="formModel.username" label="Nome/Username" density="compact" variant="outlined" hide-details/></v-col>
                        <v-col cols="12" md="6" class="pa-1"><v-text-field v-model="formModel.email" label="E-mail" density="compact" variant="outlined" hide-details/></v-col>
                    </v-row>

                    <v-row dense align="center" class="mt-2">
                        <v-col cols="12" md="6" class="pa-1">
                            <v-text-field v-model="formModel.cellphone" label="Contato" density="compact" variant="outlined" maxlength="11" hide-details/>
                        </v-col>
                        <v-col cols="12" md="6" class="pa-1 d-flex align-center">
                            <v-select v-model="formModel.department_id" :items="departments" item-title="name" item-value="id" density="compact" label="Departamento" variant="outlined" hide-details class="mr-2"></v-select>
                            <v-btn icon="mdi-plus" variant="outlined" color="primary"  @click="deptDialog = true"></v-btn>
                        </v-col>
                    </v-row>

                    <v-row dense v-if="!formModel.id" class="mt-2">
                        <v-col cols="12" class="pa-1">
                            <v-text-field v-model="formModel.password" label="Senha" :type="showPassword ? 'text' : 'password'" :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append-inner="showPassword = !showPassword" density="compact" variant="outlined" hide-details/>
                        </v-col>
                    </v-row>

                    <v-row dense align="center" class="mt-2">
                        <v-col cols="5" md="5" class="pa-1">
                            <v-select label="Perfil" :items="perfis" item-title="title" item-value="value" density="compact" v-model="formModel.role" variant="outlined" hide-details/>
                        </v-col>
                        <v-col cols="5" md="5" class="pa-1">
                            <v-select v-model="formModel.company_id" label="Empresa" :items="companies" item-title="name" item-value="id" density="compact" variant="outlined" hide-details></v-select>
                        </v-col>
                        <v-col cols="2" md="2" class="d-flex align-center">
                            <v-btn icon="mdi-plus" variant="outlined" color="primary" @click="companyDialog = true"  />
                        </v-col>
                    </v-row>

                    <v-row dense class="mt-2">
                        <v-col class="pa-1"><v-text-field v-model="formModel.absence_message" label="Mensagem de Ausência" density="compact" variant="outlined" hide-details/></v-col>
                    </v-row>
                    
                    <v-checkbox v-model="formModel.no_auto_assign" color="primary" label="Não receber tickets automáticos" hide-details density="compact" class="mt-2"></v-checkbox>
                    <v-checkbox v-model="formModel.see_department_tickets" color="primary" label="Visualizar tickets de outros" hide-details density="compact" class="mt-2"></v-checkbox>
                </v-card-text>
                <v-card-actions>
                    <v-btn text="Cancelar" variant="plain" @click="dialog = false"></v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="elevated" @click="save">Salvar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="deleteDialog" max-width="450">
            <v-card title="Confirmar Exclusão">
                <v-card-text>
                    Tem certeza que deseja deletar o usuário <strong>{{ userToDeletar?.username }}</strong>? Esta ação é irreversível.
                </v-card-text>
                <v-card-actions>
                    <v-btn text="Cancelar" @click="deleteDialog = false"></v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="error" variant="elevated" :loading="loadingDelete" @click="confirmDelete">Sim, Deletar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="companyDialog" max-width="400">
            <v-card title="Nova Empresa">
                <v-card-text>
                    <v-text-field v-model="newCompanyName" label="Nome da Empresa" variant="outlined" density="compact" hide-details @keyup.enter="saveNewCompany"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn text="Cancelar" @click="companyDialog = false"></v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="elevated" :loading="loadingCompany" @click="saveNewCompany">Criar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="deptDialog" max-width="400">
            <v-card title="Novo Departamento">
                <v-card-text>
                    <v-text-field v-model="newDeptName" label="Nome do Departamento" variant="outlined" density="compact" hide-details @keyup.enter="saveNewDept"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn text="Cancelar" @click="deptDialog = false"></v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="elevated" :loading="loadingDept" @click="saveNewDept">Criar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import api from '../../api/axios'

const search = ref('')
const users = ref([])
const companies = ref([])
const departments = ref([])
const expanded = ref([])
const dialog = ref(false)
const showPassword = ref(false)

const companyDialog = ref(false)
const deptDialog = ref(false)
const newCompanyName = ref('')
const newDeptName = ref('')
const loadingCompany = ref(false)
const loadingDept = ref(false)

const deleteDialog = ref(false)
const userToDeletar = ref(null)
const loadingDelete = ref(false)

const passwordDialog = ref(false)
const userToPassword = ref(null)
const newPassword = ref('')
const loadingPass = ref(false)
const showPass = ref(false)

const perfis = [
    { title: 'Administrador', value: 'admin' },
    { title: 'Supervisor', value: 'supervisor' },
    { title: 'Agente', value: 'agent' }
]

const headers = [
    { title: 'Nome', key: 'username', align: 'start' },
    { title: 'Empresa', key: 'company' },       
    { title: 'Depto', key: 'department' },      
    { title: 'Perfil', key: 'role_display' },   
    { title: 'Login', key: 'last_login' },  
    { title: 'Logout', key: 'last_logout' },
    { title: 'Online', key: 'is_online', align: 'center' }, 
    { title: 'Ações', key: 'actions', sortable: false },
]

function createNewRecord() {
    return { id: null, username: '', email: '', cellphone: '', role: 'agent', company_id: null, department_id: null, password: '', absence_message: '', no_auto_assign: false, see_department_tickets: true }
}
const formModel = ref(createNewRecord())

const loadData = async () => {
    try {
        const [u, c] = await Promise.all([api.get('/auth/users/'), api.get('/companies/')])
        users.value = u.data
        companies.value = c.data
    } catch (e) { console.error("Erro 500 ou conexão:", e) }
}

const loadDepartments = async (companyId: number) => {
    try { 
        const { data } = await api.get(`/departments/?company=${companyId}`)
        departments.value = data 
    } catch (e) {}
}

watch(() => formModel.value.company_id, (newVal) => {
    if (newVal) loadDepartments(newVal)
    else departments.value = []
})


const add = () => { formModel.value = createNewRecord(); dialog.value = true }

const editItem = (item) => { 
    formModel.value = { 
        ...item, 
        company_id: item.company_info?.id || item.company || null,
        department_id: item.department?.[0]?.id || null,
        password: '' 
    }
    dialog.value = true 
}

const save = async () => {
    const payload = {
        username: formModel.value.username,
        email: formModel.value.email,
        cellphone: formModel.value.cellphone,
        role: formModel.value.role,
        company: formModel.value.company_id,
        absence_message: formModel.value.absence_message,
        no_auto_assign: formModel.value.no_auto_assign,
        see_department_tickets: formModel.value.see_department_tickets,
        departments: formModel.value.department_id ? [formModel.value.department_id] : []
    }
    if (!formModel.value.id) payload['password'] = formModel.value.password

    try {
        if (formModel.value.id) await api.put(`/auth/users/${formModel.value.id}/`, payload)
        else await api.post('/auth/users/', payload)
        dialog.value = false
        loadData()
    } catch (e: any) { alert("Erro ao salvar: " + JSON.stringify(e.response?.data)) }
}

function preparePasswordChange(item) {
    userToPassword.value = item
    newPassword.value = ''
    passwordDialog.value = true
}

async function confirmPasswordChange() {
    if (!newPassword.value) return
    loadingPass.value = true
    try {
        await api.patch(`/auth/users/${userToPassword.value.id}/`, { password: newPassword.value })
        passwordDialog.value = false
        alert("Senha atualizada!")
    } catch (e) { alert("Erro ao mudar senha") }
    finally { loadingPass.value = false }
}

function prepareDelete(item) { userToDeletar.value = item; deleteDialog.value = true }
async function confirmDelete() {
    loadingDelete.value = true
    try {
        await api.delete(`/auth/users/${userToDeletar.value.id}/`)
        deleteDialog.value = false
        loadData()
    } catch (e) { alert("Erro ao deletar") }
    finally { loadingDelete.value = false }
}

const toggleRow = (item) => {
    const index = expanded.value.indexOf(item.id)
    index > -1 ? expanded.value.splice(index, 1) : expanded.value.push(item.id)
}

onMounted(loadData)
</script>