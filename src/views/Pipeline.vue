<template>
  <div class="min-h-screen bg-slate-950 text-white">

    <!-- HEADER -->
    <div class="px-8 pt-10 pb-6">
      <h1 class="text-4xl font-black mb-2">Pipeline de Vendas</h1>
      <p class="text-slate-400">Acompanhe sua operação comercial em tempo real</p>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 px-8 mb-10">
      <div class="bg-slate-900 p-6 rounded-2xl shadow-lg">
        <p class="text-slate-400 text-sm">Valor Total</p>
        <h2 class="text-2xl font-bold text-emerald-400">
          R$ {{ totalPipelineValue.toLocaleString('pt-BR') }}
        </h2>
      </div>

      <div class="bg-slate-900 p-6 rounded-2xl shadow-lg">
        <p class="text-slate-400 text-sm">Leads Ativos</p>
        <h2 class="text-2xl font-bold">
          {{ activeLeads }}
        </h2>
      </div>

      <div class="bg-slate-900 p-6 rounded-2xl shadow-lg">
        <p class="text-slate-400 text-sm">Ticket Médio</p>
        <h2 class="text-2xl font-bold text-blue-400">
          R$ {{ averageTicket.toLocaleString('pt-BR') }}
        </h2>
      </div>

      <div class="bg-slate-900 p-6 rounded-2xl shadow-lg">
        <p class="text-slate-400 text-sm">Taxa Conversão</p>
        <h2 class="text-2xl font-bold text-purple-400">
          {{ conversionRate }}%
        </h2>
      </div>
    </div>

    <!-- FILTRO -->
    <div class="px-8 mb-6">
      <select
        v-model="selectedFilter"
        class="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
      >
        <option value="">Todos</option>
        <option value="joao">João</option>
        <option value="maria">Maria</option>
        <option value="ana">Ana</option>
        <option value="carlos">Carlos</option>
      </select>
    </div>

    <!-- KANBAN -->
    <div class="px-8 pb-10 overflow-x-auto">
      <div class="flex gap-6 min-w-max">

        <div
          v-for="stage in stages"
          :key="stage.id"
          class="w-80 bg-slate-900 rounded-2xl p-4 shadow-xl flex flex-col"
        >

          <!-- STAGE HEADER -->
          <div class="mb-4">
            <h2 class="text-lg font-bold flex justify-between items-center">
              {{ stage.name }}
              <span
                class="text-xs px-2 py-1 rounded-full"
                :style="{ backgroundColor: stage.color }"
              >
                {{ leadsByStage(stage.id).length }}
              </span>
            </h2>

            <p class="text-xs text-slate-400 mt-1">
              R$ {{ stageValue(stage.id).toLocaleString('pt-BR') }}
            </p>
          </div>

          <!-- CARDS -->
          <div class="space-y-4 flex-1 overflow-y-auto">

            <div
              v-for="lead in leadsByStage(stage.id)"
              :key="lead.id"
              class="bg-white text-slate-900 rounded-xl p-4 shadow-md hover:shadow-xl transition cursor-pointer"
            >

              <!-- TOP -->
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h3 class="font-bold text-sm">{{ lead.name }}</h3>
                  <p class="text-xs text-slate-500">{{ lead.phone }}</p>
                </div>

                <span
                  v-if="isHot(lead)"
                  class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold"
                >
                  HOT
                </span>
              </div>

              <!-- VALUE -->
              <div class="text-sm font-bold mb-2"
                   :style="{ color: stage.color }">
                R$ {{ (lead.value || 0).toLocaleString('pt-BR') }}
              </div>

              <!-- PROGRESS -->
              <div class="w-full bg-slate-200 h-1.5 rounded-full mb-2">
                <div
                  class="h-1.5 rounded-full"
                  :style="{
                    width: stageProgress(stage.id) + '%',
                    backgroundColor: stage.color
                  }"
                ></div>
              </div>

              <!-- FOOTER -->
              <div class="flex justify-between text-xs text-slate-500">
                <span>{{ lead.attendant.name }}</span>
                <span>⏳ {{ daysInStage(lead) }} dias</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface Lead {
  id: number
  name: string
  phone: string
  value?: number
  stage: string
  attendant: {
    id: string
    name: string
  }
  createdAt: string
}

interface Stage {
  id: string
  name: string
  color: string
}

export default defineComponent({
  name: 'PipelinePremium',

  data() {
    return {
      selectedFilter: '',

      stages: [
        { id: 'prospect', name: 'Prospect', color: '#ef4444' },
        { id: 'qualification', name: 'Qualificação', color: '#f97316' },
        { id: 'proposal', name: 'Proposta', color: '#eab308' },
        { id: 'negotiation', name: 'Negociação', color: '#3b82f6' },
        { id: 'closed', name: 'Fechado', color: '#10b981' },
      ] as Stage[],

      leads: [
        { id: 1, name: 'Empresa A', phone: '(11) 9999-0001', value: 15000, stage: 'prospect', attendant: { id: 'joao', name: 'João' }, createdAt: '2026-02-18' },
        { id: 2, name: 'Empresa B', phone: '(11) 9999-0002', value: 35000, stage: 'qualification', attendant: { id: 'maria', name: 'Maria' }, createdAt: '2026-02-16' },
        { id: 3, name: 'Empresa C', phone: '(11) 9999-0003', value: 52000, stage: 'proposal', attendant: { id: 'ana', name: 'Ana' }, createdAt: '2026-02-14' },
        { id: 4, name: 'Empresa D', phone: '(11) 9999-0004', value: 80000, stage: 'negotiation', attendant: { id: 'carlos', name: 'Carlos' }, createdAt: '2026-02-12' },
        { id: 5, name: 'Empresa E', phone: '(11) 9999-0005', value: 95000, stage: 'closed', attendant: { id: 'joao', name: 'João' }, createdAt: '2026-02-10' },
      ] as Lead[]
    }
  },

  computed: {
    totalPipelineValue(): number {
      return this.leads.reduce((sum, l) => sum + (l.value || 0), 0)
    },
    activeLeads(): number {
      return this.leads.filter(l => l.stage !== 'closed').length
    },
    averageTicket(): number {
      return this.leads.length
        ? Math.round(this.totalPipelineValue / this.leads.length)
        : 0
    },
    conversionRate(): number {
      const closed = this.leads.filter(l => l.stage === 'closed').length
      return this.leads.length
        ? Math.round((closed / this.leads.length) * 100)
        : 0
    }
  },

  methods: {
    leadsByStage(stageId: string): Lead[] {
      return this.leads.filter(l =>
        l.stage === stageId &&
        (!this.selectedFilter || l.attendant.id === this.selectedFilter)
      )
    },

    stageValue(stageId: string): number {
      return this.leadsByStage(stageId)
        .reduce((sum, l) => sum + (l.value || 0), 0)
    },

    stageProgress(stageId: string): number {
      const index = this.stages.findIndex(s => s.id === stageId)
      return ((index + 1) / this.stages.length) * 100
    },

    isHot(lead: Lead): boolean {
      return (lead.value || 0) > 50000
    },

    daysInStage(lead: Lead): number {
      const created = new Date(lead.createdAt)
      const now = new Date()
      return Math.floor(
        (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
      )
    }
  }
})
</script>

<style scoped>
::-webkit-scrollbar {
  height: 8px;
}
::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 10px;
}
</style>