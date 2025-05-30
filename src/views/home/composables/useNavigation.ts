import { ref, watch } from 'vue'

export function useNavigation(total: number) {
  // 响应式状态
  const currentIndex = ref(0) // 当前索引
  const isTransitioning = ref(false) // 是否正在过渡
  const markedQuestionIndices = ref<Set<number>>(new Set()) // 记录已标记的问题

  // 导航方法
  const prevQuestion = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--
    }
  }

  const nextQuestion = () => {
    if (currentIndex.value < total - 1) {
      currentIndex.value++
    }
  }

  // 收藏切换
  const toggleMark = () => {
    const index = currentIndex.value
    if (markedQuestionIndices.value.has(index)) {
      markedQuestionIndices.value.delete(index)
    } else {
      markedQuestionIndices.value.add(index)
    }
  }

  // 过渡效果监听
  watch(currentIndex, () => {
    isTransitioning.value = true
    setTimeout(() => {
      isTransitioning.value = false
    }, 50)
  })

  return {
    currentIndex,
    isTransitioning,
    markedQuestionIndices,
    prevQuestion,
    nextQuestion,
    toggleMark,
  }
}
