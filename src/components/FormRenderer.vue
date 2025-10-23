<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFormBuilderStore } from '@/stores/form-builder'
import { useFormValidation } from '@/composables/useFormValidation'
import { useZodValidation } from '@/composables/useZodValidation'
import TextField from './form-fields/TextField.vue'
import NumberField from './form-fields/NumberField.vue'
import RadioField from './form-fields/RadioField.vue'
import CheckboxField from './form-fields/CheckboxField.vue'
import SelectField from './form-fields/SelectField.vue'
import type { FieldType } from '@/types/form-schema'

const store = useFormBuilderStore()
const errors = ref<Record<string, string | null>>({})

const { validateField: zodValidateField, validateForm: zodValidateForm } = useZodValidation(store.schema)

const componentMap: Record<FieldType, any> = {
  Text: TextField,
  Email: TextField,
  Number: NumberField,
  Radio: RadioField,
  Checkbox: CheckboxField,
  Select: SelectField,
  Date: TextField, // Fallback to TextField for now
}

const visibleFields = computed(() => {
  return store.fieldOrder
    .filter((fieldName: string) => {
      const field = store.schema.items[fieldName]
      if (!field) return false
      const { isVisible } = useFormValidation(field, store.formValues)
      return isVisible.value
    })
    .map((fieldName: string) => {
      const field = store.schema.items[fieldName]!
      return {
        name: fieldName,
        component: componentMap[field.type],
        field,
        value: store.formValues[fieldName],
        error: errors.value[fieldName]
      }
    })
})

const updateValue = (fieldName: string, value: unknown) => {
  store.updateFormValue(fieldName, value)
  
  // Validate the field with Zod
  const error = zodValidateField(fieldName, value)
  errors.value[fieldName] = error
}

const handleSubmit = () => {
  // Validate all visible fields with Zod
  const visibleValues: Record<string, unknown> = {}
  for (const fieldData of visibleFields.value) {
    visibleValues[fieldData.name] = store.formValues[fieldData.name]
  }

  const result = zodValidateForm(visibleValues)
  
  if (result.success) {
    console.log('Form submitted:', store.formValues)
    alert('Form submitted successfully! Check console for values.')
    errors.value = {}
  } else {
    errors.value = result.errors
    alert('Please fix the errors before submitting.')
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">
        {{ store.schema.label }}
      </h1>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <component
          v-for="fieldData in visibleFields"
          :key="fieldData.name"
          :is="fieldData.component"
          :field="fieldData.field"
          :model-value="fieldData.value"
          :error="fieldData.error"
          @update:model-value="updateValue(fieldData.name, $event)"
        />

        <div class="pt-4">
          <button
            type="submit"
            class="w-full bg-ultramarine text-white py-3 px-6 rounded-lg font-medium hover:bg-medium-slate-blue transition-colors focus:outline-none focus:ring-2 focus:ring-medium-slate-blue focus:ring-offset-2"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

