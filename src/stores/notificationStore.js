// src/stores/notificationStore.js
import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    visible: false,
    message: '',
  }),

  actions: {
    show(message) {
      this.message = message
      this.visible = true

      // Ẩn sau 5 giây
      setTimeout(() => (this.visible = false), 5000)
    },
    hide() {
      this.visible = false
    },
  },
})
