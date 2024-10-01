'use client'

import { RadioValues } from '@/validation/formSchema'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export type ExamState = {
  examType?: 'Practice' | 'Exam',
  currentIndex: number,
  answers: RadioValues[],
}

export type ExamActions = {
  next: (type: RadioValues) => void,
  prev: () => void,
  setExam: (type: ExamState['examType']) => void,
}

export const useExam = create<ExamState & ExamActions>()(
  immer((set) => ({
    examType: undefined,
    currentIndex: 0,
    answers: [],
    next: (type) => set((state) => {
      state.answers[state.currentIndex] = type
      state.currentIndex++
    }),
    prev: () => set((state) => {
      const nextNum = state.currentIndex - 1
      if (nextNum < 0) state.currentIndex = 0
      else state.currentIndex = nextNum
    }),
    setExam: (type) => set((state) => {
      if (type) state.examType = type
      else state.examType = undefined
    })
  }))
)