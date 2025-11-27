<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]"
    @click.self="close"
  >
    <div
      class="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
    >
      <!-- Desktop shell -->
      <div
        class="relative hidden md:grid md:grid-cols-2 auth-shell min-h-[560px] place-items-center"
        :class="[switching ? 'is-switching' : '', revealing ? 'is-revealing' : '']"
        :style="{
          '--curtain-in': CURTAIN_IN + 'ms',
          '--curtain-hold': SLIDE_DURATION + POST_SLIDE_DELAY + 'ms',
          '--curtain-out': CURTAIN_OUT + 'ms',
        }"
      >
        <!-- Nền trượt (delay để curtain phủ trước) -->
        <div
          class="auth-switcher transform-gpu transition-transform ease-[cubic-bezier(0.22,1,0.36,1)]"
          :class="[
            'duration-[' + SLIDE_DURATION + 'ms]',
            'delay-[' + CURTAIN_IN + 'ms]',
            mode === 'login' ? 'md:translate-x-full' : 'md:translate-x-0',
          ]"
          aria-hidden="true"
        />

        <!-- Panel Login -->
        <div
          class="auth-panel relative z-10 p-6 md:p-10 flex items-center justify-center w-full"
          :class="panelActiveClass('login')"
        >
          <div class="w-full max-w-[420px]">
            <h3 class="text-2xl font-bold text-slate-800 text-center mb-6">Đăng nhập</h3>

            <form @submit.prevent="handleLogin" class="space-y-5">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1"
                  >Email</label
                >
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  placeholder="Nhập email của bạn"
                  class="input"
                  :disabled="disableFields('login')"
                />
              </div>
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-1"
                  >Mật khẩu</label
                >
                <div class="relative">
                  <input
                    id="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    placeholder="Nhập mật khẩu"
                    class="input pr-10"
                    :disabled="disableFields('login')"
                  />
                  <button
                    type="button"
                    @click="togglePassword"
                    class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-sky-600 transition"
                    :tabindex="disableFields('login') ? -1 : 0"
                  >
                    <svg
                      v-if="showPassword"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 18"
                      width="20"
                      height="20"
                      stroke="currentColor"
                      stroke-width="0.1"
                      class="w-5 h-5"
                      space="preserve"
                      style="
                        fill-rule: evenodd;
                        clip-rule: evenodd;
                        stroke-linejoin: round;
                        stroke-miterlimit: 2;
                      "
                    >
                      <path
                        d="M16.666 6.734a.75.75 0 0 0-1.061.011A9.18 9.18 0 0 1 9 9.519a9.18 9.18 0 0 1-6.605-2.774.75.75 0 1 0-1.072 1.05c.515.525 1.074.99 1.669 1.393l-.881 1.441a.75.75 0 0 0 1.28.782l.906-1.482q1.019.497 2.124.769l-.333 1.655a.75.75 0 0 0 1.47.296l.339-1.685a11 11 0 0 0 2.206 0l.339 1.685a.75.75 0 0 0 1.47-.296l-.333-1.655a10.6 10.6 0 0 0 2.124-.769l.906 1.482a.75.75 0 1 0 1.28-.782l-.881-1.441a11 11 0 0 0 1.669-1.393.75.75 0 0 0-.011-1.061"
                        style="fill: currentcolor; fill-rule: nonzero"
                      />
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 18"
                      width="20"
                      height="20"
                      stroke="currentColor"
                      stroke-width="0.1"
                      class="w-5 h-5"
                      space="preserve"
                      style="
                        fill-rule: evenodd;
                        clip-rule: evenodd;
                        stroke-linejoin: round;
                        stroke-miterlimit: 2;
                      "
                    >
                      <path
                        d="m15.008 6.083.881-1.441a.75.75 0 0 0-1.279-.783l-.907 1.482a10.6 10.6 0 0 0-2.124-.769l.333-1.655a.75.75 0 0 0-1.47-.296l-.339 1.685a11 11 0 0 0-2.206 0l-.339-1.685a.75.75 0 1 0-1.47.296l.333 1.655q-1.106.272-2.124.769L3.39 3.859a.75.75 0 0 0-1.279.783l.881 1.441c-.594.402-1.154.867-1.668 1.392a.75.75 0 1 0 1.072 1.05 9.18 9.18 0 0 1 6.605-2.774 9.18 9.18 0 0 1 6.605 2.774.747.747 0 0 0 1.061.011.75.75 0 0 0 .011-1.061 11 11 0 0 0-1.668-1.392z"
                        style="fill: currentcolor; fill-rule: nonzero"
                      ></path>
                      <path
                        d="M9 14a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"
                        style="fill: currentcolor; fill-rule: nonzero"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="text-right">
                <a
                  href="#"
                  class="text-sm text-sky-600 hover:text-sky-700 font-medium"
                  @click.prevent="handleForgotPassword"
                  :tabindex="disableFields('login') ? -1 : 0"
                  >Quên mật khẩu?</a
                >
              </div>
              <button
                type="submit"
                :disabled="loading || disableFields('login')"
                class="btn-primary btn-flash"
              >
                <span v-if="loading && mode === 'login'">Đang xử lý...</span>
                <span v-else>Đăng nhập</span>
              </button>
              <p v-if="error && mode === 'login' && !switching" class="error-msg">
                {{ error }}
              </p>
              <p class="text-sm text-slate-600 text-center">
                Chưa có tài khoản?
                <button
                  type="button"
                  class="text-sky-600 hover:text-sky-700 font-semibold"
                  @click="switchMode('register')"
                  :disabled="switching"
                >
                  Đăng ký ngay
                </button>
              </p>
            </form>
          </div>
        </div>

        <!-- Panel Register -->
        <div
          class="auth-panel relative z-10 p-6 md:p-10 border-l border-gray-100 flex items-center justify-center w-full"
          :class="panelActiveClass('register')"
        >
          <div class="w-full max-w-[520px]">
            <h3 class="text-2xl font-bold text-slate-800 text-center mb-6">Đăng ký</h3>

            <form @submit.prevent="handleRegister" class="space-y-5">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label
                    for="registerHo"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Họ</label
                  >
                  <input
                    id="registerHo"
                    v-model="registerHo"
                    type="text"
                    required
                    placeholder="Nguyễn"
                    class="input"
                    :disabled="disableFields('register')"
                  />
                </div>
                <div>
                  <label
                    for="registerTenLot"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Tên lót</label
                  >
                  <input
                    id="registerTenLot"
                    v-model="registerTenLot"
                    type="text"
                    placeholder="Văn"
                    class="input"
                    :disabled="disableFields('register')"
                  />
                </div>
                <div>
                  <label
                    for="registerTen"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Tên</label
                  >
                  <input
                    id="registerTen"
                    v-model="registerTen"
                    type="text"
                    required
                    placeholder="An"
                    class="input"
                    :disabled="disableFields('register')"
                  />
                </div>
                <div>
                  <label
                    for="registerPhone"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Số điện thoại</label
                  >
                  <input
                    id="registerPhone"
                    v-model="registerPhone"
                    type="tel"
                    required
                    placeholder="0123 456 789"
                    class="input"
                    :disabled="disableFields('register')"
                  />
                </div>
                <div class="col-span-2">
                  <label
                    for="registerEmail"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Email</label
                  >
                  <input
                    id="registerEmail"
                    v-model="registerEmail"
                    type="email"
                    required
                    placeholder="Nhập email"
                    class="input"
                    :disabled="disableFields('register')"
                  />
                </div>
                <div>
                  <label
                    for="registerPassword"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Mật khẩu</label
                  >
                  <input
                    id="registerPassword"
                    v-model="registerPassword"
                    type="password"
                    required
                    placeholder="Tạo mật khẩu"
                    class="input"
                    :disabled="disableFields('register')"
                  />
                </div>
                <div>
                  <label
                    for="registerConfirm"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Xác nhận mật khẩu</label
                  >
                  <input
                    id="registerConfirm"
                    v-model="registerConfirm"
                    type="password"
                    required
                    placeholder="Nhập lại mật khẩu"
                    class="input"
                    :disabled="disableFields('register')"
                  />
                </div>
              </div>
              <button
                type="submit"
                :disabled="loading || disableFields('register')"
                class="btn-primary btn-flash mt-2"
              >
                <span v-if="loading && mode === 'register'">Đang xử lý...</span>
                <span v-else>Đăng ký</span>
              </button>
              <p v-if="error && mode === 'register' && !switching" class="error-msg">
                {{ error }}
              </p>
              <p class="text-sm text-slate-600 text-center">
                Đã có tài khoản?
                <button
                  type="button"
                  class="text-sky-600 hover:text-sky-700 font-semibold"
                  @click="switchMode('login')"
                  :disabled="switching"
                >
                  Đăng nhập ngay
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>

      <!-- Mobile -->
      <div class="md:hidden p-6">
        <transition name="auth-form" mode="out-in">
          <div key="login-mobile" v-if="mode === 'login'" class="max-w-[420px] mx-auto">
            <h3 class="text-xl font-bold text-slate-800 text-center mb-6">Đăng nhập</h3>
            <form @submit.prevent="handleLogin" class="space-y-5">
              <div>
                <label for="m_email" class="block text-sm font-medium text-gray-700 mb-1"
                  >Email</label
                >
                <input
                  id="m_email"
                  v-model="email"
                  type="email"
                  required
                  placeholder="Nhập email của bạn"
                  class="input"
                />
              </div>
              <div>
                <label
                  for="m_password"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Mật khẩu</label
                >
                <div class="relative">
                  <input
                    id="m_password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    placeholder="Nhập mật khẩu"
                    class="input pr-10"
                  />
                  <button
                    type="button"
                    @click="togglePassword"
                    class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-sky-600 transition"
                  >
                    <svg
                      v-if="showPassword"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 18"
                      width="20"
                      height="20"
                      stroke="currentColor"
                      stroke-width="0.1"
                      class="w-5 h-5"
                      space="preserve"
                      style="
                        fill-rule: evenodd;
                        clip-rule: evenodd;
                        stroke-linejoin: round;
                        stroke-miterlimit: 2;
                      "
                    >
                      <path
                        d="M9 14a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"
                        style="fill: currentcolor; fill-rule: nonzero"
                      ></path>
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 18"
                      width="20"
                      height="20"
                      stroke="currentColor"
                      stroke-width="0.1"
                      class="w-5 h-5"
                      space="preserve"
                      style="
                        fill-rule: evenodd;
                        clip-rule: evenodd;
                        stroke-linejoin: round;
                        stroke-miterlimit: 2;
                      "
                    >
                      <path
                        d="m15.008 6.083.881-1.441a.75.75 0 0 0-1.279-.783l-.907 1.482a10.6 10.6 0 0 0-2.124-.769l.333-1.655a.75.75 0 0 0-1.47-.296l-.339 1.685a11 11 0 0 0-2.206 0l-.339-1.685a.75.75 0 1 0-1.47.296l.333 1.655q-1.106.272-2.124.769L3.39 3.859a.75.75 0 0 0-1.279.783l.881 1.441c-.594.402-1.154.867-1.668 1.392a.75.75 0 1 0 1.072 1.05 9.18 9.18 0 0 1 6.605-2.774 9.18 9.18 0 0 1 6.605 2.774.747.747 0 0 0 1.061.011.75.75 0 0 0 .011-1.061 11 11 0 0 0-1.668-1.392z"
                        style="fill: currentcolor; fill-rule: nonzero"
                      />
                      <path
                        d="M9 14a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"
                        style="fill: currentcolor; fill-rule: nonzero"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="text-right">
                <a
                  href="#"
                  class="text-sm text-sky-600 hover:text-sky-700 font-medium"
                  @click.prevent="handleForgotPassword"
                  >Quên mật khẩu?</a
                >
              </div>
              <button type="submit" :disabled="loading" class="btn-primary">
                <span v-if="loading">Đang xử lý...</span>
                <span v-else>Đăng nhập</span>
              </button>
              <p v-if="error" class="error-msg">{{ error }}</p>
              <p class="text-sm text-slate-600 text-center">
                Chưa có tài khoản?
                <button
                  type="button"
                  class="text-sky-600 hover:text-sky-700 font-semibold"
                  @click="switchMode('register')"
                >
                  Đăng ký ngay
                </button>
              </p>
            </form>
          </div>

          <div key="register-mobile" v-else class="max-w-[520px] mx-auto">
            <h3 class="text-xl font-bold text-slate-800 text-center mb-6">Đăng ký</h3>
            <form @submit.prevent="handleRegister" class="space-y-5">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label
                    for="m_registerHo"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Họ</label
                  >
                  <input
                    id="m_registerHo"
                    v-model="registerHo"
                    type="text"
                    required
                    placeholder="Nguyễn"
                    class="input"
                  />
                </div>
                <div>
                  <label
                    for="m_registerTenLot"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Tên lót</label
                  >
                  <input
                    id="m_registerTenLot"
                    v-model="registerTenLot"
                    type="text"
                    placeholder="Văn"
                    class="input"
                  />
                </div>
                <div>
                  <label
                    for="m_registerTen"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Tên</label
                  >
                  <input
                    id="m_registerTen"
                    v-model="registerTen"
                    type="text"
                    required
                    placeholder="An"
                    class="input"
                  />
                </div>
                <div>
                  <label
                    for="m_registerPhone"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Số điện thoại</label
                  >
                  <input
                    id="m_registerPhone"
                    v-model="registerPhone"
                    type="tel"
                    required
                    placeholder="0123 456 789"
                    class="input"
                  />
                </div>
                <div class="col-span-2">
                  <label
                    for="m_registerEmail"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Email</label
                  >
                  <input
                    id="m_registerEmail"
                    v-model="registerEmail"
                    type="email"
                    required
                    placeholder="Nhập email"
                    class="input"
                  />
                </div>
                <div>
                  <label
                    for="m_registerPassword"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Mật khẩu</label
                  >
                  <input
                    id="m_registerPassword"
                    v-model="registerPassword"
                    type="password"
                    required
                    placeholder="Tạo mật khẩu"
                    class="input"
                  />
                </div>
                <div>
                  <label
                    for="m_registerConfirm"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Xác nhận mật khẩu</label
                  >
                  <input
                    id="m_registerConfirm"
                    v-model="registerConfirm"
                    type="password"
                    required
                    placeholder="Nhập lại mật khẩu"
                    class="input"
                  />
                </div>
              </div>
              <button type="submit" :disabled="loading" class="btn-primary mt-2">
                <span v-if="loading">Đang xử lý...</span>
                <span v-else>Đăng ký</span>
              </button>
              <p v-if="error" class="error-msg">{{ error }}</p>
              <p class="text-sm text-slate-600 text-center">
                Đã có tài khoản?
                <button
                  type="button"
                  class="text-sky-600 hover:text-sky-700 font-semibold"
                  @click="switchMode('login')"
                >
                  Đăng nhập ngay
                </button>
              </p>
            </form>
          </div>
        </transition>
      </div>
    </div>
  </div>

  <!-- Toast -->
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
import { ref, computed } from "vue";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";

