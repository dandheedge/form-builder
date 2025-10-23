import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { FormSchema, FormField, FormValues } from '@/types/form-schema'

const defaultSchema: FormSchema = {
  name: 'step',
  label: 'Sample Form',
  items: {
    full_name: {
      name: 'full_name',
      display: {
        label: 'Full Name',
      },
      rule: 'required',
      props: {
        maxlength: 280,
      },
      builder: {
        type: 'simple_input',
      },
      layout: 'Normal',
      type: 'Text',
    },
    email: {
      name: 'email',
      display: {
        label: 'Email Address',
        placeholder: 'your@email.com',
      },
      rule: 'required',
      builder: {
        type: 'simple_input',
      },
      layout: 'Normal',
      type: 'Email',
    },
    duration: {
      name: 'duration',
      display: {
        label: 'Reason for Leave',
        placeholder: 'If taking a full-day leave, please fill in the dates below.',
      },
      enum: [
        {
          label: 'Half Day',
          value: 'half',
        },
        {
          label: 'Full Day',
          value: 'full',
        },
      ],
      builder: {
        type: 'simple_choice',
      },
      layout: 'Normal',
      type: 'Radio',
    },
    days: {
      display: {
        label: 'Number of Leave Days',
      },
      name: 'days',
      prefill: {
        value: 1,
      },
      value_constraints: {
        maximum: 1000000,
        allow_decimal: 0,
      },
      visible: {
        duration: 'required|is:full',
      },
      builder: {
        type: 'simple_input',
      },
      layout: 'Normal',
      type: 'Number',
    },
  },
}

export const useFormBuilderStore = defineStore('formBuilder', () => {
  const schema = ref<FormSchema>(JSON.parse(JSON.stringify(defaultSchema)))
  const formValues = ref<FormValues>({})
  const selectedFieldName = ref<string | null>(null)

  const fieldOrder = computed(() => Object.keys(schema.value.items))

  const selectedField = computed(() => {
    if (!selectedFieldName.value) return null
    return schema.value.items[selectedFieldName.value]
  })

  const addField = (fieldType: FormField['type']) => {
    const timestamp = Date.now()
    const fieldName = `field_${timestamp}`
    
    const newField: FormField = {
      name: fieldName,
      display: {
        label: `New ${fieldType} Field`,
      },
      builder: {
        type: fieldType === 'Radio' || fieldType === 'Checkbox' || fieldType === 'Select' 
          ? 'simple_choice' 
          : 'simple_input',
      },
      layout: 'Normal',
      type: fieldType,
    }

    if (fieldType === 'Radio' || fieldType === 'Checkbox' || fieldType === 'Select') {
      newField.enum = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
      ]
    }

    if (fieldType === 'Number') {
      newField.value_constraints = {
        allow_decimal: 0,
      }
    }

    schema.value.items[fieldName] = newField
    selectedFieldName.value = fieldName
  }

  const removeField = (fieldName: string) => {
    delete schema.value.items[fieldName]
    if (selectedFieldName.value === fieldName) {
      selectedFieldName.value = null
    }
  }

  const updateField = (fieldName: string, updates: Partial<FormField>) => {
    const field = schema.value.items[fieldName]
    if (field) {
      schema.value.items[fieldName] = { ...field, ...updates }
    }
  }

  const reorderFields = (newOrder: string[]) => {
    const newItems: Record<string, FormField> = {}
    for (const fieldName of newOrder) {
      if (schema.value.items[fieldName]) {
        newItems[fieldName] = schema.value.items[fieldName]
      }
    }
    schema.value.items = newItems
  }

  const selectField = (fieldName: string | null) => {
    selectedFieldName.value = fieldName
  }

  const updateFormValue = (fieldName: string, value: unknown) => {
    formValues.value[fieldName] = value
  }

  const exportSchema = () => {
    return JSON.stringify(schema.value, null, 2)
  }

  const importSchema = (jsonSchema: string) => {
    try {
      const parsed = JSON.parse(jsonSchema)
      schema.value = parsed
      formValues.value = {}
      selectedFieldName.value = null
    } catch (error) {
      console.error('Invalid JSON schema:', error)
    }
  }

  const resetSchema = () => {
    schema.value = JSON.parse(JSON.stringify(defaultSchema))
    formValues.value = {}
    selectedFieldName.value = null
  }

  return {
    schema,
    formValues,
    selectedFieldName,
    fieldOrder,
    selectedField,
    addField,
    removeField,
    updateField,
    reorderFields,
    selectField,
    updateFormValue,
    exportSchema,
    importSchema,
    resetSchema,
  }
})

