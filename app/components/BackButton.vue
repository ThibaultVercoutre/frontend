<script setup lang="ts">
import type { LyricLine } from '~/types'

type SectionType = LyricLine['type']

interface Props {
  to?: string
  label?: string
  theme?: 'celtic' | 'winter' | 'default'
  sectionType?: SectionType
  trackId?: number
}

const props = withDefaults(defineProps<Props>(), {
  to: '/',
  label: 'Retour',
  theme: 'celtic',
  sectionType: undefined,
  trackId: 0,
})

// Check if we should use pride colors (track 3 "Majorité de Minorité" during REFRAIN)
const usePrideColors = computed(() => props.trackId === 3 && props.sectionType === 'REFRAIN')

// Section-based color classes
const sectionColorClasses = computed(() => {
  if (!props.sectionType) return null

  // Pride colors for "Majorité de Minorité" REFRAIN
  if (usePrideColors.value) {
    return 'text-pink-400/70 hover:text-purple-300'
  }

  const colors: Record<SectionType, string> = {
    INTRO: 'text-blue-400/70 hover:text-blue-300',
    COUPLET: 'text-green-400/70 hover:text-green-300',
    REFRAIN: 'text-orange-400/70 hover:text-yellow-300',
    CHORUS: 'text-rose-400/70 hover:text-pink-300',
    VERSE: 'text-teal-400/70 hover:text-teal-300',
    BRIDGE: 'text-purple-400/70 hover:text-fuchsia-300',
    OUTRO: 'text-gray-400/70 hover:text-gray-300',
    INSTRUMENTAL: 'text-amber-400/70 hover:text-cyan-300',
  }
  return colors[props.sectionType] || null
})

// Theme-based fallback colors
const themeColorClasses = computed(() => {
  if (props.theme === 'winter') {
    return 'text-sky-400/70 hover:text-amber-400'
  }
  if (props.theme === 'celtic') {
    return 'text-emerald-400/70 hover:text-amber-400'
  }
  return 'text-purple-400/70 hover:text-pink-400'
})

// Use section colors if available, otherwise fall back to theme
const colorClasses = computed(() => sectionColorClasses.value || themeColorClasses.value)
</script>

<template>
  <NuxtLink
    :to="to"
    :class="['flex items-center gap-2 transition-colors duration-500 group', colorClasses]"
  >
    <svg
      class="w-6 h-6 transform group-hover:-translate-x-1 transition-transform"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    <span class="text-sm uppercase tracking-wider">{{ label }}</span>
  </NuxtLink>
</template>
