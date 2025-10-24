<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FormField, EnumOption } from '@/types/form-schema'

const props = defineProps<{
  field: FormField | null
}>()

const emit = defineEmits<{
  update: [updates: Partial<FormField>]
}>()

const localField = ref<Partial<FormField>>({})

watch(
  () => props.field,
  (newField) => {
    if (newField) {
      localField.value = JSON.parse(JSON.stringify(newField))
    }
  },
  { immediate: true }
)

const updateLabel = (label: string) => {
  if (!localField.value.display) localField.value.display = {}
  localField.value.display.label = label
  emit('update', { display: localField.value.display })
}

const updatePlaceholder = (placeholder: string) => {
  if (!localField.value.display) localField.value.display = {}
  localField.value.display.placeholder = placeholder
  emit('update', { display: localField.value.display })
}

const updateDescription = (description: string) => {
  if (!localField.value.display) localField.value.display = {}
  localField.value.display.description = description
  emit('update', { display: localField.value.display })
}

const toggleRequired = () => {
  const isRequired = localField.value.rule?.includes('required')
  localField.value.rule = isRequired ? undefined : 'required'
  emit('update', { rule: localField.value.rule })
}

const updateMaxLength = (maxlength: number) => {
  if (!localField.value.props) localField.value.props = {}
  localField.value.props.maxlength = maxlength
  emit('update', { props: localField.value.props })
}

const updateAllowDecimal = (allow: boolean) => {
  if (!localField.value.value_constraints) localField.value.value_constraints = {}
  localField.value.value_constraints.allow_decimal = allow ? 1 : 0
  emit('update', { value_constraints: localField.value.value_constraints })
}

const updateMinimum = (min: number | undefined) => {
  if (!localField.value.value_constraints) localField.value.value_constraints = {}
  localField.value.value_constraints.minimum = min
  emit('update', { value_constraints: localField.value.value_constraints })
}

const updateMaximum = (max: number | undefined) => {
  if (!localField.value.value_constraints) localField.value.value_constraints = {}
  localField.value.value_constraints.maximum = max
  emit('update', { value_constraints: localField.value.value_constraints })
}

const addOption = () => {
  if (!localField.value.enum) localField.value.enum = []
  const newOption: EnumOption = {
    label: `Option ${localField.value.enum.length + 1}`,
    value: `option${localField.value.enum.length + 1}`,
  }
  localField.value.enum.push(newOption)
  emit('update', { enum: localField.value.enum })
}

const updateOption = (index: number, label: string, value: string) => {
  if (!localField.value.enum) return
  // Create a new array to ensure reactivity
  const updatedEnum = [...localField.value.enum]
  updatedEnum[index] = { label, value }
  localField.value.enum = updatedEnum
  emit('update', { enum: updatedEnum })
}

const removeOption = (index: number) => {
  if (!localField.value.enum) return
  const updatedEnum = localField.value.enum.filter((_, i) => i !== index)
  localField.value.enum = updatedEnum
  emit('update', { enum: updatedEnum })
}
</script>

