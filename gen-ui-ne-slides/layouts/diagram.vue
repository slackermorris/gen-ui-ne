<script setup lang="ts">
import { computed } from 'vue'
import { resolveAssetUrl } from '../utils/asset'

const props = defineProps({
  image: { type: String, required: true },
  caption: { type: String, default: null },
})

// frontmatter paths are root-relative; prefix them with the deploy base
const src = computed(() => resolveAssetUrl(props.image))
</script>

<template>
  <div class="slidev-layout diagram-bg h-full w-full !p-0 flex flex-col">
    <div class="px-12 pt-8">
      <slot />
    </div>
    <div class="flex-1 min-h-0 flex items-center justify-center px-8 py-4">
      <img :src="src" class="max-w-full max-h-full object-contain" />
    </div>
    <div v-if="caption" class="px-12 pb-6 text-sm text-black/50 text-center">
      {{ caption }}
    </div>
  </div>
</template>
