import { defineStore } from "pinia";
import { login } from "./authService";

export const useAuthStore = defineStore("auth", {

  state: () => ({
    user: null as any,
    token: localStorage.getItem("access_token") || null,
    refreshToken: localStorage.getItem("refresh_token") || null
  }),

  actions: {

    async signIn(email: string, password: string) {

      const data = await login({email, password})

        this.token = data.access_token
        this.refreshToken = data.refresh_token
        this.user = data.user
    
        localStorage.setItem("access_token", data.access_token)
        localStorage.setItem("refresh_token", data.refresh_token)
    },

    logout() {
      this.token = null
      this.user = null
  
      localStorage.removeItem("access_token")
    }
  },

})










// import { reactive } from "vue"
// import { login } from "../services/authService"

// export const authState = reactive({
//   user: null,
//   token: null
// })

// export const loginUser = async (email: string, password: string) => {

//   const response: any = await login(email, password)

//   authState.user = response.user
//   authState.token = response.token

//   localStorage.setItem("token", response.token)
// }