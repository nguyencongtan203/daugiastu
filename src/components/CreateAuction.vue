<template>
  <!-- Popup -->
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
  >
    <div class="relative z-10 w-full max-w-6xl rounded-lg bg-white p-8 shadow-lg">
      <!-- Header -->
      <div class="flex justify-center mb-6 border-b pb-3 relative">
        <h2 class="text-2xl font-semibold text-gray-800 text-center">
          Tạo phiên đấu giá
        </h2>
        <button
          class="absolute right-0 top-0 text-gray-500 hover:text-gray-700 text-xl"
          @click="close"
          aria-label="Đóng"
        >
          ✕
        </button>
      </div>

      <form class="grid grid-cols-1 md:grid-cols-2 gap-5" @submit.prevent="save">
        <div class="flex flex-col md:flex-row md:items-start gap-3">
          <label class="w-52 font-medium text-gray-700">Mã sản phẩm</label>
          <p class="font-semibold text-gray-700 w-full">{{ form.masp }}</p>
        </div>

        <div class="flex flex-col md:flex-row md:items-start gap-3">
          <label class="w-52 font-medium text-gray-700">Giá khởi điểm</label>
          <p class="font-semibold text-gray-700 w-full">
            {{ formatPrice(form.giamongdoi) }}
          </p>
        </div>

        <template v-for="f in fields" :key="f.key">
          <div class="flex flex-col md:flex-row md:items-start gap-3">
            <label class="w-52 font-medium text-gray-700">{{ f.label }}</label>
            <div class="flex flex-col w-full">
              <input
                v-model="formattedValues[f.key]"
                @input="onNumberInput(f.key, $event)"
                type="text"
                inputmode="numeric"
                class="input"
                :class="{ error: errors[f.key] }"
                :placeholder="`Nhập ${f.label.toLowerCase()}`"
              />
              <small v-if="errors[f.key]" class="text-red-500 text-sm mt-1">
                {{ errors[f.key] }}
              </small>
            </div>
          </div>
        </template>

        <template v-for="t in timeFields" :key="t.key">
          <div class="flex flex-col md:flex-row md:items-start gap-3">
            <label class="w-52 font-medium text-gray-700">{{ t.label }}</label>
            <div class="flex flex-col w-full">
              <input
                v-model="form[t.key]"
                type="datetime-local"
                @change="validateTimes"
                class="input"
                :class="{ error: errors[t.key] }"
              />
              <small v-if="errors[t.key]" class="text-red-500 text-sm mt-1">
                {{ errors[t.key] }}
              </small>
            </div>
          </div>
        </template>
      </form>

      <div class="pt-6 flex justify-end gap-3 mt-6">
        <button
          type="button"
          class="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
          @click="close"
        >
          Hủy
        </button>
        <button
          type="button"
          class="inline-flex items-center bg-[#127fcf] hover:bg-[#1992eb] text-white px-4 py-2 rounded-xl font-semibold btn-flash"
          @click="save"
          :disabled="submitting"
        >
          <span v-if="submitting">Đang tạo...</span>
          <span v-else>Tạo phiên</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Toast (giữ đúng template đã chuẩn hoá trước đó) -->
  <transition name="slide-fade">
    <div v-if="toastSafe.show" class="fixed top-5 right-5 z-[60]">
      <div
        class="flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow relative"
      >
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
            <p class="text-sm text-gray-600">{{ toastSafe.message }}</p>
          </div>
        </div>
        <button
          class="absolute top-1 right-1 text-slate-400 hover:text-slate-600 text-xs"
          @click="hideToast"
          aria-label="Đóng toast"
        >
          ✕
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { reactive, ref, watch, computed } from "vue";
import axios from "axios";
import Cookies from "js-cookie";

const API = "http://localhost:8082/api";

// Props & Emits
const props = defineProps({
  visible: Boolean,
  product: Object,
});
const emit = defineEmits(["close", "created"]);

