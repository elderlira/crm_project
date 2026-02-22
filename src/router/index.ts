import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '../views/Dashboard.vue'
import PipelineView from '../views/Pipeline.vue'
import ConversasView from '../views/Talks.vue'
import LeadsView from '../views/Leads.vue'
import ConfigView from '../views/Config.vue'
import ReasonForClousure from '../views/config/ReasonForClousure.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: DashboardView },
  { path: '/pipeline', name: 'pipeline', component: PipelineView },
  { path: '/conversas', name: 'talks', component: ConversasView },
  { path: '/leads', name: 'lead', component: LeadsView },
  { path: '/configuracoes', name: 'config', component: ConfigView },
  { path: '/configuracao-motivo-fechamento', name: 'reasonForClousure', component: ReasonForClousure}
]

export default createRouter({
  history: createWebHistory(),
  routes
})
