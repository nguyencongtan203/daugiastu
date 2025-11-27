<template>
  <div
    class="min-h-screen product-mana px-4 py-8 bg-gradient-to-b from-slate-50 to-white fade-in"
  >
    <!-- Tabs -->
    <div
      class="menu flex flex-wrap gap-3 mb-6 border-b border-slate-200 pb-3 max-w-[1024px] mx-auto"
    >
      <button
        :class="{ 'tab-btn--active': activeTab === 'deposit' }"
        @click="activeTab = 'deposit'"
        class="tab-btn group"
      >
        <span>Thanh toán tiền cọc</span>
      </button>
      <button
        :class="{ 'tab-btn--active': activeTab === 'win' }"
        @click="activeTab = 'win'"
        class="tab-btn group"
      >
        <span>Thanh toán thắng phiên</span>
      </button>
    </div>

    <!-- TAB: TIỀN CỌC -->
    <div v-if="activeTab === 'deposit'" class="fade-in max-w-[1024px] mx-auto">
      <!-- Sub-tabs -->
      <div class="sub-menu flex flex-wrap gap-3 mb-6 border-b border-slate-200 pb-3">
        <button
          :class="{ 'tab-btn--active': activeSubTab === 'UNPAID' }"
          @click="changeSubTab('UNPAID')"
          class="sub-tab-btn group"
        >
          <span>Chưa thanh toán</span>
        </button>
        <button
          :class="{ 'tab-btn--active': activeSubTab === 'PAID' }"
          @click="changeSubTab('PAID')"
          class="sub-tab-btn group"
        >
          <span>Đã thanh toán</span>
        </button>
      </div>

      <div class="mb-2">
        <span
          v-if="inFlight"
          class="inline-flex items-center text-[11px] px-2 py-1 rounded bg-sky-100 text-sky-700"
          >Đang cập nhật...</span
        >
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

      <div v-else>
        <div v-for="item in deposits" :key="item.matc" class="deposit-card group fade-in">
          <div class="card-main">
            <div class="card-lines">
              <div class="line">
                <span class="label">Mã phiếu</span>
                <span class="value mono-tag">{{ item.matc }}</span>
              </div>
              <div class="line">
                <span class="label">Phiên đấu giá</span>
                <span class="value mono-tag">{{ item.phienDauGia.maphiendg }}</span>
              </div>
              <div class="line">
                <span class="label">Tiền cọc</span>
                <span class="value strong text-sky-700">{{
                  formatCurrency(item.phienDauGia.tiencoc)
                }}</span>
              </div>
              <div class="line">
                <span class="label">Hạn thanh toán</span>
                <span class="value">{{ formatDate(item.thoigianthanhtoan) }}</span>
              </div>
              <div class="line">
                <span class="label">Trạng thái</span>
                <span :class="['status-pill', softStatus(item.trangthai)]">
                  {{ item.trangthai }}
                </span>
              </div>
            </div>
          </div>

          <div class="card-actions">
            <button
              v-if="item.trangthai === 'Chưa thanh toán' && !payingItems[item.matc]"
              @click="handlePay(item)"
              class="inline-flex items-center bg-[#127fcf] hover:bg-[#1992eb] text-white px-4 py-2 rounded-xl font-semibold btn-flash"
            >
              Thanh toán
            </button>
            <button v-else-if="payingItems[item.matc]" disabled class="soft-btn disabled">
              Đang chuyển hướng...
            </button>
          </div>
        </div>
      </div>

      <!-- Pager -->
      <div v-if="depositTotalPages > 1" class="pager">
        <button class="pager-btn" @click="prevPage" :disabled="depositPage <= 1">
          ‹ Prev
        </button>
        <span class="pager-info">
          Trang <strong>{{ depositPage }}</strong> / {{ depositTotalPages }}
        </span>
        <button
          class="pager-btn"
          @click="nextPage"
          :disabled="depositPage >= depositTotalPages"
        >
          Next ›
        </button>
      </div>
    </div>

    <!-- TAB: THẮNG PHIÊN -->
    <div v-else class="fade-in max-w-[1024px] mx-auto">
      <!-- Sub-tabs -->
      <div class="sub-menu flex flex-wrap gap-3 mb-6 border-b border-slate-200 pb-3">
        <button
          :class="{ 'tab-btn--active': activeWinSubTab === 'UNPAID' }"
          @click="changeWinSubTab('UNPAID')"
          class="sub-tab-btn group"
        >
          <span>Chưa thanh toán</span>
        </button>
        <button
          :class="{ 'tab-btn--active': activeWinSubTab === 'PAID' }"
          @click="changeWinSubTab('PAID')"
          class="sub-tab-btn group"
        >
          <span>Đã thanh toán</span>
        </button>
      </div>

      <div class="mb-2">
        <span
          v-if="winInFlight"
          class="inline-flex items-center text-[11px] px-2 py-1 rounded bg-sky-100 text-sky-700"
          >Đang cập nhật...</span
        >
      </div>

      <!-- Loading / Error -->
      <div v-if="winLoading" class="flex justify-center items-center py-12 fade-in">
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

      <div v-else-if="winError" class="text-center text-red-500 py-10 font-medium">
        {{ winError }}
      </div>

      <div v-else>
        <div v-for="item in wins" :key="item.matt" class="deposit-card group fade-in">
          <div class="card-main">
            <div class="card-lines">
              <div class="line">
                <span class="label">Mã phiếu</span>
                <span class="value mono-tag">{{ item.matt }}</span>
              </div>
              <div class="line">
                <span class="label">Phiên đấu giá</span>
                <span class="value mono-tag">{{ item.phienDauGia.maphiendg }}</span>
              </div>
              <div class="line">
                <span class="label">Giá thắng</span>
                <span class="value strong text-sky-700">{{
                  formatCurrency(item.sotien)
                }}</span>
              </div>
              <div class="line">
                <span class="label">Hạn thanh toán</span>
                <span class="value">{{ formatDate(item.thoigianthanhtoan) }}</span>
              </div>
              <div class="line">
                <span class="label">Trạng thái</span>
                <span :class="['status-pill', softStatus(item.trangthai)]">
                  {{ item.trangthai }}
                </span>
              </div>
            </div>
          </div>

          <div class="card-actions">
            <button
              v-if="item.trangthai === 'Chưa thanh toán' && !payingWinItems[item.matt]"
              @click="handleWinPay(item)"
              class="inline-flex items-center bg-[#127fcf] hover:bg-[#1992eb] text-white px-4 py-2 rounded-xl font-semibold btn-flash"
            >
              Thanh toán
            </button>
            <button
              v-else-if="payingWinItems[item.matt]"
              disabled
              class="soft-btn disabled"
            >
              Đang chuyển hướng...
            </button>
          </div>
        </div>
      </div>

      <!-- Pager -->
      <div v-if="winTotalPages > 1" class="pager">
        <button class="pager-btn" @click="prevWinPage" :disabled="winPage <= 1">
          ‹ Prev
        </button>
        <span class="pager-info">
          Trang <strong>{{ winPage }}</strong> / {{ winTotalPages }}
        </span>
        <button
          class="pager-btn"
          @click="nextWinPage"
          :disabled="winPage >= winTotalPages"
        >
          Next ›
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated, onUnmounted, watch } from "vue";
import axios from "axios";
import Cookies from "js-cookie";

