<template >
  <div class="max-w-[1400px] mx-auto px-4 lg:px-6 mt-5 relative" >
    <!-- Toolbar -->
    <div
      class="toolbar flex flex-wrap items-center gap-3 justify-center max-w-[1200px] mx-auto border-b border-slate-200"
    >
      <!-- Ô tìm kiếm -->
      <div class="relative flex-1 min-w-[200px] max-w-md">
        <input
          v-model="search"
          type="text"
          class="search-input w-full"
          placeholder="Ví dụ: Chung cư"
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

      <!-- Danh mục -->
      <div class="relative">
        <button ref="cateBtn" class="category-btn" @click="toggleCate">
          <span class="i ph ph-list text-slate-500 mr-2"></span>
          {{ selectedCate?.tendm || "Danh mục" }}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 transform transition-transform duration-300 relative top-[1px] left-[2px]"
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
        <!-- Dropdown danh mục -->
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

      <!-- Khu vực -->
      <div class="relative">
        <button ref="regionBtn" class="category-btn" @click="toggleRegion">
          {{ regionLabel || "Khu vực" }}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 transform transition-transform duration-300 relative top-[1px] left-[2px]"
            :class="{ 'rotate-180': showRegion }"
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
        <!-- Dropdown khu vực -->
        <transition name="fade">
          <ul
            v-if="showRegion"
            ref="regionDropdown"
            class="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50"
          >
            <li
              @click="selectRegion(null)"
              class="px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 cursor-pointer"
            >
              Tất tất tỉnh thành
            </li>
            <li
              v-for="tp in cities"
              :key="tp.matp"
              @click="selectRegion(tp)"
              class="px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 cursor-pointer"
            >
              {{ tp.tentp }}
            </li>
            <li
              v-if="!cities.length"
              class="px-4 py-3 text-sm text-slate-500 text-center"
            >
              Đang tải...
            </li>
          </ul>
        </transition>
      </div>

      <!-- Mức giá -->
      <div class="relative">
        <button ref="priceBtn" class="category-btn" @click="togglePrice">
          {{ priceLabel || "Mức giá" }}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 transform transition-transform duration-300 relative top-[1px] left-[2px]"
            :class="{ 'rotate-180': showPrice }"
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
        <!-- Dropdown mức giá -->
        <transition name="fade">
          <ul
            v-if="showPrice"
            ref="priceDropdown"
            class="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50"
          >
            <li
              @click="setPrice(null, null)"
              class="px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 cursor-pointer"
            >
              Tất tất mức giá
            </li>
            <li
              @click="setPrice(1000000000, null)"
              class="px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 cursor-pointer"
            >
              Trên 1 tỷ
            </li>
            <li
              @click="setPrice(500000000, 1000000000)"
              class="px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 cursor-pointer"
            >
              Từ 500 triệu đến 1 tỷ
            </li>
            <li
              @click="setPrice(null, 500000000)"
              class="px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 cursor-pointer"
            >
              Dưới 500 triệu
            </li>
          </ul>
        </transition>
      </div>

      <!-- Thời gian -->
      <div class="relative">
        <button ref="dateBtn" class="category-btn" @click="toggleDate">
          {{ dateLabel || "Thời gian" }}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 transform transition-transform duration-300 relative top-[1px] left-[2px]"
            :class="{ 'rotate-180': showDate }"
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
        <!-- Dropdown thời gian -->
        <transition name="fade">
          <div
            v-if="showDate"
            ref="dateDropdown"
            class="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-4"
          >
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Từ ngày</label>
                <input
                  v-model="dateRange.from"
                  type="date"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Đến ngày</label>
                <input
                  v-model="dateRange.to"
                  type="date"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
              <button
                @click="applyDateFilter"
                class="w-full bg-[#127fcf] hover:bg-[#1992eb] btn-flash text-white py-2 rounded-lg font-medium"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Bộ lọc trạng thái -->
    <div class="flex gap-3 mt-4 mx-auto max-w-[1200px]">
      <button
        class="tab-btn"
        :class="statusFilter === 'upcoming' ? 'tab-btn--active' : ''"
        @click="changeStatusFilter('upcoming')"
      >
        <span>Sắp diễn ra</span>
      </button>

      <button
        class="tab-btn"
        :class="statusFilter === 'ongoing' ? 'tab-btn--active' : ''"
        @click="changeStatusFilter('ongoing')"
      >
        <span>Đang diễn ra</span>
      </button>

      <button
        class="tab-btn"
        :class="statusFilter === 'ended' ? 'tab-btn--active' : ''"
        @click="changeStatusFilter('ended')"
      >
        <span>Đã kết thúc</span>
      </button>
    </div>

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

    <!-- Content -->
    <div v-else class="content">
      <section
        id="auction-grid"
        class="max-w-[1400px] mx-auto px-4 lg:px-6 py-6 lg:py-7 fade-in"
      >
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <article
            v-for="it in filteredPageContent"
            :key="it.id"
            class="card relative rounded-[22px] border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col cursor-pointer fade-in"
            @click.prevent="goAuctionDetail(it.id)"
          >
            <!-- Ảnh và timer -->
            <div class="p-4">
              <div
                class="h-60 rounded-xl bg-white ring-1 ring-slate-100 flex items-center justify-center overflow-hidden relative image-wrap"
              >
                <div v-if="imgState[it.id] !== 'loaded'" class="image-loading"></div>
                <img
                  v-if="it.image"
                  :src="it.image"
                  :alt="it.title"
                  class="object-contain max-h-full relative z-[1]"
                  loading="lazy"
                  @load="onImgLoad(it.id)"
                  @error="onImgError(it.id)"
                />
                <div class="image-timer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
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
                    />
                    <path
                      d="M8 3.2a4.8 4.8 0 1 1 0 9.6.8.8 0 1 0 0 1.6A6.4 6.4 0 0 0 14.4 8 6.4 6.4 0 0 0 8 1.6a.8.8 0 1 0 0 1.6"
                      transform="translate(-1.6 -1.6)"
                      style="fill: currentcolor"
                    />
                    <path
                      d="M5.2 13.65a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6M3.151 11.6a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6M2.4 8.8a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6M3.151 6a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6M5.2 3.95a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6"
                      transform="translate(-1.6 -1.6)"
                      style="fill-rule: nonzero; fill: currentcolor"
                    />
                  </svg>
                  <span class="tabular-nums">{{
                    shortCountdown(it.startAt, it.endAt)
                  }}</span>
                </div>
              </div>
            </div>
            <!-- Tiêu đề -->
            <div class="px-5">
              <h3 class="font-bold text-[19px] leading-snug clamp-2 min-h-[44px]">
                {{ it.title }}
              </h3>
            </div>
            <!-- Meta info và nút -->
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
    </div>
  </div>

  <!-- Phân trang -->
  <div style="background-image: linear-gradient(rgb(255, 255, 255), rgb(239, 247, 255))">
    <section class="max-w-[1400px] mx-auto px-6 lg:px-8 py-6 lg:py-8">
      <div
        class="mt-8 flex flex-col items-center gap-3 md:flex-row md:items-center md:justify-center"
      >
        <nav class="flex items-center gap-2" role="navigation" aria-label="Pagination">
          <button class="page-pill" @click="prevPage" :disabled="!canPrev">‹ Back</button>
          <button
            v-for="n in numericPages"
            :key="n"
            class="page-num"
            :class="n === page ? 'page-num--active' : ''"
            @click="goTo(n)"
          >
            {{ n }}
          </button>
          <button class="page-pill" @click="nextPage" :disabled="!canNext">Next ›</button>
        </nav>
        <div class="text-xs text-slate-500 mt-2">Trang {{ page }} / {{ totalPages }}</div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const API = "http://localhost:8082/api";

