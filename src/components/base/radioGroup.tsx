'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { memo, MouseEvent, MouseEventHandler, useMemo, useState } from 'react'
import { FormSchema, SchemaType } from '@/validation/formSchema'

export type RadioGroupFormProps = RadioOverall | (RadioOverall & RadioLeftButton)
type RadioOverall = {
  title: string,
  options: Array<Record<'name' | 'value', string>>,
  answer?: string,
  explanation?: string,
  rightButtonName: string,
  onClickRightButton: (data: SchemaType['type']) => void
}
type RadioLeftButton = {
  leftButtonName: string,
  onClickLeftButton: (MouseEventHandler<HTMLButtonElement>),
}

export function RadioGroupForm(props: RadioGroupFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<SchemaType>({
    resolver: zodResolver(FormSchema)
  })

  const { type: answer } = form.watch()

  function onSubmit(data: SchemaType) {
    // submit when using outside of group reset
    if (!('answer' in props) && !('explanation' in props)) {
      nextQ(data)
      return
    }

    if (!isSubmitted) {
      setIsSubmitted(true)
    } else {
      nextQ(data)
    }
  }

  function reset() {
    setIsSubmitted(false)
    form.reset()
  }

  function nextQ(data: SchemaType) {
    props.onClickRightButton(data.type)
    reset()
  }

  function prevQ(e: MouseEvent<HTMLButtonElement>) {
    'onClickLeftButton' in props && props.onClickLeftButton(e)
    reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-[40rem] space-y-6'>
        <FormField
          control={form.control}
          name='type'
          render={({ field }) => (
            <FormItem className='space-y-3'>
              <FormLabel className='text-lg font-semibold'>{props.title}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  className='flex flex-col space-y-1'
                >
                  {props.options.map((radio) => (
                    <RadioItem 
                      key={radio.value}
                      name={radio.name}
                      checked={field.value === radio.value}
                      value={radio.value}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex gap-2'>
          {'leftButtonName' in props && <Button type='button' onClick={prevQ} variant='destructive'>{props.leftButtonName}</Button>}
          <Button type='submit'>{!('answer' in props)
            ? props.rightButtonName
            : isSubmitted
              ? props.rightButtonName
              : 'Submit'
          }</Button>
        </div>
        {isSubmitted && <p className={`${answer === props.answer ? 'text-green-600' : 'text-red-600'} flex flex-col`}>
          <span>{answer === props.answer ? 'Correct Answer' : 'Wrong Answer'}</span>
          <span>{answer !== props.answer && 'Correct Answer: ' + props.answer}</span>
          {props.explanation}  
        </p>}
      </form>
    </Form>
  )
}

type RadioItemProps = RadioOverall['options'][number] & { checked: boolean }
const RadioItem = memo((props: RadioItemProps) => (
  <FormItem className='flex items-center space-x-3 space-y-0'>
    <FormControl>
      <RadioGroupItem checked={props.checked} value={props.value} />
    </FormControl>
    <FormLabel className='font-normal'>
      {props.value}: <span className='font-semibold'>{props.name}</span>
    </FormLabel>
  </FormItem>
))