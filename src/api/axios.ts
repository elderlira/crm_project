import axios from "axios"

const api = axios.create({
    // Certifique-se da barra no final
    baseURL: "http://127.0.0.1:8000/api/auth/" 
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
        // Remove aspas caso existam
        const cleanToken = token.replace(/"/g, "")
        config.headers.Authorization = `Bearer ${cleanToken}`
    }
    return config
})

export default api