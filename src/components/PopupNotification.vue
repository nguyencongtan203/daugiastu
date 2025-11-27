<template>
  <transition name="fade">
    <div v-if="visible" class="popup-overlay" @click="hide">
      <div class="popup-box">
        <h3>⚠️ Cảnh báo đăng nhập</h3>
        <p>{{ message }}</p>
        <button @click="hide">Đóng</button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useNotificationStore } from "../stores/notificationStore";

const notification = useNotificationStore();
const { visible, message } = storeToRefs(notification);
const { hide } = notification;
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.popup-box {
  background: white;
  padding: 20px 30px;
  border-radius: 10px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.popup-box h3 {
  color: #e74c3c;
  margin-bottom: 10px;
}

.popup-box p {
  margin: 10px 0;
  color: #333;
}

.popup-box button {
  background: #42b983;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s;
}

.popup-box button:hover {
  background: #369b73;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
