<script setup lang="ts">
import type { Track } from '~/types'

interface Props {
  track: Track | undefined
  size?: 'sm' | 'lg'
  theme?: 'celtic' | 'winter' | 'default'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'lg',
  theme: 'celtic',
})

const { getTypeTextColor } = useTracks()

// Theme-based classes
const titleClasses = computed(() => {
  if (props.theme === 'winter') {
    return 'font-winter text-winter'
  }
  if (props.theme === 'celtic') {
    return 'font-medieval text-epic'
  }
  return 'font-bold text-tag'
})

const subtitleClasses = computed(() => {
  if (props.theme === 'winter') {
    return 'text-sky-300/70'
  }
  if (props.theme === 'celtic') {
    return 'text-emerald-400/60'
  }
  return 'text-purple-400/60'
})
</script>

<template>
  <div :class="['text-center', size === 'lg' ? 'mb-12 animate-fade-in-up' : '']">
    <p
      v-if="track"
      :class="['uppercase tracking-widest mb-2', getTypeTextColor(track.type), size === 'lg' ? 'text-sm' : 'text-xs']"
    >
      {{ track.type }}
    </p>
    <h1
      v-if="size === 'lg'"
      :class="['text-4xl md:text-6xl mb-3', titleClasses]"
    >
      {{ track?.title }}
    </h1>
    <h2
      v-else
      :class="['text-xl md:text-2xl truncate', titleClasses]"
    >
      {{ track?.title }}
    </h2>
    <p :class="[subtitleClasses, size === 'lg' ? 'text-lg' : 'text-sm']">
      {{ track?.subtitle }}
    </p>
  </div>
</template>
