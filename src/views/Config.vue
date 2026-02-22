<template>
    <div class="all">
        <div class="flex w-full">
            <h1 class="w-full text-[30px] text-center text-white">
                Configurações
            </h1>
        </div>
        <div class="grid gap-6 
            grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-3 
            xl:grid-cols-4">

            <div v-for="(item, index) in itemCard" :key="index" class="p-6 rounded-2xl shadow-lg bg-white flex flex-col gap-3 
           hover:scale-105 transition duration-300">
                <RouterLink :to="item.route" class="flex flex-col gap-3">
                    <component :is="item.icon" :style="{ fontSize: item.size, color: '#6d28d9' }" />

                    <h2 class="text-lg font-semibold">
                        {{ item.title }}
                    </h2>

                    <p class="text-sm text-gray-500">
                        {{ item.subtitle }}
                    </p>
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CarbonCalendar from '~icons/carbon/calendar'

const itemCard = ref([
    {
        title: 'Plaug-in',
        subtitle: 'Configurar os plug-in',
        color: 'white',
        size: '2em',
        icon: CarbonCalendar,
        route: { name: 'pipeline' }
    },
    {
        title: 'Mensagem rápidas',
        subtitle: 'Configurar as mensagens rápidas',
        color: 'white',
        size: '2em',
        icon: CarbonCalendar,
        route: { name: 'pipeline' }
    },
    {
        title: 'Etiquetas',
        subtitle: 'Configurar as etiquetas',
        color: 'white',
        size: '2em',
        icon: CarbonCalendar,
        route: { name: 'label' }
    },
    {
        title: 'Motivos de Fechamento',
        subtitle: 'Configurar os motivos de fechamento',
        color: 'white',
        size: '2em',
        icon: CarbonCalendar,
        route: { name: 'reasonForClousure' }
    },
    {
        title: 'Template',
        subtitle: 'Sincronize seus templates do whatsapp business api',
        color: 'white',
        size: '2em',
        icon: CarbonCalendar,
        route: { name: 'pipeline' }
    },
])


</script>


<style scoped>
.all {
    background-color: rgb(7, 17, 47);
}
</style>