defineOptions({ name: "DepositPayments" });

const API = "http://localhost:8082/api";
const deposits = ref([]);
const wins = ref([]); // Thêm cho win
const loading = ref(true);
const winLoading = ref(false); // Thêm cho win
const error = ref(null);
const winError = ref(null); // Thêm cho win
const activeTab = ref("deposit");
const activeSubTab = ref("UNPAID");
const activeWinSubTab = ref("UNPAID"); // Thêm cho win
const inFlight = ref(false);
const winInFlight = ref(false); // Thêm cho win
const payingItems = ref({});
const payingWinItems = ref({}); // Thêm cho win
const depositPage = ref(1);
const winPage = ref(1); // Thêm cho win
const depositPageSize = ref(20);
const winPageSize = ref(20); // Thêm cho win
const depositTotalPages = ref(1);
const winTotalPages = ref(1); // Thêm cho win

let abortController = null;
let winAbortController = null; // Thêm cho win
let visibilityHandlerAdded = false;

const formatCurrency = (n) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(n || 0);

const formatDate = (iso) => {
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
};

function softStatus(status) {
  switch (status) {
    case "Chưa thanh toán":
      return "pill-amber";
    case "Đã thanh toán":
      return "pill-green";
    case "Hủy":
    case "Đã hủy":
      return "pill-red";
    default:
      return "pill-gray";
  }
}

