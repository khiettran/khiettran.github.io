import { defineStore } from 'pinia'
import { stationApi } from '../services/api'

export const useStationStore = defineStore('station', {
  state: () => ({
    stations: [],
    selectedStation: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchStations(search = '') {
      this.loading = true
      this.error = null

      try {
        const stations = await stationApi.getStations(search)
        this.stations = stations
        return stations
      } catch (error) {
        this.error = 'Failed to fetch stations. Please try again.'
        console.error('Error in fetchStations:', error)
        return []
      } finally {
        this.loading = false
      }
    },

    setSelectedStation(station) {
      this.selectedStation = station
    },
  },
})
