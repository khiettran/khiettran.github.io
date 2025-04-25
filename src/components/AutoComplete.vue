<template>
  <div class="relative">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>
    <div class="relative">
      <input :id="id" v-model="searchQuery" type="text"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-300 focus:border-green-600"
        :placeholder="placeholder" @input="handleInput" @focus="showSuggestions = true" @blur="handleBlur" />
      <div v-if="isLoading" class="absolute inset-y-0 right-0 flex items-center pr-3">
        <div class="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent"></div>
      </div>
    </div>

    <div v-if="showSuggestions && filteredSuggestions.length > 0"
      class="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
      <ul>
        <li v-for="suggestion in filteredSuggestions" :key="suggestion.id" @mousedown="selectSuggestion(suggestion)"
          class="cursor-pointer select-none relative py-3 px-4 hover:bg-green-50 mx-1">
          {{ suggestion.name }}
        </li>
      </ul>
    </div>

    <div v-else-if="showSuggestions && searchQuery && !isLoading"
      class="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md py-2 px-4">
      No results found
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { debounce } from 'lodash';

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search...'
  },
  apiFunction: {
    type: Function,
    required: true
  },
  id: {
    type: String,
    default: `autocomplete-${Math.random().toString(36).substr(2, 9)}`
  },
  minChars: {
    type: Number,
    default: 2
  }
});

const emit = defineEmits(['select', 'search']);

const searchQuery = ref('');
const suggestions = ref([]);
const selectedSuggestion = ref(null);
const isLoading = ref(false);
const showSuggestions = ref(false);

const filteredSuggestions = ref([]);

const fetchSuggestions = debounce(async () => {
  if (searchQuery.value.length < props.minChars) {
    filteredSuggestions.value = [];
    isLoading.value = false;
    return;
  }

  isLoading.value = true;

  try {
    const data = await props.apiFunction(searchQuery.value);
    suggestions.value = data;
    filteredSuggestions.value = data;
    emit('search', searchQuery.value);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
  } finally {
    isLoading.value = false;
  }
}, 300);

const handleInput = () => {
  fetchSuggestions();
  showSuggestions.value = true;
};

const selectSuggestion = (suggestion) => {
  selectedSuggestion.value = suggestion;
  searchQuery.value = suggestion.name;
  showSuggestions.value = false;
  emit('select', suggestion);
};

const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 150);
};

watch(() => selectedSuggestion.value, (newValue) => {
  if (!newValue) {
    searchQuery.value = '';
  }
}, { deep: true });

const reset = () => {
  searchQuery.value = '';
  selectedSuggestion.value = null;
  showSuggestions.value = false;
};

defineExpose({
  reset
});
</script>
