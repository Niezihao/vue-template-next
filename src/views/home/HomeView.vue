<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- 头部 -->
    <header class="mb-10 text-center">
      <h1 class="text-[clamp(1.8rem,4vw,2.5rem)] font-bold text-primary mb-2 text-shadow">
        <i class="fa fa-book mr-2"></i>真题浏览应用
      </h1>
      <p class="text-gray-600">
        按 <kbd class="px-2 py-1 bg-gray-100 rounded text-sm">Enter</kbd> 键查看下一题
      </p>
    </header>

    <!-- 题目卡片 -->
    <question-card
      :question="questionData[currentIndex]"
      :index="currentIndex"
      :total="totalQuestions"
      :is-transitioning="isTransitioning"
      @prev="prevQuestion"
      @next="nextQuestion"
      @toggle-mark="toggleMark"
      @show-hint="showHint"
    >
      <!-- 选项区域插槽 -->
      <template v-slot:options>
        <div
          v-for="(option, index) in questionData[currentIndex]?.options"
          :key="index"
          class="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <option-marker :index="index" />
          <p>{{ option }}</p>
        </div>
      </template>
    </question-card>

    <!-- 底部 -->
    <footer class="text-center text-gray-500 text-sm mt-10">
      <p>
        © 2025 真题浏览应用 | 按
        <kbd class="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd> 键继续
      </p>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useQuestions } from './composables/useQuestions'
import { useNavigation } from './composables/useNavigation'
import QuestionCard from './components/QuestionCard.vue'
import OptionMarker from './components/OptionMarker.vue'

const { questionData, totalQuestions } = useQuestions()
const {
  currentIndex,
  isTransitioning,
  prevQuestion,
  nextQuestion,
  // markedQuestionIndices,
  toggleMark,
} = useNavigation(totalQuestions)

const showHint = () => {
  if (!questionData.value[currentIndex.value]?.analysis) return
  alert(`答案解析: ${questionData.value[currentIndex.value].analysis}`)
}

// 键盘事件处理
const handleKeydown = (event: KeyboardEvent) => {
  const keyActions: Record<string, () => void> = {
    Enter: nextQuestion,
    ArrowLeft: prevQuestion,
    ArrowRight: nextQuestion,
    ' ': toggleMark,
  }

  keyActions[event.key]?.()
}

// 生命周期
onMounted(() => document.addEventListener('keydown', handleKeydown))
onUnmounted(() => document.removeEventListener('keydown', handleKeydown))

// 新增答案选择逻辑
const selectedAnswers = ref<{ [key: string]: number | number[] }>({})

const selectAnswer = (questionId: string, optionIndex: number) => {
  const question = questionData.value.find((q) => q.id === questionId)
  if (!question) return

  // 根据题目类型处理选择逻辑
  if (question.type === 'single-choice') {
    selectedAnswers.value[questionId] = optionIndex
  } else if (question.type === 'multiple-choice') {
    const current = (selectedAnswers.value[questionId] as number[]) || []
    selectedAnswers.value[questionId] = current.includes(optionIndex)
      ? current.filter((i) => i !== optionIndex)
      : [...current, optionIndex]
  }

  // 实时保存到本地存储
  localStorage.setItem('userAnswers', JSON.stringify(selectedAnswers.value))
}
</script>

<style scoped>
@layer utilities {
  .content-auto {
    content-visibility: auto;
  }
  .text-shadow {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .transition-height {
    transition: max-height 0.5s ease-in-out;
  }
  .card-hover {
    @apply transition-all duration-300;
  }
}

:root {
  --primary: #165dff;
  --secondary: #36d399;
  --neutral: #f9fafb;
  --dark: #1f2937;
}

kbd {
  font-family: inherit;
}
</style>