async function fetchDeposits() {
  if (activeTab.value !== "deposit") return;
  loading.value = deposits.value.length === 0;
  error.value = null;
  inFlight.value = true;
  if (abortController) abortController.abort();
  abortController = new AbortController();

  try {
    const token = Cookies.get("jwt_token") || Cookies.get("token");
    if (!token) {
      error.value = "Bạn cần đăng nhập để xem phiếu thanh toán.";
      return;
    }

    const res = await axios.get(`${API}/deposit-payments/find-by-user-and-status`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        status: activeSubTab.value,
        page: depositPage.value - 1,
        size: depositPageSize.value,
        sort: "thoigianthanhtoan,asc",
      },
      signal: abortController.signal,
    });

    if (res.data.code === 200) {
      const page = res.data.result;
      deposits.value = page.content || [];
      depositTotalPages.value = page.totalPages || 1;
    } else {
      error.value = res.data.message || "Tải dữ liệu thất bại.";
    }
  } catch (err) {
    if (err.name !== "CanceledError") {
      error.value = "Lỗi khi tải dữ liệu: " + (err?.message || "Không rõ");
    }
  } finally {
    loading.value = false;
    inFlight.value = false;
  }
}

async function fetchWins() {
  // Thêm function cho win
  if (activeTab.value !== "win") return;
  winLoading.value = wins.value.length === 0;
  winError.value = null;
  winInFlight.value = true;
  if (winAbortController) winAbortController.abort();
  winAbortController = new AbortController();

  try {
    const token = Cookies.get("jwt_token") || Cookies.get("token");
    if (!token) {
      winError.value = "Bạn cần đăng nhập để xem phiếu thanh toán.";
      return;
    }

    const res = await axios.get(`${API}/payments/find-by-user-and-status`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        status: activeWinSubTab.value,
        page: winPage.value - 1,
        size: winPageSize.value,
        sort: "thoigianthanhtoan,asc",
      },
      signal: winAbortController.signal,
    });

    if (res.data.code === 200) {
      const page = res.data.result;
      wins.value = page.content || [];
      winTotalPages.value = page.totalPages || 1;
    } else {
      winError.value = res.data.message || "Tải dữ liệu thất bại.";
    }
  } catch (err) {
    if (err.name !== "CanceledError") {
      winError.value = "Lỗi khi tải dữ liệu: " + (err?.message || "Không rõ");
    }
  } finally {
    winLoading.value = false;
    winInFlight.value = false;
  }
}

function changeSubTab(newTab) {
  activeSubTab.value = newTab;
  depositPage.value = 1;
  fetchDeposits();
}

function changeWinSubTab(newTab) {
  // Thêm cho win
  activeWinSubTab.value = newTab;
  winPage.value = 1;
  fetchWins();
}

