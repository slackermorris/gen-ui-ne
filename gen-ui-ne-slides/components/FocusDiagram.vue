<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

interface Region { x: number; y: number; w: number; h: number }
interface Step {
  label: string
  note?: string
  code?: string
  lang?: string
  region?: Region
  regions?: Region[]
  // optional card anchor (top-left, % of the diagram frame). When set, the
  // caption is placed here instead of the default bottom-centre position.
  card?: { x: number; y: number }
}

const props = defineProps({
  image: { type: String, required: true },
  // aspect-ratio of the source image, so region %s map straight onto pixels
  ratio: { type: String, default: '3888 / 860' },
  steps: { type: Array as () => Step[], default: () => [] },
  // spotlight: blur + dim the diagram and ring the active region(s).
  // Set false for a plain image with per-click caption cards only.
  spotlight: { type: Boolean, default: true },
})

const { $clicks } = useSlideContext()

// robust to $clicks being a ref or an already-unwrapped number
const clicks = computed(() => {
  const v: unknown = $clicks
  if (v && typeof v === 'object' && 'value' in (v as any)) return Number((v as any).value) || 0
  return Number(v) || 0
})

// -1 = high-level overview (nothing focused); 0..n-1 = active focus step
const active = computed(() => {
  const c = clicks.value
  if (c <= 0) return -1
  return Math.min(c, props.steps.length) - 1
})

const step = computed(() => (active.value >= 0 ? props.steps[active.value] : null))

// a step may focus a single region (region) or several (regions)
const regions = computed<Region[]>(() => {
  if (!props.spotlight) return []
  const s = step.value
  if (!s) return []
  if (Array.isArray(s.regions)) return s.regions
  return s.region ? [s.region] : []
})

// clip a sharp copy down to one region: inset(top right bottom left)
function clipStyle(r: Region) {
  const top = r.y
  const right = 100 - (r.x + r.w)
  const bottom = 100 - (r.y + r.h)
  const left = r.x
  return { clipPath: `inset(${top}% ${right}% ${bottom}% ${left}% round 10px)` }
}

function ringStyle(r: Region) {
  return { left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%` }
}

// anchored-card position (only when the active step supplies `card`)
const cardStyle = computed(() => {
  const c = step.value?.card
  return c ? { left: `${c.x}%`, top: `${c.y}%` } : {}
})
</script>

<template>
  <div class="fd-root h-full w-full flex flex-col relative">
    <div class="px-12 pt-8">
      <slot />
    </div>

    <div class="flex-1 min-h-0 flex items-start justify-center px-10 pt-6">
      <div class="fd-frame relative w-full" :style="{ aspectRatio: ratio }">
        <!-- base image: sharp for the overview, blurred + dimmed once focusing -->
        <img
          :src="image"
          class="absolute inset-0 w-full h-full object-contain transition-all duration-500"
          :class="active >= 0 && spotlight ? 'fd-dim' : ''"
        />
        <!-- sharp copies, each clipped to one focused region -->
        <img
          v-for="(r, i) in regions"
          :key="'clip-' + i"
          :src="image"
          class="absolute inset-0 w-full h-full object-contain transition-all duration-500 pointer-events-none"
          :style="clipStyle(r)"
        />
        <!-- highlight ring around each focused region -->
        <div
          v-for="(r, i) in regions"
          :key="'ring-' + i"
          class="fd-ring absolute pointer-events-none transition-all duration-500"
          :style="ringStyle(r)"
        />
        <!-- anchored caption card, positioned within the diagram -->
        <transition name="fd-card">
          <div v-if="step && step.card" :key="'anchor-' + active" class="fd-card fd-card--anchored" :style="cardStyle">
            <div class="fd-card-head">
              <span class="fd-badge">{{ active + 1 }}</span>
              <span class="fd-label">{{ step.label }}</span>
            </div>
            <div v-if="step.note" class="fd-note">{{ step.note }}</div>
            <pre v-if="step.code" class="fd-code"><code>{{ step.code }}</code></pre>
          </div>
        </transition>
      </div>
    </div>

    <!-- default bottom-centre caption card (steps without a card anchor) -->
    <transition name="fd-card">
      <div v-if="step && !step.card" :key="active" class="fd-card">
        <div class="fd-card-head">
          <span class="fd-badge">{{ active + 1 }}</span>
          <span class="fd-label">{{ step.label }}</span>
        </div>
        <div v-if="step.note" class="fd-note">{{ step.note }}</div>
        <pre v-if="step.code" class="fd-code"><code>{{ step.code }}</code></pre>
      </div>
    </transition>

    <!-- invisible click anchors: register one slide click per step -->
    <span v-for="(s, i) in steps" :key="i" v-click class="fd-anchor" />
  </div>
</template>

<style scoped>
.fd-dim {
  filter: blur(3px) brightness(0.62) saturate(0.85);
}

.fd-ring {
  border: 2px solid rgba(240, 79, 180, 0.9);
  border-radius: 10px;
  box-shadow: 0 0 0 2px rgba(240, 79, 180, 0.18), 0 8px 30px rgba(240, 79, 180, 0.25);
}

.fd-card {
  position: absolute;
  bottom: 1.75rem;
  left: 50%;
  transform: translateX(-50%);
  max-width: min(64ch, 82%);
  padding: 0.85rem 1.15rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(6px);
}

.fd-card-head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.fd-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 999px;
  background: rgba(240, 79, 180, 0.95);
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
}

.fd-label {
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.fd-note {
  margin-top: 0.4rem;
  font-size: 0.9rem;
  line-height: 1.45;
  color: rgba(0, 0, 0, 0.7);
}

.fd-code {
  margin-top: 0.6rem;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.04);
  font-size: 0.72rem;
  line-height: 1.4;
  overflow-x: auto;
}

.fd-anchor {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

.fd-card--anchored {
  bottom: auto;
  left: 0;
  transform: none;
  width: 42%;
  max-width: 42%;
}

.fd-card-enter-active,
.fd-card-leave-active {
  transition: opacity 0.3s ease;
}
.fd-card-enter-from,
.fd-card-leave-to {
  opacity: 0;
}
</style>
