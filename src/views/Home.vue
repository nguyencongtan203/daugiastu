<template>
  <div class="min-h-screen flex flex-col bg-white text-slate-800">
    <main class="flex-1">
      <!-- HERO -->
      <div
        style="background-image: linear-gradient(rgb(222, 239, 255), rgb(255, 255, 255))"
      >
        <section class="max-w-[1400px] mx-auto px-4 lg:px-6 pt-5 lg:pt-7">
          <div class="grid lg:grid-cols-[2fr_1fr] gap-4">
            <!-- Banner trái -->
            <div class="relative rounded-2xl overflow-hidden ring-1 ring-slate-200">
              <img
                src="/banner.png"
                class="absolute inset-0 w-full h-full object-cover opacity-50"
                alt=""
              />
              <div class="relative p-4 lg:p-6">
                <div class="flex items-center gap-3">
                  <div class="inline-flex items-center gap-2">
                    <span
                      class="inline-flex items-center rounded-full bg-white ring-1 ring-amber-200 px-2 py-1 text-[11px] font-bold text-amber-800 tracking-wide"
                    >
                      HONEST DEALS
                    </span>
                    <span class="hidden sm:inline text-xs text-black-600"
                      >Ưu đãi minh bạch</span
                    >
                  </div>
                  <div
                    class="ml-auto inline-flex items-center gap-2 bg-white/90 backdrop-blur rounded-xl px-2.5 py-1.5 ring-1 ring-slate-200"
                  >
                    <span class="text-[11px] text-slate-500">ĐANG CÓ</span>
                    <span class="text-[13px] font-extrabold text-slate-900 tabular-nums">
                      {{ formatNumber(stats.liveAuctions) }}
                    </span>
                    <span
                      class="text-[11px] font-semibold text-white bg-sky-600 rounded px-1.5 py-0.5"
                      >PHIÊN</span
                    >
                  </div>
                </div>
                <h1
                  class="mt-3 text-[22px] md:text-[26px] lg:text-[30px] font-extrabold text-slate-900 tracking-tight"
                >
                  Sàn đấu giá trực tuyến
                </h1>
                <div class="mt-4 flex flex-wrap items-center gap-3">
                  <a
                    href="#auction-grid"
                    class="inline-flex items-center gap-2 text-white px-4 py-2 rounded-xl shadow-sm bg-[#127fcf] hover:bg-[#1992eb] btn-flash"
                  >
                    Bắt đầu ngay
                  </a>
                </div>
              </div>
            </div>
            <!-- Card phải -->
            <div
              class="relative rounded-2xl ring-1 ring-slate-200 bg-[#0B1B3B] text-white p-5 overflow-hidden"
            >
              <div
                class="absolute -top-12 -right-10 w-44 h-44 bg-sky-500/25 rounded-full"
              />
              <div
                class="absolute -bottom-14 -left-6 w-52 h-52 bg-sky-400/10 rounded-full"
              />
              <div class="relative">
                <div class="text-[13px] text-white/80">DAUGIASTU</div>
                <div class="mt-1 text-[20px] font-bold leading-tight">
                  Website đấu giá tốt nhất
                </div>
                <p class="mt-2 text-white/70 text-sm">
                  Tham gia ngay các phiên sắp bắt đầu và nhận quà tặng cho người mới.
                </p>
                <button
                  class="mt-5 w-full bg-white text-slate-900 hover:bg-slate-100 rounded-xl py-2.5 font-semibold"
                >
                  Xem phiên nổi bật
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Thanh danh mục + tìm kiếm -->
      <section class="max-w-[1400px] mx-auto px-4 lg:px-6 mt-5 relative fade-in">
        <div class="flex flex-wrap items-center gap-3">
          <div class="relative">
            <button class="category-btn" @click="toggleCate">
              <span class="i ph ph-list text-slate-500 mr-2"></span>
              {{ selectedCate?.tendm || "Tất Cả Danh Mục" }}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 transform transition-transform duration-300 relative top-[2px] left-[2px]"
                :class="{ 'rotate-180': showCate }"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <transition name="fade">
              <div
                v-if="showCate"
                ref="cateDropdown"
                class="absolute left-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-50"
              >
                <ul>
                  <li
                    @click="selectCate(null)"
                    class="px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 cursor-pointer"
                  >
                    Tất tất danh mục
                  </li>
                  <li
                    v-for="c in categories"
                    :key="c.madm"
                    @click="selectCate(c)"
                    class="px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 cursor-pointer"
                  >
                    {{ c.tendm }}
                  </li>
                  <li
                    v-if="!categories.length"
                    class="px-4 py-3 text-sm text-slate-500 text-center"
                  >
                    Đang tải...
                  </li>
                </ul>
              </div>
            </transition>
          </div>

          <div class="ml-auto relative">
            <input
              v-model="search"
              type="text"
              class="search-input w-64 md:w-80"
              placeholder="Tìm kiếm sản phẩm"
            />
            <svg
              class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M12.9 14.32a7 7 0 1 1 1.41-1.41l3.38 3.38a1 1 0 0 1-1.42 1.42l-3.37-3.39ZM8 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </section>

      <!-- Tabs lọc thời gian -->
      <section class="max-w-[1400px] mx-auto px-4 lg:px-6 mt-5 fade-in">
        <div class="flex gap-4">
          <button
            v-for="(tab, index) in tabs"
            :key="tab"
            @click="setActiveTab(index)"
            class="tab-btn"
            :class="{ 'tab-btn--active': activeTab === index }"
          >
            <span>{{ tab }}</span>
          </button>
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
            <div class="text" data-text="Đang Tải"></div>
          </div>
        </div>
      </div>

      <div v-else-if="error" class="text-center text-red-500 py-10 font-medium">
        {{ error }}
      </div>

      <!-- Grid phiên đấu giá -->
      <section
        id="auction-grid"
        class="max-w-[1400px] mx-auto px-4 lg:px-6 py-6 lg:py-7 fade-in"
        v-else
      >
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <article
            v-for="it in filteredPageContent"
            :key="it.id"
            class="card relative rounded-[22px] border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col cursor-pointer"
            @click.prevent="goAuctionDetail(it.id)"
          >
            <div class="p-4">
              <div
                class="h-60 rounded-xl bg-white ring-1 ring-slate-100 flex items-center justify-center overflow-hidden relative image-wrap"
              >
                <!-- Skeleton -->
                <div v-if="imgState[it.id] !== 'loaded'" class="image-loading"></div>

                <!-- Ảnh thực -->
                <img
                  v-if="it.image"
                  :src="it.image"
                  :alt="it.title"
                  class="object-contain max-h-full relative z-[1]"
                  loading="lazy"
                  @load="onImgLoad(it.id)"
                  @error="onImgError(it.id)"
                />

                <!-- Timer -->
                <div class="image-timer">
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
                    shortCountdown(it.startAt, it.endAt)
                  }}</span>
                </div>
              </div>
            </div>

            <div class="px-5">
              <h3 class="font-bold text-[19px] leading-snug clamp-2 min-h-[44px]">
                {{ it.title }}
              </h3>
            </div>

            <div class="px-5 pt-3 pb-5 flex-1 flex flex-col">
              <div class="meta-grid-2">
                <div class="label">Giá khởi điểm:</div>
                <div class="value text-sky-700">{{ formatVND(it.priceStartVnd) }}</div>
                <div class="label">Thời gian bắt đầu:</div>
                <div class="value">{{ viTime(it.startAt) }}</div>
              </div>

              <button
                class="mt-5 w-full text-white py-2 rounded-xl font-semibold inline-flex items-center justify-center gap-2 bg-[#127fcf] hover:bg-[#1992eb] btn-flash"
                @click.prevent="goAuctionDetail(it.id)"
              >
                ĐĂNG KÝ NGAY
              </button>
            </div>
          </article>
        </div>
      </section>

      <!-- PHÂN TRANG (Server-side) -->
      <div
        style="background-image: linear-gradient(rgb(255, 255, 255), rgb(239, 247, 255))"
      >
        <section class="max-w-[1400px] mx-auto px-6 lg:px-8 py-6 lg:py-8">
          <div
            class="mt-8 flex flex-col items-center gap-3 md:flex-row md:items-center md:justify-center"
          >
            <nav
              class="flex items-center gap-2"
              role="navigation"
              aria-label="Pagination"
            >
              <button class="page-pill" @click="prevPage" :disabled="!canPrev">
                ‹ Back
              </button>
              <button
                v-for="n in numericPages"
                :key="n"
                class="page-num"
                :class="n === page ? 'page-num--active' : ''"
                @click="goTo(n)"
              >
                {{ n }}
              </button>
              <button class="page-pill" @click="nextPage" :disabled="!canNext">
                Next ›
              </button>
            </nav>
            <div class="text-xs text-slate-500 mt-1">
              Trang {{ page }} / {{ totalPages }}
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
function goAuctionDetail(id) {
  router.push({ name: "AuctionDetail", params: { id } });
}

