<script setup lang="ts">
import IconTick from '@/components/icons/IconTick.vue';

</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center py-20 bg-gray-50">
    <div class="text-center max-w-2xl mx-auto px-6">
      <IconTick></IconTick>
      <h1 class="text-4xl font-bold text-gray-800 mb-4">Coming Soon!</h1>
      <p class="text-lg text-gray-600 mb-8">This page is currently under development. Check back soon for more exciting
        features!</p>
      <router-link to="/"
        class="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
        Back to Home
      </router-link>
    </div>
  </div>
</template>
