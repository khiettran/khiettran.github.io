<template>
  <div
    class="bg-white rounded-lg shadow border p-2 flex flex-col h-full min-h-[120px] sm:min-h-[150px] day-tile-wrapper">
    <div class="text-center border-b pb-1 mb-1">
      <div class="flex items-center justify-between sm:justify-center">
        <div class="text-sm font-medium text-gray-500">{{ day.dayName }}</div>
        <div class="text-lg font-bold sm:ml-2">{{ day.dayNumber }}</div>
      </div>
    </div>

    <div class="overflow-y-auto flex-grow">
      <draggable v-model="localBookings" group="bookings" :animation="200" itemKey="id"
        class="min-h-[30px] space-y-1 drop-area mb-2" @change="handleDragChange" ghost-class="booking-ghost"
        chosen-class="booking-chosen" drag-class="booking-dragging" handle=".drag-handle">
        <template #item="{ element: booking }">
          <div :id="`booking-${booking.id}`"
            class="text-xs p-2 rounded no-text-select booking-draggable transition-all duration-200" :class="[
              getBookingClasses(booking),
              !isBookingReschedulable(booking) ? 'opacity-80' : ''
            ]">
            <div class="flex justify-between items-center">
              <span class="font-medium">{{ booking.customerName }}</span>
              <span v-if="isBookingReschedulable(booking)" class="drag-handle">
                <IconDrag></IconDrag>
              </span>
            </div>
            <div class="flex mt-1 flex-col">
              <span class="booking-label rounded-full px-2 text-xs inline-flex w-max" :class="getLabelClasses(booking)">
                {{ booking.type }}
              </span>
              <span class="text-blue-600 hover:text-blue-800 text-xs cursor-pointer mt-4 text-center"
                @click.stop="$emit('booking-click', booking)">
                Details
              </span>
            </div>
          </div>
        </template>
      </draggable>

      <div v-if="props.bookings.length === 0" class="text-gray-400 text-xs text-center mt-2">
        No bookings
      </div>
    </div>
  </div>
</template>

<script setup>
import { format, parseISO, isSameDay } from 'date-fns';
import draggable from 'vuedraggable';
import { BOOKING_TYPES } from '@/utils/constant';
import IconDrag from './icons/IconDrag.vue';
import { computed } from 'vue';

const props = defineProps({
  day: {
    type: Object,
    required: true
  },
  bookings: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['booking-click', 'booking-reschedule', 'update:bookings']);

const localBookings = computed({
  get: () => props.bookings,
  set: (newValue) => {
    emit('update:bookings', newValue);
  }
});

const isBookingReschedulable = (booking) => {
  const bookingStartDate = parseISO(booking.startDate);
  const bookingEndDate = parseISO(booking.endDate);
  const currentDate = new Date(props.day.date);

  return isSameDay(currentDate, bookingStartDate) || isSameDay(currentDate, bookingEndDate);
};

const getLabelClasses = (booking) => {
  const bookingStartDate = parseISO(booking.startDate);
  const bookingEndDate = parseISO(booking.endDate);
  const currentDate = new Date(props.day.date);

  if (isSameDay(currentDate, bookingStartDate)) {
    return 'bg-green-100 text-green-800';
  } else if (isSameDay(currentDate, bookingEndDate)) {
    return 'bg-blue-100 text-blue-800';
  } else {
    return 'bg-yellow-200 text-yellow-900';
  }
};

const getBookingClasses = (booking) => {
  const bookingStartDate = parseISO(booking.startDate);
  const bookingEndDate = parseISO(booking.endDate);
  const currentDate = new Date(props.day.date);

  const bookingClasses = 'border-l-4 bg-white shadow-sm';

  if (isSameDay(currentDate, bookingStartDate)) {
    return `${bookingClasses} border-green-500 hover:shadow`;
  } else if (isSameDay(currentDate, bookingEndDate)) {
    return `${bookingClasses} border-blue-500 hover:shadow`;
  } else {
    return `${bookingClasses} border-yellow-500`;
  }
};

const handleDragChange = (evt) => {
  if (evt.added) {
    const booking = evt.added.element;
    const targetDate = new Date(props.day.date);
    const targetDateFormatted = format(targetDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

    const isOriginalPickup = booking.type === BOOKING_TYPES.PICKUP;
    const isOriginalReturn = booking.type === BOOKING_TYPES.RETURN;

    const updatedBooking = { ...booking };

    if (isOriginalReturn) {
      updatedBooking.endDate = targetDateFormatted;
    } else if (isOriginalPickup) {
      updatedBooking.startDate = targetDateFormatted;
    }

    if (isOriginalPickup || isOriginalReturn) {
      emit('booking-reschedule', updatedBooking);
    }
  }
};

</script>

<style scoped>
.no-text-select {
  user-select: none;
}

.booking-ghost {
  opacity: 0.5;
  background: #c8ebfb !important;
  border: 2px dashed #3b82f6;
}

.booking-chosen {
  box-shadow: 0 0 0 2px #3b82f6;
}

.booking-dragging {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.booking-draggable {
  transition: all 0.2s ease;
}

.booking-draggable:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.drop-area {
  min-height: 30px;
  padding: 4px;
  transition: all 0.3s ease;
}

.drop-area.sortable-drag-active {
  background-color: rgba(59, 130, 246, 0.05);
  border: 2px dashed #3b82f6;
  border-radius: 0.375rem;
}

.drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  cursor: -webkit-grab;
  cursor: grab;
  opacity: 0.7;
  transition: opacity 0.2s;
  width: 20px;
  height: 20px;
}

.drag-handle:hover {
  opacity: 1;
}

.drag-handle:active {
  cursor: -webkit-grabbing;
  cursor: grabbing;
}
</style>