// Reactive state: State chính của component
const search = ref("");
const categories = ref([]);
const cities = ref([]);
const selectedCate = ref(null);
const selectedRegion = ref(null);

const showCate = ref(false);
const showRegion = ref(false);
const showPrice = ref(false);
const showDate = ref(false);

const cateBtn = ref(null);
const cateDropdown = ref(null);
const regionBtn = ref(null);
const regionDropdown = ref(null);
const priceBtn = ref(null);
const priceDropdown = ref(null);
const dateBtn = ref(null);
const dateDropdown = ref(null);

const priceRange = reactive({ min: null, max: null });
const dateRange = reactive({ from: "", to: "" });

const page = ref(1);
const pageSize = ref(12);
const totalPages = ref(1);

const now = ref(Date.now());
const pageContent = ref([]);
const router = useRouter();
const statusFilter = ref("upcoming"); // upcoming | ongoing | ended
const imgState = reactive({});
const loading = ref(true);
const error = ref(null);

// Computed: Các giá trị tính toán dựa trên state
const filteredPageContent = computed(() => {
  return pageContent.value;
});

const canPrev = computed(() => page.value > 1);
const canNext = computed(() => page.value < totalPages.value);
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

const regionLabel = computed(() => selectedRegion.value?.tentp || "");
const priceLabel = computed(() => {
  if (!priceRange.min && !priceRange.max) return "";
  if (priceRange.min && !priceRange.max) return "Trên 1 tỷ";
  if (priceRange.min && priceRange.max) return "Từ 500 triệu đến 1 tỷ";
  if (!priceRange.min && priceRange.max) return "Dưới 500 triệu";
  return "";
});
const dateLabel = computed(() => {
  if (dateRange.from && dateRange.to) {
    return `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`;
  }
  if (dateRange.from) return `Từ ${formatDate(dateRange.from)}`;
  if (dateRange.to) return `Hiện tại - Đến ${formatDate(dateRange.to)}`;
  return "";
});

