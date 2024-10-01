import { z } from "zod"

export const radioValues = ['A', 'B', 'C', 'D'] as const
export type RadioValues = typeof radioValues[number]
export const FormSchema = z.object({
  type: z.enum(radioValues, {
    required_error: 'Please select an answer before continuing.',
  }),
})
export type SchemaType = z.infer<typeof FormSchema>