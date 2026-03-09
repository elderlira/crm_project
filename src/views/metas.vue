<template>
  <v-container fluid>

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

    <div v-if="goals.length === 0" class="mb-20 text-center" style="font-size: xx-large;">
      <v-row>
        <v-col>
          {{ 'Sem metas definidas' }}
        </v-col>
      </v-row>

    </div>
    <div v-else>
      <v-row class="mb-10">

        <v-col v-for="goal in goals" :key="goal.id" cols="12" lg="3" md="4" sm="12">
          <v-card class="pa-4" elevation="4">
            <v-card-title>
              {{ `Metas de ${goal.mes} ${goal.ano} ` }}
            </v-card-title>

            <v-card-text @click="selectedGoal = goal">
              <div>Meta: {{ goal.targetValue }}</div>
              <div>Realizado: {{ goal.achievedValue }}</div>

              <v-progress-linear :model-value="getProgress(goal)" height="25" :color="getColorByProgress(goal)"
                class="mt-4" />

              <div class="mt-2">
                {{ getProgress(goal).toFixed(1) }}%
              </div>
            </v-card-text>

            <v-card-actions>
              <v-row>
                <v-col class="d-flex text-left">
                  <v-btn size="small" @click="openEdit(goal)">
                    Editar
                  </v-btn>
                </v-col>
                <v-col class="justify-end  d-flex text-left">
                  <v-btn color="#dc2626" @click="goals = goals.filter(g => g.id !== goal.id); dialog = false">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>


            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-card elevation="6">
      <v-data-table :headers="headers" :items="goals" class="rounded-xl">

        <template v-slot:item.meses="{ item }">
          {{ item.mes }}
        </template>

        <template v-slot:item.ano="{ item }">
          {{ item.ano }}
        </template>

        <template v-slot:item.targetValue="{ item }">
          {{ item.targetValue }}
        </template>

        <template v-slot:item.achievedValue="{ item }">
          {{ item.achievedValue }}
        </template>

        <template v-slot:item.progresso="{ item }">
          <v-progress-linear :model-value="getProgress(item)" height="20" :color="getColorByProgress(item)" />
        </template>

      </v-data-table>
    </v-card>
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>
          {{ isEditing ? 'Editar Meta' : 'Nova Meta' }}
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols=12 lg="6" md="6" sm="12" class="mb-5">
              <v-select label="selecione o mês" :items="meses" v-model="form.mes"
                :rules="[(v) => !!v || 'Mês é obrigatório']"></v-select>
            </v-col>
            <v-col cols=12 lg="6" md="6" sm="12" class="mb-5">
              <v-select label="selecione o ano" :items="anos" v-model="form.ano"
                :rules="[(v) => !!v || 'Ano é obrigatório']"></v-select>
            </v-col>
          </v-row>


          <v-text-field label="Valor da Meta" type="number" v-model.number="form.targetValue"
            :rules="[(v) => !!v || 'Valor obrigatório']" min="0" step="0.01" required />

          <v-text-field label="Valor Realizado" type="text" v-model.number="form.achievedValue" disabled />

          <v-text-field label="Data Início" type="date" v-model="form.startDate" :min="minDateStart"
            :max="maxDateEnd" />

          <v-text-field label="Data Final" type="date" v-model="form.endDate" :min="minDateStart" :max="maxDateEnd" />
        </v-card-text>

        <v-card-actions class="d-flex align-center">

          <v-spacer />
          <v-btn text @click="dialog = false">
            Cancelar
          </v-btn>
          <v-btn color="primary" :disabled="!form.mes || !form.ano || !form.targetValue" @click="saveGoal">
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogExistentMeta" max-width="400" persistent>
      <v-card class="align-center">
        <v-card-title class="text-h6 error white--text" style="color: red;">
          <v-icon start color="#8B0000" class="mr-2">mdi-alert-circle</v-icon>
          Meta Duplicada
        </v-card-title>
        <v-card-text class="pt-4">
          Já existe uma meta para o mês de <strong>{{ form.mes }}</strong> de <strong>{{ form.ano }}</strong>.<br>
          Escolha outro mês/ano ou edite a meta existente.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="dialogExistentMeta = false">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogSucess" max-width="400" persistent="">
      <v-card class="align-center">
        <v-card-title>
          <v-icon start color="#008000">mdi-check-circle-outline</v-icon>
          Dados gravado com sucesso
        </v-card-title>
        <v-card-actions>
          <v-btn variant="flat" color="success" @click="dialogSucess = false" text="Ok"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>
