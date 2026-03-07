import axios from "axios"
import { useAuthStore } from "./authStore"

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
  timeout: 5000
})

api.interceptors.request.use((config) => {

  const auth = useAuthStore()

  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }

  return config
})


api.interceptors.response.use(

  response => response,

  async error => {

    const auth = useAuthStore()

    if (error.response?.status === 401 && auth.refreshToken) {

      try {

        const response = await axios.post(
          "http://localhost:8000/api/auth/refresh/",
          {
            refresh: auth.refreshToken
          }
        )

        const newAccessToken = response.data.access

        auth.token = newAccessToken

        localStorage.setItem("access_token", newAccessToken)

        error.config.headers.Authorization = `Bearer ${newAccessToken}`

        return axios(error.config)

      } catch (err) {

        auth.logout()
        window.location.href = "/login"

      }

    }

    return Promise.reject(error)

  }

)

export default api