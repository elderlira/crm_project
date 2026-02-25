<template>
    <div>
        <v-row>
            <v-col v-for="(m, index) in metrics" :key="index" cols="12" lg="2" md="6" sm="12">
                <v-card rounded="xl" elevation="3" class="pa-5">
                    <v-row>
                        <v-col>
                            <v-icon :color="m.color" :icon="m.icon" size="30"></v-icon>
                        </v-col>
                        <v-col cols="9" class="text-center">
                            <p style="font-size: 30px">
                                {{ m.value }}
                            </p>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="text-uppercase text-center">
                            {{ m.title }}
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </div>

</template>

<script setup lang="ts">

import { ref, Ref, watch } from 'vue'

const filterValue = ref<FilterData | null>(null)

interface FilterData {
    startDate: string,
    endDate: string,
    user: string,
    department: string,
    channel: string
}

const props = defineProps<{
    filterValue: FilterData | null
}>()

let valores = ref<FilterData>({
    startDate: '',
    endDate: '',
    user: '',
    department: '',
    channel: ''
})

watch(
    () => props.filterValue,
    (newFilters) => {
        if (newFilters) {
            console.log(newFilters)
            valores.value = newFilters
        }
    },
    { deep: true }
)
const metrics = [
    { id: 1, title: 'Total de atendimentos', value: 12, color: '#16a34a', icon: 'mdi-chart-line' },
    { title: 'Receptivos', value: 6, color: '#dc2626', icon: 'mdi-phone-incoming' },
    { title: 'Ativos', value: 6, color: '#2563eb', icon: 'mdi-phone-outgoing' },
    { title: 'Pendentes', value: 0, color: '#4f46e5', icon: 'mdi-message-reply-text' },
    { title: 'Atendentes', value: 3, color: '#eab308', icon: 'mdi-account-group' },
    { title: 'Total contatos', value: 741, color: '#f59e0b', icon: 'mdi-account-multiple' },
    { title: 'Novos contatos', value: 7, color: '#14b8a6', icon: 'mdi-account-plus' },
    { title: 'Contatos ativos', value: 7, color: '#8b5cf6', icon: 'mdi-account-check' },
    { title: 'TMA', value: '5h 21min', color: '#0ea5e9', icon: 'mdi-timer-outline' },
    { title: '1° resposta', value: '19h 36min', color: '#ec4899', icon: 'mdi-clock-outline' },
]

</script>