<template>
  <div class="auction-room fade-in" v-if="user">
    <header class="room-header">
      <div class="room-title">
        <h2>
          Phòng đấu giá <span class="code">{{ roomId || "—" }}</span>
        </h2>
        <span class="status-badge" :class="statusClass" v-if="statusText">
          {{ statusText }}
        </span>
      </div>
      <div class="user-info">
        <span class="avatar-initial">
          {{ (user.ten || "?").charAt(0).toUpperCase() }}
        </span>
        <div class="user-meta">
          <strong>{{ fullName }}</strong>
          <small>{{ user.email }}</small>
        </div>
      </div>
    </header>

    <div class="grid">
      <div class="left-col">
        <section class="card auction-info" v-if="!auctionError">
          <div v-if="loadingAuction" class="skeleton">
            <div class="line w40"></div>
            <div class="line w70"></div>
            <div class="line w55"></div>
            <div class="line w60"></div>
            <div class="line w80"></div>
          </div>
          <template v-else>
            <h3 class="card-title">Thông tin phiên</h3>
            <div class="info-grid">
              <div class="info-block full">
                <label>Tài sản</label>
                <div class="value asset">{{ productName || "—" }}</div>
              </div>
              <div class="info-block">
                <label>Giá khởi điểm</label>
                <div class="value">{{ formatCurrency(startPrice) }}</div>
              </div>
              <div class="info-block">
                <label>Bước giá</label>
                <div class="value">{{ formatCurrency(stepPrice) }}</div>
              </div>
              <div class="info-block">
                <label>Bắt đầu</label>
                <div class="value time">{{ formatDate(startTime) }}</div>
              </div>
              <div class="info-block">
                <label>Kết thúc</label>
                <div class="value time">{{ formatDate(endTime) }}</div>
              </div>
              <div class="info-block highlight full">
                <label>Giá cao nhất</label>
                <div class="value big">{{ formatCurrency(highestPrice) }}</div>
              </div>
            </div>

            <div v-if="countDownToStart" class="countdown-bar upcoming">
              Bắt đầu sau: <strong>{{ countDownToStart }}</strong>
            </div>
            <div v-else-if="countDownToEnd" class="countdown-bar live">
              Còn lại: <strong>{{ countDownToEnd }}</strong>
            </div>
          </template>
        </section>

        <section v-if="auctionError" class="card error-card">
          <h3 class="card-title">Lỗi tải phiên</h3>
          <p>{{ auctionError }}</p>
        </section>

        <section class="card bid-card" v-if="!auctionError">
          <h3 class="card-title">Trả giá</h3>
          <div class="flex flex-wrap items-end gap-3">
            <div class="flex flex-col">
              <label
                for="bidStep"
                class="text-[10px] uppercase tracking-wide font-semibold text-slate-600 mb-1"
                >Số lần (x bước giá)</label
              >
              <input
                id="bidStep"
                type="number"
                v-model.number="bidStep"
                :min="minBidStep"
                :disabled="isWaiting || sending || !canBid"
                class="w-24 px-3 py-1.5 rounded-md border border-slate-300 bg-slate-50 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            <button
              @click="sendBid"
              :disabled="sending || isWaiting || !stompConnected || !canBid"
              class="inline-flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold tracking-wide text-white bg-[#127fcf] hover:bg-[#1992eb] btn-flash disabled:bg-slate-400 shadow-sm transition disabled:cursor-not-allowed"
            >
              <span v-if="sending" class="loader-inline !w-4 !h-4"></span>
              <span v-else-if="isWaiting">Chờ {{ countdown }}s</span>
              <span v-else-if="!stompConnected">Đang kết nối...</span>
              <span v-else-if="!canBid">Không thể</span>
              <span v-else>Trả giá</span>
            </button>
            <div class="flex-1 min-w-full sm:min-w-[220px]">
              <small v-if="canBid" class="block text-[11px] text-slate-500 leading-snug">
                Tổng tăng = bước giá × số lần: {{ formatCurrency(stepPrice) }} ×
                {{ bidStep || minBidStep }}
              </small>
              <small v-else class="block text-[11px] text-amber-600 leading-snug">
                Phiên chưa bắt đầu hoặc đã kết thúc.
              </small>
            </div>
          </div>
          <transition name="fade">
            <p v-if="actionError" class="inline-error mt-3">{{ actionError }}</p>
          </transition>
        </section>
      </div>

      <div class="right-col">
        <section class="card history-card">
          <div class="history-head">
            <h3 class="card-title">Lịch sử trả giá</h3>
            <span class="badge-count">{{ bids.length }}/{{ maxStored }}</span>
          </div>

          <div v-if="loadingHistory && bids.length === 0" class="history-loading">
            <div class="spinner"></div>
            <p>Đang tải lịch sử...</p>
          </div>

          <ul v-else class="history-list">
            <li
              v-for="(b, i) in displayedBids"
              :key="b.maphientg"
              class="history-row"
              :class="rowHighlightClasses(globalIndex(i), b)"
            >
              <div class="col user">
                <span
                  class="user-id"
                  :class="{ me: b.taiKhoanNguoiRaGia?.matk === user?.matk }"
                >
                  {{ b.taiKhoanNguoiRaGia?.matk }}
                  <span v-if="b.taiKhoanNguoiRaGia?.matk === user?.matk" class="me-tag"
                    >Bạn</span
                  >
                </span>
              </div>
              <div class="col price">{{ formatCurrency(b.sotien) }}</div>
              <div class="col step">{{ b.solan }}×</div>
              <div class="col time">{{ formatDate(b.thoigian) }}</div>
            </li>
            <li v-if="bids.length === 0" class="empty-row">Chưa có trả giá nào.</li>
          </ul>

          <div
            v-if="totalPages > 1"
            class="mt-4 flex flex-wrap items-center justify-between gap-3"
          >
            <div class="flex items-center gap-1">
              <button class="pg-btn" :disabled="currentPage === 1" @click="goFirst">
                &laquo;
              </button>
              <button class="pg-btn" :disabled="currentPage === 1" @click="prevPage">
                &lsaquo;
              </button>
              <template v-for="p in pageWindow" :key="p">
                <button
                  class="pg-btn"
                  :class="{ active: p === currentPage }"
                  @click="goPage(p)"
                >
                  {{ p }}
                </button>
              </template>
              <button
                class="pg-btn"
                :disabled="currentPage === totalPages"
                @click="nextPage"
              >
                &rsaquo;
              </button>
              <button
                class="pg-btn"
                :disabled="currentPage === totalPages"
                @click="goLast"
              >
                &raquo;
              </button>
            </div>
            <div class="text-[11px] text-slate-500">
              Trang {{ currentPage }}/{{ totalPages }} • Hiển thị
              {{ displayedBids.length }} / {{ bids.length }}
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>

  <div v-else class="auth-loading">
    <div class="spinner"></div>
    <p>Đang kiểm tra đăng nhập...</p>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import { storeToRefs } from "pinia";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import axios from "axios";

