<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from '@kitbag/router'
import FormRenderer from '@/components/FormRenderer.vue'
import { useFormBuilderStore } from '@/stores/form-builder'
import { transformSchemaForRenderer } from '@/utils/schema-transformer'

const router = useRouter()
const store = useFormBuilderStore()

// Transform the full schema to a minimal renderer schema
// This strips out sensitive metadata like builder config, visibility rules, and validation rules
const rendererSchema = computed(() => transformSchemaForRenderer(store.schema))

const goToBuilder = () => {
  router.push('builder')
}

const handleFormValuesUpdate = (newValues: Record<string, unknown>) => {
  // Update form values in the store
  Object.entries(newValues).forEach(([fieldName, value]) => {
    store.updateFormValue(fieldName, value)
  })
}

const handleFormSubmit = (values: Record<string, unknown>) => {
  console.log('Form submitted in FormView:', values)
}
</script>

<template>
  <div class="min-h-screen bg-pale-purple">
    <header class="bg-white border-b border-ultramarine px-6 py-4">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <h1 class="text-xl font-bold text-rich-black">Form Preview</h1>
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-ultramarine bg-white border border-ultramarine rounded-lg hover:bg-pale-purple transition-colors cursor-pointer"
          @click="goToBuilder"
        >
          ← Back to Builder
        </button>
      </div>
    </header>

    <main class="py-8 pb-16">
      <FormRenderer
        :schema="rendererSchema"
        :full-schema="store.schema"
        :form-values="store.formValues"
        @update:form-values="handleFormValuesUpdate"
        @submit="handleFormSubmit"
      />
    </main>
  </div>
</template>

