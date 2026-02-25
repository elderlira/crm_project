<template>
  <v-container fluid class="pa-5">

    <DashboardFilters @valorAEnviar="valorRecebido" />


    <Grafics :filterValue="filterValue" />


    <ChartCard title="Evolução atendimentos">
      <v-chart />
    </ChartCard>

  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VChart from 'vue-echarts'
import ChartCard from './dashboards/ChartCard.vue'
import DashboardFilters from './dashboards/DashboardFilters.vue'
import Grafics from './dashboards/GraphCards.vue'

interface FilterData {
  startDate: string,
  endDate: string,
  user: string,
  department: string,
  channel: string
}

const filterValue = ref<FilterData | null>(null)

const valorRecebido = (e: FilterData) => {
  filterValue.value = e
}

</script>