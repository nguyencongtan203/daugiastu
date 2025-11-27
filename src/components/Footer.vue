<template>
  <!-- Footer -->
  <footer class="border-t border-slate-200 bg-white">
    <div
      class="max-w-[1200px] mx-auto px-4 lg:px-6 py-10 grid md:grid-cols-2 lg:grid-cols-4 gap-8"
    >
      <div>
        <div @click="goHome" class="flex items-center gap-3 cursor-pointer">
          <img src="/logo.png" alt="Logo" class="h-6 w-auto object-contain" />
        </div>
        <p class="mt-3 text-sm text-slate-600">
          Nền tảng đấu giá trực tuyến: minh bạch, hiệu quả, đa dạng tài sản.
        </p>
        <div class="mt-3 flex items-center gap-2 text-sm text-slate-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M10 2a6 6 0 00-6 6c0 5.25 6 10 6 10s6-4.75 6-10a6 6 0 00-6-6zM8 8a2 2 0 114 0 2 2 0 01-4 0z"
            />
          </svg>
          180 Cao Lỗ, Phường, Quận 8, Thành phố Hồ Chí Minh, Vietnam
        </div>
      </div>

      <div>
        <h4 class="font-semibold">Trong mục</h4>
        <ul class="mt-3 space-y-2 text-sm text-slate-600">
          <li><a href="#" class="hover:text-sky-600">Danh mục tài sản</a></li>
          <li>
            <a href="#" @click.prevent="goAuctionRoom" class="hover:text-sky-600"
              >Phòng đấu giá
            </a>
          </li>
          <li><a href="#" class="hover:text-sky-600">Tin tức</a></li>
        </ul>
      </div>

      <div>
        <h4 class="font-semibold">Về chúng tôi</h4>
        <ul class="mt-3 space-y-2 text-sm text-slate-600">
          <li><a href="#" class="hover:text-sky-600">Giới thiệu</a></li>
          <li><a href="mailto:daugiastu@gmail.com?subject=Hello!" class="hover:text-sky-600">Liên hệ</a></li>
          <li><a href="#" class="hover:text-sky-600">Tuyển dụng</a></li>
        </ul>
      </div>

      <div>
        <h4 class="font-semibold">Chính sách</h4>
        <ul class="mt-3 space-y-2 text-sm text-slate-600">
          <li><a href="#" class="hover:text-sky-600">Điều khoản sử dụng</a></li>
          <li><a href="#" class="hover:text-sky-600">Bảo mật thông tin</a></li>
          <li><a href="#" class="hover:text-sky-600">Hướng dẫn thanh toán</a></li>
        </ul>
      </div>
    </div>
    <div class="border-t border-slate-200">
      <div
        class="max-w-[1200px] mx-auto px-4 lg:px-6 py-4 text-sm text-slate-500 flex flex-col md:flex-row items-center justify-between"
      >
        <div>© {{ new Date().getFullYear() }} DauGiaSTU. All rights reserved.</div>
        <div class="mt-2 md:mt-0">Hỗ trợ: VISA • MasterCard • VNPay</div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
function goAuctionRoom() {
  router.push({ name: "AuctionRoom" });
}
</script>
