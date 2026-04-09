<template>
    <div class="ml-4 mr-4 mb-4 mt-8">
        <v-data-table :headers="headers" :items="users" :search="search" v-model:expanded="expanded" item-value="id"
            :item-props="getRowProps">
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

            <template v-slot:expanded-row="{ columns, item }">
                <tr>
                    <td :colspan="columns.length" class="py-2">
                        <v-sheet rounded="lg" border>
                            <v-table density="compact">
                                <tbody>
                                    <tr>
                                        <th>
                                            <v-btn text="Grupos do Usuário" variant="plain"
                                                @click="() => console.log('clicado em grupos do usuario')">
                                                <v-icon icon="mdi-account-group" color="primary" class="mr-1"></v-icon>
                                                Grupos do Usuário
                                            </v-btn>
                                        </th>
                                        <th> <v-btn text="Grupos do Usuário" variant="plain"
                                                @click="() => console.log('clicado em grupos do usuario')">
                                                <v-icon icon="mdi-account-group" class="mr-1"></v-icon>
                                                Permissões do usuário
                                            </v-btn>
                                        </th>
                                        <th>
                                            <v-btn text="Grupos do Usuário" variant="plain"
                                                @click="() => console.log('clicado em grupos do usuario')">
                                                <v-icon icon="mdi-account-group" class="mr-1"></v-icon>
                                                Gestão de canais do usuário
                                            </v-btn>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>
                                            <v-btn text="Grupos do Usuário" variant="plain"
                                                @click="() => console.log('clicado em grupos do usuario')">
                                                <v-icon icon="mdi-account-group" class="mr-1"></v-icon>
                                                Alterar senha
                                            </v-btn>
                                        </th>
                                        <th>
                                            <v-btn text="Grupos do Usuário" variant="plain"
                                                @click="() => console.log('clicado em grupos do usuario')">
                                                <v-icon icon="mdi-account-group" class="mr-1"></v-icon>
                                                Editar
                                            </v-btn>
                                        </th>
                                        <th>
                                            <v-btn text="Grupos do Usuário" variant="plain"
                                                @click="() => console.log('clicado em grupos do usuario')">
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

            <template v-slot:item.role="{ item }">
                {{ roleDisplayMap[item.role] || item.role || '—' }}
            </template>

            <template v-slot:item.actions="{ item }">
                <v-btn :append-icon="expanded.includes(item.id) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                    :text="expanded.includes(item.id) ? 'Compactar' : 'Mais informações'" size="small" variant="text"
                    @click="toggleRow(item)" />
            </template>
        </v-data-table>

        <v-dialog v-model="dialog" max-width="500" persistent>
            <v-card :title="`${isEditing ? 'Editar' : 'Adicionar'} Usuário`">
                <template v-slot:text>
                    <v-row>
                        <v-col cols="12" md="6" sm="12" class="pa-1 ma-0">
                            <v-text-field v-model="formModel.name" label="Nome" density="compact"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" , sm="12" class="pa-1 ma-0">
                            <v-text-field v-model="formModel.email" label="E-mail" density="compact"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="6" , sm="12" class="pa-1 ma-0">
                            <v-text-field v-model="formModel.cellphone" label="Contato (DDD + Número)"
                                density="compact"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" , sm="12" class="pa-1 ma-0">
                            <v-select v-model="formModel.department" :items="departments" item-title="name"
                                item-value="id" density="compact" label="Departamentos"></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="12" class="pa-0 ma-0">
                            <v-text-field v-model="formModel.password" label="Senha"
                                :type="showPassword ? 'text' : 'password'"
                                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append-inner="showPassword = !showPassword" hint="Pelo menos 8 caracteres"
                                density="compact"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="5" md="5" class="pa-1 ma-0">
                            <v-select label="Perfil" :items="profile" density="compact" v-model="formModel.role"
                                item-title="name" item-value="name"></v-select>
                        </v-col>
                        <v-col cols="5" md="5" class="pa-1 ma-0">
                            <v-select v-model="formModel.company" label="Empresa" :items="companies" item-title="name"
                                item-value="id" density="compact"></v-select>
                        </v-col>
                        <v-col cols=2 md=2>
                            <v-btn icon="mdi-plus" variant="outlined" @click="companyDialog = true" density="compact" />
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

                    <v-btn text="Salvar" @click="save"></v-btn>
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
import { onMounted, ref, shallowRef, toRef } from 'vue'
// import { useBackgroundColor } from 'vuetify/lib/composables/color'
import api from '../../api/axios'

onMounted(() => {
    loadData()
    usersSearch()
})

const search = ref('')
function createNewRecord() {
    return {
        id: null,
        name: '',
        email: '',
        cellphone: '',
        department: null,
        role: '',
        company: '',
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
const companyDialog = shallowRef(false)
const isEditing = toRef(() => !!formModel.value.id)
const menu = ref(false)
const companies = ref([])
const departments = ref([])
const profile = ref([])

const headers = [
    { align: 'start', key: 'username', sortable: false, title: 'Nome' },
    { key: 'email', title: 'E-mail' },
    { key: 'cellphone', title: 'Celular' },
    { key: 'department', title: 'Departamento' },
    { key: 'role', title: 'Perfil' },
    { key: 'uLogin', title: 'Último login' },
    { key: 'uLogout', title: 'Último logout' },
    { key: 'online', title: 'Online' },
    { key: 'actions', title: 'Ações' },
]
const users = ref([])

const roleDisplayMap: Record<string, string> = {
    "admin": "Administrador",
    "supervisor": "Supervisor",
    "agent": "Agente"
}


const loadDepartments = async () => {
    try {
        const { data } = await api.get(`/departments/?company=${formModel.value.company}`)
        departments.value = data
    } catch (error) {
        console.log(error.response.data)
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

function getRowProps({ item }) {
    const id = item.raw.id

    return {
        class: id % 2 === 0 && 'v-data-table' ? 'row-red' : 'row-blue'
    }
}

const save = async () => {

    const payload = {
        username: formModel.value.name,
        email: formModel.value.email,
        password: formModel.value.password,
        cellphone: formModel.value.cellphone,
        absence_message: formModel.value.absence_message,
        company: formModel.value.company,
        profile: formModel.value.role,
        departments: formModel.value.department ? [formModel.value.department] : []
    }

    console.log(payload)
    try {
        if (isEditing.value) {
            await api.put(`/users/${formModel.value.id}`, payload)
        } else {
            await api.post('/users/', payload)
        }
        dialog.value = false
    } catch (error) {
        console.log("API ERROR:", error.response.data)
    } finally {
        await usersSearch()
        await loadDepartments()
        await loadData()
    }
}

</script>

<style>
.v-data-table {
    background-color: #32CD32;
    color: white;
}

.v-data-table tbody tr:nth-child(even) {
    background-color: #006400;
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