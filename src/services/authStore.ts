import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios' 

export const useAuthStore = defineStore('auth', () => {
  // Inicializa o estado buscando do localStorage
  const token = ref(localStorage.getItem('access_token'))
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  async function loadUser() {
    try {
      const response = await api.get('me/') 
      // CORREÇÃO: No Setup Store, não se usa 'this'. Usa-se o .value
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(response.data))
    } catch (error) {
      console.error("Erro ao carregar usuário:", error)
      if (error.response?.status === 401) logout()
    }
  }
  
  // CORREÇÃO: O seu Login.vue chama 'signIn', então vamos padronizar o nome
  async function signIn(email, password) {
    try {
      // Ajuste a rota de login conforme o seu Django (ex: 'login/' ou 'token/')
      const response = await api.post('login/', { email, password })
      
      // O Django SimpleJWT geralmente retorna 'access' e 'refresh'
      const accessToken = response.data.access || response.data.access_token
      
      token.value = accessToken
      user.value = response.data.user
      
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      return response.data
    } catch (error) {
      throw error
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    // Opcional: router.push('/login')
  }

  return { 
    token, 
    user, 
    loadUser, 
    signIn, // Agora o Login.vue vai encontrar esta função
    logout 
  }
})