<template>
  <div class="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4">
    <h2 class="text-2xl font-semibold text-gray-800 mb-8">ĐĂNG KÝ TÀI SẢN</h2>

    <!-- Toast -->
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
              <span class="font-semibold" :class="toastMeta.titleColor">
                {{ toastMeta.title }}
              </span>
              <p class="text-sm text-gray-600">{{ toast.message }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div v-if="loading" class="text-center text-gray-500 py-6 fade-in">
      Đang tải dữ liệu...
    </div>

    <form v-else @submit.prevent="submitProduct" class="w-full max-w-3xl space-y-5">
      <div class="form-row fade-in">
        <label class="w-40 text-sm text-gray-700 font-bold">Tên sản phẩm</label>
        <div class="flex-1">
          <input
            v-model="product.name"
            class="input"
            :class="{ error: errors.name }"
            placeholder="Nhập tên sản phẩm"
          />
          <p v-if="errors.name" class="error-msg">{{ errors.name }}</p>
        </div>
      </div>

      <div class="form-row fade-in">
        <label class="w-40 text-sm text-gray-700 font-bold">Danh mục</label>
        <div class="flex-1">
          <SoftDropdown
            v-model="product.category"
            :options="catOptions"
            option-value="value"
            option-label="label"
            :error="!!errors.category"
            :errorMessage="errors.category"
            placeholder="-- Chọn danh mục --"
          />
          <p v-if="errors.category" class="error-msg">{{ errors.category }}</p>
        </div>
      </div>

      <div class="form-row fade-in">
        <label class="w-40 text-sm text-gray-700 font-bold">Giá mong đợi</label>
        <div class="flex-1">
          <input
            v-model="formattedPrice"
            type="text"
            class="input"
            :class="{ error: errors.expectedPrice }"
            placeholder="Ví dụ: 10.000"
            @input="onPriceInput"
          />
          <p v-if="errors.expectedPrice" class="error-msg">{{ errors.expectedPrice }}</p>
        </div>
      </div>

      <div class="form-row fade-in">
        <label class="w-40 text-sm text-gray-700 font-bold">Tình trạng sản phẩm</label>
        <div class="flex-1">
          <input
            v-model="product.condition"
            class="input"
            :class="{ error: errors.condition }"
            placeholder="Ví dụ: Mới, Cũ, Hàng Like New..."
          />
          <p v-if="errors.condition" class="error-msg">{{ errors.condition }}</p>
        </div>
      </div>

      <div class="form-row fade-in">
        <label class="w-40 text-sm text-gray-700 font-bold">Thành phố</label>
        <div class="flex-1">
          <SoftDropdown
            v-model="product.city"
            :options="cityOptions"
            option-value="value"
            option-label="label"
            :error="!!errors.city"
            :errorMessage="errors.city"
            placeholder="-- Chọn thành phố --"
          />
          <p v-if="errors.city" class="error-msg">{{ errors.city }}</p>
        </div>
      </div>

      <div class="form-row fade-in">
        <label class="w-40 text-sm text-gray-700 font-bold">Ảnh sản phẩm</label>
        <div class="flex gap-4 flex-wrap">
          <div
            v-for="(img, index) in product.images"
            :key="index"
            class="w-32 h-32 border border-gray-300 rounded-md flex items-center justify-center bg-gray-100 relative cursor-pointer"
            @click="removeImage(index)"
          >
            <img
              v-if="img.preview"
              :src="img.preview"
              class="object-cover w-full h-full rounded-md"
              alt=""
            />
            <span v-else class="text-gray-400 text-center">Ảnh</span>
            <button
              v-if="img.preview"
              type="button"
              @click.stop="removeImage(index)"
              class="absolute top-1 right-1 text-red-500 bg-white rounded-full w-5 h-5 flex items-center justify-center text-sm"
            >
              ✕
            </button>
          </div>
          <label
            v-if="product.images.length < 3"
            class="w-32 h-32 border border-dashed border-gray-400 rounded-md flex items-center justify-center cursor-pointer text-gray-400"
          >
            Thêm ảnh
            <input
              type="file"
              class="hidden"
              accept="image/png, image/jpeg, image/jpg"
              @change="handleImage"
            />
          </label>
        </div>
        <p v-if="errors.images" class="error-msg">{{ errors.images }}</p>
      </div>

      <div class="pt-6 flex justify-end gap-3">
        <button
          type="submit"
          class="inline-flex items-center bg-[#127fcf] hover:bg-[#1992eb] text-white px-4 py-2 rounded-xl font-semibold btn-flash"
        >
          Đăng Ký Tài Sản
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import Cookies from "js-cookie";
import SoftDropdown from "@/components/SoftDropdown.vue";

const API = "https://daugiabe-production.up.railway.app/api";

const product = ref({
  name: "",
  category: "",
  expectedPrice: null,
  condition: "",
  city: "",
  images: [],
});

const categories = ref([]);
const cities = ref([]);
const errors = ref({});
const loading = ref(true);
const toast = ref({ show: false, message: "", type: "success" });
const formattedPrice = ref("");

/* Toast meta */
const toastMeta = computed(() => {
  const type = (toast.value.type || "info").toLowerCase();
  if (type === "success") {
    return {
      title: "Thành công!",
      barBg: "bg-emerald-500",
      titleColor: "text-emerald-500",
      iconPaths: [
        "M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z",
      ],
    };
  }
  if (type === "warning") {
    return {
      title: "Cảnh báo!",
      barBg: "bg-yellow-400",
      titleColor: "text-yellow-400",
      iconPaths: [
        "M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z",
      ],
    };
  }
  if (type === "error") {
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
    title: "Info",
    barBg: "bg-blue-500",
    titleColor: "text-blue-500",
    iconPaths: [
      "M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331Z",
      "M21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z",
    ],
  };
});

const showToast = (msg, type = "success") => {
  toast.value = { show: true, message: msg, type };
  setTimeout(() => (toast.value.show = false), 3000);
};

/* Price input */
function onPriceInput(e) {
  let val = e.target.value.replace(/[^\d]/g, ""); // Chỉ giữ số
  product.value.expectedPrice = val ? Number(val) : null;
  formattedPrice.value = val ? new Intl.NumberFormat("vi-VN").format(Number(val)) : "";
}

/* Ảnh: sanitize và preview */
const handleImage = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const validTypes = ["image/png", "image/jpeg", "image/jpg"];
  if (!validTypes.includes(file.type)) {
    showToast("Chỉ chấp nhận ảnh PNG, JPG, JPEG!", "error");
    return;
  }
  if (product.value.images.length >= 3) return;

  // Sanitize tên file: loại bỏ dấu, khoảng trắng, chuyển lowercase
  const sanitizedName = file.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9.-]/g, "")
    .toLowerCase();

  const reader = new FileReader();
  reader.onload = () => {
    product.value.images.push({
      file,
      preview: reader.result,
      name: sanitizedName,
    });
  };
  reader.readAsDataURL(file);
  e.target.value = "";
};