<template>
  <div v-if="field" class="h-full overflow-y-auto p-6 bg-pale-purple">
    <h2 class="text-lg font-bold text-rich-black mb-6">Field Configuration</h2>

    <div class="space-y-6">
      <!-- Basic Settings -->
      <div class="bg-white p-4 rounded-lg shadow-sm border border-ultramarine space-y-4">
        <h3 class="text-sm font-semibold text-rich-black uppercase tracking-wide">
          Basic Settings
        </h3>

        <div>
          <label class="block text-sm font-medium text-rich-black mb-1">
            Field Label
          </label>
          <input
            type="text"
            :value="localField.display?.label"
            class="w-full px-3 py-2 border border-ultramarine rounded-lg focus:ring-2 focus:ring-medium-slate-blue focus:border-transparent"
            @input="updateLabel(($event.target as HTMLInputElement).value)"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-rich-black mb-1">
            Placeholder
          </label>
          <input
            type="text"
            :value="localField.display?.placeholder"
            class="w-full px-3 py-2 border border-ultramarine rounded-lg focus:ring-2 focus:ring-medium-slate-blue focus:border-transparent"
            @input="updatePlaceholder(($event.target as HTMLInputElement).value)"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-rich-black mb-1">
            Description
          </label>
          <textarea
            :value="localField.display?.description"
            rows="2"
            class="w-full px-3 py-2 border border-ultramarine rounded-lg focus:ring-2 focus:ring-medium-slate-blue focus:border-transparent"
            @input="updateDescription(($event.target as HTMLTextAreaElement).value)"
          />
        </div>

        <div class="flex items-center">
          <input
            :id="`required-${field.name}`"
            type="checkbox"
            :checked="localField.rule?.includes('required')"
            class="w-4 h-4 text-ultramarine bg-pale-purple border-ultramarine rounded focus:ring-ultramarine accent-ultramarine"
            @change="toggleRequired"
          />
          <label
            :for="`required-${field.name}`"
            class="ml-2 text-sm text-rich-black cursor-pointer"
          >
            Required field
          </label>
        </div>
      </div>

      <!-- Text Field Settings -->
      <div
        v-if="field.type === 'Text' || field.type === 'Email'"
        class="bg-white p-4 rounded-lg shadow-sm border border-ultramarine space-y-4"
      >
        <h3 class="text-sm font-semibold text-rich-black uppercase tracking-wide">
          Text Settings
        </h3>

        <div>
          <label class="block text-sm font-medium text-rich-black mb-1">
            Max Length
          </label>
          <input
            type="number"
            :value="localField.props?.maxlength"
            min="1"
            class="w-full px-3 py-2 border border-ultramarine rounded-lg focus:ring-2 focus:ring-medium-slate-blue focus:border-transparent"
            @input="updateMaxLength(Number(($event.target as HTMLInputElement).value))"
          />
        </div>
      </div>

      <!-- Number Field Settings -->
      <div
        v-if="field.type === 'Number'"
        class="bg-white p-4 rounded-lg shadow-sm border border-ultramarine space-y-4"
      >
        <h3 class="text-sm font-semibold text-rich-black uppercase tracking-wide">
          Number Settings
        </h3>

        <div class="flex items-center">
          <input
            :id="`allow-decimal-${field.name}`"
            type="checkbox"
            :checked="localField.value_constraints?.allow_decimal === 1"
            class="w-4 h-4 text-ultramarine bg-pale-purple border-ultramarine rounded focus:ring-ultramarine accent-ultramarine"
            @change="updateAllowDecimal(($event.target as HTMLInputElement).checked)"
          />
          <label
            :for="`allow-decimal-${field.name}`"
            class="ml-2 text-sm text-rich-black cursor-pointer"
          >
            Allow decimal values
          </label>
        </div>

        <div>
          <label class="block text-sm font-medium text-rich-black mb-1">
            Minimum Value
          </label>
          <input
            type="number"
            :value="localField.value_constraints?.minimum"
            class="w-full px-3 py-2 border border-ultramarine rounded-lg focus:ring-2 focus:ring-medium-slate-blue focus:border-transparent"
            @input="updateMinimum(($event.target as HTMLInputElement).value ? Number(($event.target as HTMLInputElement).value) : undefined)"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-rich-black mb-1">
            Maximum Value
          </label>
          <input
            type="number"
            :value="localField.value_constraints?.maximum"
            class="w-full px-3 py-2 border border-ultramarine rounded-lg focus:ring-2 focus:ring-medium-slate-blue focus:border-transparent"
            @input="updateMaximum(($event.target as HTMLInputElement).value ? Number(($event.target as HTMLInputElement).value) : undefined)"
          />
        </div>
      </div>

      <!-- Choice Field Settings (Radio, Checkbox, Select) -->
      <div
        v-if="field.type === 'Radio' || field.type === 'Checkbox' || field.type === 'Select'"
        class="bg-white p-4 rounded-lg shadow-sm border border-ultramarine space-y-4"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-rich-black uppercase tracking-wide">
            Options
          </h3>
          <button
            type="button"
            class="text-sm text-ultramarine hover:text-medium-slate-blue font-medium"
            @click="addOption"
          >
            + Add Option
          </button>
        </div>

        <div class="space-y-3">
          <div
            v-for="(option, index) in localField.enum"
            :key="index"
            class="flex gap-2"
          >
            <input
              :id="`option-label-${index}`"
              type="text"
              :value="option.label"
              placeholder="Label"
              class="flex-1 px-3 py-2 border border-ultramarine rounded-lg focus:ring-2 focus:ring-medium-slate-blue focus:border-transparent"
              @input="updateOption(index, ($event.target as HTMLInputElement).value, option.value.toString())"
            />
            <button
              type="button"
              class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              @click="removeOption(index)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Field Info -->
      <div class="bg-white p-4 rounded-lg shadow-sm border border-ultramarine space-y-2">
        <h3 class="text-sm font-semibold text-rich-black uppercase tracking-wide">
          Field Info
        </h3>
        <div class="text-sm text-gray-600">
          <p><span class="font-medium">Name:</span> {{ field.name }}</p>
          <p><span class="font-medium">Type:</span> {{ field.type }}</p>
          <p><span class="font-medium">Builder Type:</span> {{ field.builder.type }}</p>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="h-full flex items-center justify-center p-6 text-gray-500">
    <div class="text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-16 w-16 mx-auto mb-4 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
      <p>Select a field to configure</p>
    </div>
  </div>
</template>

