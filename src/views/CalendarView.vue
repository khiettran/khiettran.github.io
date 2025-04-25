<template>
  <div class="calendar-page">
    <!-- Page Header -->
    <div class="bg-green-600 py-10 md:py-16">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-4" data-aos="fade-up">Booking Calendar</h1>
        <p class="text-green-50 max-w-2xl" data-aos="fade-up" data-aos-delay="100">
          Check availability, schedule pickups and returns, and manage bookings with our easy-to-use calendar system.
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-10">
      <div class="mb-8" data-aos="fade-up">
        <AutoComplete label="Select Station" placeholder="Search for a station..." :api-function="fetchStations"
          @select="handleStationSelect" class="bg-white shadow-lg rounded-lg p-6 border border-gray-100"
          :default-value="selectedStation?.name" />
      </div>

      <transition name="fade" mode="out-in">
        <div v-if="selectedStation" key="calendar" class="bg-white rounded-lg shadow-lg p-6 mb-6" data-aos="fade-up"
          data-aos-delay="200">
          <!-- Calendar Navigation -->
          <CalendarNavigation :current-date="currentWeekStart" @previous-week="navigateToPreviousWeek"
            @next-week="navigateToNextWeek" @date-change="handleDateChange" />

          <!-- Filtering Options -->
          <div class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100" data-aos="fade-up" data-aos-delay="300">
            <div class="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <h3 class="text-sm font-medium text-gray-700">Filter Bookings:</h3>
              <div class="flex flex-wrap gap-2">
                <button @click="setFilter('all')" class="px-4 py-2 text-sm rounded-full transition-colors"
                  :class="activeFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'">
                  All Bookings
                </button>
                <button @click="setFilter('pickup')" class="px-4 py-2 text-sm rounded-full transition-colors"
                  :class="activeFilter === 'pickup' ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'">
                  Pickups Only
                </button>
                <button @click="setFilter('return')" class="px-4 py-2 text-sm rounded-full transition-colors"
                  :class="activeFilter === 'return' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'">
                  Returns Only
                </button>
              </div>
            </div>
          </div>

          <!-- Calendar Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-7 gap-4" data-aos="fade-up" data-aos-delay="400">
            <DayTile v-for="day in weekDays" :key="day.formattedDate" :day="day" :bookings="getBookingsForDay(day.date)"
              @booking-click="viewBookingDetails" @booking-reschedule="handleBookingReschedule" />
          </div>
        </div>

        <div v-else key="empty-state" class="bg-gray-50 rounded-lg p-12 text-center transition-all" data-aos="fade-up"
          data-aos-delay="200">
          <div class="max-w-md mx-auto">
            <IconCalendar class="text-green-500"></IconCalendar>
            <h2 class="text-2xl font-bold text-green-500 mb-2 mt-4">Empty State</h2>
            <p class="text-gray-500 mb-6">Please select a station above to view available campervans and booking times.
            </p>
          </div>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="loading" class="flex justify-center mt-6">
          <div class="loader">
            <div class="spinner"></div>
            <p class="text-gray-600 mt-4">Loading bookings...</p>
          </div>
        </div>
      </transition>
    </div>

    <!-- Notification -->
    <transition name="slide-fade">
      <div v-if="notificationMessage"
        class="fixed bottom-5 right-5 p-4 rounded-lg shadow-lg max-w-md z-50 flex items-center bg-green-100 border-l-4 border-green-500 text-green-700">
        <div class="mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd" />
          </svg>
        </div>
        {{ notificationMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import * as dateFns from 'date-fns';
import { useStationStore } from '@/stores/stationStore';
import { useBookingStore } from '@/stores/bookingStore';
import { getWeekDays, getNextWeek, getPreviousWeek } from '@/utils/dateUtils';
import AutoComplete from '@/components/AutoComplete.vue';
import DayTile from '@/components/DayTile.vue';
import CalendarNavigation from '@/components/CalendarNavigation.vue';
import { BOOKING_TYPES } from '@/utils/constant';
import IconCalendar from '@/components/icons/IconCalendar.vue';

const { startOfToday, startOfWeek, endOfWeek, parseISO, isBefore, isAfter, isSameDay } = dateFns;

const router = useRouter();
const stationStore = useStationStore();
const bookingStore = useBookingStore();
const currentWeekStart = ref(startOfToday());
const selectedStation = ref(stationStore.selectedStation);
const activeFilter = ref('all');
const loading = computed(() => bookingStore.loading);
const weekDays = computed(() => getWeekDays(currentWeekStart.value));
const notificationMessage = ref('');
const notificationType = ref('success');

const navigateToPreviousWeek = () => {
  currentWeekStart.value = getPreviousWeek(currentWeekStart.value);
};

const navigateToNextWeek = () => {
  currentWeekStart.value = getNextWeek(currentWeekStart.value);
};

const handleDateChange = (date) => {
  currentWeekStart.value = date;
};

const handleStationSelect = async (station) => {
  selectedStation.value = station;
  stationStore.setSelectedStation(station);
  await fetchBookingsForCurrentWeek();
};

const fetchStations = (query = '') => {
  return stationStore.fetchStations(query);
};

const setFilter = (filter) => {
  activeFilter.value = filter;
};

const viewBookingDetails = (booking) => {
  router.push({ name: 'bookingDetail', params: { id: booking.id, stationId: booking.pickupReturnStationId } });
};

const fetchBookingsForCurrentWeek = async () => {
  if (!selectedStation.value) return;

  const startDate = startOfWeek(currentWeekStart.value, { weekStartsOn: 1 });
  const endDate = endOfWeek(currentWeekStart.value, { weekStartsOn: 1 });

  try {
    await bookingStore.fetchBookingsByStationAndDateRange(
      selectedStation.value.id,
      startDate,
      endDate
    );
  } catch (error) {
    showNotification('Error loading bookings', 'error');
    console.error('Error fetching bookings:', error);
  }
};

const handleBookingReschedule = async (updatedBooking) => {
  try {
    showNotification('Rescheduling booking...', 'info');

    const originalBooking = bookingStore.bookings.find(b => b.id === updatedBooking.id);
    if (!originalBooking) {
      throw new Error('Booking not found');
    }

    await bookingStore.rescheduleBooking(updatedBooking);
    showNotification('Booking rescheduled successfully', 'success');
  } catch (error) {
    console.error('Error rescheduling booking:', error);
    showNotification('Failed to reschedule booking. Please try again.', 'error');
  }
};

watch(currentWeekStart, async () => {
  if (selectedStation.value) {
    await fetchBookingsForCurrentWeek();
  }
});

const showNotification = (message, type = 'success') => {
  notificationMessage.value = message;
  notificationType.value = type;

  setTimeout(() => {
    notificationMessage.value = '';
  }, 3000);
};

const getBookingType = (booking, day) => {
  const bookingStartDate = parseISO(booking.startDate);
  const bookingEndDate = parseISO(booking.endDate);
  const currentDate = new Date(day);

  if (isSameDay(currentDate, bookingStartDate)) {
    return BOOKING_TYPES.PICKUP;
  } else if (isSameDay(currentDate, bookingEndDate)) {
    return BOOKING_TYPES.RETURN;
  } else {
    return BOOKING_TYPES.INPROGRESS;
  }
};

const getBookingsForDay = (day) => {
  if (!bookingStore.bookings || bookingStore.bookings.length === 0) return [];

  const bookingDays = bookingStore.bookings.filter(booking => {
    const bookingStart = parseISO(booking.startDate);
    const bookingEnd = parseISO(booking.endDate);
    const dayDate = new Date(day);

    const dayIsBetweenBookingDates =
      (isAfter(dayDate, bookingStart) || isSameDay(dayDate, bookingStart)) &&
      (isBefore(dayDate, bookingEnd) || isSameDay(dayDate, bookingEnd));

    if (activeFilter.value === 'pickup' && !isSameDay(dayDate, bookingStart)) {
      return false;
    }

    if (activeFilter.value === 'return' && !isSameDay(dayDate, bookingEnd)) {
      return false;
    }

    return dayIsBetweenBookingDates;
  });

  return bookingDays.map(booking => ({
    ...booking,
    type: getBookingType(booking, day)
  }));
};

onMounted(async () => {
  await stationStore.fetchStations();
});
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