const API = "http://localhost:8082/api";
const SOCKET_URL = "http://localhost:8082/api/ws-auction";
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { user, token } = storeToRefs(userStore);

const roomId = ref("");
const productName = ref("");
const startPrice = ref(0);
const highestPrice = ref(0);
const stepPrice = ref(0);
const startTime = ref(null);
const endTime = ref(null);
const statusText = ref("");
const loadingAuction = ref(false);
const auctionError = ref("");

const bids = ref([]);
const maxStored = 20;
const loadingHistory = ref(false);

const bidStep = ref(1);
const sending = ref(false);
const actionError = ref("");
const stompConnected = ref(false);
const isWaiting = ref(false);
const countdown = ref(10);
let countdownTimer = null;
let stompClient = null;
let stompSubscription = null;
let reconnectTimer = null;

const now = ref(Date.now());
let nowTimer = null;

const pageSize = 10;
const currentPage = ref(1);

const fullName = computed(() =>
  user.value ? `${user.value.ho} ${user.value.tenlot} ${user.value.ten}`.trim() : ""
);
const canBid = computed(() => {
  if (!startTime.value || !endTime.value) return false;
  const s = new Date(startTime.value).getTime();
  const e = new Date(endTime.value).getTime();
  return now.value >= s && now.value < e;
});
const countDownToStart = computed(() => {
  if (!startTime.value) return "";
  const s = new Date(startTime.value).getTime();
  return now.value < s ? formatDuration(s - now.value) : "";
});
const countDownToEnd = computed(() => {
  if (!endTime.value || !startTime.value) return "";
  const s = new Date(startTime.value).getTime();
  const e = new Date(endTime.value).getTime();
  if (now.value < s || now.value >= e) return "";
  return formatDuration(e - now.value);
});
const statusClass = computed(() => {
  const st = (statusText.value || "").toLowerCase();
  if (st.includes("pending") || st.includes("chờ")) return "pending";
  if (st.includes("approved") || st.includes("bắt đầu") || st.includes("đang"))
    return "live";
  if (st.includes("end") || st.includes("kết thúc") || st.includes("closed"))
    return "ended";
  return "neutral";
});

