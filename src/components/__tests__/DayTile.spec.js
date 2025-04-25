import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DayTile from '../DayTile.vue'
import { BOOKING_TYPES } from '@/utils/constant'
import { addDays } from 'date-fns'

vi.mock('vuedraggable', () => ({
  default: {
    name: 'draggable',
    props: [
      'modelValue',
      'group',
      'animation',
      'itemKey',
      'ghostClass',
      'chosenClass',
      'dragClass',
      'handle',
    ],
    template:
      '<div class="mock-draggable"><slot name="item" v-for="item in modelValue" :element="item"></slot></div>',
    emits: ['update:modelValue', 'change'],
  },
}))

vi.mock('../icons/IconDrag.vue', () => ({
  default: {
    name: 'IconDrag',
    template: '<div class="mock-icon-drag"></div>',
  },
}))

describe('DayTile', () => {
  const today = new Date()
  const tomorrow = addDays(today, 1)

  const createWrapper = (props = {}) => {
    return mount(DayTile, {
      props: {
        day: {
          dayName: 'Mon',
          dayNumber: '1',
          date: today.toISOString(),
        },
        bookings: [],
        ...props,
      },
    })
  }

  it('renders the day name and number correctly', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.text-sm.font-medium').text()).toBe('Mon')
    expect(wrapper.find('.text-lg.font-bold').text()).toBe('1')
  })

  it('displays "No bookings" message when no bookings are provided', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('No bookings')
  })

  it('renders bookings when provided', () => {
    const bookings = [
      {
        id: 1,
        customerName: 'Khiet Tran',
        startDate: today.toISOString(),
        endDate: tomorrow.toISOString(),
        type: BOOKING_TYPES.PICKUP,
      },
    ]

    const wrapper = createWrapper({ bookings })
    expect(wrapper.text()).toContain('Khiet Tran')
    expect(wrapper.text()).toContain(BOOKING_TYPES.PICKUP)
    expect(wrapper.text()).not.toContain('No bookings')
  })

  it('applies correct classes for pickup bookings', () => {
    const bookings = [
      {
        id: 1,
        customerName: 'Khiet Tran',
        startDate: today.toISOString(),
        endDate: tomorrow.toISOString(),
        type: BOOKING_TYPES.PICKUP,
      },
    ]

    const wrapper = createWrapper({ bookings })
    const bookingEl = wrapper.find('.booking-draggable')
    expect(bookingEl.classes()).toContain('border-green-500')

    const labelEl = wrapper.find('.booking-label')
    expect(labelEl.classes()).toContain('bg-green-100')
    expect(labelEl.classes()).toContain('text-green-800')
  })

  it('only shows drag handle for reschedulable bookings', () => {
    const bookings = [
      {
        id: 1,
        customerName: 'Reschedulable',
        startDate: today.toISOString(),
        endDate: tomorrow.toISOString(),
        type: BOOKING_TYPES.PICKUP,
      },
      {
        id: 2,
        customerName: 'Not Reschedulable',
        startDate: addDays(today, -2).toISOString(),
        endDate: addDays(today, 2).toISOString(),
        type: BOOKING_TYPES.INPROGRESS,
      },
    ]

    const wrapper = createWrapper({ bookings })
    const bookingElements = wrapper.findAll('.booking-draggable')

    // First booking should have drag handle
    expect(bookingElements[0].find('.drag-handle').exists()).toBe(true)

    // Second booking shouldn't have drag handle
    expect(bookingElements[1].find('.drag-handle').exists()).toBe(false)
  })

  it('emits booking-click event when Details is clicked', async () => {
    const booking = {
      id: 1,
      customerName: 'Khiet Tran',
      startDate: today.toISOString(),
      endDate: tomorrow.toISOString(),
      type: BOOKING_TYPES.PICKUP,
    }

    const wrapper = createWrapper({ bookings: [booking] })
    await wrapper.find('.text-blue-600').trigger('click')

    expect(wrapper.emitted('booking-click')).toBeTruthy()
    expect(wrapper.emitted('booking-click')[0][0]).toEqual(booking)
  })

  it('emits booking-reschedule when a booking is dragged to a new date', async () => {
    const booking = {
      id: 1,
      customerName: 'Khiet Tran',
      startDate: today.toISOString(),
      endDate: tomorrow.toISOString(),
      type: BOOKING_TYPES.PICKUP,
    }

    const wrapper = createWrapper({ bookings: [booking] })

    await wrapper.vm.handleDragChange({
      added: {
        element: booking,
      },
    })

    expect(wrapper.emitted('booking-reschedule')).toBeTruthy()
    expect(wrapper.emitted('booking-reschedule')[0][0]).toHaveProperty('startDate')
    expect(wrapper.emitted('booking-reschedule')[0][0].id).toBe(booking.id)
  })

  it('does not reschedule non-pickup/return bookings', async () => {
    const booking = {
      id: 1,
      customerName: 'Khiet Tran',
      startDate: today.toISOString(),
      endDate: tomorrow.toISOString(),
      type: 'In Progress', // Not a pickup or return
    }

    const wrapper = createWrapper()

    await wrapper.vm.handleDragChange({
      added: {
        element: booking,
      },
    })

    expect(wrapper.emitted('booking-reschedule')).toBeFalsy()
  })
})
