import { reactive } from "vue"
import { login } from "../services/authService"

export const authState = reactive({
  user: null,
  token: null
})

export const loginUser = async (email: string, password: string) => {

  const response: any = await login(email, password)

  authState.user = response.user
  authState.token = response.token

  localStorage.setItem("token", response.token)
}