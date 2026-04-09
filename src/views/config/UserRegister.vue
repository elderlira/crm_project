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
                        label="Busque" 
                        prepend-inner-icon="mdi-magnify"
                        variant="outlined" 
                        hide-details 
                        single-line 
                        density="compact" 
                        class="mr-10"
                    ></v-text-field>
                    <v-btn class="me-2 mb-2" prepend-icon="mdi-plus" rounded="lg" text="Adicionar" border @click="add"></v-btn>
                </v-toolbar>
            </template>

            <template v-slot:expanded-row="{ columns, item }">
                <tr>
                    <td :colspan="columns.length" class="py-2">
                        <v-sheet rounded="lg" border>
                            <v-table density="compact">
                                <tbody>
                                    <tr>
                                        <th><v-btn text variant="plain" @click="() => {}"><v-icon icon="mdi-account-group" color="primary" class="mr-1"/>Grupos</v-btn></th>
                                        <th><v-btn text variant="plain" @click="() => {}"><v-icon icon="mdi-shield-lock" class="mr-1"/>Permissões</v-btn></th>
                                        <th><v-btn text variant="plain" @click="() => {}"><v-icon icon="mdi-vector-link" class="mr-1"/>Canais</v-btn></th>
                                    </tr>
                                    <tr>
                                        <th><v-btn text variant="plain" @click="() => {}"><v-icon icon="mdi-key" class="mr-1"/>Alterar Senha</v-btn></th>
                                        <th><v-btn text variant="plain" @click="editItem(item)"><v-icon icon="mdi-pencil" class="mr-1"/>Editar</v-btn></th>
                                        <th><v-btn text variant="plain" color="error" @click="() => {}"><v-icon icon="mdi-delete" class="mr-1"/>Deletar</v-btn></th>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-sheet>
                    </td>
                </tr>
            </template>

            <template v-slot:item.role_name="{ item }">
                {{ item.role_name || 'Sem Perfil' }}
            </template>

                        <template v-slot:item.company_name="{ item }">
                <span class="text-caption">{{ item.company_name || 'N/A' }}</span>
            </template>

            <template v-slot:item.department_name="{ item }">
                <v-chip size="x-small" variant="outlined">{{ item.department_name || 'Geral' }}</v-chip>
            </template>

            <template v-slot:item.last_login="{ item }">
                <span class="text-caption">
                    {{ item.last_login ? new Date(item.last_login).toLocaleString('pt-BR') : '-' }}
                </span>
            </template>

            <template v-slot:item.last_logout="{ item }">
                <span class="text-caption">
                    {{ item.last_logout ? new Date(item.last_logout).toLocaleString('pt-BR') : '-' }}
                </span>
            </template>

            <template v-slot:item.is_online="{ item }">
                <v-chip :color="item.is_online ? 'success' : 'warning'" size="x-small">
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

        <v-dialog v-model="dialog" max-width="550" persistent>
            <v-card :title="`${formModel.id ? 'Editar' : 'Adicionar'} Usuário`">
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="6" class="pa-1"><v-text-field v-model="formModel.name" label="Nome" density="compact" variant="outlined"/></v-col>
                        <v-col cols="12" md="6" class="pa-1"><v-text-field v-model="formModel.email" label="E-mail" density="compact" variant="outlined"/></v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="6" class="pa-1">
                            <v-text-field v-model="formModel.phone" label="Contato (11 dígitos)" density="compact" variant="outlined" maxlength="11" @input="validatePhone"/>
                        </v-col>
                      
                    </v-row>
                    <v-row v-if="!formModel.id">
                        <v-col cols="12" class="pa-1"><v-text-field v-model="formModel.password" label="Senha" :type="showPassword ? 'text' : 'password'" :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append-inner="showPassword = !showPassword" density="compact" variant="outlined"/></v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="5" md="5" class="pa-1">
                            <v-select label="Perfil" :items="perfis" item-title="title" item-value="value" density="compact" v-model="formModel.role" variant="outlined"/>
                        </v-col>
                        <v-col cols="5" md="5" class="pa-1">
                            <v-select v-model="formModel.company" label="Empresa" :items="companies" item-title="name" item-value="id" density="compact" variant="outlined"/>
                        </v-col>
                        <v-col cols="2" md="2" class="d-flex align-center"><v-btn icon="mdi-plus" variant="outlined" @click="companyDialog = true" density="compact" /></v-col>
                    </v-row>
                    <v-row>
                        <v-col class="pa-1"><v-text-field v-model="formModel.away_message" label="Mensagem de Ausência" density="compact" variant="outlined"/></v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="pa-1">
                            <v-checkbox v-model="formModel.no_auto_assign" color="primary" label="Não receber tickets via distribuição automática" hide-details></v-checkbox>
                            <v-checkbox v-model="formModel.see_department_tickets" color="primary" label="Visualizar tickets de outros usuários" hide-details></v-checkbox>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-btn text="Cancelar" variant="plain" @click="dialog = false"></v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="elevated" @click="save">Salvar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="companyDialog" max-width="400" persistent>
            <v-card title="Adicionar Empresa">
                <v-card-text><v-text-field v-model="companyForm.name" label="Nome da empresa" variant="outlined" /></v-card-text>
                <v-card-actions><v-spacer /><v-btn text @click="companyDialog = false" /><v-btn color="primary" text="Salvar" @click="saveCompany" /></v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../../api/axios'

