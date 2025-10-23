<script setup lang="ts">
import { RouterView } from '@kitbag/router'
import { motion, AnimatePresence } from 'motion-v'
</script>

<template>
  <RouterView v-slot="{ component, route }">
    <AnimatePresence mode="wait">
      <motion.div
        v-if="component"
        :key="route.name"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :exit="{ opacity: 0, y: -20 }"
        :transition="{ duration: 0.3, ease: 'easeInOut' }"
        class="h-full"
      >
        <component :is="component" />
      </motion.div>
    </AnimatePresence>
  </RouterView>
</template>