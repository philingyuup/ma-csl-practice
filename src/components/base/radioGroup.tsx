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
import { memo, MouseEventHandler } from 'react'
import { FormSchema, SchemaType } from '@/validation/formSchema'

export type RadioGroupFormProps = RadioOverall | (RadioOverall & RadioLeftButton)
type RadioOverall = {
  title: string,
  options: Array<Record<'name' | 'value', string>>
  rightButtonName: string,
  onClickRightButton: (data: SchemaType) => void
}
type RadioLeftButton = {
  leftButtonName: string,
  onClickLeftButton: MouseEventHandler<HTMLButtonElement>,
}

export function RadioGroupForm(props: RadioGroupFormProps) {
  const form = useForm<SchemaType>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: SchemaType) {
    props.onClickRightButton(data)
    console.log('information', data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-2/3 space-y-6'>
        <FormField
          control={form.control}
          name='type'
          render={({ field }) => (
            <FormItem className='space-y-3'>
              <FormLabel>{props.title}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className='flex flex-col space-y-1'
                >
                  {props.options.map((radio) => (
                    <RadioItem 
                      key={radio.value}
                      name={radio.name}
                      value={radio.value}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {'leftButtonName' in props && <Button type='button' onClick={props.onClickLeftButton}>{props.leftButtonName}</Button>}
        <Button type='submit'>{props.rightButtonName}</Button>
      </form>
    </Form>
  )
}

type RadioItemProps = RadioOverall['options'][number]
const RadioItem = memo((props: RadioItemProps) => (
  <FormItem className='flex items-center space-x-3 space-y-0'>
    <FormControl>
      <RadioGroupItem value={props.value} />
    </FormControl>
    <FormLabel className='font-normal'>
      {props.name}
    </FormLabel>
  </FormItem>
))