<template>
  <v-container fluid class="pa-5">

    <!-- FILTROS -->
    <v-row class="mb-2">
      <v-col cols="10">
        <DashboardFilters />
      </v-col>
    </v-row>

    <!-- MÉTRICAS -->
    <v-row class="mb-2">
      <v-col
        v-for="(metric, index) in metrics"
        :key="index"
        cols="12"
        sm="8"
        md="4"
        lg="2"
      >
        <MetricCard
    :title="metric.title"
    :value="metric.value"
    :color="metric.color"
    :icon="metric.icon"
  />
      </v-col>
    </v-row>

    <!-- GRÁFICOS DE PIZZA -->
    <v-row class="mb-6" dense>

      <v-col cols="12" md="4">
        <ChartCard title="Atendimento por canal">
          <v-chart :option="pieChannel" style="height: 250px;" />
        </ChartCard>
      </v-col>

      <v-col cols="12" md="4">
        <ChartCard title="Motivo de fechamento">
          <v-chart :option="pieClosing" style="height: 250px;" />
        </ChartCard>
      </v-col>

      <v-col cols="12" md="4">
        <ChartCard title="Atendimento por departamento">
          <v-chart :option="pieDepartment" style="height: 250px;" />
        </ChartCard>
      </v-col>

    </v-row>

    <!-- EVOLUÇÃO -->
    <v-row>
      <v-col cols="12">
        <ChartCard title="Evolução atendimentos">
          <v-chart :option="evolutionOption" style="height: 300px;" />
        </ChartCard>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VChart from 'vue-echarts'
import ChartCard from '/src/views/dashboards/ChartCard.vue'
import MetricCard from '/src/views/dashboards/MetricCard.vue'
import DashboardFilters from '/src/views/dashboards/DashboardFilters.vue'

/* ================= METRICS ================= */
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

/* ================= GRÁFICOS ================= */

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