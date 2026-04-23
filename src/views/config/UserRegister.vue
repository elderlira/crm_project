<template>
    <div class="ml-4 mr-4 mb-4 mt-8">
        <v-data-table :headers="headers" :items="users" :search="search" v-model:expanded="expanded" item-value="id">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title class="mb-2">
                        <v-icon color="medium-emphasis" icon="mdi-book-multiple" size="x-small" start></v-icon>
                        Usuários
                    </v-toolbar-title>
                    <v-toolbar-title class="mr-10 mb-2">
                        <template v-slot:text>
                            <v-text-field v-model="search" label="Busque" prepend-inner-icon="mdi-magnify"
                                variant="outlined" hide-details single-line></v-text-field>
                        </template>
                    </v-toolbar-title>

                    <v-btn class="me-2 mb-2" prepend-icon="mdi-plus" rounded="lg" text="Adicionar" border
                        @click="add"></v-btn>
                </v-toolbar>
            </template>

            <template v-slot:item.online="{ item }">
                <v-icon :color="item.online ? 'success' : 'error'">
                    {{ item.online ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline' }}
                </v-icon>
            </template>


            <template v-slot:expanded-row="{ columns, item }">
                <tr>
                    <td :colspan="columns.length" class="py-2">
                        <v-sheet rounded="lg" border>
                            <v-table density="compact">
                                <tbody>
                                    <tr>
                                        <th>
                                            <v-btn text="Grupos do Usuário" variant="plain">
                                                <v-icon icon="mdi-account-group" color="primary" class="mr-1"></v-icon>
                                                Grupos do Usuário
                                            </v-btn>
                                        </th>
                                        <th> <v-btn text="Grupos do Usuário" variant="plain">
                                                <v-icon icon="mdi-account-group" class="mr-1"></v-icon>
                                                Permissões do usuário
                                            </v-btn>
                                        </th>
                                        <th>
                                            <v-btn text="Grupos do Usuário" variant="plain">
                                                <v-icon icon="mdi-account-group" class="mr-1"></v-icon>
                                                Gestão de canais do usuário
                                            </v-btn>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>
                                            <v-btn text="Grupos do Usuário" variant="plain">
                                                <v-icon icon="mdi-account-group" class="mr-1"></v-icon>
                                                Alterar senha
                                            </v-btn>
                                        </th>
                                        <th>
                                            <v-btn text="Grupos do Usuário" variant="plain" @click="editUser(item)">
                                                <v-icon icon="mdi-account-group" class="mr-1"></v-icon>
                                                Editar
                                            </v-btn>
                                        </th>
                                        <th>
                                            <v-btn text="Grupos do Usuário" variant="plain" @click="deleteUser(item)">
                                                <v-icon icon="mdi-account-group" class="mr-1"></v-icon>
                                                Deletar
                                            </v-btn>
                                        </th>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-sheet>
                    </td>
                </tr>
            </template>

            <template v-slot:item.department="{ item }">
                <span v-if="item.department && item.department.length">
                    {{item.department.map(d => d.name).join(', ')}}
                </span>
                <span v-else>—</span>
            </template>

            <template v-slot:item.actions="{ item }">
                <v-btn :append-icon="expanded.includes(item.id) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                    :text="expanded.includes(item.id) ? 'Compactar' : 'Mais informações'" size="small" variant="text"
                    @click="toggleRow(item)" />
            </template>
        </v-data-table>

        <v-dialog v-model="dialog" max-width="500" persistent>
            <v-form v-model="valid" ref="form" lazy-validation>
                <v-card :title="`${isEditing ? 'Editar' : 'Adicionar'} Usuário`">
                    <template v-slot:text>
                        <v-row>
                            <v-col cols="12" md="12" sm="12" class="pa-1 ma-0">
                                <v-text-field v-model="formModel.name" label="Nome" density="compact"
                                    hint="Campo obrigatório"
                                    :rules="[validationRules.min(3), validationRules.required('Campo nome obrigatório')]"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="12" sm="12" class="pa-1 ma-0">
                                <v-text-field v-model="formModel.email" label="E-mail" density="compact"
                                    hint="Campo obrigatório"
                                    :rules="[validationRules.email, validationRules.required('Campo e-mail obrigatório')]"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="12" sm="12" class="pa-1 ma-0">
                                <v-text-field v-model="cellphone" label="Contato (DDD + Número)" density="compact"
                                    hint="Campo obrigatório"
                                    :rules="[validationRules.phoneNumber, validationRules.max(11), validationRules.required('Campo telefone obrigatório')]"
                                    maxlength="11"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="6" class="pa-1 ma-0">
                                <v-text-field :disabled="isEditing" v-model="formModel.password" label="Senha"
                                    :type="showPassword ? 'text' : 'password'"
                                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                    @click:append-inner="showPassword = !showPassword" hint="Pelo menos 8 caracteres"
                                    density="compact"
                                    :rules="isEditing ? [] : [validationRules.min(8), validationRules.required('Campo senha obrigatório')]" />
                            </v-col>
                            <v-col cols="6" md="6" class="pa-1 ma-0">
                                <v-select label="Perfil" :items="[
                                    { title: 'Administrador', value: 'admin' },
                                    { title: 'Supervisor', value: 'supervisor' },
                                    { title: 'Agente', value: 'agent' }
                                ]" item-title="title" item-value="value" density="compact" v-model="formModel.role"
                                    :rules="[validationRules.required('Perfil Obrigatório')]" />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="10" sm="10" class="pa-1 ma-0">
                                <v-select v-model="formModel.company" label="Empresa" :items="companies"
                                    item-title="name" item-value="id" density="compact"
                                    :rules="[validationRules.required('Precisa selecionar uma Empresa')]"></v-select>
                            </v-col>
                            <v-col cols=2 md=2>
                                <v-btn icon="mdi-plus" variant="outlined" @click="companyDialog = true"
                                    density="compact" />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="12" class="pa-1 ma-0">
                                <v-select v-model="formModel.department" :items="departments" item-title="name"
                                    item-value="id" density="compact" label="Departamentos"></v-select>
                            </v-col>

                        </v-row>
                        <v-row>
                            <v-col class="pa-0 ma-0">
                                <v-text-field v-model="formModel.absence_message" label="Mensagem de Ausência"
                                    density="compact"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" class="pa-0 ma-0">
                                <v-checkbox v-model="formModel.no_auto_assign" color="primary"
                                    label="Não receber tickets via distribuição automática" hint-details></v-checkbox>

                                <v-checkbox v-model="formModel.see_department_tickets" color="primary"
                                    label="Visualizar tickets de outros usuários dos seus departamentos"
                                    hint-details></v-checkbox>
                            </v-col>
                        </v-row>

                    </template>

                    <v-divider></v-divider>

                    <v-card-actions class="bg-surface-light">
                        <v-btn text="Cancelar" variant="plain" @click="dialog = false"></v-btn>

                        <v-spacer></v-spacer>

                        <v-btn text="Salvar" @click="save" :disabled="!valid"></v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="400" persistent>
            <v-card title="Confirmar exclusão">
                <v-card-text>
                    Tem certeza que deseja deletar o usuário
                    <div style="font-weight: bold; color: red; margin-top: 8px;">
                        {{ userToDelete?.username?.toUpperCase() || '' }}
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn text="Cancelar" @click="dialogDelete = false" />
                    <v-btn text="Deletar" color="red" @click="confirmDelete" />
                </v-card-actions>
            </v-card>

        </v-dialog>

        <v-dialog v-model="companyDialog" max-width="400" persistent>
            <v-card title="Adicionar Empresa">
                <v-card-text>
                    <v-text-field v-model="companyForm.name" label="Nome da empresa" />
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn text="Cancelar" @click="companyDialog = false" />
                    <v-btn text="Salvar" @click="saveCompany" />
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { number } from 'echarts'
import { onMounted, ref, shallowRef, toRef, watch, computed } from 'vue'
// import { useBackgroundColor } from 'vuetify/lib/composables/color'
import api from '../../api/axios'
import { validationRules } from '../../rules/validationRules'
import { useItems } from 'vuetify/lib/composables/list-items'

onMounted(() => {
    loadData()
    usersSearch()
})

const cellphone = computed({
    get: () => formModel.value.cellphone,
    set: (value) => {
        const numericValue = value.replace(/\D/g, '')
        formModel.value.cellphone = numericValue
    }
})

const valid = ref(false)

const search = ref('')
function createNewRecord() {
    return {
        id: null,
        name: '',
        email: '',
        cellphone: '',
        department: null,
        role: '',
        company: null,
        uLogin: '',
        uLogout: '',
        online: '',
        password: '',
        absence_message: '',
        no_auto_assign: false,
        see_department_tickets: false
    }
}

const companyForm = ref({ name: '' })
const showPassword = ref(false)
const books = ref([])
const formModel = ref(createNewRecord())
const dialog = shallowRef(false)
const dialogDelete = shallowRef(false)
const companyDialog = shallowRef(false)
const isEditing = computed(() => !!formModel.value.id)
const menu = ref(false)
const companies = ref([])
const departments = ref([])
const profile = ref([])

const headers = [
    { align: 'start', key: 'username', sortable: false, title: 'Nome' },
    { key: 'email', title: 'E-mail' },
    { key: 'cellphone', title: 'Celular' },
    { key: 'department', title: 'Departamento' },
    { key: 'role_display', title: 'Perfil' },
    { key: 'uLogin', title: 'Último login' },
    { key: 'uLogout', title: 'Último logout' },
    { key: 'online', title: 'Online' },
    { key: 'actions', title: 'Ações' },
]
const users = ref([])

watch(
    () => formModel.value.company,
    (newCompanyId) => {
        if (!isEditing.value) {
            formModel.value.department = null
        }
        loadDepartments(newCompanyId)
    }
)

const roleDisplayMap: Record<string, string> = {
    "admin": "Administrador",
    "supervisor": "Supervisor",
    "agent": "Agente"
}


const loadDepartments = async (companyId: number | string) => {
    if (!companyId) {
        departments.value = []
        return
    }
    try {
        const { data } = await api.get(`/departments/?company=${companyId}`)
        departments.value = data
    } catch (error) {
        console.log(error.response?.data)
    }
}

const usersSearch = async () => {
    try {
        const { data } = await api.get('/users/')
        console.log('USERS API:', data)
        users.value = data
    } catch (error) {
        console.error('Erro to search users:', error)
    }
}

const saveCompany = async () => {
    try {
        await api.post('/companies/', companyForm.value)
        companyForm.value.name = ''
        companyDialog.value = false

    } catch (error) {
        console.error('Erro to save company:', error)
    } finally {
        await fetchFields([{ endpoint: '/companies/', field: companies }])
    }
}

const endpointsSearch = [
    { endpoint: '/companies/', field: companies },
    { endpoint: '/departments/', field: departments },
    { endpoint: '/profiles/', field: profile }
]

const fetchFields = async (searches: Array<{ endpoint: string; field: any }>) => {
    await Promise.all(
        searches.map(async ({ endpoint, field }) => {
            try {
                const { data } = await api.get(endpoint)
                field.value = data
            } catch (error) {
                console.error(`Erro to search endpoint: ${endpoint}:`, error)
            }
        })
    )
}

const loadData = async () => {
    await fetchFields(endpointsSearch)
}

const expanded = ref<number[]>([])

function toggleRow(item) {
    const index = expanded.value.indexOf(item.id)

    if (index > -1) {
        expanded.value.splice(index, 1)
    } else {
        expanded.value.push(item.id)
    }
}

function add() {
    formModel.value = createNewRecord()
    dialog.value = true
}

// function getRowProps({ item }) {
//     const id = item.raw.id

//     return {
//         class: id % 2 === 0 && 'v-data-table' ? 'row-red' : 'row-blue'
//     }
// }

const save = async () => {

    if (!valid.value) {
        console.log('Formulário inválido')
        return
    }

    const payload: any = {
        username: formModel.value.name,
        email: formModel.value.email,
        cellphone: formModel.value.cellphone,
        absence_message: formModel.value.absence_message,
        company: formModel.value.company,
        role: formModel.value.role,
        departments: formModel.value.department
            ? [formModel.value.department]
            : []
    }

    if (!isEditing.value || formModel.value.password) {
        payload.password = formModel.value.password
    }

    console.log(payload)

    try {
        if (isEditing.value) {
            await api.put(`/users/${formModel.value.id}/`, payload)
        } else {
            await api.post('/users/', payload)
        }

        dialog.value = false

    } catch (error: any) {
        console.log("API ERROR:", error.response?.data)
    } finally {
        await usersSearch()
        // await loadDepartments(formModel.value.company)
        await loadData()
    }
}

const editUser = (item: any) => {
    formModel.value = {
        id: item.id,
        name: item.username,
        email: item.email,
        cellphone: item.cellphone,
        absence_message: item.absence_message,
        company: item.company_info?.id || null,
        role: item.role,
        department: item.department?.[0]?.id ?? null,
        password: '',
        no_auto_assign: item.no_auto_assign ?? false,
        see_department_tickets: item.see_department_tickets ?? false
    }

    dialog.value = true
}

const userToDelete = ref<any | null>(null)

const deleteUser = async (item: any) => {
    userToDelete.value = item
    dialogDelete.value = true
}

const confirmDelete = async () => {
    if (!userToDelete.value) return

    try {
        await api.delete(`/users/${userToDelete.value.id}/`)
    } catch (error) {
        console.error('Erro ao deletar usuário:', error)
    } finally {
        dialogDelete.value = false
        userToDelete.value = null
        await usersSearch()
    }

    dialogDelete.value = false
}

</script>

<style>
.v-data-table {
    background-color: #293148;
    color: white;
}

.v-data-table tbody tr:nth-child(even) {
    background-color: #5173b8;
    color: white;
}

.v-data-table tbody tr[aria-expanded="true"] {
    background-color: white !important;
    color: black !important;
}

th {
    background-color: white !important;
    color: black
}
</style>