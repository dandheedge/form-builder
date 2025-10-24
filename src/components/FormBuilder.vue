<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from '@kitbag/router'
import { motion, AnimatePresence } from 'motion-v'
import { useFormBuilderStore } from '@/stores/form-builder'
import { useDragAndDrop } from '@/composables/useDragAndDrop'
import { transformSchemaForRenderer } from '@/utils/schema-transformer'
import FieldListItem from './builder/FieldListItem.vue'
import FieldConfigPanel from './builder/FieldConfigPanel.vue'
import FormRenderer from './FormRenderer.vue'
import type { FieldType } from '@/types/form-schema'

const router = useRouter()
const store = useFormBuilderStore()
const showPreview = ref(true)
const showExportModal = ref(false)
const exportedJson = ref('')

// Transform schema for the preview renderer
// In builder mode, we still keep full schema access, but renderer gets minimal schema
const rendererSchema = computed(() => transformSchemaForRenderer(store.schema))

const {
  draggedIndex,
  dragOverIndex,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  handleDrop,
} = useDragAndDrop()

const fieldTypes: { type: FieldType; label: string; icon: string }[] = [
  { type: 'Text', label: 'Text Input', icon: '📝' },
  { type: 'Email', label: 'Email', icon: '📧' },
  { type: 'Number', label: 'Number', icon: '🔢' },
  { type: 'Radio', label: 'Radio Buttons', icon: '⚪' },
  { type: 'Checkbox', label: 'Checkboxes', icon: '☑️' },
  { type: 'Select', label: 'Dropdown', icon: '📋' },
]

const addNewField = (type: FieldType) => {
  store.addField(type)
}

const handleExport = () => {
  exportedJson.value = store.exportSchema()
  showExportModal.value = true
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(exportedJson.value)
  alert('Schema copied to clipboard!')
}

const handleImport = () => {
  const json = prompt('Paste your JSON schema:')
  if (json) {
    store.importSchema(json)
  }
}

const isDraggingField = (index: number) => {
  return draggedIndex.value === index
}

const handleFormValuesUpdate = (newValues: Record<string, unknown>) => {
  // Update form values in the store during preview
  Object.entries(newValues).forEach(([fieldName, value]) => {
    store.updateFormValue(fieldName, value)
  })
}

const handleFormSubmit = (values: Record<string, unknown>) => {
  console.log('Form preview submitted:', values)
}

const isDragOver = (index: number) => {
  return dragOverIndex.value === index
}
</script>