const removeImage = (index) => {
  product.value.images.splice(index, 1);
};

/* Options cho dropdown */
const catOptions = computed(() =>
  (categories.value || []).map((c) => ({ value: String(c.madm), label: c.tendm }))
);
const cityOptions = computed(() =>
  (cities.value || []).map((c) => ({ value: String(c.matp), label: c.tentp }))
);

/* Submit sản phẩm + ảnh */
const submitProduct = async () => {
  errors.value = {};
  // Trim và validate
  if (!product.value.name.trim()) errors.value.name = "Nhập tên sản phẩm.";
  if (!product.value.category) errors.value.category = "Chọn danh mục.";
  if (product.value.expectedPrice === null || product.value.expectedPrice < 10000)
    errors.value.expectedPrice = "Giá mong đợi phải từ 10.000 trở lên.";
  if (!product.value.condition.trim())
    errors.value.condition = "Nhập tình trạng sản phẩm.";
  if (!product.value.city) errors.value.city = "Chọn thành phố.";
  if (product.value.images.length === 0) errors.value.images = "Thêm ít nhất 1 ảnh.";
  if (Object.keys(errors.value).length > 0) return;

  const token = Cookies.get("jwt_token");
  if (!token) {
    showToast("Phiên đăng nhập đã hết hạn!", "error");
    return;
  }

  try {
    // 1) Tạo sản phẩm với chuỗi sạch
    const productPayload = {
      madm: product.value.category.trim(),
      matp: product.value.city.trim(),
      tensp: product.value.name.trim(),
      tinhtrangsp: product.value.condition.trim(),
      giamongdoi: product.value.expectedPrice,
    };
    const res = await axios.post(`${API}/products/create`, productPayload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data?.code !== 200) {
      showToast(res.data?.message || "Đăng ký tài sản thất bại!", "error");
      return;
    }

    const masp = res.data.result.masp;
    showToast("Đăng ký tài sản thành công!", "success");

    // 2) Upload ảnh ban đầu
    if (product.value.images.length > 0) {
      const formData = new FormData();
      formData.append("masp", masp);

      product.value.images.forEach((img) => {
        const sanitizedFile = new File([img.file], img.name, { type: img.file.type });
        formData.append("files", sanitizedFile);
      });

      const imageRes = await axios.post(`${API}/images/init`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (imageRes.data.code === 200) {
        showToast("Upload ảnh thành công!", "success");
      } else {
        showToast(imageRes.data.message || "Upload ảnh thất bại!", "error");
      }
    }

    // 3) Reset form + phát sự kiện để trang quản lý tự refetch
    product.value = {
      name: "",
      category: "",
      expectedPrice: null,
      condition: "",
      city: "",
      images: [],
    };
    formattedPrice.value = "";
    window.dispatchEvent(new CustomEvent("products:changed"));
  } catch (err) {
    console.error(err);
    showToast("Đăng ký tài sản thất bại!", "error");
  }
};

/* Tải danh mục + thành phố */
onMounted(async () => {
  try {
    const [catRes, cityRes] = await Promise.all([
      axios.get(`${API}/cates/find-all`),
      axios.get(`${API}/cities/find-all`),
    ]);
    if (catRes.data?.result) categories.value = catRes.data.result;
    if (cityRes.data?.result) cities.value = cityRes.data.result;
  } catch (err) {
    console.error(err);
    showToast("Không thể tải dữ liệu danh mục hoặc thành phố!", "error");
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
@import "@/assets/styles/userinfo.css";
@import "@/assets/styles/toast.css";
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .form-row label {
    width: 100%;
  }
  .form-row > div {
    width: 100%;
  }
}
</style>
