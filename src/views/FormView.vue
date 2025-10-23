<script setup lang="ts">
import { useRouter } from '@kitbag/router'
import FormRenderer from '@/components/FormRenderer.vue'

const router = useRouter()

const goToBuilder = () => {
  router.push('builder')
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
      <FormRenderer />
    </main>
  </div>
</template>

