<template>
    <div>
        <v-sheet border rounded>
            <v-data-table :headers="headers" :hide-default-footer="books.length < 11" :items="books">
                <template v-slot:item.color="{ item }">
                </template>
                <template v-slot:item.ativo="{ item }">
                    <v-icon :color="item.active === true ? 'success' : 'error'">
                        {{ item.active === true ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline' }}
                    </v-icon>
                </template>
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <v-icon color="medium-emphasis" icon="mdi-book-multiple" size="x-small" start></v-icon>
                            Departamentos
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

                <template v-slot:item.actions="{ item }">
                    <div class="d-flex ga-2 justify-center">
                        <v-icon color="success" icon="mdi-pencil" size="small" @click="edit(item.id)"></v-icon>

                        <v-icon color="error" icon="mdi-delete" size="small" @click="remove(item.id)"></v-icon>
                    </div>
                </template>

                <template v-slot:no-data>
                    {{ ' Sem departamentos cadastrados' }}
                </template>
            </v-data-table>
        </v-sheet>

        <v-dialog v-model="dialog" max-width="500">
            <v-card :subtitle="`${isEditing ? 'Update' : 'Crie'} seu departamento`"
                :title="`${isEditing ? 'Editar' : 'Adicionar'} departamento`">
                <template v-slot:text>
                    <v-row>
                        <v-col cols="10" md="10" class="pa-1 ma-0">
                            <v-select v-model="formModel.company" label="Empresa" :items="companies" item-title="name"
                                item-value="id"></v-select>
                        </v-col>
                        <v-col cols=2 md=2>
                            <v-btn icon="mdi-plus" variant="outlined" @click="companyDialog = true" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="12" class="pa-1 ma-0">
                            <v-text-field v-model="formModel.department" label="nome do departamento"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="12" class="pa-1 ma-0">
                            <v-menu v-model="menu" :close-on-content-click="false" location="left">
                                <template #activator="{ props }">
                                    <v-textarea v-model="formModel.message" label="Mensagem"></v-textarea>
                                </template>
                            </v-menu>

                            <v-card class="pa-6 d-flex align-center justify-space-between" color="grey-lighten-3"
                                rounded="lg" elevation="0">
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="12">
                            <v-container fluid>
                                <v-toolbar-title>
                                    {{ `${formModel.active}` == 'true' ? 'Ativo' : 'Inativo' }}
                                </v-toolbar-title>
                                <v-switch v-model="formModel.active" color='primary' hide-details inset></v-switch>
                            </v-container>
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
import { onMounted, ref, shallowRef, toRef } from 'vue'
// import { useBackgroundColor } from 'vuetify/lib/composables/color'
import api from "../../api/axios"
import { useAuthStore } from '../../services/authStore'

const auth = useAuthStore()

const currentYear = new Date().getFullYear()

function createNewRecord() {
    return {
        company: '',
        department: '',
        message: '',
        active: true,
    }
}

const companyForm = ref({
    name: ''
})

const books = ref([])
const formModel = ref(createNewRecord())
const dialog = shallowRef(false)
const companyDialog = shallowRef(false)
const isEditing = toRef(() => !!formModel.value.id)
const menu = ref(false)
const companies = ref([])

const headers = [
    { title: 'Id', key: 'id', align: 'start' },
    { title: 'Departamento', key: 'name' },
    { title: 'Ativo', key: 'active', align: 'center' },
    { title: 'Ações', key: 'actions', align: 'center', sortable: false, color: '#792828' },
]

onMounted(() => {
    searchCompany()
})

const saveCompany = async () => {
    try {
        await api.post('/companies/', companyForm.value)
        companyDialog.value = false
        companyForm.value.name = ''
    } catch (error) {
        console.error('Error saving company:', error)
    }
}

const searchCompany = async () => {
    try {
        const { data } = await api.get('/companies/')
        companies.value = data
    } catch (error) {
        console.error('Error fetching companies:', error)
    }
}

const loadDepartments = async () => {
    try {
        const { data } = await api.get('/departments/')
        books.value = data
    } catch (error) {
        console.error('Error fetching departments:', error)
    }

}

function add() {
    formModel.value = createNewRecord()
    dialog.value = true
}

function edit(id) {
    const found = books.value.find(book => book.id === id)

    formModel.value = {
        id: found.id,
        department: found.departament,
        message: found.message,
        active: found.active,
    }

    dialog.value = true
}

function remove(id) {
    const index = books.value.findIndex(book => book.id === id)
    books.value.splice(index, 1)
}

async function save() {

    const payload = {
        company: formModel.value.company,
        name: formModel.value.department,
        message: formModel.value.message,
        active: formModel.value.active
    }

    try {
        if (isEditing.value) {
            await api.put(`/departments/${formModel.value.id}/`, payload)
        } else {
            await api.post('/departments/', payload)
        }

        await loadDepartments()
    } catch (error) {
        console.error('Error saving department:', error)
    }

    dialog.value = false
}

</script>

<style>
.color-cell {
    width: 100%;
    height: 100%;
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
}
</style>