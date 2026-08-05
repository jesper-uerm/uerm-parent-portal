import { defineStore } from "pinia";
import { api } from "boot/axios";
export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("auth_user") || "null"),
    token: localStorage.getItem("auth_token") || null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(email, password) {
      this.loading = true;
      try {
        const { data } = await api.post("/parent-portal/auth/login", { email, password });
        this.user = data.user;
        this.token = data.token;
        localStorage.setItem("auth_user", JSON.stringify(data.user));
        localStorage.setItem("auth_token", data.token);
        return { success: true };
      } catch (err) {
        console.error("Login error:", err);
        return { success: false, message: err.response?.data?.message || "Login failed." };
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_token");
    },
  },
});
