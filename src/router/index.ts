import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '../views/Dashboard.vue'
import PipelineView from '../views/Pipeline.vue'
import ConversasView from '../views/Conversas.vue'
import LeadsView from '../views/Leads.vue'
import ConfigView from '../views/Config.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: DashboardView },
  { path: '/pipeline', name: 'pipeline', component: PipelineView },
  { path: '/conversas', name: 'conversas', component: ConversasView },
  { path: '/leads', name: 'lead', component: LeadsView },
  { path: '/configuracoes', name: 'config', component: ConfigView }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
