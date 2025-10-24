<script setup lang="ts">
import type { FormField } from '@/types/form-schema'

const props = defineProps<{
  field: FormField
  error?: string | null
}>()

const value = defineModel<string | undefined>({
  get: (val) => val ?? (typeof props.field.prefill?.value === 'string' ? props.field.prefill.value : ''),
  set: (val) => val,
})
</script>

<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-700">
      {{ field.display.label }}
      <span v-if="field.rule?.includes('required')" class="text-red-500">*</span>
    </label>
    <input
      v-model="value"
      type="date"
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

