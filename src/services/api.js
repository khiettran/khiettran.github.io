import axios from 'axios'
import { parseISO } from 'date-fns'
import { checkDateRangeOverlap } from '@/utils/dateUtils'

const apiClient = axios.create({
  baseURL: 'https://605c94c36d85de00170da8b4.mockapi.io',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const stationApi = {
  getStations: async (search = '') => {
    try {
      const response = await apiClient.get('/stations')
      const stations = response.data

      if (!search) return stations

      return stations.filter((station) => station.name.toLowerCase().includes(search.toLowerCase()))
    } catch (error) {
      console.error('Error fetching stations:', error)
      throw error
    }
  },

  getBookingsByStationAndDateRange: async (stationId, startDate, endDate) => {
    try {
      const response = await apiClient.get(`/stations/${stationId}/bookings`)
      const allBookings = response.data

      const stationBookings = allBookings.filter(
        (booking) => booking.pickupReturnStationId === stationId,
      )
      const filteredBookings = stationBookings.filter((booking) => {
        const bookingStart = parseISO(booking.startDate)
        const bookingEnd = parseISO(booking.endDate)
        const overlaps = checkDateRangeOverlap(bookingStart, bookingEnd, startDate, endDate)

        return overlaps
      })

      return filteredBookings
    } catch (error) {
      console.error('Error fetching bookings:', error)
      throw error
    }
  },

  getBookingDetails: async (stationId, bookingId) => {
    try {
      const response = await apiClient.get(`/stations/${stationId}/bookings/${bookingId}`)
      const booking = response.data
      if (!booking) {
        throw new Error('Booking not found')
      }
      return booking
    } catch (error) {
      console.error('Error fetching booking details:', error)
      throw error
    }
  },
}
