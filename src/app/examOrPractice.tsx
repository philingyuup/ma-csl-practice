'use client'

import { RadioValues } from "@/validation/formSchema"
import { RadioGroupForm, RadioGroupFormProps } from "../components/base/radioGroup"
import { ExamState } from "@/zustand/examStore"
import { useExamStore } from "@/zustand/examStore"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const radioGroupAnswers = {
  'A': 'Practice',
  'B': 'Exam'
} as const satisfies Partial<Record<RadioValues, ExamState['examType']>>
type RadioGroupAnswerKey = keyof typeof radioGroupAnswers

const options = Object.keys(radioGroupAnswers)
  .reduce<RadioGroupFormProps['options']>(
    (opt, key) => [
      ...opt,
      {
        name: radioGroupAnswers[key as RadioGroupAnswerKey],
        value: key
      }
    ]
  , [])
const radioGroupDetails = {
  title: 'Would you like to practice or take an exam?',
  options,
  rightButtonName: 'Next',
} as const satisfies Omit<RadioGroupFormProps, 'onClickRightButton'>


export default function ExamOrPractice() {
  const examType = useExamStore(state => state.examType)
  const setExamType = useExamStore(state => state.setExam)
  const router = useRouter()

  useEffect(() => {
    // reset state of examType since user has to select it when reaching this component
    if (examType) {
      setExamType(undefined)
    }
  }, [])

  const onSubmit: RadioGroupFormProps['onClickRightButton'] = function(data) {
    if (data === 'C' || data === 'D') {
      console.error('Data type value is not A or B: ', data)
      return
    }
    setExamType(radioGroupAnswers[data])
    router.push('test')
  }


  return <RadioGroupForm
    {...radioGroupDetails}
    onClickRightButton={onSubmit}
  />
}