// Watch: Theo dõi thay đổi để refetch dữ liệu
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
watch(selectedRegion, () => {
  page.value = 1;
  fetchAuctions();
});
watch(
  priceRange,
  () => {
    page.value = 1;
    fetchAuctions();
  },
  { deep: true }
);
watch(
  dateRange,
  () => {
    page.value = 1;
    fetchAuctions();
  },
  { deep: true }
);
watch(statusFilter, () => {
  page.value = 1;
  fetchAuctions();
});

// Functions
// Helpers
const getImageUrl = (tenanh) => `${API}/imgs/${tenanh}`;
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
const parseDateTime = (str) => new Date(str).getTime() || Date.now();
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

function extractErrorMessage(err) {
  if (err?.response?.data?.message) return err.response.data.message;
  if (typeof err?.response?.data === "string") return err.response.data;
  return err?.message || "Lỗi kết nối đến máy chủ!";
}

// Map statusFilter
function buildStatusEnums() {
  switch (statusFilter.value) {
    case "upcoming":
      return ["NOT_STARTED"];
    case "ongoing":
      return ["IN_PROGRESS"];
    case "ended":
      return ["SUCCESS"];
    default:
      return ["NOT_STARTED", "IN_PROGRESS", "SUCCESS"];
  }
}

// Countdown
const shortCountdown = (startAt, endAt) => {
  const nowVal = now.value;
  const pad = (x) => String(x).padStart(2, "0");
  if (nowVal < startAt) {
    const diff = startAt - nowVal;
    const totalS = Math.floor(diff / 1000);
    const h = Math.floor(totalS / 3600);
    const m = Math.floor((totalS % 3600) / 60);
    const s = totalS % 60;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }
  if (nowVal >= startAt && nowVal < endAt) {
    const diff = endAt - nowVal;
    const totalS = Math.floor(diff / 1000);
    const h = Math.floor(totalS / 3600);
    const m = Math.floor((totalS % 3600) / 60);
    const s = totalS % 60;
    return `Đang diễn ra ${pad(h)}:${pad(m)}:${pad(s)}`;
  }
  return "Đã kết thúc";
};

// Fetch dữ liệu từ server với filter
async function fetchAuctions() {
  try {
    loading.value = true;
    error.value = null;

    const params = new URLSearchParams();
    const statuses = buildStatusEnums();
    statuses.forEach((s) => params.append("statuses", s));
    if (search.value.trim()) params.append("keyword", search.value.trim());
    if (selectedCate.value) params.append("cateId", selectedCate.value.madm);
    if (selectedRegion.value) params.append("regionId", selectedRegion.value.matp);
    if (priceRange.min) params.append("minPrice", priceRange.min);
    if (priceRange.max) params.append("maxPrice", priceRange.max);
    if (dateRange.from)
      params.append("startDateFrom", new Date(dateRange.from).getTime());
    if (dateRange.to)
      params.append(
        "startDateTo",
        new Date(new Date(dateRange.to).setHours(23, 59, 59, 999)).getTime()
      );
    params.append("page", page.value - 1); // BE 0-based
    params.append("size", pageSize.value);
    params.append("sort", "thoigianbd,asc");

    const url = `${API}/auctions/find-filtered?${params.toString()}`;
    const res = await axios.get(url);

    if (res.data?.code === 200 && res.data.result) {
      const pg = res.data.result;
      totalPages.value = pg.totalPages || 1;

      pageContent.value = (pg.content || []).map((it) => {
        const src = it.sanPham?.hinhAnh?.[0]?.tenanh
          ? getImageUrl(it.sanPham.hinhAnh[0].tenanh)
          : null;
        const item = {
          id: it.maphiendg,
          title: it.sanPham?.tensp || "Không rõ tên",
          image: src,
          startAt: parseDateTime(it.thoigianbd),
          endAt: parseDateTime(it.thoigiankt),
          priceStartVnd: it.giakhoidiem || 0,
          cateId: it.sanPham?.danhMuc?.madm ?? it.sanPham?.madm ?? null,
          region: it.sanPham?.thanhPho?.matp ?? null,
        };
        imgState[item.id] = src ? "loading" : "error";
        return item;
      });
    } else {
      pageContent.value = [];
      totalPages.value = 1;
      error.value = res.data?.message || null;
    }
  } catch (err) {
    error.value = extractErrorMessage(err) || "Không thể tải danh sách phiên đấu giá.";
  } finally {
    loading.value = false;
  }
}

