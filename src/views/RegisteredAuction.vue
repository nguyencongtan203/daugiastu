<template>
  <div
    class="min-h-screen product-mana px-4 py-8 bg-gradient-to-b from-slate-50 to-white"
  >
    <main class="flex-1">
      <!-- Header -->
      <section class="max-w-[1200px] mx-auto px-4 lg:px-6 pt-2">
        <div class="flex items-end justify-center">
          <h1
            class="text-[22px] md:text-[26px] font-semibold text-slate-900 tracking-tight"
          >
            PHIÊN ĐĂNG KÝ
          </h1>
        </div>
      </section>

      <!-- Loading / Error -->
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

      <!-- List -->
      <section class="max-w-[1200px] mx-auto px-4 lg:px-6 py-6" v-else>
        <div v-if="auctions.length === 0" class="text-center text-slate-600 py-10">
          Chưa có phiên nào bạn đã thanh toán tiền cọc.
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="a in auctions"
            :key="a.maphiendg"
            class="fade-in group relative rounded-[22px] ring-1 ring-slate-200 bg-white overflow-hidden shadow-sm flex gap-4 p-4 hover:shadow-md transition"
          >
            <!-- Image -->
            <div
              class="w-44 md:w-56 h-32 md:h-36 rounded-xl bg-white ring-1 ring-slate-100 overflow-hidden relative flex items-center justify-center"
            >
              <div v-if="!firstImage(a)" class="text-slate-400 text-sm">No image</div>
              <img
                v-else
                :src="imageUrl(firstImage(a))"
                :alt="a.sanPham?.tensp || 'Ảnh sản phẩm'"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <div
                class="absolute bottom-2 right-2 bg-white/90 backdrop-blur rounded-lg px-2 py-1 ring-1 ring-slate-200 text-[11px] text-slate-700 flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xml:space="preserve"
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  color="#ec003f"
                  style="
                    fill-rule: evenodd;
                    clip-rule: evenodd;
                    stroke-linejoin: round;
                    stroke-miterlimit: 2;
                  "
                >
                  <path
                    d="M7.2 5.6V8a.8.8 0 0 0 .234.566l1.6 1.6a.802.802 0 0 0 1.132-1.132L8.8 7.669V5.6a.8.8 0 1 0-1.6 0"
                    transform="translate(-1.6 -1.6)"
                    style="fill: currentcolor"
                  ></path>
                  <path
                    d="M8 3.2a4.8 4.8 0 1 1 0 9.6.8.8 0 1 0 0 1.6A6.4 6.4 0 0 0 14.4 8 6.4 6.4 0 0 0 8 1.6a.8.8 0 1 0 0 1.6"
                    transform="translate(-1.6 -1.6)"
                    style="fill: currentcolor"
                  ></path>
                  <path
                    d="M5.2 13.65a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6M3.151 11.6a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6M2.4 8.8a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6M3.151 6a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6M5.2 3.95a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6"
                    transform="translate(-1.6 -1.6)"
                    style="fill-rule: nonzero; fill: currentcolor"
                  ></path>
                </svg>
                <span class="tabular-nums">{{
                  shortCountdown(a.thoigianbd, a.thoigiankt)
                }}</span>
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-3">
                <h3
                  class="text-[17px] md:text-[18px] font-bold text-slate-900 leading-snug line-clamp-2"
                >
                  {{ a.sanPham?.tensp || "Sản phẩm" }}
                  <span class="ml-2 text-slate-500 text-sm font-normal"
                    >#{{ a.maphiendg }}</span
                  >
                </h3>
                <span
                  class="shrink-0 text-[12px] px-2 py-1 rounded-full bg-slate-100 text-slate-700 ring-1 ring-slate-200"
                >
                  {{ a.trangthai }}
                </span>
              </div>

              <div class="grid sm:grid-cols-2 gap-x-8 gap-y-1 mt-2 text-sm">
                <div class="flex items-center gap-1">
                  <span class="text-slate-500">Bắt đầu:</span>
                  <span class="font-semibold text-slate-900">{{
                    formatDate(a.thoigianbd)
                  }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="text-slate-500">Kết thúc:</span>
                  <span class="font-semibold text-slate-900">{{
                    formatDate(a.thoigiankt)
                  }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="text-slate-500">Giá khởi điểm:</span>
                  <span class="font-semibold text-sky-700">{{
                    formatCurrency(a.giakhoidiem)
                  }}</span>
                </div>
              </div>

              <div class="mt-3 flex gap-2 justify-end">
                <a
                  class="inline-flex items-center bg-[#127fcf] hover:bg-[#1992eb] text-white px-4 py-2 rounded-xl font-semibold btn-flash"
                  :href="auctionUrl(a.maphiendg)"
                  @click.prevent="goAuction(a)"
                >
                  Truy cập phiên
                </a>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-center gap-3 pt-2">
            <button
              class="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-50"
              :disabled="page.first"
              @click="goTo(page.number - 1)"
            >
              « Trước
            </button>
            <span>Trang {{ page.number + 1 }} / {{ page.totalPages }}</span>
            <button
              class="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-50"
              :disabled="page.last"
              @click="goTo(page.number + 1)"
            >
              Sau »
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onActivated, watch } from "vue";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter, useRoute } from "vue-router";

