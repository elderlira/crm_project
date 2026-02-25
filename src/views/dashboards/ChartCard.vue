<template>
  <div>
 <v-row class="mt-6">
    <v-col cols="12" md="6">
      <v-card rounded="xl" elevation="3" class="pa-5">
        <div class="text-subtitle-1 font-weight-bold mb-4">
          Atendimento por canal
        </div>
        <v-chart
          :option="Channel"
          style="height: 300px"
          autoresize
        />
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <v-card rounded="xl" elevation="3" class="pa-5">
        <div class="text-subtitle-1 font-weight-bold mb-4">
          Motivo de fechamento
        </div>
        <v-chart
          :option="Closing"
          style="height: 300px"
          autoresize
        />
      </v-card>
    </v-col>
  </v-row>
  <v-row class="mt-6">
    
  </v-row>
   <v-row class="mt-6">
    <v-col cols="12" md="6">
      <v-card rounded="xl" elevation="3" class="pa-5">
        <div class="text-subtitle-1 font-weight-bold mb-4">
          Atendimento por departamento
        </div>
        <v-chart
          :option="Department"
          style="height: 300px"
          autoresize
        />
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <v-card rounded="xl" elevation="3" class="pa-5">
        <div class="text-subtitle-1 font-weight-bold mb-4">
          Evolução atendimentos
        </div>
        <v-chart
          :option="evolutionOption"
          style="height: 300px"
          autoresize
        />
      </v-card>
    </v-col>
  </v-row>

  <v-row class="mt-6">
    <v-col cols="12" md="6">
      <v-card rounded="xl" elevation="3" class="pa-5">
        <div class="text-subtitle-1 font-weight-bold mb-4">
          Atendimento por dia
        </div>

        <v-chart
          :option="chartOption1"
          style="height: 300px"
          autoresize
        />
      </v-card>
    </v-col>

    <v-col cols="12" md="6">
      <v-card rounded="xl" elevation="3" class="pa-5">
        <div class="text-subtitle-1 font-weight-bold mb-4">
          Performance por Atendente
        </div>

        <v-chart
          :option="chartOption2"
          style="height: 300px"
          autoresize
        />
      </v-card>
    </v-col>

  </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VChart from 'vue-echarts'

// 👇 IMPORTANTE
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent
} from 'echarts/components'

// 👇 REGISTRAR módulos
echarts.use([
  CanvasRenderer,
  LineChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent
])

/* ============================= */
const Channel = ref({
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
const Closing = ref({
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
const Department = ref({
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


const chartOption1 = ref({
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    data: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']
  },
  yAxis: { type: 'value' },
  series: [
    {
      type: 'line',
      data: [10, 20, 15, 30, 25]
    }
  ]
})

const chartOption2 = ref({
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    data: ['João', 'Maria', 'Carlos']
  },
  yAxis: { type: 'value' },
  series: [
    {
      type: 'bar',
      data: [40, 60, 35]
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