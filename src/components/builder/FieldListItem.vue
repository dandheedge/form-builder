<script setup lang="ts">
import { motion } from 'motion-v'
import type { FormField } from '@/types/form-schema'

defineProps<{
  field: FormField
  isSelected: boolean
  isDragging: boolean
}>()

defineEmits<{
  select: []
  remove: []
}>()

const getFieldIcon = (type: FormField['type']) => {
  switch (type) {
    case 'Text':
    case 'Email':
      return '📝'
    case 'Number':
      return '🔢'
    case 'Radio':
      return '⚪'
    case 'Checkbox':
      return '☑️'
    case 'Select':
      return '📋'
    case 'Date':
      return '📅'
    default:
      return '📄'
  }
}
</script>

<template>
  <motion.div
    layout
    :initial="{ opacity: 0, scale: 0.8, y: -20 }"
    :animate="{ 
      opacity: 1, 
      scale: 1, 
      y: 0,
      borderColor: isSelected ? 'rgb(47, 18, 152)' : 'rgb(242, 231, 255)'
    }"
    :exit="{ opacity: 0, scale: 0.8, x: -100 }"
    :transition="{ 
      layout: { duration: 0.3, ease: 'easeInOut' },
      opacity: { duration: 0.2 },
      scale: { duration: 0.2 }
    }"
    class="group relative flex items-center justify-between p-3 bg-white border-2 rounded-lg cursor-move hover:border-ultramarine"
    :class="{
      'bg-pale-purple': isSelected,
      'opacity-50 scale-105': isDragging,
    }"
    @click="$emit('select')"
  >
    <div class="flex items-center gap-3 flex-1 min-w-0">
      <motion.span 
        class="text-xl flex-shrink-0"
        :animate="{ rotate: isDragging ? [0, -10, 10, -10, 0] : 0 }"
        :transition="{ duration: 0.5 }"
      >
        {{ getFieldIcon(field.type) }}
      </motion.span>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900 truncate">
          {{ field.display.label }}
        </p>
        <p class="text-xs text-gray-500">{{ field.type }}</p>
      </div>
    </div>

    <motion.button
      type="button"
      :initial="{ opacity: 1, scale: 0.8 }"
      :whileHover="{ scale: 1.1 }"
      :whilePress="{ scale: 0.9 }"
      class="flex-shrink-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 rounded transition-opacity cursor-pointer"
      @click.stop="$emit('remove')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>
    </motion.button>
  </motion.div>
</template>

