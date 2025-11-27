<template>
  <div class="min-h-screen text-slate-800 py-10 px-6 max-w-5xl mx-auto fade-in">
     <!-- Loading / Error: Hiển thị khi đang tải hoặc có lỗi -->
    <div v-if="loading" class="flex justify-center items-center py-12 fade-in">
      <div class="flex flex-col items-center gap-3">
        <div id="wifi-loader">
          <svg class="circle-outer" viewBox="0 0 86 86">
            <circle class="back" cx="43" cy="43" r="40"></circle>
            <circle class="front" cx="43" cy="43" r="40"></circle>
            <circle class="new" cx="43" cy="43" r="40"></circle>
          </svg>
          <svg class="circle-middle" viewBox="0 0 60 60">
            <circle class="back" cx="30" cy="30" r="27"></circle>
            <circle class="front" cx="30" cy="30" r="27"></circle>
          </svg>
          <svg class="circle-inner" viewBox="0 0 34 34">
            <circle class="back" cx="17" cy="17" r="14"></circle>
            <circle class="front" cx="17" cy="17" r="14"></circle>
          </svg>
          <div class="text" data-text="Đang tải"></div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="text-center text-red-500 py-10 font-medium">
      {{ error }}
    </div>

    <!-- Nội dung chính: Khi đã load xong -->
    <div v-else>
      <!-- Tiêu đề: Tên sản phẩm -->
      <h1
        class="text-2xl md:text-3xl font-bold text-center text-[#0f6bae] uppercase tracking-wide mb-8"
      >
        {{ auction.sanPham?.tensp }}
      </h1>

      <!-- Bộ đếm ngược: Hiển thị thời gian đến khi bắt đầu đấu giá -->
      <div class="flex justify-center flex-wrap gap-2 mb-10 items-center">
        <template v-for="(unit, label, index) in countdown" :key="label">
          <div
            class="text-center bg-white shadow-sm rounded-xl p-4 border border-[#e3fafc] w-24"
          >
            <div class="text-[#0f6bae] text-2xl font-extrabold">{{ unit }}</div>
            <div class="text-xs uppercase text-slate-600 mt-1 font-semibold">
              {{ label }}
            </div>
          </div>
          <span
            v-if="index < Object.keys(countdown).length - 1"
            class="text-2xl font-bold text-[#0f6bae]"
            >:</span
          >
        </template>
      </div>

      <!-- Thông tin đấu giá: Chia làm 2 cột trên md -->
      <div class="grid md:grid-cols-2 gap-10">
        <!-- Hình ảnh: Bên trái, có thumbnail nếu nhiều ảnh -->
        <div>
          <img
            :src="mainImage"
            @error="onImgError"
            @click="showImagePopup(mainImage)"
            class="w-full h-80 object-contain border border-slate-200 rounded-xl shadow-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          />
          <div v-if="images.length > 1" class="flex flex-wrap gap-2 mt-4 justify-center">
            <img
              v-for="(img, i) in images"
              :key="i"
              :src="img"
              @error="onImgError"
              @click="setMainImage(img)"
              class="w-20 h-20 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-80 transition ring-offset-2"
              :class="{ 'ring-2 ring-[#0f6bae]': img === mainImage }"
            />
          </div>
        </div>

        <!-- Chi tiết: Bên phải, danh sách thông tin -->
        <div class="space-y-3 text-[15px] leading-relaxed">
          <div
            v-for="item in thongTin"
            :key="item.label"
            class="flex items-start border-b border-slate-200 pb-2 gap-x-4"
          >
            <span class="w-52 text-slate-600 font-medium shrink-0"
              >{{ item.label }}:</span
            >
            <span
              class="font-semibold text-slate-800 whitespace-pre-line break-words flex-1"
            >
              {{ item.value }}
            </span>
          </div>

          <div class="flex items-start text-lg font-bold text-[#0f6bae] pt-3 gap-x-4">
            <span class="w-52 shrink-0">Giá khởi điểm:</span>
            <span>{{ formatCurrency(auction.giakhoidiem) }}</span>
          </div>
        </div>
      </div>

      <!-- Nút đăng ký -->
      <div class="mt-12 flex justify-end">
        <button
          class="text-white px-5 py-2 rounded-xl font-semibold text-lg transition-all shadow-md hover:shadow-lg bg-[#127fcf] hover:bg-[#1992eb] btn-flash"
          @click="handleRegister"
        >
          ĐĂNG KÝ
        </button>
      </div>
    </div>
  </div>

  <!-- Popup xem ảnh -->
  <transition name="fade">
    <div
      v-if="imagePopup.show"
      class="fixed inset-0 z-[100] bg-black/90 text-white"
      @click="closeImagePopup"
    >
      <!-- Top bar: Thông tin và controls -->
      <div
        class="absolute top-0 left-0 right-0 h-12 px-4 md:px-6 flex items-center justify-between select-none"
        @click.stop
      >
        <div class="text-sm md:text-base opacity-80">
          {{ imagePopup.index + 1 }} / {{ images.length }}
        </div>
        <div class="flex items-center gap-3 text-[13px] md:text-sm">
          <button
            class="px-2 py-1 hover:text-sky-400"
            @click.stop="zoomOut"
            title="Thu nhỏ"
          >
            −
          </button>
          <span class="opacity-80 tabular-nums min-w-[48px] text-center"
            >{{ Math.round(zoom * 100) }}%</span
          >
          <button
            class="px-2 py-1 hover:text-sky-400"
            @click.stop="zoomIn"
            title="Phóng to"
          >
            +
          </button>
          <button
            class="px-2 py-1 hover:text-sky-400"
            @click.stop="resetZoom"
            title="Khôi phục"
          >
            Khôi phục
          </button>
          <button
            class="px-2 py-1 hover:text-sky-400"
            @click.stop="downloadCurrent"
            title="Tải xuống"
          >
            ⬇︎
          </button>
          <button
            class="px-2 py-1 hover:text-rose-400"
            @click.stop="closeImagePopup"
            title="Đóng"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Stage: Ảnh chính -->
      <div class="h-full w-full flex items-center justify-center px-4 md:px-10">
        <div class="relative h-[80vh] w-full max-w-[96vw]">
          <img
            :src="currentPopupSrc"
            :alt="currentPopupName"
            class="absolute inset-0 m-auto object-contain max-h-full max-w-full transition-transform duration-150 ease-out"
            :style="{ transform: `scale(${zoom})` }"
            @dblclick.stop="zoom === 1 ? zoomIn() : resetZoom()"
            @click.stop
            draggable="false"
          />
          <!-- Prev / Next -->
          <button
            v-if="images.length > 1"
            @click.stop="prevImage"
            class="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-5xl leading-none select-none"
            title="Trước"
          >
            ‹
          </button>
          <button
            v-if="images.length > 1"
            @click.stop="nextImage"
            class="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-5xl leading-none select-none"
            title="Sau"
          >
            ›
          </button>
        </div>
      </div>

      <!-- Filename -->
      <div
        class="pointer-events-none absolute bottom-25 left-0 right-0 flex justify-center"
      >
        <div class="px-3 py-1 rounded bg-black/60 text-white/90 text-xs md:text-sm">
          {{ currentPopupName }}
        </div>
      </div>

      <!-- Thumbnails: Dưới cùng, scroll ngang -->
      <div class="absolute bottom-0 left-0 right-0 bg-black/70" @click.stop>
        <div class="mx-auto max-w-[95vw] px-3 py-3 overflow-x-auto">
          <div class="flex items-center gap-2">
            <button
              v-for="(img, i) in images"
              :key="i"
              class="relative shrink-0 h-16 w-16 rounded border border-white/10 overflow-hidden ring-2 transition-all"
              :class="
                i === imagePopup.index
                  ? 'ring-2 ring-[#0f6bae]'
                  : 'ring-transparent hover:ring-white/40'
              "
              @click.stop="goToImage(i)"
              title="Xem ảnh này"
            >
              <img
                :src="img"
                class="h-full w-full object-cover"
                alt=""
                draggable="false"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- Toast: Thông báo -->
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
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Cookies from "js-cookie";