function goToPage(n) {
  const safe = Math.min(Math.max(1, n), depositTotalPages.value);
  if (safe !== depositPage.value) {
    depositPage.value = safe;
    fetchDeposits();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function prevPage() {
  if (depositPage.value > 1) goToPage(depositPage.value - 1);
}

function nextPage() {
  if (depositPage.value < depositTotalPages.value) goToPage(depositPage.value + 1);
}

function goToWinPage(n) {
  // Thêm cho win
  const safe = Math.min(Math.max(1, n), winTotalPages.value);
  if (safe !== winPage.value) {
    winPage.value = safe;
    fetchWins();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function prevWinPage() {
  // Thêm cho win
  if (winPage.value > 1) goToWinPage(winPage.value - 1);
}

function nextWinPage() {
  // Thêm cho win
  if (winPage.value < winTotalPages.value) goToWinPage(winPage.value + 1);
}

function onDepositChanged() {
  fetchDeposits();
}

function onWinChanged() {
  // Thêm cho win
  fetchWins();
}

function onVisibilityChange() {
  if (document.visibilityState === "visible") {
    fetchDeposits();
    fetchWins();
  }
}

async function handlePay(item) {
  payingItems.value[item.matc] = true;
  try {
    const res = await axios.get(`${API}/deposit-payments/create-order`, {
      params: {
        matc: item.matc,
        amount: item.phienDauGia.tiencoc || 0,
      },
    });
    if (res.data.code === 200) {
      window.location.href = res.data.result;
    } else {
      alert(res.data.message || "Tạo URL thanh toán thất bại");
      payingItems.value[item.matc] = false;
    }
  } catch (err) {
    alert("Lỗi khi tạo URL thanh toán: " + err.message);
    payingItems.value[item.matc] = false;
  }
}

async function handleWinPay(item) {
  // Thêm cho win
  payingWinItems.value[item.matt] = true;
  try {
    const res = await axios.get(`${API}/payments/create-order`, {
      params: {
        matt: item.matt,
        amount: item.sotien || 0,
      },
    });
    if (res.data.code === 200) {
      window.location.href = res.data.result;
    } else {
      alert(res.data.message || "Tạo URL thanh toán thất bại");
      payingWinItems.value[item.matt] = false;
    }
  } catch (err) {
    alert("Lỗi khi tạo URL thanh toán: " + err.message);
    payingWinItems.value[item.matt] = false;
  }
}

watch(activeTab, (tab) => {
  if (tab === "deposit") fetchDeposits();
  else if (tab === "win") fetchWins();
});

onActivated(() => {
  fetchDeposits();
  fetchWins();
});

onMounted(() => {
  fetchDeposits();
  fetchWins();
  window.addEventListener("deposit-payments:changed", onDepositChanged);
  window.addEventListener("win-payments:changed", onWinChanged); // Thêm cho win
  if (!visibilityHandlerAdded) {
    document.addEventListener("visibilitychange", onVisibilityChange);
    visibilityHandlerAdded = true;
  }
});

onUnmounted(() => {
  window.removeEventListener("deposit-payments:changed", onDepositChanged);
  window.removeEventListener("win-payments:changed", onWinChanged); // Thêm cho win
  if (visibilityHandlerAdded) {
    document.removeEventListener("visibilitychange", onVisibilityChange);
    visibilityHandlerAdded = false;
  }
  if (abortController) abortController.abort();
  if (winAbortController) winAbortController.abort(); // Thêm cho win
});
</script>

<style scoped>
/* =====================================
   CÁC PHẦN CÒN LẠI GIỮ NGUYÊN (CARD, STATUS…)
   ===================================== */
.soft-empty {
  background: linear-gradient(to right, #f9fafb, #f4f7fa);
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1rem 1.2rem;
  text-align: center;
  color: #64748b;
  box-shadow: 0 4px 18px -6px rgba(99, 115, 129, 0.25);
}

.deposit-card {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
  border: 1px solid #e6ebf2;
  border-radius: 16px;
  padding: 1rem 1rem 1.1rem 1rem;
  background: linear-gradient(to bottom, #ffffff, #fdfefe);
  box-shadow: 0 6px 18px -10px rgba(30, 41, 59, 0.25);
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease,
    background 0.3s ease;
  margin-bottom: 0.9rem;
}
.deposit-card:hover {
  border-color: #bcd7f8;
  background: linear-gradient(to bottom, #fefefe, #fdfdfd);
  box-shadow: 0 8px 25px -8px rgba(30, 41, 59, 0.35);
}

.card-main {
  display: flex;
  align-items: center;
}
.card-lines {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.55rem 1rem;
  width: 100%;
}
.line {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  min-height: 24px;
}

.label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #64748b;
  font-weight: 600;
}
.value {
  font-size: 0.85rem;
  color: #334155;
}
.value.strong {
  font-weight: 700;
}

.mono-tag {
  font-family: ui-monospace, Menlo, Monaco, Consolas, monospace;
  font-size: 0.72rem;
  background: #f1f5f9;
  color: #455468;
  padding: 0.25rem 0.45rem;
  border-radius: 8px;
  border: 1px solid #e6eaf0;
}

.card-actions {
  display: flex;
  align-items: end;
  justify-content: end;
}

.status-pill {
  padding: 0.28rem 0.55rem;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.4px;
  border-radius: 999px;
  display: inline-block;
  min-width: 82px;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
.pill-green {
  background: #e7f9ef;
  color: #16823d;
}
.pill-amber {
  background: #fff5d9;
  color: #b86e00;
}
.pill-red {
  background: #ffe9e9;
  color: #c03636;
}
.pill-gray {
  background: #f1f5f9;
  color: #64748b;
}

.pager {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}
.pager-btn {
  background: linear-gradient(to bottom, #fdfdfd, #f6f7f9);
  border: 1px solid #d9dce2;
  color: #475569;
  font-weight: 500;
  font-size: 0.85rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.25s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}
.pager-btn:hover:not(:disabled) {
  background: #eef6ff;
  border-color: #bcd7f8;
  color: #0f172a;
}
.pager-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.pager-info {
  font-size: 0.85rem;
  color: #64748b;
}
@media (max-width: 768px) {
  .deposit-card {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .card-lines {
    grid-template-columns: 1fr;
  }
  .card-actions {
    justify-content: start;
  }
}
</style>
