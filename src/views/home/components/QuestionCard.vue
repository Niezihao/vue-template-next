<template>
  <div
    :class="[
      'rounded-xl shadow-md p-6 mb-8 transform transition-all duration-500 card-hover',
      { 'scale-95 opacity-70': isTransitioning },
    ]"
  >
    <!-- 题目头部 -->
    <div class="flex justify-between items-center mb-4">
      <span class="text-primary font-bold text-lg">题目 ID: {{ question?.id || '加载中' }}</span>
      <div class="flex items-center space-x-4">
        <slot name="header-extra"></slot>
        <span class="text-gray-500 text-sm">{{ index + 1 }}/{{ total }}</span>
      </div>
    </div>

    <!-- 题目内容 -->
    <div class="prose max-w-none mb-6 text-lg leading-relaxed">
      <p v-if="!question">加载中...</p>
      <div v-else v-html="question.title"></div>
    </div>

    <!-- 选项插槽 -->
    <div
      v-if="question?.options?.length"
      class="space-y-3 mb-6 opacity-100 transition-opacity duration-500"
    >
      <slot name="options"></slot>
    </div>

    <!-- 控制按钮 -->
    <div class="flex justify-between items-center mt-8">
      <button
        :disabled="index === 0"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        @click="$emit('prev')"
      >
        <i class="fa fa-arrow-left mr-1"></i> 上一题
      </button>

      <div class="flex space-x-2">
        <button
          class="p-2 text-gray-500 hover:text-yellow-500 transition-colors"
          @click="$emit('toggle-mark')"
        >
          <slot name="bookmark-icon"></slot>
        </button>
        <button
          class="p-2 text-gray-500 hover:text-blue-500 transition-colors"
          @click="$emit('show-hint')"
        >
          <span class="text-lg">💡</span>
        </button>
      </div>

      <button
        :disabled="index === total - 1"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        @click="$emit('next')"
      >
        下一题 <i class="fa fa-arrow-right ml-1"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Question } from '../types'

defineProps({
  question: {
    type: Object as () => Question | null,
    default: null,
  },
  index: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  isTransitioning: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['prev', 'next', 'toggle-mark', 'show-hint'])
</script>