<script setup lang="ts">
import { ref, shallowRef, onMounted, watch, nextTick, computed } from 'vue'
import * as echarts from 'echarts'
import { format } from "date-fns"

interface Goal {
  id: string
  mes: string,
  ano: number,
  targetValue: number
  achievedValue: number
  startDate: string
  endDate: string
  type: string
  scope: string
  active: boolean
}

const headers = [
  { title: 'Mês', key: 'meses' },
  { title: 'Ano', key: 'ano' },
  { title: 'Meta', key: 'targetValue' },
  { title: 'Realizado', key: 'achievedValue' },
  { title: 'Progresso', key: 'progresso' }
]

const meses = ref([
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
])

const anos = ref([
  2026, 2027
])

const currentDate = new Date()
const actualYear = format(currentDate, 'yyyy')

const goals = ref<Goal[]>([])

const selectedGoal = ref<Goal | null>(goals.value[0])

const dialog = ref(false)
const dialogExistentMeta = ref(false)
const dialogSucess = ref(false)
const isEditing = ref(false)

const form = ref<Goal>({
  id: '',
  mes: '',
  ano: actualYear,
  targetValue: 0,
  achievedValue: 0,
  startDate: '',
  endDate: '',
  type: 'vendas',
  scope: 'usuario',
  active: true
})

const openCreate = () => {
  isLoadingEdit = false;
  isEditing.value = false
  form.value = {
    id: '',
    mes: '',
    ano: actualYear,
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
  isLoadingEdit = true;
  isEditing.value = true
  form.value = { ...goal }
  dialog.value = true

  nextTick(() => {
    isLoadingEdit = false;
  });
}

const verifyBeforeToPush = (formData: Goal) => {
  const existing = goals.value.find(g =>
    g.mes === String(formData.mes) &&
    g.ano === Number(formData.ano)
  );
  if (existing) {
    dialogExistentMeta.value = true
    return;
  }

  goals.value.push({
    id: crypto.randomUUID(),
    mes: String(formData.mes),
    ano: Number(formData.ano),
    targetValue: Number(formData.targetValue),
    achievedValue: Number(formData.achievedValue || 0),
    startDate: formData.startDate,
    endDate: formData.endDate,
    type: formData.type,
    scope: formData.scope,
    active: formData.active
  });

  dialogSucess.value = true
  dialog.value = false
};


const saveGoal = () => {
  if (isEditing.value) {
    const index = goals.value.findIndex(g => g.id === form.value.id)
    if (index !== -1) goals.value[index] = { ...form.value }
    dialogSucess.value = true
    dialog.value = false
  } else {
    verifyBeforeToPush({ ...form.value })
  }
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

const getMonthRange = (mes: string, ano: number) => {
  const monthIndex = meses.value.indexOf(mes) + 1;
  const firstDay = new Date(ano, monthIndex - 1, 1);
  const lastDay = new Date(ano, monthIndex, 0).getDate();
  return {
    start: `${ano}-${monthIndex.toString().padStart(2, '0')}-01`,
    end: `${ano}-${monthIndex.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`
  };
};

const minDateStart = computed(() => {
  if (!form.value.mes || !form.value.ano) return '';
  return getMonthRange(form.value.mes, form.value.ano).start;
});

const maxDateEnd = computed(() => {
  if (!form.value.mes || !form.value.ano) return '';
  return getMonthRange(form.value.mes, form.value.ano).end;
});

let isLoadingEdit = false;

watch([() => form.value.mes, () => form.value.ano], ([newMes, newAno]) => {
  if (newMes && newAno && !isLoadingEdit) {
    form.value.startDate = '';
    form.value.endDate = '';
  }
});


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

<style scoped>
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