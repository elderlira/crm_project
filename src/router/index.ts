import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '../views/Dashboard.vue'
import PipelineView from '../views/Pipeline.vue'
import ConversasView from '../views/Conversas.vue'
import LeadsView from '../views/Leads.vue'
import ConfigView from '../views/Config.vue'

const routes = [
  { path: '/', component: DashboardView },
  { path: '/pipeline', component: PipelineView },
  { path: '/conversas', component: ConversasView },
  { path: '/leads', component: LeadsView },
  { path: '/configuracoes', component: ConfigView }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
