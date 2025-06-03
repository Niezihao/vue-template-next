<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl" :class="{ dark: isDarkMode }">
    <header class="mb-10 text-center relative">
      <!-- 主题切换按钮 -->
      <button
        @click="toggleDarkMode"
        class="absolute top-0 right-0 p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 z-10"
      >
        <span
          class="text-xl w-6 h-6 flex items-center justify-center transition-all duration-500"
          :class="isDarkMode ? 'text-amber-400 rotate-180' : 'text-slate-500 rotate-0'"
        >
          {{ isDarkMode ? '☀️' : '🌙' }}
        </span>
      </button>
      <h1
        class="text-[clamp(1.8rem,4vw,2.5rem)] font-bold text-primary mb-2 text-shadow dark:text-primary-dark"
      >
        <!-- <i class="fa fa-book mr-2"></i>真题浏览应用 -->
      </h1>
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
      <template #header-extra>
        <button
          @click="showAnswers = !showAnswers"
          class="flex items-center px-3 py-1.5 space-x-2 text-sm rounded-full border border-primary/20 hover:bg-primary/5 transition-colors dark:border-primary-dark/30 dark:hover:bg-primary-dark/10"
        >
          <i class="fa" :class="showAnswers ? 'fa-eye-slash' : 'fa-eye'"></i>
          <span class="text-primary/80 dark:text-primary-dark/80">{{
            showAnswers ? '隐藏答案' : '显示解析'
          }}</span>
        </button>
      </template>

      <!-- 选项区域 -->
      <template v-slot:options>
        <div
          v-for="(option, index) in questionData[currentIndex]?.options"
          :key="index"
          class="flex items-start p-3 border-2 rounded-lg transition-all cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700/50"
          :class="{
            'border-green-500 dark:border-green-400':
              showAnswers && questionData[currentIndex]?.correctAnswer?.includes(index),
            'border-red-500 dark:border-red-400':
              showAnswers &&
              selectedAnswers[questionData[currentIndex]?.id]?.includes(index) &&
              !questionData[currentIndex]?.correctAnswer?.includes(index),
            'bg-blue-50 dark:bg-blue-900/20 scale-95':
              selectedAnswers[questionData[currentIndex]?.id]?.includes(index),
            'border-gray-200':
              !showAnswers || !questionData[currentIndex]?.correctAnswer?.includes(index),
          }"
          @click="selectAnswer(questionData[currentIndex]?.id, index)"
        >
          <p class="ml-2 dark:text-gray-200">{{ option }}</p>
        </div>

        <!-- 解析内容 -->
        <transition name="fade">
          <div
            v-if="showAnswers"
            class="mt-4 p-4 bg-green-50 border-l-4 border-green-500 text-sm rounded-lg dark:bg-green-900/20 dark:border-green-800"
          >
            <div class="flex items-center text-green-700 font-medium dark:text-green-300">
              <i class="fa fa-lightbulb mr-2"></i>
              题目解析：
            </div>
            <p class="mt-2 text-green-600 dark:text-green-200">
              {{ questionData[currentIndex]?.analysis }}
            </p>
          </div>
        </transition>
      </template>
    </question-card>

    <!-- 底部 -->
    <footer class="text-center text-gray-500 text-sm mt-10 dark:text-gray-400">
      <!-- 答题卡弹窗 -->
      <transition name="fade">
        <div
          v-if="showAnswerSheet"
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          @click.self="showAnswerSheet = false"
        >
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl w-[90%] max-w-2xl">
            <!-- 在答题卡弹窗标题下方添加进度条 -->
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold dark:text-gray-100">答题进度</h3>
              <button
                @click="showAnswerSheet = false"
                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <span class="text-gray-600 dark:text-gray-300 text-xl">×</span>
              </button>
            </div>

            <!-- 进度条 -->
            <div class="mb-4">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600 dark:text-gray-300"
                  >已完成 {{ progressPercentage }}%</span
                >
                <span class="text-gray-600 dark:text-gray-300"
                  >{{ answeredCount }}/{{ totalQuestions }}</span
                >
              </div>
              <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                <div
                  class="h-full bg-green-500 rounded-full transition-all duration-500"
                  :style="{ width: progressPercentage + '%' }"
                ></div>
              </div>
            </div>

            <div class="grid grid-cols-8 gap-2">
              <button
                v-for="(q, index) in questionData"
                :key="q.id"
                @click="jumpToQuestion(index)"
                class="h-10 flex items-center justify-center rounded-lg transition-colors"
                :class="{
                  'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300':
                    selectedAnswers[q.id]?.length > 0,
                  'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300':
                    !selectedAnswers[q.id]?.length,
                  'ring-2 ring-blue-500': currentIndex === index,
                }"
              >
                {{ index + 1 }}
                {{
                  selectedAnswers[q.id] &&
                  selectedAnswers[q.id].map((i) => String.fromCharCode(65 + i)).join(',')
                }}
              </button>
            </div>
          </div>
        </div>
      </transition>
      <button
        @click="showAnswerSheet = true"
        class="mb-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors dark:bg-blue-900/20 dark:text-blue-300"
      >
        <i class="fa fa-list-alt mr-2"></i>答题卡
      </button>

      <p>
        © 2025 真题浏览应用 | 按
        <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs dark:text-gray-200"
          >Enter</kbd
        >
        键继续
      </p>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, onUnmounted, computed } from 'vue'
import { useQuestions } from './composables/useQuestions'
import { useNavigation } from './composables/useNavigation'
import QuestionCard from './components/QuestionCard.vue'

const isDarkMode = ref(localStorage.getItem('darkMode') === 'true')

const answeredCount = computed(() => {
  return Object.values(selectedAnswers.value).filter((a) => a?.length > 0).length
})

const progressPercentage = computed(() => {
  return Math.round((answeredCount.value / totalQuestions) * 100) || 0
})

watch(isDarkMode, (val) => {
  localStorage.setItem('darkMode', val.toString())
  document.documentElement.classList.toggle('dark', val)
})

const { questionData, totalQuestions } = useQuestions()
const {
  currentIndex,
  isTransitioning,
  prevQuestion,
  nextQuestion,
  // markedQuestionIndices,
  toggleMark,
} = useNavigation(totalQuestions)
// 答题卡显示状态
const showAnswerSheet = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
}
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
    Tab: () => (showAnswerSheet.value = !showAnswerSheet.value),
  }
  keyActions[event.key]?.()
}

// 跳题方法
const jumpToQuestion = (index: number) => {
  currentIndex.value = index
  showAnswerSheet.value = false
}

// 答案选择逻辑
const selectedAnswers = ref<{ [key: string]: number[] }>({})

// 显示答案状态
const showAnswers = ref(false)

// 选择逻辑
const selectAnswer = (questionId: string, optionIndex: number) => {
  const question = questionData.value.find((q) => q.id === questionId)
  if (!question) return

  // 存储为数组格式保持一致性
  if (question.type === 'single-choice') {
    selectedAnswers.value[questionId] = [optionIndex]
  } else {
    const current = (selectedAnswers.value[questionId] as number[]) || []
    selectedAnswers.value[questionId] = current.includes(optionIndex)
      ? current.filter((i) => i !== optionIndex)
      : [...current, optionIndex]
  }

  localStorage.setItem('userAnswers', JSON.stringify(selectedAnswers.value))
}

// 生命周期
onMounted(() => {
  document.documentElement.classList.toggle('dark', isDarkMode.value)
  document.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
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

<style>
@import './styles/dark.css';
</style>
