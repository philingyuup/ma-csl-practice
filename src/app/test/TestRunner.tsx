'use client'

import { RadioGroupForm, RadioGroupFormProps } from "@/components/base/radioGroup"
import { shuffle } from "@/helper/shuffle"
import { useExamStore } from "@/zustand/examStore"
import { useMemo } from "react"

export type TestRunnerProps = {
  data: string[][]
}

export default function TestRunner(props: TestRunnerProps) {
  const currentIndex = useExamStore(state => state.currentIndex)
  const next = useExamStore(state => state.next)
  const prev = useExamStore(state => state.prev)
  const questions = useMemo(() => shuffle(props.data), [props.data])
  const currentQ = useMemo(() => questions[currentIndex], [questions, currentIndex])
  const question = useMemo<Pick<RadioGroupFormProps, 'title' | 'options'>>(() => {
    const [title, A, B, C, D] = currentQ
    return {
      title,
      options: [
        { name: A, value: 'A' },
        { name: B, value: 'B' },
        { name: C, value: 'C' },
        { name: D, value: 'D' },
      ],
      leftButtonName: 'Back'
    }
  }, [currentQ])
  const answer = useMemo<Record<'answer' | 'explanation', string>>(() => {
    const [_t, _a, _b, _c, _d, answer, explanation] = currentQ

    return {
      answer,
      explanation
    }
  }, [currentQ])

  return <div>
    <RadioGroupForm
      {...question}
      {...answer}
      rightButtonName={'Next'}
      onClickRightButton={next}
      onClickLeftButton={prev}
    />
  </div>
}