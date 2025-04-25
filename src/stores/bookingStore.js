import { defineStore } from 'pinia'
import { stationApi } from '../services/api'

export const useBookingStore = defineStore('booking', {
  state: () => ({
    bookings: [],
    selectedBooking: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchBookingsByStationAndDateRange(stationId, startDate, endDate) {
      this.loading = true
      this.error = null

      try {
        const bookings = await stationApi.getBookingsByStationAndDateRange(
          stationId,
          startDate,
          endDate,
        )
        this.bookings = bookings
        return bookings
      } catch (error) {
        this.error = 'Failed to fetch bookings. Please try again.'
        console.error('Error in fetchBookingsByStationAndDateRange:', error)
        return []
      } finally {
        this.loading = false
      }
    },

    async getBookingDetails(stationId, bookingId) {
      this.loading = true
      this.error = null

      try {
        const booking = await stationApi.getBookingDetails(stationId, bookingId)
        this.selectedBooking = booking
        return booking
      } catch (error) {
        this.error = 'Failed to fetch booking details. Please try again.'
        console.error('Error in getBookingDetails:', error)
        return null
      } finally {
        this.loading = false
      }
    },

    clearSelectedBooking() {
      this.selectedBooking = null
    },

    setSelectedBooking(bookingId) {
      const booking = this.bookings.find((booking) => booking.id === bookingId)
      this.selectedBooking = booking
    },

    rescheduleBooking(updateBooking) {
      this.loading = true
      // TODO: make an API call to update the booking
      // For now, just update the local state
      this.bookings = this.bookings.map((booking) => {
        if (booking.id === updateBooking.id) {
          return updateBooking
        }
        return booking
      })
      this.loading = false
    },
  },
  persist: true,
})
