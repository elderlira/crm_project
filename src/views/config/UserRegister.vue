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

            <template v-slot:item.actions="{ item }">
                <!-- {{ item.id }} -->
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
                            <v-text-field v-model="formModel.nome" label="Nome" density="compact"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" , sm="12" class="pa-1 ma-0">
                            <v-text-field v-model="formModel.email" label="E-mail" density="compact"></v-text-field>
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
                        <v-col cols="6" md="6" class="pa-1 ma-0">
                            <v-select label="Perfil" :items="perfis" density="compact"></v-select>
                        </v-col>
                        <v-col cols="6" md="6" class="pa-1 ma-0">
                            <v-select label="Empresa" :items="companies" density="compact"></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="pa-0 ma-0">
                            <v-text-field v-model="formModel.outOfMenssage" label="Mensagem de Ausência"
                                density="compact"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="pa-0 ma-0">
                            <v-checkbox v-model="formModel.reciveTicket" color="primary"
                                label="Não receber tickets via distribuição automática" hint-details></v-checkbox>

                            <v-checkbox v-model="formModel.reciveTicket" color="primary"
                                label="Visualizar tickets de outros usuários dos seus departamentos"
                                hint-details></v-checkbox>
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
    </div>
</template>

<script setup lang="ts">
import { number } from 'echarts'
import { onMounted, ref, shallowRef, toRef } from 'vue'
import { useBackgroundColor } from 'vuetify/lib/composables/color'
import api from '../../api/axios'

const search = ref('')
function createNewRecord() {
    return {
        nome: '',
        email: '',
        celular: '',
        departament: '',
        perfil: '',
        uLogin: '',
        uLogout: '',
        online: '',
        password: '',
        number: '',
        outOfMenssage: '',
        reciveTicket: ref(false),
        viewTicket: ref(false)
    }
}
const showPassword = ref(false)
const books = ref([])
const formModel = ref(createNewRecord())
const dialog = shallowRef(false)
const isEditing = toRef(() => !!formModel.value.id)
const menu = ref(false)
const companies = ref([])

const headers = [
    {
        align: 'start',
        key: 'name',
        sortable: false,
        title: 'Nome',
    },
    { key: 'email', title: 'E-mail' },
    { key: 'celular', title: 'Celular' },
    { key: 'departament', title: 'Departamento' },
    { key: 'perfil', title: 'Perfil' },
    { key: 'uLogin', title: 'Último login' },
    { key: 'uLogout', title: 'Último logout' },
    { key: 'online', title: 'Online' },
    { key: 'actions', title: 'Ações' },
]
const users = [
    {
        id: 1,
        name: 'Elder Castro Franca Lira',
        email: 'elderfranca@hotmail.com',
        celular: '71986325411',
        departament: 'SUPORTE AO TIME - CS',
        perfil: 24,
        uLogin: '02/03/2026 00:10',
        uLogout: '02/03/2026 00:45',
        online: 'sim',
        details: {
            valor1: 'primeiro item',
            valor2: 'seguindo item',
            valor3: 'terceiro item'
        }
    },
    {
        id: 2,
        name: 'Elder Castro Franca Lira',
        email: 'elderfranca@hotmail.com',
        celular: '71986325411',
        departament: 'SUPORTE AO TIME - CS',
        perfil: 24,
        uLogin: '02/03/2026 00:10',
        uLogout: '02/03/2026 00:45',
        online: 'sim',
        details: {
            valor1: 'primeiro item',
            valor2: 'seguindo item',
            valor3: 'terceiro item'
        }
    },
    {
        id: 3,
        name: 'Elder Castro Franca Lira',
        email: 'elderfranca@hotmail.com',
        celular: '71986325411',
        departament: 'SUPORTE AO TIME - CS',
        perfil: 24,
        uLogin: '02/03/2026 00:10',
        uLogout: '02/03/2026 00:45',
        online: 'sim',
        details: {
            valor1: 'primeiro item',
            valor2: 'seguindo item',
            valor3: 'terceiro item'
        }
    }
]

const perfis = ['Usuário', 'Administrador', 'Supervisor']

async function companiesSearch() {

    await api.get('/companies').then((response) => {
        companies.value = response.data
    }).catch((error) => {
        console.error('Erro ao buscar empresas:', error)
    })

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

</script>

<style>
/* .row-blue {
    background-color: #2196f3 !important;
    color: white !important;
}

.row-red {
    background-color: #f44336 !important;
    color: white !important;
} */
.v-data-table {
    background-color: #32CD32;
    color: white;
}

.v-data-table tbody tr:nth-child(even) {
    background-color: #006400;
    color: white;
}

/* Adicionando estilo para a linha expandida */
.v-data-table tbody tr[aria-expanded="true"] {
    background-color: white !important;
    color: black !important;
}

th {
    background-color: white !important;
    color: black
}
</style>