/* Supabase image builder */
const SUPABASE_URL = 'https://gcxlqxkowwkdhyiyjaks.supabase.co' // Thay bằng URL project thật nếu khác
function buildImageUrl(key) {
  if (!key) return '/placeholder.png'
  return SUPABASE_URL.replace(/\/+$/, '') + '/storage/v1/object/public/' + key
}

/* Helpers */
const formatNumber = (num) =>
  num == null || isNaN(num) ? "0" : num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const formatVND = (n) =>
  `${new Intl.NumberFormat("vi-VN").format(Math.round(n || 0))} VNĐ`;
const viTime = (ts) => {
  const d = new Date(ts);
  return `${d.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })} - ${d.toLocaleDateString("vi-VN")}`;
};
const shortCountdown = (startAt, endAt) => {
  const nowVal = now.value;
  const pad = (x) => String(x).padStart(2, "0");
  if (nowVal < startAt) {
    const diff = startAt - nowVal;
    const s = Math.floor(diff / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return `${pad(h)}:${pad(m)}:${pad(ss)}`;
  }
  if (nowVal >= startAt && nowVal < endAt) {
    const diff = endAt - nowVal;
    const s = Math.floor(diff / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return `Đang diễn ra ${pad(h)}:${pad(m)}:${pad(ss)}`;
  }
  return "Đã kết thúc";
};
function parseDateTime(str) {
  if (!str) return Date.now();
  return new Date(str).getTime();
}
function extractErrorMessage(err) {
  if (err?.response?.data?.message) return err.response.data.message;
  if (typeof err?.response?.data === "string") return err.response.data;
  return err?.message || "Lỗi kết nối đến máy chủ!";
}

/* State */
const search = ref("");
const now = ref(Date.now());
const stats = reactive({ liveAuctions: 0 });

/* Danh mục */
const categories = ref([]);
const showCate = ref(false);
const cateDropdown = ref(null);
const selectedCate = ref(null);

const toggleCate = () => (showCate.value = !showCate.value);
const closeCate = () => (showCate.value = false);
const selectCate = (cate) => {
  selectedCate.value = cate;
  closeCate();
};
const onClickOutside = (e) => {
  if (
    showCate.value &&
    cateDropdown.value &&
    !cateDropdown.value.contains(e.target) &&
    !e.target.closest(".category-btn")
  ) {
    closeCate();
  }
};
onMounted(() => document.addEventListener("click", onClickOutside));
onUnmounted(() => document.removeEventListener("click", onClickOutside));

/* Tabs lọc thời gian */
const tabs = ["Hôm nay", "Tuần này", "Tháng này"];
const activeTab = ref(0);

function getDateRange(tabIndex) {
  const now = new Date();
  let start, end;
  if (tabIndex === 0) {
    // Hôm nay
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  } else if (tabIndex === 1) {
    // Tuần này
    const day = now.getDay(); // 0 = Chủ nhật
    const monday = new Date(now);
    monday.setDate(now.getDate() - day + (day === 0 ? -6 : 1)); // Thứ 2
    monday.setHours(0, 0, 0, 0);
    start = monday;
    end = new Date(monday);
    end.setDate(monday.getDate() + 7);
  } else if (tabIndex === 2) {
    // Tháng này
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }
  return {
    startDateFrom: start.getTime(),
    startDateTo: end.getTime() - 1,
  };
}

function setActiveTab(index) {
  activeTab.value = index;
  page.value = 1; // Reset về trang 1
  fetchAuctions();
}

/* API base */
const API = "https://daugiabe-production.up.railway.app/api";

/* Image state */
const imgState = reactive({});

/* Loading/Error */
const loading = ref(true);
const error = ref(null);

/* Server-side pagination states */
const page = ref(1);
const pageSize = ref(8);
const totalPages = ref(1);
const pageContent = ref([]);

/* Fetch categories */
async function fetchCategories() {
  try {
    const res = await axios.get(`${API}/cates/find-all`);
    if (res.data?.code === 200) {
      categories.value = res.data.result || [];
    } else {
      categories.value = [];
      if (res.data?.message) console.warn(res.data.message);
    }
  } catch (err) {
    console.error("Lỗi tải danh mục:", err);
  }
}

/* Fetch auctions */
async function fetchAuctions() {
  try {
    loading.value = true;
    error.value = null;

    const params = new URLSearchParams();
    params.append("statuses", "NOT_STARTED");
    params.append("page", page.value - 1);
    params.append("size", pageSize.value);
    params.append("sort", "thoigianbd,asc");

    // Thêm filter thời gian dựa trên tab
    const { startDateFrom, startDateTo } = getDateRange(activeTab.value);
    params.append("startDateFrom", startDateFrom);
    params.append("startDateTo", startDateTo);
    if (search.value.trim()) params.append("keyword", search.value.trim());
    if (selectedCate.value) params.append("cateId", selectedCate.value.madm);
    const url = `${API}/auctions/find-filtered?${params.toString()}`;
    const res = await axios.get(url);

    if (res.data?.code === 200 && res.data.result) {
      const pg = res.data.result;
      totalPages.value = pg.totalPages || 1;

      pageContent.value = (pg.content || []).map((it) => {
        const imgSrc = it.sanPham?.hinhAnh?.[0]?.tenanh
          ? buildImageUrl(it.sanPham.hinhAnh[0].tenanh)
          : null;
        const item = {
          id: it.maphiendg,
          title: it.sanPham?.tensp || "Không rõ tên sản phẩm",
          image: imgSrc,
          startAt: parseDateTime(it.thoigianbd),
          endAt: parseDateTime(it.thoigiankt),
          priceStartVnd: it.giakhoidiem || 0,
          cateId: it.sanPham?.danhMuc?.madm ?? it.sanPham?.madm ?? null,
          cateName: it.sanPham?.danhMuc?.tendm || "Khác",
        };
        if (imgSrc) {
          const img = new Image();
          img.onload = () => (imgState[item.id] = "loaded");
          img.onerror = () => (imgState[item.id] = "error");
          img.src = imgSrc;
          imgState[item.id] = "loading"; // Tạm thời loading
        } else {
          imgState[item.id] = "error";
        }
        return item;
      });

      stats.liveAuctions = pg.totalElements ?? (pg.content?.length || 0);
    } else {
      pageContent.value = [];
      totalPages.value = 1;
      stats.liveAuctions = 0;
      error.value = res.data?.message || null;
    }
  } catch (err) {
    console.error("Lỗi tải phiên:", err);
    error.value = extractErrorMessage(err) || "Không thể tải danh sách phiên đấu giá.";
  } finally {
    loading.value = false;
  }
}

/* Image handlers */
function onImgLoad(id) {
  imgState[id] = "loaded";
}
function onImgError(id) {
  imgState[id] = "error";
}

/* Lifecycle */
let timer = null;
onMounted(() => {
  fetchAuctions();
  fetchCategories();
  timer = setInterval(() => (now.value = Date.now()), 1000);
});
onUnmounted(() => {
  clearInterval(timer);
});

/* Filtering trên content của trang hiện tại - Bỏ filter client vì server đã filter */
const filteredPageContent = computed(() => pageContent.value);

/* Pagination controls */
const canPrev = computed(() => page.value > 1);
const canNext = computed(() => page.value < totalPages.value);
function goTo(n) {
  const safe = Math.min(Math.max(1, n), totalPages.value);
  if (safe !== page.value) {
    page.value = safe;
    fetchAuctions();
    scrollToGrid();
  }
}
function prevPage() {
  if (canPrev.value) goTo(page.value - 1);
}
function nextPage() {
  if (canNext.value) goTo(page.value + 1);
}
function scrollToGrid() {
  const el = document.getElementById("auction-grid");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}
const numericPages = computed(() => {
  const total = totalPages.value;
  const p = page.value;
  const windowSize = 3;
  let start = Math.max(1, p - Math.floor(windowSize / 2));
  let end = start + windowSize - 1;
  if (end > total) {
    end = total;
    start = Math.max(1, end - windowSize + 1);
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

/* Reset về trang 1 khi đổi filter */
const searchTimeout = ref(null);
watch(search, () => {
  if (searchTimeout.value) clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(() => {
    page.value = 1;
    fetchAuctions();
  }, 700); // Debounce 700ms để tránh gọi API quá nhiều
});
watch(selectedCate, () => {
  page.value = 1;
  fetchAuctions();
});
watch(activeTab, () => {
  page.value = 1;
  fetchAuctions();
});
</script>


<style scoped>
@import "@/assets/styles/home.css";

@media (max-width: 768px) {
  .category-btn {
    width: 100%;
  }
  .search-input {
    width: 100% !important;
  }
}
</style>