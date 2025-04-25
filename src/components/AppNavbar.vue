<template>
  <div>
    <nav class="bg-white fixed w-full z-50 shadow-md transition-all duration-300"
      :class="{ 'py-2': !scrolled, 'py-1 bg-opacity-95': scrolled }">
      <div class="container mx-auto px-6">
        <div class="flex justify-between items-center py-2">
          <router-link to="/" class="flex items-center space-x-2">
            <div class="text-green-600">
              <IconUserOutline></IconUserOutline>
            </div>
            <div>
              <span class="text-xl font-bold text-gray-900">CamperDash</span>
              <span class="hidden md:inline-block text-sm text-green-600 ml-1">Premium Campervans</span>
            </div>
          </router-link>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-6">
            <router-link v-for="(item, index) in navItems" :key="index" :to="item.path"
              class="text-gray-700 hover:text-green-600 transition duration-300 relative font-medium"
              :class="{ 'text-green-600 font-bold nav-active': isActive(item.path) }">
              {{ item.name }}
            </router-link>
          </div>

          <!-- Mobile Menu Button -->
          <div class="md:hidden">
            <button @click="toggleMenu" class="text-gray-500 hover:text-gray-700 focus:outline-none">
              <IconMenu v-if="!mobileMenuOpen"></IconMenu>
              <IconCross v-else></IconCross>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="mobileMenuOpen" class="md:hidden fixed inset-0 z-40 bg-white pt-20">
        <div class="px-6 py-4 space-y-4">
          <router-link v-for="(item, index) in navItems" :key="index" :to="item.path"
            class="block py-2 text-lg text-center"
            :class="{ 'text-green-600 font-bold': isActive(item.path), 'text-gray-700': !isActive(item.path) }"
            @click="closeMenu">
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import IconUserOutline from './icons/IconUserOutline.vue';
import IconMenu from './icons/IconMenu.vue';
import IconCross from './icons/IconCross.vue';

const route = useRoute();
const mobileMenuOpen = ref(false);
const scrolled = ref(false);

const navItems = [
  { name: 'Calendar', path: '/calendar' },
  { name: 'Vehicles', path: '/vehicles' },
  { name: 'Locations', path: '/locations' },
  { name: 'About', path: '/about' }
];

const isActive = (path) => {
  if (path === '/' && route.path !== '/') return false;
  return route.path.startsWith(path);
};

const toggleMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  if (mobileMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const closeMenu = () => {
  mobileMenuOpen.value = false;
  document.body.style.overflow = '';
};

const handleScroll = () => {
  scrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.body.style.overflow = '';
});
</script>

<style scoped>
.nav-active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #059669;
  border-radius: 9999px;
}
</style>