const API = "https://daugiabe-production.up.railway.app/api/";
const route = useRoute();
const router = useRouter();

const auction = ref({});
const loading = ref(true);
const error = ref(null);

const images = ref([]);
const mainImage = ref("");
// Countdown
const now = ref(Date.now());
let timer = null;
const countdown = computed(() => {
  const end = new Date(auction.value?.thoigianbd || 0).getTime();
  const diff = end - now.value;
  if (diff <= 0) return { Ngày: "00", Giờ: "00", Phút: "00", Giây: "00" };
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  const pad = (n) => String(n).padStart(2, "0");
  return { Ngày: pad(d), Giờ: pad(h), Phút: pad(m), Giây: pad(s) };
});

// Thông tin chi tiết
const thongTin = computed(() => [
  { label: "Mã tài sản", value: auction.value.sanPham?.masp || "-" },
  { label: "Thời gian mở đăng ký", value: formatDate(auction.value.thoigianbddk) },
  { label: "Thời gian kết thúc đăng ký", value: formatDate(auction.value.thoigianktdk) },
  { label: "Bước giá", value: formatCurrency(auction.value.buocgia) },
  { label: "Tiền đặt trước", value: formatCurrency(auction.value.tiencoc) },
  {
    label: "Tên chủ tài sản",
    value: auction.value.taiKhoanNguoiBan
      ? [
          auction.value.taiKhoanNguoiBan.ho,
          auction.value.taiKhoanNguoiBan.tenlot,
          auction.value.taiKhoanNguoiBan.ten,
        ]
          .filter(Boolean)
          .join(" ")
      : "-",
  },
  {
    label: "Nơi xem tài sản",
    value: auction.value.taiKhoanNguoiBan?.diachi || "Không có thông tin",
  },
  { label: "Thời gian xem tài sản", value: auction.value.thoigianxemts || "-" },
  { label: "Tổ chức đấu giá tài sản", value: auction.value.tochucdg || "Đấu giá STU" },
  { label: "Đấu giá viên", value: auction.value.daugiaVien || "-" },
  { label: "Thời gian bắt đầu đấu giá", value: formatDate(auction.value.thoigianbd) },
  { label: "Thời gian kết thúc đấu giá", value: formatDate(auction.value.thoigiankt) },
]);

