<template>
  <div class="booking-detail-page">
    <!-- Page Header -->
    <div class="bg-blue-600 py-10 md:py-16">
      <div class="container mx-auto px-4">
        <div class="flex items-center mb-4">
          <router-link to="/calendar" class="flex items-center text-white hover:text-blue-100 transition-colors"
            data-aos="fade-right">
            <IconLeftArrow2></IconLeftArrow2>
            Back to Calendar
          </router-link>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold text-white" data-aos="fade-up">
          Booking Details
        </h1>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-10">
      <transition name="fade" mode="out-in">
        <div v-if="loading" key="loading" class="flex justify-center py-20">
          <div class="flex flex-col items-center">
            <div class="border-4 border-t-blue-500 rounded-full w-12 h-12 animate-spin"></div>
            <p class="text-gray-600 mt-4">Loading booking details...</p>
          </div>
        </div>

        <div v-else-if="error" key="error" class="bg-red-100 border-l-4 border-red-500 p-6 rounded-lg mb-6"
          data-aos="fade-up">
          <div class="flex">
            <IconError></IconError>
            <p class="text-red-700">{{ error }}</p>
          </div>
        </div>

        <div v-else-if="booking" key="booking" data-aos="fade-up" class="space-y-8">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="p-6 sm:p-8">
              <!-- Booking Header -->
              <div class="mb-8 pb-6 border-b border-gray-200">
                <div class="flex flex-col md:flex-row md:items-center justify-between">
                  <h2 class="text-2xl font-bold text-gray-800">
                    Booking #{{ booking.id }}
                  </h2>
                  <div class="mt-2 md:mt-0 flex items-center">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <span class="h-2 w-2 mr-1 rounded-full bg-green-500"></span>
                      Confirmed
                    </span>
                  </div>
                </div>
              </div>

              <div class="space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <!-- Customer Information -->
                  <div class="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    data-aos="fade-up" data-aos-delay="100">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <IconUser></IconUser>
                      Customer Information
                    </h3>
                    <div class="space-y-3">
                      <div class="flex flex-col">
                        <span class="text-sm text-gray-500">Name</span>
                        <span class="font-medium text-gray-800">{{ booking.customerName }}</span>
                      </div>

                      <div class="flex flex-col">
                        <span class="text-sm text-gray-500">Email</span>
                        <span class="font-medium text-gray-800">{{ booking.customerEmail || 'khiet.tran@nfq.com'
                        }}</span>
                      </div>

                      <div class="flex flex-col">
                        <span class="text-sm text-gray-500">Phone</span>
                        <span class="font-medium text-gray-800">{{ booking.customerPhone || '+84 986 880 200' }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Station Information -->
                  <div class="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    data-aos="fade-up" data-aos-delay="200">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <IconLocation></IconLocation>
                      Station Information
                    </h3>
                    <div class="space-y-3">
                      <div class="flex flex-col">
                        <span class="text-sm text-gray-500">Station Name</span>
                        <span class="font-medium text-gray-800">{{ stationName }}</span>
                      </div>

                      <div class="flex flex-col">
                        <span class="text-sm text-gray-500">Address</span>
                        <span class="font-medium text-gray-800">123 Camper Street, Station City</span>
                      </div>

                      <div class="flex flex-col">
                        <span class="text-sm text-gray-500">Contact</span>
                        <span class="font-medium text-gray-800">+84 986 880 200</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Booking Schedule -->
                <div class="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  data-aos="fade-up" data-aos-delay="300">
                  <h3 class="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                    <IconCalendarFill></IconCalendarFill>
                    Booking Schedule
                  </h3>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-green-50 p-4 rounded-lg border border-green-100 hover:shadow-md transition-shadow">
                      <div class="flex items-start">
                        <div class="bg-green-100 p-3 rounded-full mr-4">
                          <IconCalendar class="h-6 w-6 mb-0 text-green-500"></IconCalendar>
                        </div>
                        <div>
                          <h4 class="text-sm font-medium text-gray-500">Pickup Date</h4>
                          <p class="text-lg font-medium text-green-700">{{ formatDate(booking.startDate) }}</p>
                          <p class="text-sm text-gray-500">{{ formatTime(booking.startDate) }}</p>
                        </div>
                      </div>
                    </div>

                    <div class="bg-blue-50 p-4 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                      <div class="flex items-start">
                        <div class="bg-blue-100 p-3 rounded-full mr-4">
                          <IconCalendar class="h-6 w-6 mb-0 text-blue-700"></IconCalendar>
                        </div>
                        <div>
                          <h4 class="text-sm font-medium text-gray-500">Return Date</h4>
                          <p class="text-lg font-medium text-blue-700">{{ formatDate(booking.endDate) }}</p>
                          <p class="text-sm text-gray-500">{{ formatTime(booking.endDate) }}</p>
                        </div>
                      </div>
                    </div>

                    <div class="bg-purple-50 p-4 rounded-lg border border-purple-100 hover:shadow-md transition-shadow">
                      <div class="flex items-start">
                        <div class="bg-purple-100 p-3 rounded-full mr-4">
                          <IconClock></IconClock>
                        </div>
                        <div>
                          <h4 class="text-sm font-medium text-gray-500">Duration</h4>
                          <p class="text-lg font-medium text-purple-700">{{ bookingDuration }} days</p>
                          <p class="text-sm text-gray-500">Total trip length</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Vehicle Information -->
                <div class="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  data-aos="fade-up" data-aos-delay="400">
                  <h3 class="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                    <IconVehicle></IconVehicle>
                    Vehicle Information
                  </h3>

                  <div class="flex flex-col md:flex-row">
                    <div class="md:w-1/3 mb-4 md:mb-0 pr-0 md:pr-6">
                      <img src="/images/camper1.png" alt="Campervan" class="rounded-lg w-full h-48 object-contain" />
                    </div>
                    <div class="md:w-2/3">
                      <h4 class="text-xl font-bold text-gray-800 mb-2">{{ booking.vehicleName || 'Deluxe Campervan' }}
                      </h4>
                      <p class="text-gray-600 mb-4">Fully equipped campervan with all the amenities you need for a
                        comfortable journey.</p>

                      <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p class="text-sm text-gray-500">License Plate</p>
                          <p class="font-medium">{{ booking.vehicleLicense || 'ABC-123' }}</p>
                        </div>
                        <div>
                          <p class="text-sm text-gray-500">Model</p>
                          <p class="font-medium">{{ booking.vehicleModel || 'Traveler XL' }}</p>
                        </div>
                        <div>
                          <p class="text-sm text-gray-500">Year</p>
                          <p class="font-medium">{{ booking.vehicleYear || '2023' }}</p>
                        </div>
                        <div>
                          <p class="text-sm text-gray-500">Seats/Sleeps</p>
                          <p class="font-medium">4/4</p>
                        </div>
                      </div>

                      <div class="flex flex-wrap gap-2">
                        <span class="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">Air
                          Conditioning</span>
                        <span class="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">Kitchen</span>
                        <span class="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">Shower</span>
                        <span class="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">Toilet</span>
                        <span class="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">Solar
                          Panels</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-4 justify-end">
                <button class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                  Print Booking
                </button>
                <button
                  class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center">
                  <IconPencil></IconPencil>
                  Edit Booking
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else key="not-found" class="bg-yellow-100 border-l-4 border-yellow-500 p-6 rounded-lg"
          data-aos="fade-up">
          <div class="flex">
            <IconInfo></IconInfo>
            <div>
              <h3 class="text-lg font-medium text-yellow-700 mb-1">Booking Not Found</h3>
              <p class="text-yellow-700">The requested booking could not be found. It may have been removed or you don't
                have permission to view it.</p>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { useBookingStore } from '@/stores/bookingStore';
import { useStationStore } from '@/stores/stationStore';
import { format } from 'date-fns';
import { calculateDuration } from '@/utils/dateUtils';
import IconLeftArrow2 from '@/components/icons/IconLeftArrow2.vue';
import IconError from '@/components/icons/IconError.vue';
import IconUser from '@/components/icons/IconUser.vue';
import IconLocation from '@/components/icons/IconLocation.vue';
import IconCalendarFill from '@/components/icons/IconCalendarFill.vue';
import IconCalendar from '@/components/icons/IconCalendar.vue';
import IconClock from '@/components/icons/IconClock.vue';
import IconVehicle from '@/components/icons/IconVehicle.vue';
import IconPencil from '@/components/icons/IconPencil.vue';
import IconInfo from '@/components/icons/IconInfo.vue';

const route = useRoute();
const bookingStore = useBookingStore();
const stationStore = useStationStore();

const loading = computed(() => bookingStore.loading);
const error = computed(() => bookingStore.error);
const booking = computed(() => bookingStore.selectedBooking);

const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMMM d, yyyy');
};

const formatTime = (dateString) => {
  return format(new Date(dateString), 'hh:mm a');
};

const bookingDuration = computed(() => {
  if (!booking.value) return 0;

  return calculateDuration(booking.value.startDate, booking.value.endDate);
});

const stationName = computed(() => {
  if (!booking.value) return '';

  const station = stationStore.stations.find(s => s.id === booking.value.pickupReturnStationId);
  return station ? station.name : 'Unknown Station';
});


onBeforeMount(async () => {
  const bookingId = route.params.id;
  const stationId = route.params.stationId;
  await bookingStore.getBookingDetails(stationId, bookingId);
  if (stationStore.stations.length === 0) {
    await stationStore.fetchStations();
  }
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
</style>
