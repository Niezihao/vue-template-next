import { ref } from 'vue'
import type { Question } from '../types'

export function useAnswerSelection() {
  const selectedAnswers = ref<{ [key: string]: number | number[] }>(
    JSON.parse(localStorage.getItem('userAnswers') || '{}'),
  )

  const selectAnswer = (question: Question, optionIndex: number) => {
    if (!question) return

    // 初始化当前题目的答案存储
    if (!selectedAnswers.value[question.id]) {
      selectedAnswers.value[question.id] = question.type === 'multiple-choice' ? [] : -1
    }

    // 处理选择逻辑
    if (question.type === 'single-choice') {
      selectedAnswers.value[question.id] = optionIndex
    } else if (question.type === 'multiple-choice') {
      const current = selectedAnswers.value[question.id] as number[]
      const index = current.indexOf(optionIndex)
      if (index === -1) {
        current.push(optionIndex)
      } else {
        current.splice(index, 1)
      }
    }

    // 持久化存储
    localStorage.setItem('userAnswers', JSON.stringify(selectedAnswers.value))

    // 返回正确答案对比结果
    return {
      isCorrect: Array.isArray(question.correctAnswer)
        ? (selectedAnswers.value[question.id] as number[]).every((i) =>
            question.correctAnswer.includes(i),
          )
        : selectedAnswers.value[question.id] === question.correctAnswer,
    }
  }

  return {
    selectedAnswers,
    selectAnswer,
  }
}