// Helpers
/* Supabase image builder */
const SUPABASE_URL = 'https://gcxlqxkowwkdhyiyjaks.supabase.co' // Thay bằng URL project thật nếu khác
function buildImageUrl(key) {
  if (!key) return '/placeholder.png'
  return SUPABASE_URL.replace(/\/+$/, '') + '/storage/v1/object/public/' + key
}
const setMainImage = (img) => (mainImage.value = img);
const onImgError = (e) => (e.target.src = "https://placehold.co/400x400?text=No+Image");
const formatDate = (iso) => {
  if (!iso) return "-";
  const date = new Date(iso);
  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};
const formatCurrency = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n || 0);

// Popup ảnh
const imagePopup = ref({ show: false, index: 0 });
const showImagePopup = (src) => {
  const idx = images.value.indexOf(src);
  imagePopup.value.index = idx >= 0 ? idx : 0;
  imagePopup.value.show = true;
  resetZoom();
};
const closeImagePopup = () => {
  imagePopup.value.show = false;
};

const currentPopupSrc = computed(() => images.value[imagePopup.value.index] || "");
const currentPopupName = computed(() => {
  const src = currentPopupSrc.value;
  if (!src) return "";
  return src.split("/").pop() || "";
});

// Điều hướng ảnh
const goToImage = (i) => {
  if (i < 0 || i >= images.value.length) return;
  imagePopup.value.index = i;
  resetZoom();
};
const prevImage = () => {
  if (!images.value.length) return;
  imagePopup.value.index =
    (imagePopup.value.index - 1 + images.value.length) % images.value.length;
};
const nextImage = () => {
  if (!images.value.length) return;
  imagePopup.value.index = (imagePopup.value.index + 1) % images.value.length;
};