<template>
  <div class="h-screen flex flex-col bg-pale-purple">
    <!-- Header -->
    <header class="bg-white border-b border-ultramarine px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-rich-black">Form Builder</h1>
          <input
            v-model="store.schema.label"
            type="text"
            class="px-3 py-1 border border-ultramarine rounded-lg focus:ring-2 focus:ring-medium-slate-blue focus:border-transparent"
            placeholder="Form Name"
          />
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-ultramarine bg-white border border-ultramarine rounded-lg hover:bg-pale-purple transition-colors cursor-pointer"
            @click="handleImport"
          >
            Import JSON
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-ultramarine bg-white border border-ultramarine rounded-lg hover:bg-pale-purple transition-colors cursor-pointer"
            @click="handleExport"
          >
            Export JSON
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-white bg-medium-slate-blue rounded-lg hover:bg-ultramarine transition-colors cursor-pointer"
            @click="router.push('form')"
          >
            View Form →
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-white bg-ultramarine rounded-lg hover:bg-medium-slate-blue transition-colors cursor-pointer"
            @click="showPreview = !showPreview"
          >
            {{ showPreview ? 'Hide' : 'Show' }} Preview
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Sidebar - Field List -->
      <div class="w-80 bg-white border-r border-ultramarine flex flex-col">
        <div class="p-4 border-b border-ultramarine">
          <h2 class="text-sm font-semibold text-rich-black uppercase tracking-wide mb-3">
            Add Fields
          </h2>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="fieldType in fieldTypes"
              :key="fieldType.type"
              type="button"
              class="flex flex-col items-center gap-1 p-3 bg-pale-purple hover:bg-medium-slate-blue hover:text-white border border-ultramarine rounded-lg transition-all cursor-pointer"
              @click="addNewField(fieldType.type)"
            >
              <span class="text-2xl">{{ fieldType.icon }}</span>
              <span class="text-xs font-medium">{{ fieldType.label }}</span>
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-4">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-sm font-semibold text-rich-black uppercase tracking-wide">
              Form Fields ({{ store.fieldOrder.length }})
            </h2>
          </div>

          <motion.div 
            v-if="store.fieldOrder.length === 0" 
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            class="text-center py-8 text-gray-400"
          >
            <p class="text-sm">No fields yet</p>
            <p class="text-xs mt-1">Add a field to get started</p>
          </motion.div>

          <AnimatePresence>
            <div v-if="store.fieldOrder.length > 0" class="space-y-2">
              <motion.div
                v-for="(fieldName, index) in store.fieldOrder"
                :key="fieldName"
                draggable="true"
                layout
                class="relative"
                :class="{
                  'border-t-2 border-ultramarine pt-2': isDragOver(index),
                }"
                :style="{
                  cursor: 'grab'
                }"
                @dragstart="handleDragStart(index)"
                @dragover="handleDragOver($event, index)"
                @dragend="handleDragEnd"
                @drop="handleDrop($event, store.fieldOrder, store.reorderFields)"
              >
                <FieldListItem
                  v-if="store.schema.items[fieldName]"
                  :field="store.schema.items[fieldName]"
                  :is-selected="store.selectedFieldName === fieldName"
                  :is-dragging="isDraggingField(index)"
                  @select="store.selectField(fieldName)"
                  @remove="store.removeField(fieldName)"
                />
              </motion.div>
            </div>
          </AnimatePresence>
        </div>
      </div>

      <!-- Center - Preview -->
      <AnimatePresence>
        <motion.div 
          v-if="showPreview"
          :initial="{ opacity: 0, x: 50 }"
          :animate="{ opacity: 1, x: 0 }"
          :exit="{ opacity: 0, x: 50 }"
          :transition="{ type: 'spring', damping: 25, stiffness: 300 }"
          class="flex-1 overflow-y-auto bg-pale-purple p-6"
        >
          <motion.div 
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ delay: 0.1 }"
            class="max-w-3xl mx-auto"
          >
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-lg font-semibold text-rich-black">Preview</h2>
              <motion.button
                type="button"
                :whileHover="{ scale: 1.05 }"
                :whilePress="{ scale: 0.95 }"
                class="text-sm text-medium-slate-blue hover:text-ultramarine"
                @click="store.formValues = {}"
              >
                Reset Form
              </motion.button>
            </div>
            <FormRenderer
              :schema="rendererSchema"
              :full-schema="store.schema"
              :form-values="store.formValues"
              @update:form-values="handleFormValuesUpdate"
              @submit="handleFormSubmit"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <!-- Right Sidebar - Configuration Panel -->
      <div class="w-96 bg-white border-l border-ultramarine overflow-y-auto">
        <FieldConfigPanel
          v-if="store.selectedField"
          :field="store.selectedField"
          @update="(updates) => store.selectedFieldName && store.updateField(store.selectedFieldName, updates)"
        />
      </div>
    </div>

    <!-- Export Modal -->
    <AnimatePresence>
      <motion.div
        v-if="showExportModal"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        @click.self="showExportModal = false"
      >
        <motion.div 
          :initial="{ scale: 0.9, opacity: 0, y: 20 }"
          :animate="{ scale: 1, opacity: 1, y: 0 }"
          :exit="{ scale: 0.9, opacity: 0, y: 20 }"
          :transition="{ type: 'spring', damping: 25, stiffness: 300 }"
          class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] flex flex-col"
        >
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-xl font-bold text-gray-900">Export Schema</h2>
          </div>

          <div class="flex-1 overflow-y-auto p-6">
            <pre class="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">{{ exportedJson }}</pre>
          </div>

          <div class="p-6 border-t border-ultramarine flex gap-3 justify-end">
            <motion.button
              type="button"
              :whileHover="{ scale: 1.02 }"
              :whilePress="{ scale: 0.98 }"
              class="px-4 py-2 text-sm font-medium text-ultramarine bg-white border border-ultramarine rounded-lg hover:bg-pale-purple transition-colors"
              @click="showExportModal = false"
            >
              Close
            </motion.button>
            <motion.button
              type="button"
              :whileHover="{ scale: 1.02 }"
              :whilePress="{ scale: 0.98 }"
              class="px-4 py-2 text-sm font-medium text-white bg-ultramarine rounded-lg hover:bg-medium-slate-blue transition-colors"
              @click="copyToClipboard"
            >
              Copy to Clipboard
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  </div>
</template>

