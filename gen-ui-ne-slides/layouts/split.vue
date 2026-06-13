<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

defineProps({
  images: { type: Array, default: null },
  caption: { type: String, default: null },
})

const { $page } = useSlideContext()

// deterministic pseudo-random, seeded by slide number so each slide's
// rail is different but stable across renders
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

const page = computed(() => $page ?? 1)

const gradient = computed(() => {
  const p = Number(page.value) || 1
  const angle = Math.round(90 + rand(p) * 180)
  const pinks = ['#f9c6dc', '#f7b8d4', '#fbd3e3', '#f4a9c9']
  const grays = ['#ececec', '#e4e1e3', '#f2f0f1', '#dcd9db']
  const pink = pinks[Math.floor(rand(p + 1) * pinks.length)]
  const gray = grays[Math.floor(rand(p + 2) * grays.length)]
  const mid = Math.round(35 + rand(p + 3) * 25)
  return `linear-gradient(${angle}deg, ${pink} 0%, #ffffff ${mid}%, ${gray} 100%)`
})

const noiseUrl = computed(() => {
  const seed = Number(page.value) || 1
  const svg = `%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch' seed='${seed}'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E`
  return `url("data:image/svg+xml,${svg}")`
})
</script>

<template>
  <div class="slidev-layout h-full w-full !p-0 grid" style="grid-template-columns: 3fr 2fr">
    <div class="bg-white px-14 py-10 flex flex-col justify-center overflow-hidden">
      <slot />
    </div>
    <div class="relative h-full w-full overflow-hidden" :style="{ background: gradient }">
      <div
        class="absolute inset-0 pointer-events-none"
        :style="{ backgroundImage: noiseUrl, opacity: 0.22, mixBlendMode: 'multiply' }"
      />
      <div v-if="images" class="relative h-full flex flex-col items-center justify-center gap-3 px-6 py-8">
        <div class="flex gap-3 items-center justify-center min-h-0">
          <img v-for="img in images" :key="img" :src="img" class="rounded-lg shadow-xl max-h-95 min-w-0 object-contain" />
        </div>
        <div v-if="caption" class="text-xs text-black/50 text-center">{{ caption }}</div>
      </div>
    </div>
  </div>
</template>
