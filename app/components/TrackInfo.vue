<script setup lang="ts">
import type { Track } from '~/types'

interface Props {
  track: Track | undefined
  size?: 'sm' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'lg',
})

const { getTypeTextColor } = useTracks()
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
      class="text-4xl md:text-6xl font-medieval text-epic mb-3"
    >
      {{ track?.title }}
    </h1>
    <h2
      v-else
      class="text-xl md:text-2xl font-medieval text-epic truncate"
    >
      {{ track?.title }}
    </h2>
    <p class="text-emerald-400/60" :class="size === 'lg' ? 'text-lg' : 'text-sm'">
      {{ track?.subtitle }}
    </p>
  </div>
</template>
