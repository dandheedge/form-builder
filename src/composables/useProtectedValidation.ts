import { computed, reactive, toValue, type MaybeRefOrGetter } from 'vue'
import type { FormSchema, RendererSchema, FormValues } from '@/types/form-schema'
import { createProtectedValidationContext } from '@/utils/schema-transformer'
import { useZodValidation } from './useZodValidation'

export function useProtectedValidation(
  fullSchema: MaybeRefOrGetter<FormSchema>,
  rendererSchema: MaybeRefOrGetter<RendererSchema>,
  formValues: MaybeRefOrGetter<FormValues>
) {
  const state = reactive({
    fullSchema: computed(() => toValue(fullSchema)),
    rendererSchema: computed(() => toValue(rendererSchema)),
    values: computed(() => toValue(formValues))
  })

  const ctx = computed(() => createProtectedValidationContext(state.fullSchema))
  const validator = useZodValidation(state.fullSchema)

  const isFieldVisible = (name: string) => {
    const rule = ctx.value.getVisibilityRule(name)
    if (!rule) return true

    return Object.entries(rule).every(([dependent, condition]) => {
      const val = state.values[dependent]
      return condition.split('|').every(part => {
        if (part === 'required') return !!val
        if (part.startsWith('is:')) return val === part.slice(3)
        if (part.startsWith('not:')) return val !== part.slice(4)
        return true
      })
    })
  }

  const isFieldRequired = (name: string) => {
    return ctx.value.getValidationRule(name)?.includes('required') ?? false
  }

  const visibleFieldNames = computed(() =>
    Object.keys(state.rendererSchema.items).filter(isFieldVisible)
  )

  const validateField = (name: string, value: unknown) =>
    validator.validateField(name, value)

  const validateVisibleFields = (values: Record<string, unknown>) =>
    validator.validateForm(
      Object.fromEntries(
        visibleFieldNames.value.map(n => [n, values[n]])
      )
    )

  return { isFieldVisible, isFieldRequired, visibleFieldNames, validateField, validateVisibleFields }
}
