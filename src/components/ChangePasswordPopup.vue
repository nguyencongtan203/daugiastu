<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]"
    @click.self="close"
  >
    <div
      class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 transition-all"
    >
      <button
        @click="close"
        class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        aria-label="Đóng"
      >
        ✖
      </button>

      <h3 class="text-xl font-semibold text-gray-800 mb-6 text-center">Đổi mật khẩu</h3>

      <form @submit.prevent="handleChangePassword" class="space-y-4">
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu cũ</label>
            <input
              type="password"
              v-model.trim="matkhaucu"
              class="input"
              required
              autocomplete="current-password"
              :disabled="loading"
            />
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
            <input
              type="password"
              v-model.trim="matkhaumoi"
              class="input"
              required
              autocomplete="new-password"
              :disabled="loading"
            />
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
            <input
              type="password"
              v-model.trim="xacnhan"
              class="input"
              required
              autocomplete="new-password"
              :disabled="loading"
            />
        </div>

        <button type="submit" :disabled="loading" class="btn-primary w-full">
          <span v-if="loading">Đang xử lý...</span>
          <span v-else>Đổi mật khẩu</span>
        </button>

        <p v-if="error" class="error-msg">{{ error }}</p>
      </form>
    </div>
  </div>

  <!-- Toast (chuẩn hóa giống template trước) -->
  <transition name="slide-fade">
    <div v-if="toast.show" class="fixed top-5 right-5 z-50">
      <div class="flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow">
        <div class="flex items-center justify-center w-12" :class="toastMeta.barBg">
          <svg
            class="w-6 h-6 text-white fill-current"
            viewBox="0 0 40 40"
            xmlns="http://www.w3.org/2000/svg"
          >
            <template v-for="(d, i) in toastMeta.iconPaths" :key="i">
              <path :d="d" />
            </template>
          </svg>
        </div>
        <div class="px-4 py-2 -mx-3">
          <div class="mx-3">
            <span class="font-semibold" :class="toastMeta.titleColor">
              {{ toastMeta.title }}
            </span>
            <p class="text-sm text-gray-600">{{ toast.message }}</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, defineExpose, inject } from "vue";
import axios from "axios";
import Cookies from "js-cookie";
import { useUserStore } from "../stores/userStore";
import { useRouter } from "vue-router";
const router = useRouter();
const API = "http://localhost:8082/api";

const show = ref(false);
const matkhaucu = ref("");
const matkhaumoi = ref("");
const xacnhan = ref("");
const loading = ref(false);
const error = ref("");
const toast = ref({ show: false, message: "", type: "success" });

const authPopup = inject("authPopup");
const userStore = useUserStore();

/* ===== Toast meta giống template chuẩn hoá ===== */
const toastMeta = computed(() => {
  const type = (toast.value.type || "info").toLowerCase();
  switch (type) {
    case "success":
      return {
        title: "Thành công!",
        barBg: "bg-emerald-500",
        titleColor: "text-emerald-500",
        iconPaths: [
          "M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z",
        ],
      };
    case "warning":
      return {
        title: "Cảnh báo!",
        barBg: "bg-yellow-400",
        titleColor: "text-yellow-400",
        iconPaths: [
          "M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z",
        ],
      };
    case "error":
      return {
        title: "Lỗi!",
        barBg: "bg-red-500",
        titleColor: "text-red-500",
        iconPaths: [
          "M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z",
        ],
      };
    default:
      return {
        title: "Thông báo",
        barBg: "bg-blue-500",
        titleColor: "text-blue-500",
        iconPaths: [
          "M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331Z",
          "M21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z",
        ],
      };
  }
});

/* ===== Helpers ===== */
function open() {
  show.value = true;
  matkhaucu.value = "";
  matkhaumoi.value = "";
  xacnhan.value = "";
  error.value = "";
}
function close() {
  show.value = false;
}
function showToast(message, type = "success") {
  toast.value = { show: true, message, type };
  setTimeout(() => (toast.value.show = false), 3000);
}

function extractErrorMessage(err) {
  if (err?.response?.data?.message) return err.response.data.message;
  if (typeof err?.response?.data === "string") return err.response.data;
  if (err?.message) return err.message;
  return "Lỗi không xác định";
}

/* ===== Change Password (chuẩn hoá theo BE: /users/change-password) ===== */
async function handleChangePassword() {
  error.value = "";
  if (matkhaumoi.value !== xacnhan.value) {
    error.value = "Mật khẩu mới và xác nhận không khớp!";
    return;
  }
  const token = Cookies.get("jwt_token");
  if (!token) {
    error.value = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
    authPopup?.value?.open("login");
    return;
  }

  loading.value = true;
  try {
    const payload = {
      matkhaucu: matkhaucu.value,
      matkhaumoi: matkhaumoi.value,
    };

    const res = await axios.put(
      `${API}/users/change-password`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const { code, message } = res.data || {};
    if (code === 200) {
      showToast(message || "Đổi mật khẩu thành công.", "success");
      Cookies.remove("jwt_token");
      userStore.logout();

      close();
      router.push("/home");
      authPopup?.value?.open("login");
    } else {
      const msg = message || "Đổi mật khẩu thất bại!";
      error.value = msg;
      showToast(msg, "error");
    }
  } catch (err) {
    const msg = extractErrorMessage(err);
    error.value = msg;
    showToast(msg, "error");

    // Nếu lỗi 401 → mở popup login
    const status = err?.response?.status;
    if (status === 401) {
      Cookies.remove("jwt_token");
      userStore.logout();
      authPopup?.value?.open("login");
    }
  } finally {
    loading.value = false;
  }
}

defineExpose({ open, close });
</script>

<style scoped>
@import "@/assets/styles/toast.css";
@import "@/assets/styles/auth.css";

.error-msg {
  @apply text-sm text-red-600 mt-2;
}
.input {
  @apply w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition;
}
.btn-primary {
  @apply inline-flex justify-center items-center rounded-md bg-sky-600 hover:bg-sky-700 text-white font-medium px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition;
}
</style>