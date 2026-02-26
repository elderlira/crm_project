

<template>
  <v-container fluid>

    <!-- HEADER -->
    <v-row>
      <v-col cols="6">
        <h1 class="text-h4 mb-6">Metas</h1>
      </v-col>
      <v-col cols="6" class="text-right">
        <v-btn color="primary" @click="openCreate">
          Nova Meta
        </v-btn>
      </v-col>
    </v-row>

    <!-- LISTA -->
    <v-row>
      <v-col
        v-for="goal in goals"
        :key="goal.id"
        cols="12"
        md="4"
      >
        <v-card
          class="pa-4"
          elevation="4"
        >
          <v-card-title>
            {{ goal.title }}
          </v-card-title>

          <v-card-text @click="selectedGoal = goal">
            <div>Meta: {{ goal.targetValue }}</div>
            <div>Realizado: {{ goal.achievedValue }}</div>

            <v-progress-linear
              :model-value="getProgress(goal)"
              height="25"
              :color="getColorByProgress(goal)"
              class="mt-4"
            />

            <div class="mt-2">
              {{ getProgress(goal).toFixed(1) }}%
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn size="small" @click="openEdit(goal)">
              Editar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- DIALOG -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>
          {{ isEditing ? 'Editar Meta' : 'Nova Meta' }}
        </v-card-title>

        <v-card-text>
          <v-text-field
            label="Título"
            v-model="form.title"
          />

          <v-text-field
            label="Valor da Meta"
            type="number"
            v-model.number="form.targetValue"
          />

          <v-text-field
            label="Valor Realizado"
            type="text"
            v-model.number="form.achievedValue" disabled    
          />

          <v-text-field
            label="Data Início"
            type="date"
            v-model="form.startDate"
          />

          <v-text-field
            label="Data Final"
            type="date"
            v-model="form.endDate"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">
            Cancelar
          </v-btn>
          <v-btn color="primary" @click="saveGoal">
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>
<script setup lang="ts">
import { ref, shallowRef, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

interface GoalHistory {
  month: string
  target: number
  achieved: number
}

interface Goal {
  id: string
  title: string
  targetValue: number
  achievedValue: number
  startDate: string
  endDate: string
  type: string
  scope: string
  active: boolean
  history: GoalHistory[]
}

const goals = ref<Goal[]>([
  {
    id: '1',
    title: 'Meta de Vendas Fevereiro',
    targetValue: 100,
    achievedValue: 65,
    startDate: '2026-02-01',
    endDate: '2026-02-28',
    type: 'vendas',
    scope: 'usuario',
    active: true
  }
])

const selectedGoal = ref<Goal | null>(goals.value[0])

// =========================
// DIALOG + FORM
// =========================

const dialog = ref(false)
const isEditing = ref(false)

const form = ref<Goal>({
  id: '',
  title: '',
  targetValue: 0,
  achievedValue: 0,
  startDate: '',
  endDate: '',
  type: 'vendas',
  scope: 'usuario',
  active: true
})

const openCreate = () => {
  isEditing.value = false
  form.value = {
    id: '',
    title: '',
    targetValue: 0,
    achievedValue: 0,
    startDate: '',
    endDate: '',
    type: 'vendas',
    scope: 'usuario',
    active: true
  }
  dialog.value = true
}

const openEdit = (goal: Goal) => {
  isEditing.value = true
  form.value = { ...goal }
  dialog.value = true
}

const saveGoal = () => {
  if (isEditing.value) {
    const index = goals.value.findIndex(g => g.id === form.value.id)
    if (index !== -1) goals.value[index] = { ...form.value }
  } else {
    goals.value.push({
      ...form.value,
      id: crypto.randomUUID()
    })
  }

  dialog.value = false
}

const chartRef = ref<HTMLDivElement | null>(null)
const chartInstance = shallowRef<echarts.ECharts | null>(null)

    
const getColorByProgress = (goal: Goal) => {
  const progress = getProgress(goal)

  if (progress < 30) return '#dc2626'
  if (progress < 50) return '#f59e0b'
  if (progress < 75) return '#eab308'
  if (progress < 100) return '#2563eb'
  return '#16a34a'
}

const getProgress = (goal: Goal) => {
  if (!goal.targetValue) return 0
  return Math.min((goal.achievedValue / goal.targetValue) * 100, 100)
}

const renderChart = async () => {
  if (!chartRef.value || !selectedGoal.value) return

  await nextTick()

  try {
    if (chartInstance.value) {
      chartInstance.value.dispose()
    }

    chartInstance.value = echarts.init(chartRef.value)

    chartInstance.value.setOption({
      tooltip: {},
      xAxis: {
        type: 'category',
        data: ['Meta', 'Realizado']
      },
      yAxis: { type: 'value' },
      series: [
  {
    type: 'bar',
    data: [
      selectedGoal.value.targetValue,
      selectedGoal.value.achievedValue
    ],
    itemStyle: {
      color: getColorByProgress(selectedGoal.value)
    }
  }
]
    })
  } catch (err) {
    console.error('Erro gráfico:', err)
  }
}

onMounted(() => {
  renderChart()
})

watch(selectedGoal, () => {
  renderChart()
})

watch(goals, () => {
  renderChart()
}, { deep: true })
</script>