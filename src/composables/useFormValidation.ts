import { computed } from 'vue'
import type { FormField, FormValues } from '@/types/form-schema'

export const useFormValidation = (field: FormField, formValues: FormValues) => {
  const isVisible = computed(() => {
    if (!field.visible) return true

    for (const [fieldName, condition] of Object.entries(field.visible)) {
      const fieldValue = formValues[fieldName]
      
      // Parse condition: e.g., "required|is:full"
      const parts = (condition as string).split('|')
      
      for (const part of parts) {
        if (part === 'required') {
          if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
            return false
          }
        } else if (part.startsWith('is:')) {
          const expectedValue = part.substring(3)
          if (fieldValue !== expectedValue) {
            return false
          }
        } else if (part.startsWith('not:')) {
          const unexpectedValue = part.substring(4)
          if (fieldValue === unexpectedValue) {
            return false
          }
        }
      }
    }

    return true
  })

  const isRequired = computed(() => {
    return field.rule?.includes('required') ?? false
  })

  const validateValue = (value: unknown): string | null => {
    if (isRequired.value && (value === undefined || value === null || value === '')) {
      return 'This field is required'
    }

    if (field.type === 'Number' && value !== undefined && value !== null && value !== '') {
      const numValue = Number(value)
      
      if (Number.isNaN(numValue)) {
        return 'Please enter a valid number'
      }

      if (field.value_constraints?.allow_decimal === 0 && !Number.isInteger(numValue)) {
        return 'Decimal values are not allowed'
      }

      if (field.value_constraints?.minimum !== undefined && numValue < field.value_constraints.minimum) {
        return `Value must be at least ${field.value_constraints.minimum}`
      }

      if (field.value_constraints?.maximum !== undefined && numValue > field.value_constraints.maximum) {
        return `Value must not exceed ${field.value_constraints.maximum}`
      }
    }

    if (field.type === 'Email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(String(value))) {
        return 'Please enter a valid email address'
      }
    }

    return null
  }

  return {
    isVisible,
    isRequired,
    validateValue,
  }
}

