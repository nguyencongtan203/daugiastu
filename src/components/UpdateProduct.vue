<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
  >
    <div class="relative z-10 w-full max-w-3xl rounded-lg bg-white p-8 shadow-lg">
      <div class="relative mb-6 border-b pb-3">
        <h2 class="text-2xl font-semibold text-gray-800 text-center">
          CẬP NHẬT SẢN PHẨM
        </h2>
        <button
          class="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xl"
          @click="close"
          aria-label="Đóng"
        >
          ✕
        </button>
      </div>

      <form class="space-y-5" @submit.prevent="save">
        <div class="form-row">
          <label class="w-40 text-sm font-semibold text-gray-700">Thành phố</label>
          <div class="flex-1">
            <SoftDropdown
              v-model="form.thanhPho.matp"
              :options="cityOptions"
              option-value="value"
              option-label="label"
              placeholder="-- Chọn thành phố --"
              :error="!!errors.matp"
              :error-message="errors.matp"
            />
          </div>
        </div>

        <div class="form-row">
          <label class="w-40 text-sm font-semibold text-gray-700">Danh mục</label>
          <div class="flex-1">
            <SoftDropdown
              v-model="form.danhMuc.madm"
              :options="catOptions"
              option-value="value"
              option-label="label"
              placeholder="-- Chọn danh mục --"
              :error="!!errors.madm"
              :error-message="errors.madm"
            />
          </div>
        </div>

        <div class="form-row">
          <label class="w-40 text-sm font-semibold text-gray-700">Tên sản phẩm</label>
          <div class="flex-1">
            <input v-model="form.tensp" class="input" :class="{ error: errors.tensp }" />
            <p v-if="errors.tensp" class="error-msg">{{ errors.tensp }}</p>
          </div>
        </div>

        <div class="form-row">
          <label class="w-40 text-sm font-semibold text-gray-700">Tình trạng</label>
          <div class="flex-1">
            <input
              v-model="form.tinhtrangsp"
              class="input"
              :class="{ error: errors.tinhtrangsp }"
            />
            <p v-if="errors.tinhtrangsp" class="error-msg">{{ errors.tinhtrangsp }}</p>
          </div>
        </div>

        <div class="form-row">
          <label class="w-40 text-sm font-semibold text-gray-700">Giá mong đợi</label>
          <div class="flex-1">
            <input
              v-model="formattedPrice"
              type="text"
              class="input"
              :class="{ error: errors.giamongdoi }"
              placeholder="Ví dụ: 10.000"
              @input="onPriceInput"
            />
            <p v-if="errors.giamongdoi" class="error-msg">{{ errors.giamongdoi }}</p>
          </div>
        </div>

        <div class="form-row flex-col items-start">
          <label class="text-sm font-semibold text-gray-700"
            >Ảnh sản phẩm (tối đa 3 ảnh)</label
          >
          <div class="flex gap-4 flex-wrap mt-2">
            <div
              v-for="(img, index) in form.hinhAnh"
              :key="index"
              class="w-32 h-32 border rounded-md flex items-center justify-center bg-gray-100 relative"
            >
              <img
                v-if="img.preview || img.tenanh"
                :src="img.preview || buildImageUrl(img.tenanh)"
                class="object-cover w-full h-full rounded-md"
                alt=""
              />
              <button
                type="button"
                @click.stop="removeImage(index)"
                class="absolute top-1 right-1 text-red-500 bg-white rounded-full w-5 h-5 flex items-center justify-center text-sm shadow-sm"
              >
                ✕
              </button>
            </div>

            <label
              v-if="form.hinhAnh.length < 3"
              class="w-32 h-32 border border-dashed rounded-md flex items-center justify-center cursor-pointer text-gray-400"
            >
              Thêm ảnh
              <input
                ref="imageInput"
                type="file"
                class="hidden"
                accept="image/png, image/jpeg, image/jpg"
                @change="onAddImage"
              />
            </label>
          </div>
          <p v-if="errors.hinhAnh" class="error-msg mt-1">{{ errors.hinhAnh }}</p>
        </div>

        <!-- Footer -->
        <div class="pt-6 flex justify-end gap-3 mt-6">
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
            @click="close"
          >
            Hủy
          </button>
          <button
            type="submit"
            class="inline-flex items-center bg-[#127fcf] hover:bg-[#1992eb] text-white px-4 py-2 rounded-xl font-semibold btn-flash"
            :disabled="submitting"
          >
            <span v-if="submitting">Đang lưu...</span>
            <span v-else>Lưu</span>
          </button>
        </div>
      </form>
    </div>
  </div>

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
</template>

<script setup>
import { reactive, ref, watch, onMounted, computed } from "vue";
import axios from "axios";
import Cookies from "js-cookie";
import SoftDropdown from "@/components/SoftDropdown.vue";

const API = "https://daugiabe-production.up.railway.app/api";

const props = defineProps({ visible: Boolean, product: Object });
const emit = defineEmits(["close", "updated"]);

