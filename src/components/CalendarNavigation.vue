<template>
  <div class="bg-white rounded-lg shadow-sm p-3 mb-4">
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
      <!-- Weekly Navigation -->
      <div class="flex items-center space-x-2">
        <button @click="navigateToPreviousWeek" class="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Previous week">
          <IconLeftArrow></IconLeftArrow>
        </button>

        <div class="text-lg font-semibold">
          {{ weekLabel }}
        </div>

        <button @click="navigateToNextWeek" class="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Next week">
          <IconRightArrow></IconRightArrow>
        </button>
      </div>

      <!-- Month & Year Selection -->
      <div class="flex items-center space-x-3">
        <div class="relative">
          <select v-model="selectedMonth" @change="handleMonthYearChange"
            class="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500">
            <option v-for="(month, index) in months" :key="index" :value="index">
              {{ month }}
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <IconDownArrow></IconDownArrow>
          </div>
        </div>

        <div class="relative">
          <select v-model="selectedYear" @change="handleMonthYearChange"
            class="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500">
            <option v-for="year in yearRange" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <IconDownArrow></IconDownArrow>
          </div>
        </div>

        <button @click="goToToday"
          class="today-btn px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm rounded transition-colors">
          Today
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { format, getMonth, getYear, startOfWeek, endOfWeek } from 'date-fns';
import IconDownArrow from './icons/IconDownArrow.vue';
import IconLeftArrow from './icons/IconLeftArrow.vue';
import IconRightArrow from './icons/IconRightArrow.vue';

const props = defineProps({
  currentDate: {
    type: Date,
    required: true
  }
});

const emit = defineEmits(['previous-week', 'next-week', 'date-change']);

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const currentYear = new Date().getFullYear();
const yearRange = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

const selectedMonth = ref(getMonth(props.currentDate));
const selectedYear = ref(getYear(props.currentDate));

const weekLabel = computed(() => {
  const start = startOfWeek(props.currentDate, { weekStartsOn: 1 });
  const end = endOfWeek(props.currentDate, { weekStartsOn: 1 });

  const startMonth = format(start, 'MMMM');
  const endMonth = format(end, 'MMMM');

  if (startMonth === endMonth) {
    return `${startMonth} ${format(start, 'd')} - ${format(end, 'd')}, ${format(end, 'yyyy')}`;
  } else {
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d')}, ${format(end, 'yyyy')}`;
  }
});

const navigateToPreviousWeek = () => {
  emit('previous-week');
};

const navigateToNextWeek = () => {
  emit('next-week');
};

const handleMonthYearChange = () => {
  const newDate = new Date(selectedYear.value, selectedMonth.value, 1);
  emit('date-change', newDate);
};

const goToToday = () => {
  const today = new Date();
  selectedMonth.value = getMonth(today);
  selectedYear.value = getYear(today);
  emit('date-change', today);
};

watch(() => props.currentDate, (newDate) => {
  selectedMonth.value = getMonth(newDate);
  selectedYear.value = getYear(newDate);
}, { immediate: true });
</script>