const search = ref('')
const users = ref([])
const companies = ref([])
const departments = ref([])
const expanded = ref([])
const dialog = ref(false)
const companyDialog = ref(false)
const showPassword = ref(false)
const companyForm = ref({ name: '' })


const perfis = [
    { title: 'Administrador', value: 6 },
    { title: 'Super Admin', value: 7 },
    { title: 'Usuário', value: 8 }
]

const headers = [
    { title: 'Nome', key: 'name', align: 'start' },
    { title: 'Empresa', key: 'company_name' },
    { title: 'Depto', key: 'department_name' },
    { title: 'Perfil', key: 'role_name' },
    { title: 'Login', key: 'last_login' },
    { title: 'Logout', key: 'last_logout' },
    { title: 'Online', key: 'is_online', align: 'center' },
    { title: 'Ações', key: 'actions', sortable: false },
]
const formModel = ref(createNewRecord())

function createNewRecord() {
    return { id: null, name: '', email: '', phone: '', role: null, company: null, department: null, password: '', away_message: '', no_auto_assign: false, see_department_tickets: true }
}

const validatePhone = () => {
    formModel.value.phone = formModel.value.phone.replace(/\D/g, '').slice(0, 11)
}

const loadData = async () => {
    try {
        const [u, c, d] = await Promise.all([api.get('/users/'), api.get('/company/'), api.get('/departments/')])
        users.value = u.data
        companies.value = c.data
        departments.value = d.data
    } catch (e) { console.error(e) }
}

const toggleRow = (item) => {
    const index = expanded.value.indexOf(item.id)
    index > -1 ? expanded.value.splice(index, 1) : expanded.value.push(item.id)
}

const add = () => { formModel.value = createNewRecord(); dialog.value = true }
const editItem = (item) => { formModel.value = { ...item }; dialog.value = true }

const save = async () => {
    try {
        if (formModel.value.id) {
            await api.put(`/users/${formModel.value.id}/`, formModel.value)
        } else {
            await api.post('/users/', formModel.value)
        }
        dialog.value = false
        loadData()
    } catch (e) { alert('Erro ao salvar!') }
}

const saveCompany = async () => {
    try {
        await api.post('/company/', companyForm.value)
        companyForm.value.name = ''; companyDialog.value = false; loadData()
    } catch (e) { console.error(e) }
}

onMounted(loadData)
</script>