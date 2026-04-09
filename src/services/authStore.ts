import { defineStore } from "pinia";
import { login } from "./authService";
import api from "../api/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user") || "null"),
    token: localStorage.getItem("access_token") || null,
    refreshToken: localStorage.getItem("refresh_token") || null
  }),

  actions: {
    async signIn(email: string, password: string) {
      const data = await login({ email, password });

      this.token = data.access_token;
      this.refreshToken = data.refresh_token;
      this.user = data.user;

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("user", JSON.stringify(data.user));
    },

    // FUNÇÃO DE LOGOUT CORRIGIDA
    async logout() {
      try {
        const refresh = localStorage.getItem("refresh_token");
        
        if (refresh) {
          // AVISA O DJANGO: Isso vai disparar o user.save() com last_logout e is_online=False
          await api.post("/auth/logout/", {
            refresh_token: refresh
          });
        }
      } catch (error) {
        // Mesmo que o token já tenha expirado no servidor, 
        // continuamos o processo para deslogar no frontend
        console.error("Erro ao registrar logout no servidor:", error);
      } finally {
        // LIMPA TUDO NO NAVEGADOR
        this.token = null;
        this.refreshToken = null;
        this.user = null;

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
      }
    },

    async loadUser() {
      try {
        const response = await api.get("/auth/me/");
        this.user = response.data;
        localStorage.setItem("user", JSON.stringify(response.data));
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      }
    }
  },
});