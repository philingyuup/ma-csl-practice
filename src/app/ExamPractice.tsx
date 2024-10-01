'use client'

import { RadioValues } from "@/validation/formSchema"
import { RadioGroupForm, RadioGroupFormProps } from "../components/base/radioGroup"

const radioGroupAnswers = {
  'A': 'Practice',
  'B': 'Exam'
} as const satisfies Partial<Record<RadioValues, string>>
type RadioGroupAnswerKey = keyof typeof radioGroupAnswers

const options = Object.keys(radioGroupAnswers).reduce<RadioGroupFormProps['options']>((opt, key) => [...opt, { name: radioGroupAnswers[key as RadioGroupAnswerKey], value: key }], [])
const radioGroupDetails = {
  title: 'Would you like to practice or take an exam?',
  options,
  rightButtonName: 'Next',
} as const satisfies Omit<RadioGroupFormProps, 'onClickRightButton'>

export default function ExamOrPractice() {


  const onSubmit: RadioGroupFormProps['onClickRightButton'] = function(data) {
    if (data.type === 'C' || data.type === 'D') {
      console.error('Data type value is not A or B: ', data.type)
      return
    }
    console.log('data', data)
    console.log('answer', radioGroupAnswers[data.type])
  }


  return <RadioGroupForm
    {...radioGroupDetails}
    onClickRightButton={onSubmit}
  />
}
