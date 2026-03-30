import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/auth/', 
})

// ESSA É A PARTE QUE "CURA" O ERRO 401
api.interceptors.request.use((config) => {
  // Pega o token do localStorage
  const token = localStorage.getItem('access_token')
  
  if (token) {
    // Remove aspas caso tenha sido salvo com JSON.stringify
    const cleanToken = token.replace(/"/g, "")
    // Aplica o Bearer que o seu settings.py espera
    config.headers.Authorization = `Bearer ${cleanToken}`
    
    console.log("Token injetado com sucesso para:", config.url)
  }
  return config
})

export default api