// Zoom
const zoom = ref(1);
const step = 0.2;
function zoomIn() {
  zoom.value = Math.min(5, +(zoom.value + step).toFixed(2));
}
function zoomOut() {
  zoom.value = Math.max(0.2, +(zoom.value - step).toFixed(2));
}
function resetZoom() {
  zoom.value = 1;
}
function downloadCurrent() {
  const src = currentPopupSrc.value;
  if (!src) return;
  const a = document.createElement("a");
  a.href = src;
  a.download = currentPopupName.value || "image";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// Error extraction theo chuẩn BE (ApiResponse)
function extractErrorMessage(err) {
  if (err?.response?.data?.message) return err.response.data.message;
  if (typeof err?.response?.data === "string") return err.response.data;
  return err?.message || "Lỗi kết nối đến máy chủ!";
}

// Fetch dữ liệu
async function fetchAuction(id) {
  loading.value = true;
  error.value = null;
  auction.value = {};
  images.value = [];
  mainImage.value = "";
  try {
    // Chuẩn BE: ApiResponse { code, message, result }
    const res = await axios.get(`${API}auctions/find-by-id/${id}`);
    const { code, result, message } = res.data || {};
    if (code === 200 && result) {
      auction.value = result;
      const imgList = auction.value?.sanPham?.hinhAnh || [];
      images.value = imgList.map((img) => buildImageUrl(img.tenanh));
      mainImage.value = images.value[0] || "https://placehold.co/400x400?text=No+Image";
    } else {
      error.value = message || "Không tìm thấy dữ liệu.";
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Lỗi tải phiên:", err);
    error.value = extractErrorMessage(err) || "Không thể tải phiên đấu giá.";
  } finally {
    loading.value = false;
  }
}

// Đăng ký
async function handleRegister() {
  try {
    const token = Cookies.get("jwt_token");
    if (!token)
      return showToast("Vui lòng đăng nhập trước khi đăng ký đấu giá.", "error");

    // Chuẩn BE: ApiResponse { code, message, result }
    const res = await axios.post(
      `${API}deposit-payments/create`,
      { maphien: auction.value.maphiendg },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const { code, message } = res.data || {};
    if (code === 200) {
      showToast(
        message || "Đăng ký thành công! Vui lòng tiến hành thanh toán.",
        "success"
      );
      setTimeout(() => router.push({ name: "PaymentMana" }), 1800);
    } else {
      showToast(message || "Không thể tạo phiếu thanh toán.", "error");
    }
  } catch (err) {
    showToast(extractErrorMessage(err), "error");
  }
}

/* Toast (chuẩn hoá giống template trước) */
const toast = ref({ show: false, message: "", type: "success" });
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
    title: "Thông báo",
    barBg: "bg-blue-500",
    titleColor: "text-blue-500",
    iconPaths: [
      "M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331Z",
      "M21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z",
    ],
  };
});
function showToast(message, type = "success") {
  toast.value = { show: true, message, type };
  setTimeout(() => (toast.value.show = false), 3000);
}

// Lifecycle
onMounted(() => {
  fetchAuction(route.params.id);
  timer = setInterval(() => (now.value = Date.now()), 1000);
});
onUnmounted(() => clearInterval(timer));
watch(
  () => route.params.id,
  (newId) => newId && fetchAuction(newId)
);
</script>

<style scoped>
@import "@/assets/styles/toast.css";

/* Fade modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
