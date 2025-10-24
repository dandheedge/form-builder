<script setup lang="ts">
import { ref, computed } from 'vue'
import TextField from './form-fields/TextField.vue'
import NumberField from './form-fields/NumberField.vue'
import RadioField from './form-fields/RadioField.vue'
import CheckboxField from './form-fields/CheckboxField.vue'
import SelectField from './form-fields/SelectField.vue'
import type { FieldType, RendererSchema, FormSchema, FormValues } from '@/types/form-schema'
import { useProtectedValidation } from '@/composables/useProtectedValidation'

interface FormRendererProps {
  schema: RendererSchema
  fullSchema: FormSchema
  formValues: FormValues
}

const props = defineProps<FormRendererProps>()
const emit = defineEmits<{
  'update:formValues': [value: FormValues]
  'submit': [values: FormValues]
}>()

const errors = ref<Record<string, string | null>>({})

const {
  visibleFieldNames,
  validateField,
  validateVisibleFields,
} = useProtectedValidation(props.fullSchema, props.schema, props.formValues)

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
  return visibleFieldNames.value
    .map((fieldName: string) => {
      const field = props.schema.items[fieldName]
      if (!field) {
        console.warn(`Field "${fieldName}" not found in schema items`)
        return null
      }
      return {
        name: fieldName,
        component: componentMap[field.type],
        field,
        value: props.formValues[fieldName],
        error: errors.value[fieldName]
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
})

const updateValue = (fieldName: string, value: unknown) => {
  const newValues = { ...props.formValues, [fieldName]: value }
  emit('update:formValues', newValues)
  
  // Validate the field
  const error = validateField(fieldName, value)
  errors.value[fieldName] = error
}

const handleSubmit = () => {
  const result = validateVisibleFields(props.formValues)
  
  if (result.success) {
    console.log('Form submitted:', props.formValues)
    alert('Form submitted successfully! Check console for values.')
    errors.value = {}
    emit('submit', props.formValues)
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
        {{ schema.label }}
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

