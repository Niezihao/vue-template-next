import type { ComputedRef } from 'vue'
import type { Question } from '../types'

export function useQuestionHint(question: ComputedRef<Question | undefined>) {
  const showHint = () => {
    if (!question.value?.analysis) return
    alert(`答案解析: ${question.value.analysis}`)
  }

  return {
    showHint,
  }
}