// Constants
const fields = [
  { key: "buocgia", label: "Bước giá" },
  { key: "tiencoc", label: "Tiền cọc" },
];
const timeFields = [
  { key: "thoigianbddk", label: "Thời gian bắt đầu đăng ký" },
  { key: "thoigianktdk", label: "Thời gian kết thúc đăng ký" },
  { key: "thoigianbd", label: "Thời gian bắt đầu phiên" },
  { key: "thoigiankt", label: "Thời gian kết thúc phiên" },
];

// Reactive state
const form = reactive({
  masp: "",
  giamongdoi: "",
  buocgia: "",
  tiencoc: "",
  thoigianbd: "",
  thoigiankt: "",
  thoigianbddk: "",
  thoigianktdk: "",
});
const errors = reactive({});
const submitting = ref(false);
const toast = ref({ show: false, message: "", type: "info" });
const formattedValues = reactive({ buocgia: "", tiencoc: "" });

// Computed
const toastSafe = computed(
  () => toast.value || { show: false, message: "", type: "info" }
);

const toastMeta = computed(() => {
  const t = (toastSafe.value.type || "info").toLowerCase();
  if (t === "success") {
    return {
      title: "Thành công!",
      barBg: "bg-emerald-500",
      titleColor: "text-emerald-500",
      iconPaths: [
        "M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z",
      ],
    };
  }
  if (t === "warning") {
    return {
      title: "Cảnh báo!",
      barBg: "bg-yellow-400",
      titleColor: "text-yellow-400",
      iconPaths: [
        "M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z",
      ],
    };
  }
  if (t === "error") {
    return {
      title: "Lỗi!",
      barBg: "bg-red-500",
      titleColor: "text-red-500",
      iconPaths: [
        "M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z",
      ],
    };
  }
  return {
    title: "Thông báo",
    barBg: "bg-blue-500",
    titleColor: "text-blue-500",
    iconPaths: [
      "M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331Z",
      "M21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z",
    ],
  };
});

// Functions
function showToast(message, type = "success", duration = 3000) {
  toast.value = { show: true, message, type };
  window.clearTimeout(hideTimer.value);
  hideTimer.value = window.setTimeout(() => {
    if (toast.value) toast.value.show = false;
  }, duration);
}

const hideTimer = ref(null);
function hideToast() {
  if (toast.value) toast.value.show = false;
  window.clearTimeout(hideTimer.value);
}

function onNumberInput(field, e) {
  let val = e.target.value.replace(/[^\d]/g, ""); // Chỉ giữ số
  form[field] = val ? Number(val) : "";
  formattedValues[field] = val ? new Intl.NumberFormat("vi-VN").format(Number(val)) : "";
}

const validateNumber = (field) => {
  const val = form[field];
  if (!val && val !== 0) {
    errors[field] = "Vui lòng nhập số.";
    return;
  }
  if (field === "tiencoc" && +val < 10000) {
    errors[field] = "Tiền cọc phải ≥ 10.000.";
  } else if (+val < 0) {
    errors[field] = "Phải ≥ 0.";
  } else {
    errors[field] = "";
  }
};

