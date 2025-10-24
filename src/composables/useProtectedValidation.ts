import { computed } from 'vue'
import type { FormSchema, FormValues, RendererSchema } from '@/types/form-schema'
import { createProtectedValidationContext } from '@/utils/schema-transformer'
import { useZodValidation } from './useZodValidation'

/**
 * Protected validation composable that keeps sensitive validation logic hidden
 * 
 * This composable accepts the full schema but doesn't expose it to component props.
 * It evaluates visibility conditions and validation rules without revealing
 * the actual conditional logic to the client.
 * 
 * @param fullSchema - The complete form schema (kept internal)
 * @param rendererSchema - The minimal schema for rendering
 * @param formValues - Current form values (reactive)
 * @returns Computed visibility states and validation functions
 */
export function useProtectedValidation(
  fullSchema: FormSchema,
  rendererSchema: RendererSchema,
  formValues: FormValues
) {
  const validationContext = createProtectedValidationContext(fullSchema)
  const { validateField: zodValidateField, validateForm: zodValidateForm } = useZodValidation(fullSchema)

  /**
   * Evaluates visibility for a specific field without exposing the rules
   */
  const isFieldVisible = (fieldName: string): boolean => {
    const visibilityRule = validationContext.getVisibilityRule(fieldName)
    
    if (!visibilityRule) {
      return true // No visibility rules means always visible
    }

    // Evaluate conditions without exposing them
    for (const [dependentFieldName, condition] of Object.entries(visibilityRule)) {
      const fieldValue = formValues[dependentFieldName]
      
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
  }

  /**
   * Checks if a field is required without exposing the rule
   */
  const isFieldRequired = (fieldName: string): boolean => {
    const rule = validationContext.getValidationRule(fieldName)
    return rule?.includes('required') ?? false
  }

  /**
   * Computed list of field names in order, filtered by visibility
   */
  const visibleFieldNames = computed(() => {
    return Object.keys(rendererSchema.items).filter(fieldName => isFieldVisible(fieldName))
  })

  /**
   * Validates a single field using Zod validation
   */
  const validateField = (fieldName: string, value: unknown): string | null => {
    return zodValidateField(fieldName, value)
  }

  /**
   * Validates all visible fields
   */
  const validateVisibleFields = (values: Record<string, unknown>) => {
    // Only validate visible fields
    const visibleValues: Record<string, unknown> = {}
    for (const fieldName of visibleFieldNames.value) {
      visibleValues[fieldName] = values[fieldName]
    }

    return zodValidateForm(visibleValues)
  }

  return {
    isFieldVisible,
    isFieldRequired,
    visibleFieldNames,
    validateField,
    validateVisibleFields,
  }
}

