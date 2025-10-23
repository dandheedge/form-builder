<script setup lang="ts">
import { computed } from 'vue'
import type { FormField } from '@/types/form-schema'

const props = defineProps<{
  field: FormField
  error?: string | null
}>()

const value = defineModel<number | undefined>({
  get: (val) => {
    const prefillValue = props.field.prefill?.value
    return val ?? (typeof prefillValue === 'number' ? prefillValue : undefined)
  },
  set: (val) => {
    if (val === null || val === undefined || (typeof val === 'number' && isNaN(val))) {
      return undefined
    }
    return Number(val)
  },
})

const step = computed(() => {
  return props.field.value_constraints?.allow_decimal ? '0.01' : '1'
})

const min = computed(() => props.field.value_constraints?.minimum)
const max = computed(() => props.field.value_constraints?.maximum)
</script>

<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-700">
      {{ field.display.label }}
      <span v-if="field.rule?.includes('required')" class="text-red-500">*</span>
    </label>
    <input
      v-model="value"
      type="number"
      :step="step"
      :min="min"
      :max="max"
      :placeholder="field.display.placeholder"
      class="w-full px-4 py-2 border border-ultramarine rounded-lg focus:ring-2 focus:ring-medium-slate-blue focus:border-transparent transition-all"
      :class="{ 'border-red-500': error }"
    />
    <p v-if="field.display.description" class="text-sm text-gray-500">
      {{ field.display.description }}
    </p>
    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
  </div>
</template>