// Thêm computed minBidStep
const minBidStep = computed(() => {
  // Nếu giá cao nhất đạt được === 0 (lần đầu), cho phép 0; ngược lại >=1
  return highestPrice.value === 0 ? 0 : 1;
});

const totalPages = computed(() =>
  bids.value.length === 0 ? 1 : Math.ceil(bids.value.length / pageSize)
);
const displayedBids = computed(() =>
  bids.value.slice(
    (currentPage.value - 1) * pageSize,
    (currentPage.value - 1) * pageSize + pageSize
  )
);

const pageWindow = computed(() => {
  const winSize = 5;
  let start = Math.max(1, currentPage.value - Math.floor(winSize / 2));
  let end = start + winSize - 1;
  if (end > totalPages.value) {
    end = totalPages.value;
    start = Math.max(1, end - winSize + 1);
  }
  return Array.from({ length: end - start + 1 }, (_, k) => start + k);
});

function goPage(p) {
  if (p >= 1 && p <= totalPages.value) currentPage.value = p;
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}
function goFirst() {
  currentPage.value = 1;
}
function goLast() {
  currentPage.value = totalPages.value;
}

function globalIndex(localIndex) {
  return (currentPage.value - 1) * pageSize + localIndex;
}

function rowHighlightClasses(globalI) {
  return globalI === 0 ? "top1" : "";
}

function formatCurrency(n) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    n || 0
  );
}
function formatDate(ts) {
  if (!ts) return "-";
  return new Date(ts).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}