// Reactive state
const categories = ref([]);
const cities = ref([]);
const imageInput = ref(null);
const formattedPrice = ref("");

const form = reactive({
  masp: "",
  tensp: "",
  tinhtrangsp: "",
  giamongdoi: null,
  thanhPho: { matp: "" },
  danhMuc: { madm: "" },
  hinhAnh: [],
});
const originalImages = ref([]);
const errors = reactive({});
const toast = reactive({ show: false, message: "", type: "success" });
const submitting = ref(false);

// Computed
const catOptions = computed(() =>
  (categories.value || []).map((c) => ({ value: String(c.madm), label: c.tendm }))
);
const cityOptions = computed(() =>
  (cities.value || []).map((c) => ({ value: String(c.matp), label: c.tentp }))
);

const toastMeta = computed(() => {
  const type = String(toast.type || "info").toLowerCase();
  if (type === "success")
    return {
      title: "Thành công!",
      barBg: "bg-emerald-500",
      titleColor: "text-emerald-500",
      iconPaths: [
        "M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z",
      ],
    };
  if (type === "warning")
    return {
      title: "Cảnh báo!",
      barBg: "bg-yellow-400",
      titleColor: "text-yellow-400",
      iconPaths: [
        "M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z",
      ],
    };
  if (type === "error")
    return {
      title: "Lỗi!",
      barBg: "bg-red-500",
      titleColor: "text-red-500",
      iconPaths: [
        "M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z",
      ],
    };
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

// Watch
watch(
  () => props.product,
  (p) => {
    if (!p) return;
    const initial = (p.hinhAnh || []).slice(0, 3).map((img) => ({
      tenanh: img.tenanh,
      file: null,
      preview: null,
    }));
    Object.assign(form, {
      masp: p.masp ?? "",
      tensp: p.tensp ?? "",
      tinhtrangsp: p.tinhtrangsp ?? "",
      giamongdoi: p.giamongdoi || null,
      thanhPho: { matp: p.thanhPho?.matp ? String(p.thanhPho.matp) : "" },
      danhMuc: { madm: p.danhMuc?.madm ? String(p.danhMuc.madm) : "" },
      hinhAnh: initial,
    });
    formattedPrice.value = form.giamongdoi
      ? new Intl.NumberFormat("vi-VN").format(form.giamongdoi)
      : "";
    originalImages.value = initial.map((x) => ({ tenanh: x.tenanh }));
    clearErrors();
  },
  { immediate: true }
);

// Functions
function clearErrors() {
  Object.keys(errors).forEach((k) => delete errors[k]);
}

/* Supabase image builder */
const SUPABASE_URL = 'https://gcxlqxkowwkdhyiyjaks.supabase.co' // Thay bằng URL project thật nếu khác
function buildImageUrl(key) {
  if (!key) return '/placeholder.png'
  return SUPABASE_URL.replace(/\/+$/, '') + '/storage/v1/object/public/' + key
}

function extractErrorMessage(err) {
  if (err?.response?.data?.message) return err.response.data.message;
  if (typeof err?.response?.data === "string") return err.response.data;
  return err?.message || "Lỗi kết nối đến máy chủ!";
}

function onPriceInput(e) {
  let val = e.target.value.replace(/[^\d]/g, ""); // Chỉ giữ số
  form.giamongdoi = val ? Number(val) : null;
  formattedPrice.value = val ? new Intl.NumberFormat("vi-VN").format(Number(val)) : "";
}

function onAddImage(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  if (form.hinhAnh.length >= 3) {
    errors.hinhAnh = "Tối đa 3 ảnh.";
    return;
  }
  const safeName = file.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
  const renamedFile = new File([file], safeName, { type: file.type });
  const reader = new FileReader();
  reader.onload = () => {
    form.hinhAnh.push({ tenanh: safeName, file: renamedFile, preview: reader.result });
    delete errors.hinhAnh;
  };
  reader.readAsDataURL(renamedFile);
  e.target.value = "";
}

function removeImage(i) {
  form.hinhAnh.splice(i, 1);
}

function validate() {
  clearErrors();
  if (!form.thanhPho.matp) errors.matp = "Chọn thành phố.";
  if (!form.danhMuc.madm) errors.madm = "Chọn danh mục.";
  if (!form.tensp?.trim()) errors.tensp = "Nhập tên sản phẩm.";
  if (!form.tinhtrangsp?.trim()) errors.tinhtrangsp = "Nhập tình trạng.";
  if (!form.giamongdoi || form.giamongdoi < 10000)
    errors.giamongdoi = "Giá mong đợi phải từ 10.000 trở lên.";
  if (form.hinhAnh.length === 0) errors.hinhAnh = "Cần ít nhất 1 ảnh.";
  return Object.keys(errors).length === 0;
}

async function save() {
  if (!validate()) return; // Chỉ inline errors

  const token = Cookies.get("jwt_token");
  if (!token) {
    showToast("Vui lòng đăng nhập lại!", "error");
    return;
  }

  submitting.value = true;
  try {
    // Xử lý chuỗi sạch: trim đầu cuối và loại bỏ khoảng trắng thừa
    const cleanString = (str) => str.trim().replace(/\s+/g, " ");

    const body = {
      masp: form.masp,
      madm: form.danhMuc.madm,
      matp: form.thanhPho.matp,
      tensp: cleanString(form.tensp),
      tinhtrangsp: cleanString(form.tinhtrangsp),
      giamongdoi: form.giamongdoi,
    };
    const updateRes = await axios.put(`${API}/products/update`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const { code: codeUpdate, message: msgUpdate } = updateRes.data || {};
    if (codeUpdate !== 200) {
      showToast(msgUpdate || "Cập nhật thất bại!", "error");
      submitting.value = false;
      return;
    }

    // Image sync
    const orig = originalImages.value.map((o) => o.tenanh);
    const after = form.hinhAnh;
    const keptTenanh = after.filter((x) => !x.file && x.tenanh).map((x) => x.tenanh);
    const removedIndices = [];
    orig.forEach((name, idx) => {
      if (!keptTenanh.includes(name)) removedIndices.push(idx);
    });

    const newFileEntries = after
      .map((item, idx) => ({ idx, item }))
      .filter((x) => !!x.item.file);
    const canReplace = removedIndices.length === 0 && after.length === orig.length;
    const replacePairs = canReplace
      ? newFileEntries.filter((x) => x.idx < orig.length)
      : [];

    if (removedIndices.length > 0) {
      await axios.delete(`${API}/images/remove-indices`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { masp: form.masp, indices: removedIndices },
        paramsSerializer: (params) => {
          const usp = new URLSearchParams();
          usp.set("masp", params.masp);
          (params.indices || []).forEach((v) => usp.append("indices", v));
          return usp.toString();
        },
      });
    }

    if (replacePairs.length > 0) {
      const fd = new FormData();
      fd.append("masp", form.masp);
      replacePairs.forEach((p) => fd.append("indices", String(p.idx)));
      replacePairs.forEach((p) => fd.append("files", p.item.file));
      const repRes = await axios.put(`${API}/images/replace-indices`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (repRes.data?.code !== 200) {
        showToast(repRes.data?.message || "Thay ảnh thất bại!", "error");
        submitting.value = false;
        return;
      }
    }

    const replaceIdxSet = new Set(replacePairs.map((p) => p.idx));
    const appendFiles = newFileEntries
      .filter((p) => !replaceIdxSet.has(p.idx))
      .map((p) => p.item.file);

    if (appendFiles.length > 0) {
      const fd = new FormData();
      fd.append("masp", form.masp);
      appendFiles.forEach((f) => fd.append("files", f));
      const appRes = await axios.post(`${API}/images/append`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (appRes.data?.code !== 200) {
        showToast(appRes.data?.message || "Thêm ảnh mới thất bại!", "error");
        submitting.value = false;
        return;
      }
      const imgs = appRes.data.result || [];
      form.hinhAnh = imgs
        .slice(0, 3)
        .map((h) => ({ tenanh: h.tenanh, file: null, preview: null }));
      originalImages.value = form.hinhAnh.map((x) => ({ tenanh: x.tenanh }));
    } else if (removedIndices.length > 0 || replacePairs.length > 0) {
      try {
        const pr = await axios.get(`${API}/products/find-by-id/${form.masp}`);
        if (pr.data?.code === 200 && pr.data?.result?.hinhAnh) {
          const imgs = pr.data.result.hinhAnh || [];
          form.hinhAnh = imgs
            .slice(0, 3)
            .map((h) => ({ tenanh: h.tenanh, file: null, preview: null }));
          originalImages.value = form.hinhAnh.map((x) => ({ tenanh: x.tenanh }));
        }
      } catch {
        /* ignore */
      }
    }

    showToast("Cập nhật thành công!", "success");
    emit("updated", null);
  } catch (err) {
    showToast(extractErrorMessage(err), "error");
    console.error(err);
  } finally {
    submitting.value = false;
  }
}

function close() {
  emit("close");
}

function showToast(msg, type = "success") {
  toast.message = msg;
  toast.type = type;
  toast.show = true;
  setTimeout(() => (toast.show = false), 2500);
}

// Lifecycle
onMounted(async () => {
  try {
    const [catRes, cityRes] = await Promise.all([
      axios.get(`${API}/cates/find-all`),
      axios.get(`${API}/cities/find-all`),
    ]);
    categories.value = catRes.data?.code === 200 ? catRes.data.result || [] : [];
    cities.value = cityRes.data?.code === 200 ? cityRes.data.result || [] : [];
    if (catRes.data?.code !== 200 && catRes.data?.message)
      showToast(catRes.data.message, "error");
    if (cityRes.data?.code !== 200 && cityRes.data?.message)
      showToast(cityRes.data.message, "error");
  } catch (err) {
    showToast("Không thể tải danh mục/thành phố!", "error");
    console.error(err);
  }
});
</script>

<style scoped>
@import "@/assets/styles/userinfo.css";
@import "@/assets/styles/toast.css";
</style>
