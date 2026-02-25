<template>
  <v-card rounded="xl" elevation="3" class="pa-5">
    <!-- <v-row class="mb-2">
      <v-col v-for="(metric, index) in metrics" :key="index" cols="12" sm="8" md="4" lg="2">
        {{ title }}

        <v-btn icon variant="text" size="small">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
        {{ valores }}
        <div style="height: 300px;">

        </div>
      </v-col>
    </v-row> -->

    <v-card color="#e8f1f2" class="pt-10  ml-2 mr-2">
      <div class="grid gap-6 
            grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-3 
            xl:grid-cols-4
            mr-5
            ">
        <div v-for="(item, index) in atendentCardItens" :key="index" class="p-6 rounded-2xl shadow-lg bg-white flex flex-col gap-3 
           hover:scale-105 transition duration-300 ml-6 mr-2 mb-10">
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
    </v-card>

  </v-card>
</template>

<script setup lang="ts">

import { ref, Ref, watch } from 'vue'

interface FilterData {
  startDate: string,
  endDate: string,
  user: string,
  department: string,
  channel: string
}

const props = defineProps<{
  title: string,
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
  { title: 'Total de atendimentos', value: 12, color: 'green', icon: 'mdi-chart-line' },
  { title: 'Receptivos', value: 6, color: 'red', icon: 'mdi-phone-incoming' },
  { title: 'Ativos', value: 6, color: 'blue', icon: 'mdi-phone-outgoing' },
  { title: 'Pendentes', value: 0, color: 'indigo', icon: 'mdi-message-reply-text' },
  { title: 'Atendentes', value: 3, color: 'yellow', icon: 'mdi-account-group' },
  { title: 'Total contatos', value: 741, color: 'orange', icon: 'mdi-account-multiple' },
  { title: 'Novos contatos', value: 7, color: 'teal', icon: 'mdi-account-plus' },
  { title: 'Contatos ativos', value: 7, color: 'purple', icon: 'mdi-account-check' },
  { title: 'TMA', value: '5h 21min', color: 'cyan', icon: 'mdi-timer-outline' },
  { title: '1° resposta', value: '19h 36min', color: 'pink', icon: 'mdi-clock-outline' },
]

</script>