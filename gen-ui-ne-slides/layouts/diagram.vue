<script setup lang="ts">
defineProps({
  image: { type: String, required: true },
  caption: { type: String, default: null },
})
</script>

<template>
  <div class="slidev-layout diagram-bg h-full w-full !p-0 flex flex-col">
    <div class="px-12 pt-8">
      <slot />
    </div>
    <div class="flex-1 min-h-0 flex items-center justify-center px-8 py-4">
      <img :src="image" class="max-w-full max-h-full object-contain" />
    </div>
    <div v-if="caption" class="px-12 pb-6 text-sm text-black/50 text-center">
      {{ caption }}
    </div>
  </div>
</template>