const validateTimes = () => {
  const now = new Date();
  const startAuction = new Date(form.thoigianbd);
  const endAuction = new Date(form.thoigiankt);
  const startReg = new Date(form.thoigianbddk);
  const endReg = new Date(form.thoigianktdk);

  timeFields.forEach(({ key }) => (errors[key] = ""));

  if (!form.thoigianbd) errors.thoigianbd = "Chưa chọn thời gian bắt đầu phiên.";
  if (!form.thoigiankt) errors.thoigiankt = "Chưa chọn thời gian kết thúc phiên.";
  if (!form.thoigianbddk) errors.thoigianbddk = "Chưa chọn thời gian bắt đầu đăng ký.";
  if (!form.thoigianktdk) errors.thoigianktdk = "Chưa chọn thời gian kết thúc đăng ký.";

  if (form.thoigianbd && startAuction < now)
    errors.thoigianbd = "Bắt đầu phiên phải ở tương lai.";
  if (form.thoigiankt && endAuction <= startAuction)
    errors.thoigiankt = "Kết thúc phiên > bắt đầu.";
  if (form.thoigianbddk && startReg < now)
    errors.thoigianbddk = "Bắt đầu đăng ký phải ở tương lai.";
  if (form.thoigianbddk && form.thoigianbd && startReg >= startAuction)
    errors.thoigianbddk = "Bắt đầu đăng ký < bắt đầu phiên.";
  if (form.thoigianktdk && endReg <= startReg)
    errors.thoigianktdk = "Kết thúc đăng ký > bắt đầu đăng ký.";
  if (form.thoigianktdk && form.thoigianbd && endReg >= startAuction)
    errors.thoigianktdk = "Kết thúc đăng ký < bắt đầu phiên.";
};

const formatDateTime = (val) => {
  if (!val) return "";
  const local = new Date(val);
  const utc = new Date(local.getTime() - local.getTimezoneOffset() * 60000);
  return utc.toISOString().slice(0, 19).replace("T", " ");
};

function extractErrorMessage(err) {
  if (err?.response?.data?.message) return err.response.data.message;
  if (typeof err?.response?.data === "string") return err.response.data;
  return err?.message || "Lỗi kết nối đến máy chủ!";
}

const save = async () => {
  const token = Cookies.get("jwt_token");
  if (!token) return showToast("Vui lòng đăng nhập lại.", "error");

  fields.forEach(({ key }) => validateNumber(key));
  validateTimes();
  if (Object.values(errors).some((e) => e))
    return showToast("Kiểm tra lại dữ liệu.", "error");

  submitting.value = true;
  try {
    const payload = {
      masp: form.masp,
      thoigianbd: formatDateTime(form.thoigianbd),
      thoigiankt: formatDateTime(form.thoigiankt),
      thoigianbddk: formatDateTime(form.thoigianbddk),
      thoigianktdk: formatDateTime(form.thoigianktdk),
      giakhoidiem: form.giamongdoi, // Sử dụng giá mong đợi làm khởi điểm
      buocgia: form.buocgia,
      tiencoc: form.tiencoc,
    };

    const res = await axios.post(`${API}/auctions/create`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Chuẩn BE: { code, message, result }
    const { code, message, result } = res.data || {};
    if (code === 200) {
      showToast(message || "Tạo phiên đấu giá thành công!", "success");
      emit("created", result); // gửi kèm DTO nếu cần dùng
      setTimeout(() => close(), 600);
    } else {
      showToast(message || "Tạo phiên thất bại!", "error");
    }
  } catch (err) {
    const msg = extractErrorMessage(err);
    showToast(msg, "error");
  } finally {
    submitting.value = false;
  }
};

const close = () => emit("close");

// Format giá tiền VND
const formatPrice = (price) => {
  if (price == null || price === undefined) return "N/A";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    price
  );
};

// Watch
watch(
  () => props.product,
  (p) => {
    if (!p) return;
    Object.assign(form, {
      masp: p.masp,
      giamongdoi: p.giamongdoi,
      buocgia: "",
      tiencoc: "",
      thoigianbd: "",
      thoigiankt: "",
      thoigianbddk: "",
      thoigianktdk: "",
    });
    Object.assign(formattedValues, { buocgia: "", tiencoc: "" });
    Object.keys(errors).forEach((k) => (errors[k] = ""));
  },
  { immediate: true }
);

watch(
  () => [form.thoigianbd, form.thoigiankt, form.thoigianbddk, form.thoigianktdk],
  () => validateTimes()
);
</script>

<style scoped>
@import "@/assets/styles/userinfo.css";
@import "@/assets/styles/toast.css";
</style>
