<script setup lang="ts">
import type { FormField } from '@/types/form-schema'

const props = defineProps<{
  field: FormField
  error?: string | null
}>()

const value = defineModel<string | number | undefined>({
  get: (val) => val ?? (typeof props.field.prefill?.value === 'string' || typeof props.field.prefill?.value === 'number' ? props.field.prefill.value : undefined),
  set: (val) => val !== undefined ? val : undefined,
})
</script>

<template>
  <div class="space-y-3">
    <label class="block text-sm font-medium text-gray-700">
      {{ field.display.label }}
      <span v-if="field.rule?.includes('required')" class="text-red-500">*</span>
    </label>
    <p v-if="field.display.placeholder" class="text-sm text-gray-500">
      {{ field.display.placeholder }}
    </p>
    <div class="space-y-2">
      <div
        v-for="option in field.enum"
        :key="option.value"
        class="flex items-center"
      >
        <input
          :id="`${field.name}_${option.value}`"
          v-model="value"
          type="radio"
          :value="option.value"
          :name="field.name"
          class="w-4 h-4 text-ultramarine bg-pale-purple border-ultramarine focus:ring-ultramarine accent-ultramarine"
        />
        <label
          :for="`${field.name}_${option.value}`"
          class="ml-3 text-sm text-gray-700 cursor-pointer"
        >
          {{ option.label }}
        </label>
      </div>
    </div>
    <p v-if="field.display.description" class="text-sm text-gray-500">
      {{ field.display.description }}
    </p>
    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
  </div>
</template>

