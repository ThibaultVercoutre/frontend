<script setup lang="ts">
import type { Track } from '~/types'

interface Props {
  track: Track | undefined
  isPlaying: boolean
  coverSrc: string
}

defineProps<Props>()

const emit = defineEmits<{
  exitKaraoke: []
}>()

const visualizerRef = ref<HTMLElement | null>(null)

defineExpose({
  visualizerRef,
})
</script>

<template>
  <div class="flex items-center gap-6 pt-20 pb-8">
    <!-- Mini Vinyl -->
    <VinylRecord
      :is-spinning="isPlaying"
      :cover-src="coverSrc"
      size="sm"
      :show-play-button="false"
      class="flex-shrink-0 cursor-pointer"
      @click="emit('exitKaraoke')"
    />

    <!-- Right side: Visualizer bar + Title -->
    <div class="flex-1 min-w-0">
      <!-- Mini Visualizer Container -->
      <div
        ref="visualizerRef"
        class="h-12 md:h-16 w-full rounded-lg overflow-hidden bg-zinc-900/30 mb-2"
      ></div>
      <!-- Track Info -->
      <TrackInfo :track="track" size="sm" />
    </div>
  </div>
</template>