const API = "https://daugiabe-production.up.railway.app/api";

const show = ref(false);
const mode = ref("login");
const switching = ref(false);
const revealing = ref(false);
let timers = [];

/* ===== THỜI GIAN HIỆU ỨNG (ms) ===== */
const CURTAIN_IN = 100;
const SLIDE_DURATION = 1000;
const POST_SLIDE_DELAY = -900;
const CURTAIN_OUT = 100;
const TOTAL_SWITCH = CURTAIN_IN + SLIDE_DURATION + POST_SLIDE_DELAY + CURTAIN_OUT;

/* ===== FORM DATA ===== */
const email = ref("");
const password = ref("");
const registerHo = ref("");
const registerTenLot = ref("");
const registerTen = ref("");
const registerEmail = ref("");
const registerPhone = ref("");
const registerPassword = ref("");
const registerConfirm = ref("");
const showPassword = ref(false);
const loading = ref(false);
const error = ref("");

const toast = ref({ show: false, message: "", type: "success" });
const router = useRouter();
const userStore = useUserStore();

/* ----- Toast meta theo type ----- */
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
  // info (mặc định)
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

const togglePassword = () => (showPassword.value = !showPassword.value);

function open(defaultMode = "login") {
  mode.value = defaultMode;
  switching.value = false;
  revealing.value = true;
  show.value = true;
}
function close() {
  show.value = false;
  clearAllTimers();
  switching.value = false;
  revealing.value = false;
}

