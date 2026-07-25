<script setup lang="ts">
import { computed } from 'vue'
import { resolveAssetUrl } from '../utils/asset'

const props = defineProps({
  images: { type: Array as () => string[], default: null },
  caption: { type: String, default: null },
})

// frontmatter paths are root-relative; prefix them with the deploy base
const srcs = computed(() => (props.images ?? []).map(resolveAssetUrl))
</script>

<template>
  <div class="slidev-layout h-full w-full !p-0 grid" style="grid-template-columns: 3fr 2fr">
    <div class="px-14 py-10 flex flex-col justify-center overflow-hidden" style="background: #fefeff">
      <slot />
    </div>
    <div class="split-rail relative h-full w-full overflow-hidden">
      <div v-if="images" class="relative h-full flex flex-col items-center justify-center gap-3 px-6 py-8">
        <div class="flex gap-3 items-center justify-center min-h-0">
          <img v-for="img in srcs" :key="img" :src="img" class="rounded-lg shadow-xl max-h-95 min-w-0 object-contain" />
        </div>
        <div v-if="caption" class="text-xs text-black/50 text-center">{{ caption }}</div>
      </div>
    </div>
  </div>
</template>
