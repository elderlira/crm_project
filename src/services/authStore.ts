import { defineStore } from "pinia";
import { login } from "./authService";
import api from "../api/axios";

export const useAuthStore = defineStore("auth", {
  state: () => {
    // Função auxiliar para evitar erro de parse em strings "null"
    const getStorageItem = (key: string) => {
      const item = localStorage.getItem(key);
      return item === "null" || item === "undefined" ? null : item;
    };

    return {
      user: JSON.parse(localStorage.getItem("user") || "null"),
      token: getStorageItem("access_token"),
      refreshToken: getStorageItem("refresh_token"),
    };
  },

  actions: {
    async signIn(email: string, password: string) {
      try {
        const data = await login({ email, password });

        this.token = data.access_token;
        this.refreshToken = data.refresh_token;
        this.user = data.user;

        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (error) {
        console.error("Erro no signIn:", error);
        throw error; // Repassa o erro para o componente de Login tratar
      }
    },

    async logout() {
      try {
        // Pega o token atualizado diretamente do estado ou storage
        const tokenParaInvalidar = this.refreshToken || localStorage.getItem("refresh_token");

        // Só faz a chamada se o token for válido e não for a string "null"
        if (tokenParaInvalidar && tokenParaInvalidar !== "null") {
          await api.post("/auth/logout/", {
            refresh_token: tokenParaInvalidar,
          });
        }
      } catch (error) {
        // Se der erro 400 ou 401 (token expirado), o servidor já considera deslogado
        console.warn("Aviso: Sessão no servidor já estava expirada ou inválida.");
      } finally {
        // LIMPEZA TOTAL: Executa sempre, mesmo se a API falhar
        this.token = null;
        this.refreshToken = null;
        this.user = null;

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        
        // Opcional: Limpa todos os outros dados de cache se necessário
        // localStorage.clear(); 
      }
    },

    async loadUser() {
      try {
        const response = await api.get("/auth/me/");
        this.user = response.data;
        localStorage.setItem("user", JSON.stringify(response.data));
      } catch (e) {
        console.error("Erro ao carregar usuário atual:", e);
        // Se falhar ao carregar o usuário (token inválido), força logout
        this.logout();
      }
    },
  },
});