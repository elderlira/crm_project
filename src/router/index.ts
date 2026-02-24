import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '../views/Dashboard.vue'
import PipelineView from '../views/Pipeline.vue'
import ConversasView from '../views/Talks.vue'
import LeadsView from '../views/Leads.vue'
import ConfigView from '../views/Config.vue'
import ReasonForClousure from '../views/config/ReasonForClousure.vue'
import Label from '../views/config/Label.vue'
import Avaliation from '../views/config/Avaliation.vue'
import ClientStatus from '../views/config/ClientStatus.vue'
import CustomizeField from '../views/config/CustomizeField.vue'
import Department from '../views/config/Department.vue'
import Profile from '../views/config/Profile.vue'
import UserRegister from '../views/config/UserRegister.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: DashboardView },
  { path: '/pipeline', name: 'pipeline', component: PipelineView },
  { path: '/conversas', name: 'talks', component: ConversasView },
  { path: '/leads', name: 'lead', component: LeadsView },
  { path: '/configuracoes', name: 'config', component: ConfigView },
  { path: '/configuracao-motivo-fechamento', name: 'reasonForClousure', component: ReasonForClousure},
  { path: '/etiquetas', name: 'label', component: Label},
  { path: '/avaliacao', name: 'avaliation', component: Avaliation },
  { path: '/usuario', name: 'userRegister', component: UserRegister },
  { path: '/filas',  name: 'departament', component: Department },
  { path: '/campos_customizados', name: 'customizeField', component: CustomizeField },
  { path: '/configuracao_leads', name: 'clientStatus', component: ClientStatus },
  { path: '/perfil', name: 'profile', component: Profile }, 
]

export default createRouter({
  history: createWebHistory(),
  routes
})
