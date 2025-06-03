export interface Question {
  id: string // 题目唯一标识
  title: string // 题目标题
  description?: string // 题目描述（可选）
  analysis?: string // 题目解析（可选）
  type: string // 题目类型
  options: string[] // 选项列表
  correctAnswer: number[] // 修改正确答案类型
}