// danh mục và tỉnh/thành
async function fetchCategories() {
  try {
    const res = await axios.get(`${API}/cates/find-all`);
    if (res.data?.code === 200) categories.value = res.data.result || [];
  } catch (err) {
    console.error("Lỗi tải danh mục:", err);
  }
}
async function fetchCities() {
  try {
    const res = await axios.get(`${API}/cities/find-all`);
    if (res.data?.code === 200) cities.value = res.data.result || [];
  } catch (err) {
    console.error("Lỗi tải tỉnh/thành:", err);
  }
}

// Phân trang
function goTo(n) {
  const safe = Math.min(Math.max(1, n), totalPages.value);
  if (safe !== page.value) {
    page.value = safe;
    fetchAuctions();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
function prevPage() {
  if (canPrev.value) goTo(page.value - 1);
}
function nextPage() {
  if (canNext.value) goTo(page.value + 1);
}

// Dropdown toggles: Mở/đóng dropdown
const toggleCate = () => (showCate.value = !showCate.value);
const toggleRegion = () => (showRegion.value = !showRegion.value);
const togglePrice = () => (showPrice.value = !showPrice.value);
const toggleDate = () => (showDate.value = !showDate.value);

// Select filter: Chọn giá trị lọc và reset trang
const selectCate = (cate) => {
  selectedCate.value = cate;
  showCate.value = false;
  resetToFirstPage();
};
const selectRegion = (val) => {
  selectedRegion.value = val;
  showRegion.value = false;
  resetToFirstPage();
};
const setPrice = (min, max) => {
  priceRange.min = min;
  priceRange.max = max;
  showPrice.value = false;
  resetToFirstPage();
};
const applyDateFilter = () => {
  showDate.value = false;
  resetToFirstPage();
  fetchAuctions();
};

function changeStatusFilter(val) {
  if (statusFilter.value !== val) {
    statusFilter.value = val;
    resetToFirstPage();
    fetchAuctions();
  }
}

function resetToFirstPage() {
  page.value = 1;
}

// Click ngoài để đóng dropdown
const handleClickOutside = (event) => {
  const path = event.composedPath ? event.composedPath() : [];
  if (
    showCate.value &&
    !path.includes(cateBtn.value) &&
    !path.includes(cateDropdown.value)
  )
    showCate.value = false;
  if (
    showRegion.value &&
    !path.includes(regionBtn.value) &&
    !path.includes(regionDropdown.value)
  )
    showRegion.value = false;
  if (
    showPrice.value &&
    !path.includes(priceBtn.value) &&
    !path.includes(priceDropdown.value)
  )
    showPrice.value = false;
  if (
    showDate.value &&
    !path.includes(dateBtn.value) &&
    !path.includes(dateDropdown.value)
  )
    showDate.value = false;
};

// Ảnh: Xử lý load/error ảnh
function onImgLoad(id) {
  imgState[id] = "loaded";
}
function onImgError(id) {
  imgState[id] = "error";
}

function goAuctionDetail(id) {
  router.push({ name: "AuctionDetail", params: { id } });
}

// Lifecycle
let timer = null;
onMounted(() => {
  fetchAuctions();
  fetchCategories();
  fetchCities();
  document.addEventListener("click", handleClickOutside);
  timer = setInterval(() => (now.value = Date.now()), 1000);
});
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  clearInterval(timer);
});
</script>

<style scoped>
@import "@/assets/styles/pdg.css";
/* Giữ nguyên các style cũ */
</style>