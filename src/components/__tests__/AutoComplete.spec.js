import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AutoComplete from '../AutoComplete.vue'
import { nextTick } from 'vue'

vi.mock('lodash', () => ({
  debounce: (fn) => fn,
}))

describe('AutoComplete', () => {
  const mockApiFunction = vi.fn()
  let mockSuggestions

  beforeEach(() => {
    vi.clearAllMocks()
    mockSuggestions = [
      { id: '1', name: 'New York' },
      { id: '2', name: 'Boston' },
      { id: '3', name: 'Chicago' },
    ]
    mockApiFunction.mockResolvedValue(mockSuggestions)
  })

  it('renders properly with default props', () => {
    const wrapper = mount(AutoComplete, {
      props: {
        apiFunction: mockApiFunction,
      },
    })

    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('shows loading indicator during API call', async () => {
    let resolvePromise
    const apiPromise = new Promise((resolve) => {
      resolvePromise = resolve
    })

    const mockApiWithDelay = vi.fn().mockReturnValue(apiPromise)

    const wrapper = mount(AutoComplete, {
      props: {
        apiFunction: mockApiWithDelay,
        minChars: 1,
      },
    })

    await wrapper.find('input').setValue('n')

    expect(wrapper.find('.animate-spin').exists()).toBe(true)

    resolvePromise(mockSuggestions)
    await flushPromises()

    expect(wrapper.find('.animate-spin').exists()).toBe(false)
  })

  it('displays suggestions when input has required characters', async () => {
    const wrapper = mount(AutoComplete, {
      props: {
        apiFunction: mockApiFunction,
        minChars: 1,
      },
    })

    await wrapper.find('input').setValue('n')
    await flushPromises()

    expect(wrapper.findAll('li').length).toBe(mockSuggestions.length)
    mockSuggestions.forEach((suggestion, index) => {
      expect(wrapper.findAll('li')[index].text()).toBe(suggestion.name)
    })
  })

  it('does not call API when input has fewer than minChars', async () => {
    const wrapper = mount(AutoComplete, {
      props: {
        apiFunction: mockApiFunction,
        minChars: 3,
      },
    })

    await wrapper.find('input').setValue('ny')

    expect(mockApiFunction).not.toHaveBeenCalled()
    expect(wrapper.findAll('li').length).toBe(0)
  })

  it('shows "No results found" when API returns empty array', async () => {
    mockApiFunction.mockResolvedValue([])

    const wrapper = mount(AutoComplete, {
      props: {
        apiFunction: mockApiFunction,
        minChars: 1,
      },
    })

    await wrapper.find('input').setValue('xyz')
    await flushPromises()

    expect(wrapper.findAll('li').length).toBe(0)
    expect(wrapper.text()).toContain('No results found')
  })

  it('selects suggestion and emits select event when suggestion is clicked', async () => {
    const wrapper = mount(AutoComplete, {
      props: {
        apiFunction: mockApiFunction,
        minChars: 1,
      },
    })

    await wrapper.find('input').setValue('n')
    await flushPromises()
    await wrapper.findAll('li')[0].trigger('mousedown')

    expect(wrapper.find('input').element.value).toBe(mockSuggestions[0].name)
    expect(wrapper.emitted().select).toBeTruthy()
    expect(wrapper.emitted().select[0][0]).toEqual(mockSuggestions[0])

    await flushPromises()
    expect(wrapper.findAll('li').length).toBe(0)
  })

  it('emits search event when API is called', async () => {
    const searchQuery = 'new'
    const wrapper = mount(AutoComplete, {
      props: {
        apiFunction: mockApiFunction,
        minChars: 1,
      },
    })

    await wrapper.find('input').setValue(searchQuery)
    await flushPromises()

    expect(wrapper.emitted().search).toBeTruthy()
    expect(wrapper.emitted().search[0][0]).toBe(searchQuery)
  })

  it('resets component state when reset method is called', async () => {
    const wrapper = mount(AutoComplete, {
      props: {
        apiFunction: mockApiFunction,
        minChars: 1,
      },
    })

    await wrapper.find('input').setValue('new')
    await flushPromises()
    await wrapper.vm.reset()

    expect(wrapper.find('input').element.value).toBe('')
    expect(wrapper.findAll('li').length).toBe(0)
  })

  it('handles API errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockApiFunction.mockRejectedValue(new Error('API Error'))

    const wrapper = mount(AutoComplete, {
      props: {
        apiFunction: mockApiFunction,
        minChars: 1,
      },
    })

    await wrapper.find('input').setValue('error')
    await flushPromises()

    expect(consoleErrorSpy).toHaveBeenCalled()
    expect(wrapper.find('.animate-spin').exists()).toBe(false)

    consoleErrorSpy.mockRestore()
  })

  it('shows suggestions on focus', async () => {
    const wrapper = mount(AutoComplete, {
      props: {
        apiFunction: mockApiFunction,
      },
    })

    await wrapper.find('input').setValue('new')
    await flushPromises()

    wrapper.vm.showSuggestions = false
    await nextTick()
    await wrapper.find('input').trigger('focus')

    expect(wrapper.vm.showSuggestions).toBe(true)
  })

  it('hides suggestions on blur after timeout', async () => {
    vi.useFakeTimers()

    const wrapper = mount(AutoComplete, {
      props: {
        apiFunction: mockApiFunction,
      },
    })

    await wrapper.find('input').setValue('new')
    await flushPromises()
    await wrapper.find('input').trigger('blur')

    expect(wrapper.vm.showSuggestions).toBe(true)

    vi.advanceTimersByTime(150)
    await nextTick()
    expect(wrapper.vm.showSuggestions).toBe(false)

    vi.useRealTimers()
  })
})
