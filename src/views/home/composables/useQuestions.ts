import { ref } from 'vue'
import type { Question } from '../types'
import questions from '@/data/questions/speech.json'

export function useQuestions() {
  const questionData = ref<Question[]>(questions)

  const totalQuestions = questionData.value.length

  return {
    totalQuestions,
    questionData,
  }
}
