import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { useAuthStore } from '../stores/authStore.js'

const api = axios.create({ baseURL: process.env.API_URL })

export default defineBoot(({ app }) => {
  api.interceptors.request.use((config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  })

  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
