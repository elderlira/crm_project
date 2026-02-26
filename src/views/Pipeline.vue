<template>
  <v-container fluid class="pa-8">

    <!-- HEADER -->
    <div class="mb-8">
      <h1 class="text-h4 font-weight-black mb-2">Pipeline de Vendas</h1>
      <p class="text-medium-emphasis">
        Acompanhe sua operação comercial em tempo real
      </p>
    </div>

    <!-- KPIs -->
    <v-row class="mb-8" dense>
      <v-col cols="12" md="3">
        <v-card elevation="6" rounded="xl" theme="dark" style="background: linear-gradient(135deg, #059669, #10b981); color: white;">
          <v-card-text>
            <div class="text-caption">Valor Total</div>
            <div class="text-h5 font-weight-bold text-emerald ">
              R$ {{ totalPipelineValue.toLocaleString('pt-BR') }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card elevation="6" rounded="xl" theme="dark" style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white;">
          <v-card-text>
            <div class="text-caption ">Leads Concluídos</div>
            <div class="text-h5 font-weight-bold">
              {{ activeLeads }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card elevation="6" rounded="xl" theme="dark" style="background: linear-gradient(135deg, #5b21b6, #8b5cf6); color: white;">
          <v-card-text>
            <div class="text-caption ">Ticket Médio</div>
            <div class="text-h5 font-weight-bold text-blue">
              R$ {{ averageTicket.toLocaleString('pt-BR') }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card elevation="6" rounded="xl" theme="dark" style="background: linear-gradient(135deg, #c2410c, #f97316); color: white;">
          <v-card-text>
            <div class="text-caption">Taxa Conversão</div>
            <div class="text-h5 font-weight-bold text-purple">
              {{ conversionRate }}%
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- FILTRO -->
    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedFilter"
          label="Filtrar por Atendente"
          :items="attendants"
          item-title="name"
          item-value="id"
          clearable
          variant="outlined"
        />
      </v-col>
    </v-row>

    <!-- KANBAN -->
    <div class="kanban-wrapper">
      <div class="kanban-container">

        <v-card
          v-for="stage in stages"
          :key="stage.id"
          class="kanban-column"
          elevation="2"
          rounded="xl"
        >
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="font-weight-bold">{{ stage.name }}</span>

            <v-chip
              size="small"
              :style="{ backgroundColor: stage.color, color: '#fff' }"
            >
              {{ leadsByStage(stage.id).length }}
            </v-chip>
          </v-card-title>

          <v-card-subtitle class="text-caption">
            R$ {{ stageValue(stage.id).toLocaleString('pt-BR') }}
          </v-card-subtitle>

          <v-divider />

          <v-card-text class="kanban-leads">
            <v-card
              v-for="lead in leadsByStage(stage.id)"
              :key="lead.id"
              class="mb-4"
              elevation="4"
              rounded="lg"
            >
              <v-card-text>

                <div class="d-flex justify-space-between align-start mb-2">
                  <div>
                    <div class="font-weight-bold text-body-2">
                      {{ lead.name }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ lead.phone }}
                    </div>
                  </div>

                  <v-chip
                    v-if="isHot(lead)"
                    size="x-small"
                    color="red"
                    variant="tonal"
                  >
                    HOT
                  </v-chip>
                </div>

                <div
                  class="font-weight-bold mb-2"
                  :style="{ color: stage.color }"
                >
                  R$ {{ (lead.value || 0).toLocaleString('pt-BR') }}
                </div>

                <v-progress-linear
                  :model-value="stageProgress(stage.id)"
                  height="6"
                  rounded
                  :color="stage.color"
                  class="mb-2"
                />

                <div class="d-flex justify-space-between text-caption text-medium-emphasis">
                  <span>{{ lead.attendant.name }}</span>
                  <span>⏳ {{ daysInStage(lead) }} dias</span>
                </div>

              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>

      </div>
    </div>

  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

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

const selectedFilter = ref<string | null>(null)

const stages = ref<Stage[]>([
  { id: 'prospect', name: 'Prospect', color: '#ef4444' },
  { id: 'proposal', name: 'Proposta', color: '#eab308' },
  { id: 'negotiation', name: 'Negociação', color: '#3b82f6' },
  { id: 'closed', name: 'Fechado', color: '#10b981' },
  { id: 'lost', name: 'Perdido', color: '#f97316' },
])

const leads = ref<Lead[]>([
  { id: 1, name: 'Empresa A', phone: '(11) 9999-0001', value: 15000, stage: 'prospect', attendant: { id: 'joao', name: 'João' }, createdAt: '2026-02-18' },
  { id: 2, name: 'Empresa B', phone: '(11) 9999-0002', value: 35000, stage: 'lost', attendant: { id: 'maria', name: 'Maria' }, createdAt: '2026-02-16' },
  { id: 3, name: 'Empresa C', phone: '(11) 9999-0003', value: 52000, stage: 'proposal', attendant: { id: 'ana', name: 'Ana' }, createdAt: '2026-02-14' },
  { id: 4, name: 'Empresa D', phone: '(11) 9999-0004', value: 80000, stage: 'negotiation', attendant: { id: 'carlos', name: 'Carlos' }, createdAt: '2026-02-12' },
  { id: 5, name: 'Empresa E', phone: '(11) 9999-0005', value: 95000, stage: 'closed', attendant: { id: 'joao', name: 'João' }, createdAt: '2026-02-10' }
])

const attendants = computed(() =>
  Array.from(
    new Map(leads.value.map(l => [l.attendant.id, l.attendant])).values()
  )
)

const totalPipelineValue = computed(() =>
  leads.value.reduce((sum, l) => sum + (l.value || 0), 0)
)

const activeLeads = computed(() =>
  leads.value.filter(l => l.stage !== 'closed').length
)

const averageTicket = computed(() =>
  leads.value.length
    ? Math.round(totalPipelineValue.value / leads.value.length)
    : 0
)

const conversionRate = computed(() => {
  const closed = leads.value.filter(l => l.stage === 'closed').length
  return leads.value.length
    ? Math.round((closed / leads.value.length) * 100)
    : 0
})

function leadsByStage(stageId: string): Lead[] {
  return leads.value.filter(l =>
    l.stage === stageId &&
    (!selectedFilter.value || l.attendant.id === selectedFilter.value)
  )
}

function stageValue(stageId: string): number {
  return leadsByStage(stageId)
    .reduce((sum, l) => sum + (l.value || 0), 0)
}

function stageProgress(stageId: string): number {
  const index = stages.value.findIndex(s => s.id === stageId)
  return ((index + 1) / stages.value.length) * 100
}

function isHot(lead: Lead): boolean {
  return (lead.value || 0) > 50000
}

function daysInStage(lead: Lead): number {
  const created = new Date(lead.createdAt)
  const now = new Date()
  return Math.floor(
    (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
  )
}
</script>

<style scoped>
.kanban-wrapper {
  overflow-x: auto;
  padding-bottom:24px;
}

.kanban-container {
  display: flex;
  gap: 30px;
  min-width: max-content;
}

.kanban-column {
  width: 320px;
  display: flex;
  flex-direction: column;
}

.kanban-leads {
  max-height: 60vh;
  overflow-y: auto;
}
</style>