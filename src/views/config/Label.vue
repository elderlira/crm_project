<template>
    <div>
        <v-sheet border rounded>
            <v-data-table :headers="headers" :hide-default-footer="books.length < 11" :items="books">
                <template v-slot:item.color="{ item }">
                    <div class="color-cell" :style="{ backgroundColor: item.color }">
                        {{ item.color }}
                    </div>
                </template>
                <template v-slot:item.ativo="{ item }">
                    <v-icon :color="item.ativo === true ? 'success' : 'error'">
                        {{ item.ativo === true ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline' }}
                    </v-icon>
                </template>
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <v-icon color="medium-emphasis" icon="mdi-book-multiple" size="x-small" start></v-icon>
                            Etiquetas
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
                        <v-col cols="12" md="12">
                            <v-text-field v-model="formModel.etiqueta"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="12">
                            <v-menu v-model="menu" :close-on-content-click="false" location="left">
                                <template #activator="{ props }">
                                    <v-text-field :label="formModel.color" append-inner-icon="mdi-eyedropper"
                                        @click:append-inner="menu = true" :color="formModel.color"
                                        :bg-color="formModel.color"></v-text-field>
                                </template>

                                <v-card>
                                    <v-color-picker v-model="formModel.color" hide-inputs />
                                </v-card>
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
                                    {{ `${formModel.ativo}` == 'true' ? 'Ativo' : 'Inativo' }}
                                </v-toolbar-title>
                                <v-switch v-model="formModel.ativo" color='primary' hide-details inset></v-switch>
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
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, shallowRef, toRef, reactive } from 'vue'
import { useBackgroundColor } from 'vuetify/lib/composables/color'

const currentYear = new Date().getFullYear()

function createNewRecord() {
    return {
        etiqueta: '',
        color: '',
        ativo: ref(true),
        actions: ''
    }
}

const books = ref([])
const formModel = ref(createNewRecord())
const dialog = shallowRef(false)
const isEditing = toRef(() => !!formModel.value.id)
const menu = ref(false)

const headers = [
    { title: 'Id', key: 'id', align: 'start' },
    { title: 'Etiqueta', key: 'etiqueta' },
    { title: 'Cor', key: 'color' },
    { title: 'Ativo', key: 'ativo', align: 'end' },
    { title: 'Ações', key: 'actions', align: 'end', sortable: false, color: '#792828' },
]

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
        etiqueta: found.etiqueta,
        color: found.color,
        ativo: found.ativo,
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
        { id: 1, etiqueta: 'etiqueta 1', color: '#792828', ativo: true },
        { id: 2, etiqueta: 'etiqueta 2', color: 'green', ativo: false },
        { id: 3, etiqueta: 'etiqueta 3', color: 'red', ativo: false },
        { id: 4, etiqueta: 'etiqueta 4', color: '#792825', ativo: true },
        { id: 5, etiqueta: 'etiqueta 5', color: '#792828', ativo: true },
    ]
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