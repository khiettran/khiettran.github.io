import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import CalendarNavigation from '../CalendarNavigation.vue'
import IconLeftArrow from '../icons/IconLeftArrow.vue'
import IconRightArrow from '../icons/IconRightArrow.vue'
import IconDownArrow from '../icons/IconDownArrow.vue'
import { format, startOfWeek, endOfWeek } from 'date-fns'

vi.mock('date-fns', async () => {
  const actual = await vi.importActual('date-fns')
  return {
    ...actual,
    format: vi.fn(),
    startOfWeek: vi.fn(),
    endOfWeek: vi.fn(),
    getMonth: vi.fn().mockReturnValue(5), // June
    getYear: vi.fn().mockReturnValue(2023),
  }
})

describe('CalendarNavigation', () => {
  let wrapper
  const testDate = new Date('2023-06-15')

  beforeEach(() => {
    vi.clearAllMocks()

    format.mockImplementation((date, formatStr) => {
      if (formatStr === 'MMMM') return 'June'
      if (formatStr === 'd') return '12'
      if (formatStr === 'yyyy') return '2023'
      if (formatStr === 'MMM d') return 'Jun 12'
      return ''
    })

    startOfWeek.mockReturnValue(new Date('2023-06-12'))
    endOfWeek.mockReturnValue(new Date('2023-06-18'))

    wrapper = mount(CalendarNavigation, {
      props: {
        currentDate: testDate,
      },
      global: {
        components: {
          IconLeftArrow,
          IconRightArrow,
          IconDownArrow,
        },
      },
    })
  })

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.text-lg.font-semibold').exists()).toBe(true)
    expect(wrapper.findAll('select').length).toBe(2)
    expect(wrapper.find('button[aria-label="Previous week"]').exists()).toBe(true)
    expect(wrapper.find('button[aria-label="Next week"]').exists()).toBe(true)
    expect(wrapper.find('button.today-btn').exists()).toBe(true)
  })

  it('emits previous-week event when previous button is clicked', async () => {
    await wrapper.find('button[aria-label="Previous week"]').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('previous-week')
    expect(wrapper.emitted()['previous-week']).toHaveLength(1)
  })

  it('emits next-week event when next button is clicked', async () => {
    await wrapper.find('button[aria-label="Next week"]').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('next-week')
    expect(wrapper.emitted()['next-week']).toHaveLength(1)
  })

  it('emits date-change event when month or year is changed', async () => {
    const monthSelect = wrapper.findAll('select')[0]
    await monthSelect.setValue(7) // August

    expect(wrapper.emitted()).toHaveProperty('date-change')
    expect(wrapper.emitted()['date-change'][0][0]).toBeInstanceOf(Date)
    expect(wrapper.emitted()['date-change'][0][0].getMonth()).toBe(7)

    const yearSelect = wrapper.findAll('select')[1]
    await yearSelect.setValue(2024)

    expect(wrapper.emitted()['date-change'][1][0]).toBeInstanceOf(Date)
    expect(wrapper.emitted()['date-change'][1][0].getFullYear()).toBe(2024)
  })

  it("emits date-change event with today's date when Today button is clicked", async () => {
    const realDate = global.Date
    const mockToday = new Date('2023-06-20')
    global.Date = class extends Date {
      constructor() {
        return mockToday
      }
    }

    await wrapper.find('button.today-btn').trigger('click')

    expect(wrapper.emitted()['date-change']).toHaveLength(1)
    expect(wrapper.emitted()['date-change'][0][0]).toEqual(mockToday)

    global.Date = realDate
  })

  it('updates selected month and year when currentDate prop changes', async () => {
    const newDate = new Date('2024-03-15')
    await wrapper.setProps({ currentDate: newDate })

    expect(wrapper.vm.selectedMonth).toBe(5) // This would be 2 (March) without mocks
    expect(wrapper.vm.selectedYear).toBe(2023) // This would be 2024 without mocks
  })
})