defineOptions({ name: "RegisteredSessions" });

const router = useRouter();
const route = useRoute();
const API = "http://localhost:8082/api";

const auctions = ref([]);
const loading = ref(true);
const error = ref(null);

const page = ref({
  content: [],
  totalElements: 0,
  totalPages: 0,
  number: 0,
  first: true,
  last: true,
});

const size = ref(12);
const sort = ref("thoigianbd,desc");

// Timer cho countdown
const now = ref(Date.now());
let timer = null;

// Quản lý request để tránh race
let abortController = null;
const inFlight = ref(false);

const formatCurrency = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n || 0);

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function shortCountdown(startIso, endIso) {
  if (!startIso || !endIso) return "-";
  const startAt = new Date(startIso).getTime();
  const endAt = new Date(endIso).getTime();
  const nowVal = now.value;
  const pad = (x) => String(Math.max(0, x)).padStart(2, "0");

  if (nowVal < startAt) {
    const diff = Math.max(0, startAt - nowVal);
    const s = Math.floor(diff / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return `${pad(h)}:${pad(m)}:${pad(ss)}`;
  }
  if (nowVal >= startAt && nowVal < endAt) {
    const diff = Math.max(0, endAt - nowVal);
    const s = Math.floor(diff / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return `Đang diễn ra ${pad(h)}:${pad(m)}:${pad(ss)}`;
  }
  return "Đã kết thúc";
}

function firstImage(a) {
  return a?.sanPham?.hinhAnh?.[0] || null;
}
function imageUrl(img) {
  return `${API}/imgs/${img.tenanh}`;
}

// URL tới trang đấu giá
function auctionUrl(id) {
  return router.resolve({ name: "Auction", query: { id } }).href;
}

// Điều hướng + preload
function goAuction(a) {
  router.push({ name: "Auction", query: { id: a.maphiendg } });
}

async function fetchAuctions(pageNumber = 0) {
  // Huỷ request cũ nếu còn
  if (abortController) abortController.abort();
  abortController = new AbortController();

  loading.value = true;
  error.value = null;
  inFlight.value = true;

  try {
    const token = Cookies.get("jwt_token") || Cookies.get("token");
    if (!token) {
      error.value = "Bạn cần đăng nhập.";
      loading.value = false;
      inFlight.value = false;
      return;
    }

    const res = await axios.get(`${API}/auctions/auction-paid`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        page: pageNumber,
        size: size.value,
        sort: sort.value,
        _: Date.now(), // cache-busting
      },
      signal: abortController.signal,
    });

    if (res.data?.code === 200) {
      const result = res.data.result || {};
      page.value = {
        content: result.content || [],
        totalElements: result.totalElements || 0,
        totalPages: result.totalPages || 0,
        number: result.number || 0,
        first: !!result.first,
        last: !!result.last,
      };
      auctions.value = page.value.content;
    } else {
      error.value = res.data?.message || "Yêu cầu thất bại.";
    }
  } catch (err) {
    if (err?.name === "CanceledError" || err?.message === "canceled") {
      // Bị hủy -> bỏ qua
    } else {
      error.value =
        err?.response?.data?.message || err?.message || "Không thể tải dữ liệu.";
    }
  } finally {
    loading.value = false;
    inFlight.value = false;
  }
}

function goTo(n) {
  if (n < 0 || n >= page.value.totalPages) return;
  fetchAuctions(n);
}

// Refetch khi quay lại trang (keep-alive)
onActivated(() => {
  // Chỉ refetch nếu không có request đang chạy
  if (!inFlight.value) {
    fetchAuctions(page.value.number);
  }
});

// Lắng nghe thay đổi query (nếu tương lai có phân trang bằng query)
watch(
  () => route.fullPath,
  () => {
    // route thay đổi nhưng vẫn cùng component -> có thể muốn refetch
    if (!inFlight.value) fetchAuctions(page.value.number);
  }
);

// Event bus: khi trang khác tạo phiên / thanh toán cọc
function onAuctionPaidChanged() {
  // Reset về trang đầu tiên để chắc chắn thấy phiên mới
  fetchAuctions(0);
}
window.addEventListener("auction-paid:changed", onAuctionPaidChanged);

// Visibility (user quay lại tab)
function onVisibility() {
  if (document.visibilityState === "visible" && !inFlight.value) {
    fetchAuctions(page.value.number);
  }
}
document.addEventListener("visibilitychange", onVisibility);

onMounted(() => {
  fetchAuctions(0);
  timer = setInterval(() => (now.value = Date.now()), 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
  window.removeEventListener("auction-paid:changed", onAuctionPaidChanged);
  document.removeEventListener("visibilitychange", onVisibility);
  if (abortController) abortController.abort();
});
</script>

<style scoped>
.image-loading {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #f8fafc 25%, #eef2f7 37%, #f8fafc 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}
@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}
.fade-in {
  animation: fadeIn 0.55s ease;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(6px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
