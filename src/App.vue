<template>
  <div class="app-wrapper">
    <AppNavBar />

    <main class="main-content">
      <div class="container mx-auto px-4 py-6">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <footer class="bg-gray-800 text-white py-6 shadow-inner">
      <div class="container mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <p class="text-gray-300 font-medium">&copy; {{ new Date().getFullYear() }} CamperDash. All rights reserved.
            </p>
            <p class="text-gray-400 text-sm mt-2">Created by: <span class="font-medium">Khiet Tran Van</span>,
              <a href="mailto:khiet.tran@nfq.com" class="text-blue-300 hover:text-white transition duration-200">
                khiet.tran@nfq.com
              </a>
            </p>
          </div>
          <div class="flex items-center space-x-6">
            <a href="#" class="text-gray-300 hover:text-white transition duration-200">Privacy</a>
            <a href="#" class="text-gray-300 hover:text-white transition duration-200">Terms</a>
            <a href="#" class="text-gray-300 hover:text-white transition duration-200">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import AOS from 'aos';
import AppNavBar from './components/AppNavbar.vue';

onMounted(() => {
  AOS.init({
    duration: 500,
    easing: 'ease-in-out',
    once: true
  });
});
</script>

<style>
html {
  scroll-behavior: smooth;
  height: 100%;
}

body {
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow-x: hidden;
  color: #333;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding-top: 64px;
  background-color: #f9fafb;
}

.container {
  max-width: 1280px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 768px) {
  .main-content {
    padding-top: 56px;
  }
}
</style>
