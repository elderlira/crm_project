import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios' 

export const useAuthStore = defineStore('auth', () => {
  // Inicializa o estado buscando do localStorage e limpa aspas extras do token
  const token = ref(localStorage.getItem('access_token')?.replace(/"/g, "") || null)
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  // Função para carregar os dados do usuário logado (Perfil)
  async function loadUser() {
    try {
      const response = await api.get('me/') 
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(response.data))
    } catch (error: any) {
      console.error("Erro ao carregar usuário:", error)
      // Se o token estiver expirado ou inválido (401), desloga
      if (error.response?.status === 401) {
        logout()
      }
    }
  }
  
  // Função de Login (SignIn)
  async function signIn(email, password) {
    try {
      const response = await api.post('login/', { email, password })
      
      // Pega o token (ajustado para o padrão do seu Django)
      const accessToken = response.data.access || response.data.access_token
      
      token.value = accessToken
      user.value = response.data.user
      
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      return response.data
    } catch (error) {
      console.error("Erro no login:", error)
      throw error
    }
  }

  // Função de Logout
  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    localStorage.clear() // Limpeza total por segurança
    
    // Força o redirecionamento para o login se necessário
    window.location.href = '/login'
  }

  // CRITICAL: Tudo o que você quer usar nos componentes (Sidebar, App, etc) 
  // precisa estar neste return!
  return { 
    token, 
    user, 
    loadUser, 
    signIn, 
    logout 
  }
})