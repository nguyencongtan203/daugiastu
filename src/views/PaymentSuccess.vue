<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <!-- <img src="/email-verified.svg" alt="Verified" class="w-32 h-32 mb-6" /> -->
    <h1 class="text-2xl font-semibold text-green-600 mb-2">
        Thanh toán thành công!
    </h1>
    <p class="text-gray-600 mb-6">
      Giao dịch của bạn đã được xử lý thành công.
    </p>
    <router-link
      to="/payment-management"
      class="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
    >
      Về quản lý thanh toán
    </router-link>
  </div>
</template>