<template>
  <div class="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4">
    <h2 class="text-2xl font-semibold text-gray-800 mb-8">THÔNG TIN TÀI KHOẢN</h2>

    <!-- Toast chỉ dành cho lỗi/ thông báo từ server -->
    <transition name="slide-fade">
      <div v-if="toast.show" class="fixed top-5 right-5 z-50">
        <div class="flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow">
          <div class="flex items-center justify-center w-12" :class="toastMeta.barBg">
            <svg class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40">
              <template v-for="(d, i) in toastMeta.iconPaths" :key="i">
                <path :d="d" />
              </template>
            </svg>
          </div>
          <div class="px-4 py-2 -mx-3">
            <div class="mx-3">
              <span class="font-semibold" :class="toastMeta.titleColor">{{
                toastMeta.title
              }}</span>
              <p class="text-sm text-gray-600">{{ toast.message }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div v-if="loading" class="text-center text-gray-500 py-6 fade-in">
      Đang tải thông tin người dùng...
    </div>

    <div v-else-if="!user" class="text-center text-red-600 py-6 fade-in">
      Không thể tải thông tin tài khoản.
    </div>

    <div v-else class="w-full max-w-3xl space-y-5">
      <!-- Thông tin tổng quát -->
      <div class="space-y-3 fade-in">
        <div class="flex items-center gap-4">
          <label class="w-40 text-sm text-gray-700 font-bold">Họ và tên</label>
          <p class="text-gray-900 flex-1">{{ fullName }}</p>
        </div>

        <div class="flex items-center gap-4">
          <label class="w-40 text-sm font-bold text-gray-700">Email</label>
          <div class="flex items-center gap-2 flex-1">
            <p class="text-gray-900">{{ user.email }}</p>
            <span v-if="!emailVerified" class="text-red-600 text-sm font-medium italic"
              >(Email chưa được xác thực)</span
            >
            <span v-else class="text-emerald-600 text-sm font-medium italic"
              >(Đã xác thực)</span
            >
          </div>
        </div>

        <div class="flex items-center gap-4">
          <label class="w-40 text-sm font-bold text-gray-700">Mật khẩu</label>
          <div class="flex items-center gap-3 flex-1">
            <p class="text-gray-900 tracking-widest select-none">•••••</p>
            <a
              href="#"
              class="text-sky-600 hover:text-sky-700 text-sm font-medium underline"
              @click.prevent="openChangePassword"
              >Đổi mật khẩu</a
            >
          </div>
        </div>
      </div>

      <hr class="border-gray-300 my-4 fade-in" />

      <!-- FORM -->
      <div class="space-y-4 fade-in">
        <div class="form-row">
          <label class="w-40 text-sm text-gray-700 font-bold">Họ</label>
          <div class="flex-1">
            <input
              v-model="user.ho"
              :disabled="!editing"
              :class="['input', errors.ho && 'error']"
            />
            <p v-if="errors.ho" class="error-msg">{{ errors.ho }}</p>
          </div>
        </div>

        <div class="form-row">
          <label class="w-40 text-sm text-gray-700 font-bold">Tên lót</label>
          <div class="flex-1">
            <input
              v-model="user.tenlot"
              :disabled="!editing"
              :class="['input', errors.tenlot && 'error']"
            />
            <p v-if="errors.tenlot" class="error-msg">{{ errors.tenlot }}</p>
          </div>
        </div>

        <div class="form-row">
          <label class="w-40 text-sm text-gray-700 font-bold">Tên</label>
          <div class="flex-1">
            <input
              v-model="user.ten"
              :disabled="!editing"
              :class="['input', errors.ten && 'error']"
            />
            <p v-if="errors.ten" class="error-msg">{{ errors.ten }}</p>
          </div>
        </div>

        <div class="form-row">
          <label class="w-40 text-sm text-gray-700 font-bold">Số điện thoại</label>
          <div class="flex-1">
            <input
              v-model="user.sdt"
              :disabled="!editing"
              :class="['input', errors.sdt && 'error']"
            />
            <p v-if="errors.sdt" class="error-msg">{{ errors.sdt }}</p>
          </div>
        </div>

        <div class="form-row">
          <label class="w-40 text-sm text-gray-700 font-bold">Địa chỉ</label>
          <div class="flex-1">
            <input
              v-model="user.diachi"
              placeholder="Chưa cập nhật"
              :disabled="!editing"
              :class="['input', errors.diachi && 'error']"
            />
            <p v-if="errors.diachi" class="error-msg">{{ errors.diachi }}</p>
          </div>
        </div>

        <div class="form-row">
          <label class="w-40 text-sm text-gray-700 font-bold">Địa chỉ giao hàng</label>
          <div class="flex-1">
            <input
              v-model="user.diachigiaohang"
              placeholder="Chưa cập nhật"
              :disabled="!editing"
              :class="['input', errors.diachigiaohang && 'error']"
            />
            <p v-if="errors.diachigiaohang" class="error-msg">
              {{ errors.diachigiaohang }}
            </p>
          </div>
        </div>

        <div class="form-row">
          <label class="w-40 text-sm text-gray-700 font-bold">Thành phố</label>
          <div class="flex-1">
            <!-- Dropdown thay cho select -->
            <SoftDropdown
              v-model="user.thanhPho.matp"
              :options="cityOptions"
              option-value="value"
              option-label="label"
              :disabled="!editing"
              :error="!!errors.matp"
              :errorMessage="errors.matp"
              placeholder="-- Chưa chọn thành phố --"
            />
            <p v-if="errors.matp" class="error-msg">{{ errors.matp }}</p>
          </div>
        </div>
      </div>

      <!-- BTN -->
      <div class="pt-6 flex justify-end gap-3">
        <button
          v-if="!editing"
          @click="enableEdit"
          class="inline-flex items-center bg-[#127fcf] hover:bg-[#1992eb] text-white px-4 py-2 rounded-xl font-semibold btn-flash"
        >
          Chỉnh Sửa
        </button>
        <button
          v-else
          @click="saveChanges"
          class="inline-flex items-center bg-[#127fcf] hover:bg-[#1992eb] text-white px-4 py-2 rounded-xl font-semibold btn-flash"
          :disabled="saving"
        >
          <span v-if="saving">Đang lưu...</span>
          <span v-else>Lưu Thay Đổi</span>
        </button>
        <button
          v-if="editing"
          @click="cancelEdit"
          class="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          Hủy
        </button>
      </div>
    </div>
  </div>

  <ChangePasswordPopup ref="changePasswordPopup" />
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import Cookies from "js-cookie";
import ChangePasswordPopup from "@/components/ChangePasswordPopup.vue";
import SoftDropdown from "@/components/SoftDropdown.vue";

const API = "https://daugiabe-production.up.railway.app/api";

// Reactive state
const changePasswordPopup = ref(null);
const user = ref(null);
const cities = ref([]);
const loading = ref(true);
const saving = ref(false);
const editing = ref(false);
const originalData = ref(null);
const errors = ref({});
const toast = ref({ show: false, message: "", type: "success" });

// Computed
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

const fullName = computed(() =>
  [user.value?.ho, user.value?.tenlot, user.value?.ten].filter(Boolean).join(" ")
);

const emailVerified = computed(() => {
  const status = (user.value?.xacthuctaikhoan || "").toUpperCase();
  return status === "ACTIVE" || status === "ĐÃ XÁC THỰC";
});

const cityOptions = computed(() =>
  (cities.value || []).map((tp) => ({ value: String(tp.matp), label: tp.tentp }))
);

// Functions
function showToast(message, type = "success") {
  toast.value = { show: true, message, type };
  setTimeout(() => (toast.value.show = false), 3000);
}

function enableEdit() {
  if (!user.value) return;
  editing.value = true;
  originalData.value = JSON.parse(JSON.stringify(user.value));
  errors.value = {};
}

function cancelEdit() {
  if (originalData.value) {
    user.value = JSON.parse(JSON.stringify(originalData.value));
  }
  editing.value = false;
  errors.value = {};
}

function validateUserData() {
  errors.value = {};
  const phoneRegexStart = /^(09|08|07|05|03)/;

  if (!user.value.ho?.trim()) errors.value.ho = "Vui lòng nhập họ.";
  if (!user.value.tenlot?.trim()) errors.value.tenlot = "Vui lòng nhập tên lót.";
  if (!user.value.ten?.trim()) errors.value.ten = "Vui lòng nhập tên.";
  if (!user.value.sdt?.trim()) {
    errors.value.sdt = "Vui lòng nhập số điện thoại.";
  } else if (!/^[0-9]{10,11}$/.test(user.value.sdt)) {
    errors.value.sdt = "Số điện thoại phải gồm 10–11 chữ số.";
  } else if (!phoneRegexStart.test(user.value.sdt)) {
    errors.value.sdt = "Số điện thoại phải bắt đầu bằng 09, 08, 07, 05 hoặc 03.";
  }
  if (!user.value.diachi?.trim()) errors.value.diachi = "Vui lòng nhập địa chỉ.";
  if (!user.value.diachigiaohang?.trim())
    errors.value.diachigiaohang = "Vui lòng nhập địa chỉ giao hàng.";
  if (!user.value.thanhPho?.matp || user.value.thanhPho.matp === "default")
    errors.value.matp = "Vui lòng chọn thành phố.";

  return Object.keys(errors.value).length === 0;
}

async function saveChanges() {
  if (!validateUserData()) return;
  const token = Cookies.get("jwt_token");
  if (!token) {
    showToast("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.", "error");
    return;
  }

  saving.value = true;
  try {
    // Xử lý chuỗi sạch: trim đầu cuối và loại bỏ khoảng trắng thừa
    const cleanString = (str) => str.trim().replace(/\s+/g, " ");

    const payload = {
      ho: cleanString(user.value.ho),
      tenlot: cleanString(user.value.tenlot),
      ten: cleanString(user.value.ten),
      diachi: cleanString(user.value.diachi),
      diachigiaohang: cleanString(user.value.diachigiaohang),
      sdt: user.value.sdt.trim(), // Số điện thoại chỉ trim
      matp: user.value.thanhPho.matp,
    };

    const res = await axios.put(`${API}/users/update-info`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { code, result, message } = res.data || {};
    if (code === 200 && result) {
      user.value = {
        ...result,
        diachi: result.diachi ?? "",
        diachigiaohang: result.diachigiaohang ?? "",
        thanhPho: result.thanhPho ?? { matp: "default" },
      };
      showToast(message || "Cập nhật thông tin thành công!", "success");
      editing.value = false;
      errors.value = {};
    } else {
      showToast(message || "Lưu thất bại, vui lòng thử lại!", "error");
    }
  } catch (err) {
    const msg = extractErrorMessage(err);
    showToast(msg, "error");
  } finally {
    saving.value = false;
  }
}

function extractErrorMessage(err) {
  if (err?.response?.data?.message) return err.response.data.message;
  if (typeof err?.response?.data === "string") return err.response.data;
  return err?.message || "Lỗi kết nối đến máy chủ!";
}

async function fetchUserAndCities() {
  loading.value = true;
  try {
    const token = Cookies.get("jwt_token");
    if (!token) {
      showToast("Bạn chưa đăng nhập!", "error");
      loading.value = false;
      return;
    }

    const [meRes, citiesRes] = await Promise.all([
      axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${API}/cities/find-all`),
    ]);

    if (meRes.data?.code === 200 && meRes.data.result) {
      const u = meRes.data.result;
      user.value = {
        ...u,
        diachi: u.diachi ?? "",
        diachigiaohang: u.diachigiaohang ?? "",
        thanhPho: u.thanhPho ?? { matp: "default" },
      };
    } else {
      showToast(meRes.data?.message || "Không thể tải thông tin người dùng!", "error");
      user.value = null;
    }

    if (citiesRes.data?.code === 200 && Array.isArray(citiesRes.data.result)) {
      cities.value = citiesRes.data.result;
    } else {
      cities.value = [];
    }
  } catch (err) {
    showToast(extractErrorMessage(err), "error");
  } finally {
    loading.value = false;
  }
}

function openChangePassword() {
  changePasswordPopup.value?.open();
}

// Lifecycle
onMounted(fetchUserAndCities);
</script>

<style scoped>
@import "@/assets/styles/userinfo.css";
@import "@/assets/styles/toast.css";
</style>
