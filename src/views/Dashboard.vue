<template>
  <v-container fluid class="pa-5">

    <!-- FILTROS -->
    <v-row class="mb-2">
      <v-col cols="10">
        <DashboardFilters @valorAEnviar="valorRecebido" />
      </v-col>
    </v-row>


    <Grafics :filterValue="filterValue" />


    <!-- <v-row class="mb-2">
      <v-col v-for="(metric, index) in metrics" :key="index" cols="12" sm="8" md="4" lg="2">
        <MetricCard :title="metric.title" :value="metric.value" :color="metric.color" :icon="metric.icon" />
      </v-col>
    </v-row> -->
    <v-row>
      <v-col cols="12">
        <ChartCard title="Evolução atendimentos">
          <v-chart />
        </ChartCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VChart from 'vue-echarts'
import ChartCard from '/src/views/dashboards/ChartCard.vue'
import DashboardFilters from '/src/views/dashboards/DashboardFilters.vue'
import Grafics from '/src/views/dashboards/GraphCards.vue'
import MetricCard from './dashboards/MetricCard.vue'

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


const pieChannel = ref({
  tooltip: { trigger: 'item' },
  series: [
    {
      type: 'pie',
      radius: '70%',
      data: [{ value: 12, name: 'Whatsapp' }],
      label: { formatter: '{d}%' }
    }
  ]
})

const pieClosing = ref({
  tooltip: { trigger: 'item' },
  series: [
    {
      type: 'pie',
      radius: '70%',
      data: [{ value: 6, name: 'SEM MENSAGEM FINAL' }],
      label: { formatter: '{d}%' }
    }
  ]
})

const pieDepartment = ref({
  tooltip: { trigger: 'item' },
  series: [
    {
      type: 'pie',
      radius: '70%',
      data: [
        { value: 2, name: 'Não informado' },
        { value: 4, name: 'ABORDAGEM - SDR' }
      ],
      label: { formatter: '{d}%' }
    }
  ]
})

const evolutionOption = ref({
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    data: ['16/02', '17/02', '18/02', '19/02', '20/02']
  },
  yAxis: { type: 'value' },
  series: [
    {
      name: 'Atendimentos',
      type: 'bar',
      data: [2, 1, 4, 1, 4]
    },
    {
      type: 'line',
      data: [2, 1, 4, 1, 4]
    }
  ]
})
</script>