function clearAllTimers() {
  timers.forEach((t) => clearTimeout(t));
  timers = [];
}

function switchMode(next) {
  if (mode.value === next) return;
  clearAllTimers();
  switching.value = true;
  revealing.value = false;
  mode.value = next;

  timers.push(
    setTimeout(() => {
      revealing.value = true;
    }, CURTAIN_IN + SLIDE_DURATION + POST_SLIDE_DELAY)
  );

  timers.push(
    setTimeout(() => {
      switching.value = false;
    }, TOTAL_SWITCH)
  );
}

function showToast(message, type = "success") {
  toast.value = { show: true, message, type };
  setTimeout(() => (toast.value.show = false), 3000);
}

function extractErrorMessage(err) {
  // Ưu tiên message từ BE (ApiResponse.message)
  if (err?.response?.data?.message) return err.response.data.message;
  // Nếu BE trả text/plain
  if (typeof err?.response?.data === "string") return err.response.data;
  return err?.message || "Lỗi kết nối đến máy chủ!";
}

/* ===== LOGIN (chuẩn hoá theo BE) ===== */
const handleLogin = async () => {
  error.value = "";
  loading.value = true;
  try {
    const res = await axios.post(`${API}/auth/login`, {
      email: email.value.trim(),
      matkhau: password.value.trim(),
    });

    // Chuẩn BE: thành công → HTTP 200 + { code:200, result: "<token>" }
    const { code, result, message } = res.data || {};
    if (code === 200 && result) {
      const token = result;
      Cookies.set("jwt_token", token);
      userStore.setToken(token);

      // Lấy thông tin user từ /auth/me (chuẩn BE: code=200, result=user)
      await userStore.fetchUser();

      showToast(message || "Đăng nhập thành công!", "success");
      close();
      router.push("/home");
    } else {
      // Trường hợp hiếm (BE trả 200 nhưng code != 200)
      error.value = message || "Đăng nhập thất bại!";
      showToast(error.value, "error");
    }
  } catch (err) {
    // Chuẩn BE: lỗi xác thực sẽ về HTTP 4xx + { code, message }
    const msg = extractErrorMessage(err);
    error.value = msg;
    showToast(msg, "error");
  } finally {
    loading.value = false;
  }
};

