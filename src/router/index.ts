import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../services/authStore'

import DashboardView from '../views/Dashboard.vue'
import PipelineView from '../views/Pipeline.vue'
import MetasView from '../views/metas.vue'
import ConversasView from '../views/Talks.vue'
import LoginView from '../views/Login.vue'  
import ForgotPassword from '../views/login/Forgot-password.vue'
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
  { path: '/', name: 'Dashboard', component: DashboardView, meta: { requiresAuth: true} },
  { path: '/pipeline', name: 'pipeline', component: PipelineView, meta: { requiresAuth: true} },
  {path: '/metas', name: 'metas', component: MetasView, meta: { requiresAuth: true} },
  { path: '/conversas', name: 'talks', component: ConversasView, meta: { requiresAuth: true} },
  { path: '/login', name: 'login', component: LoginView, meta:{hideSidebar: true} },
  { path: '/forgot-password', name: 'forgotPassword', component: ForgotPassword, meta:{hideSidebar: true} },
  { path: '/leads', name: 'lead', component: LeadsView, meta: { requiresAuth: true} },
  { path: '/configuracoes', name: 'config', component: ConfigView, meta: { requiresAuth: true} },
  { path: '/configuracao-motivo-fechamento', name: 'reasonForClousure', component: ReasonForClousure, meta: { requiresAuth: true}},
  { path: '/etiquetas', name: 'label', component: Label, meta: { requiresAuth: true}},
  { path: '/avaliacao', name: 'avaliation', component: Avaliation, meta: { requiresAuth: true} },
  { path: '/usuario', name: 'userRegister', component: UserRegister, meta: { requiresAuth: true} },
  { path: '/filas',  name: 'departament', component: Department, meta: { requiresAuth: true} },
  { path: '/campos_customizados', name: 'customizeField', component: CustomizeField, meta: { requiresAuth: true} },
  { path: '/configuracao_leads', name: 'clientStatus', component: ClientStatus, meta: { requiresAuth: true} },
  { path: '/perfil', name: 'profile', component: Profile, meta: { requiresAuth: true} }, 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {

  const auth = useAuthStore()

  if(to.meta.requiresAuth && !auth.token) {
    next("/login")
  } else {
    next()
  }
})

export default router