<!-- App.vue -->
<template>
  <div class="min-h-screen w-full text-gray-800 flex flex-col">
    <Header />
    <!-- Nội dung động, được cache -->
    <main class="flex-1 w-full">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </main>
    <PopupNotification />
    <AuthPopup ref="authPopup" />
    <Footer />
  </div>
</template>

<script setup>
import PopupNotification from "@/components/PopupNotification.vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import AuthPopup from "@/components/AuthPopup.vue";
import { ref, provide } from "vue";

const authPopup = ref(null);
provide("authPopup", authPopup);
</script>

<style scoped></style>