function formatDuration(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const pad = (v) => String(v).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(ss)}`;
}

function resetState() {
  productName.value = "";
  startPrice.value = 0;
  highestPrice.value = 0;
  stepPrice.value = 0;
  startTime.value = null;
  endTime.value = null;
  statusText.value = "";
  bids.value = [];
  auctionError.value = "";
  actionError.value = "";
  isWaiting.value = false;
  sending.value = false;
  currentPage.value = 1;
  if (countdownTimer) clearInterval(countdownTimer);
  countdownTimer = null;
}

async function fetchAuction() {
  if (!roomId.value) return;
  loadingAuction.value = true;
  auctionError.value = "";
  try {
    const res = await axios.get(`${API}/auctions/find-by-id/${roomId.value}`);
    if (res.data?.code === 200 && res.data.result) {
      const r = res.data.result;
      productName.value = r?.sanPham?.tensp || "";
      startPrice.value = Number(r?.giakhoidiem || 0);
      highestPrice.value = Number(r?.giacaonhatdatduoc || 0); // Sửa: không fallback giaKhoiDiem
      stepPrice.value = Number(r?.buocgia || 0);
      startTime.value = r?.thoigianbd || null;
      endTime.value = r?.thoigiankt || null;
      statusText.value = r?.trangthai || "";
    } else auctionError.value = res.data?.message || "Không thể tải thông tin phiên.";
  } catch (e) {
    auctionError.value = e?.response?.data?.message || e?.message || "Lỗi tải phiên.";
  } finally {
    loadingAuction.value = false;
  }
}

function connectWebSocket() {
  if (!roomId.value) return;
  disconnectWebSocket();
  const socket = new SockJS(SOCKET_URL);
  stompClient = Stomp.over(socket);
  stompClient.debug = null;
  stompClient.connect(
    {},
    () => {
      stompConnected.value = true;
      loadingHistory.value = true;
      stompClient.subscribe("/user/queue/history", (frame) => {
        try {
          const list = JSON.parse(frame.body) || [];
          list.sort((a, b) => new Date(b.thoigian) - new Date(a.thoigian));
          bids.value = list.slice(0, maxStored);
          currentPage.value = 1;
        } catch {}
        loadingHistory.value = false;
      });
      stompSubscription = stompClient.subscribe(
        `/topic/auction/${roomId.value}`,
        onIncomingBid
      );
      requestHistory(roomId.value, maxStored);
    },
    () => {
      stompConnected.value = false;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(() => {
        if (roomId.value) connectWebSocket();
      }, 3000);
    }
  );
}

function requestHistory(id, limit = 20) {
  if (!stompConnected.value) return;
  stompClient.send("/app/history", {}, JSON.stringify({ maphienDauGia: id, limit }));
}

function onIncomingBid(frame) {
  let data;
  try {
    data = JSON.parse(frame.body);
  } catch {
    return;
  }
  if (!data) return;
  if (data.error) {
    actionError.value = data.message || "Lỗi trả giá.";
    setTimeout(() => (actionError.value = ""), 4000);
    return;
  }
  if (typeof data.sotien === "number") highestPrice.value = data.sotien;
  if (data.taiKhoanNguoiRaGia?.matk === user.value?.matk) startCooldown(20);
  if (data.maphientg) {
    const i = bids.value.findIndex((b) => b.maphientg === data.maphientg);
    if (i >= 0) {
      if (new Date(data.thoigian) > new Date(bids.value[i].thoigian))
        bids.value.splice(i, 1, data);
    } else {
      bids.value.unshift(data);
      if (bids.value.length > maxStored) bids.value.pop();
    }
    currentPage.value = 1;
  }
}

function disconnectWebSocket() {
  try {
    if (stompSubscription) stompSubscription.unsubscribe();
    if (stompClient?.connected) stompClient.disconnect();
  } catch {}
  stompSubscription = null;
  stompClient = null;
  stompConnected.value = false;
  if (reconnectTimer) clearTimeout(reconnectTimer);
  reconnectTimer = null;
}

function sendBid() {
  actionError.value = "";
  if (!stompConnected.value) {
    actionError.value = "Chưa kết nối socket.";
    return;
  }
  if (!roomId.value) {
    actionError.value = "Thiếu mã phiên.";
    return;
  }
  if (!user.value?.matk) {
    actionError.value = "Chưa đăng nhập.";
    return;
  }
  if (!canBid.value) {
    actionError.value = "Phiên chưa bắt đầu hoặc đã kết thúc.";
    return;
  }
  if (isWaiting.value) {
    actionError.value = "Đang trong thời gian chờ.";
    return;
  }
  if (!Number.isInteger(bidStep.value) || bidStep.value < minBidStep.value) {
    actionError.value = `Số lần phải ≥ ${minBidStep.value}.`;
    return;
  }
  sending.value = true;
  const payload = {
    phienDauGia: { maphiendg: roomId.value },
    taiKhoanNguoiRaGia: { matk: user.value.matk },
    solan: bidStep.value,
  };
  try {
    stompClient.send("/app/bid", {}, JSON.stringify(payload));
  } catch (e) {
    actionError.value = "Gửi trả giá thất bại: " + (e.message || e);
  } finally {
    sending.value = false;
  }
}

function startCooldown(sec) {
  if (countdownTimer) clearInterval(countdownTimer);
  isWaiting.value = true;
  countdown.value = sec;
  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      isWaiting.value = false;
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  }, 1000);
}

function deriveId() {
  let id = route.query.id || route.params.id;
  if (!id) {
    const m = window.location.href.match(/([A-Z]{2}\d{8,})/);
    if (m) id = m[1];
  }
  return (id || "").toString();
}

async function initAuction() {
  await fetchAuction();
  connectWebSocket();
}

watch(
  () => [route.query.id, route.params.id],
  () => {
    const id = deriveId();
    if (!id) {
      disconnectWebSocket();
      resetState();
      roomId.value = "";
      return;
    }
    if (id === roomId.value && stompConnected.value) return;
    roomId.value = id;
    resetState();
    initAuction();
  },
  { immediate: true }
);

watch(bids, () => {
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value;
});

onMounted(async () => {
  if (!token.value) {
    router.push({ name: "Login" });
    return;
  }
  if (!user.value) {
    await userStore.fetchUser();
    if (!user.value) {
      router.push({ name: "Login" });
      return;
    }
  }
  nowTimer = setInterval(() => (now.value = Date.now()), 1000);
});
onUnmounted(() => {
  disconnectWebSocket();
  if (countdownTimer) clearInterval(countdownTimer);
  if (nowTimer) clearInterval(nowTimer);
});
</script>

<style scoped>
@import "@/assets/styles/auction.css";
</style>