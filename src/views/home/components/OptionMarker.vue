<template>
  <span
    class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3"
  >
    {{ markerLetter }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
})

const markerLetter = computed(() => String.fromCharCode(65 + props.index))
</script>