/* ===== REGISTER (chuẩn hoá theo BE) ===== */
const handleRegister = async () => {
  error.value = "";
  if (registerPassword.value !== registerConfirm.value) {
    error.value = "Mật khẩu xác nhận không khớp!";
    return;
  }
  const phoneRegex = /^[0-9]{10,11}$/;
  if (!phoneRegex.test(registerPhone.value)) {
    error.value = "Số điện thoại không hợp lệ!";
    return;
  }
  loading.value = true;
  try {
    const res = await axios.post(`${API}/users/create`, {
      ho: registerHo.value.trim(),
      tenlot: registerTenLot.value.trim(),
      ten: registerTen.value.trim(),
      email: registerEmail.value.trim(),
      sdt: registerPhone.value.trim(),
      matkhau: registerPassword.value.trim(),
    });

    const { code, message } = res.data || {};
    if (code === 200) {
      showToast(
        message || "Tạo tài khoản thành công! Vui lòng kiểm tra email để xác thực.",
        "success"
      );
      // Reset form
      registerHo.value = "";
      registerTenLot.value = "";
      registerTen.value = "";
      registerEmail.value = "";
      registerPhone.value = "";
      registerPassword.value = "";
      registerConfirm.value = "";
      switchMode("login");
    } else {
      error.value = res.data?.message || "Đăng ký thất bại!";
      showToast(error.value, "error");
    }
  } catch (err) {
    const msg = extractErrorMessage(err);
    error.value = msg;
    showToast(msg, "error");
  } finally {
    loading.value = false;
  }
};

function handleForgotPassword(e) {
  e?.preventDefault?.();
  showToast("Tính năng Quên mật khẩu sẽ sớm có.", "info");
}

/* ===== PANEL CLASSES & DISABLED ===== */
function panelActiveClass(panel) {
  if (switching.value) return "panel-hidden";
  if (revealing.value && mode.value === panel) return "panel-visible";
  if (revealing.value && mode.value !== panel) return "panel-hidden";
  return mode.value === panel ? "panel-visible" : "panel-hidden";
}
function disableFields(panel) {
  if (switching.value) return true;
  return mode.value !== panel || !revealing.value;
}

defineExpose({ open, close });
</script>

<style scoped>
@import "@/assets/styles/auth.css";
@import "@/assets/styles/toast.css";
</style>