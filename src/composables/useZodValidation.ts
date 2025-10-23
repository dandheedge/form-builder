import { z } from 'zod'
import type { FormField, FormSchema } from '@/types/form-schema'

export const createFieldSchema = (field: FormField) => {
  let schema: z.ZodTypeAny

  switch (field.type) {
    case 'Text':
    case 'Email':
      schema = field.type === 'Email' ? z.string().email('Invalid email address') : z.string()
      
      if (field.props?.maxlength) {
        schema = (schema as z.ZodString).max(
          field.props.maxlength as number,
          `Maximum length is ${field.props.maxlength}`
        )
      }
      break

    case 'Number':
      schema = z.number({
        message: 'Please enter a valid number',
      })

      if (field.value_constraints?.minimum !== undefined) {
        schema = (schema as z.ZodNumber).min(
          field.value_constraints.minimum,
          `Value must be at least ${field.value_constraints.minimum}`
        )
      }

      if (field.value_constraints?.maximum !== undefined) {
        schema = (schema as z.ZodNumber).max(
          field.value_constraints.maximum,
          `Value must not exceed ${field.value_constraints.maximum}`
        )
      }

      if (field.value_constraints?.allow_decimal === 0) {
        schema = (schema as z.ZodNumber).int('Decimal values are not allowed')
      }
      break

    case 'Radio':
    case 'Select':
      if (field.enum && field.enum.length > 0) {
        const values = field.enum.map((opt) => opt.value)
        schema = z.union([z.string(), z.number()]).refine(
          (val) => values.includes(val),
          'Please select a valid option'
        )
      } else {
        schema = z.union([z.string(), z.number()])
      }
      break

    case 'Checkbox':
      schema = z.array(z.union([z.string(), z.number()]))
      break

    case 'Date':
      schema = z.string()
      break

    default:
      schema = z.unknown()
  }

  // Handle required fields
  if (!field.rule?.includes('required')) {
    schema = schema.optional()
  }

  return schema
}

export const createFormSchema = (formSchema: FormSchema) => {
  const schemaShape: Record<string, z.ZodTypeAny> = {}

  for (const [fieldName, field] of Object.entries(formSchema.items)) {
    schemaShape[fieldName] = createFieldSchema(field)
  }

  return z.object(schemaShape)
}

export const useZodValidation = (formSchema: FormSchema) => {
  const zodSchema = createFormSchema(formSchema)

  const validateForm = (values: Record<string, unknown>) => {
    try {
      zodSchema.parse(values)
      return { success: true as const, errors: {} }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        for (const issue of error.issues) {
          const path = issue.path.join('.')
          errors[path] = issue.message
        }
        return { success: false as const, errors }
      }
      return { success: false as const, errors: {} }
    }
  }

  const validateField = (fieldName: string, value: unknown) => {
    const field = formSchema.items[fieldName]
    if (!field) return null

    const fieldSchema = createFieldSchema(field)
    try {
      fieldSchema.parse(value)
      return null
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues[0]?.message || 'Invalid value'
      }
      return 'Invalid value'
    }
  }

  return {
    validateForm,
    validateField,
  }
}

