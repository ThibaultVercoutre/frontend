<script setup lang="ts">
import type { Track } from '~/types'

interface Props {
  track: Track
  index: number
}

const props = defineProps<Props>()

const { getTypeIcon } = useTracks()

// Track number within the album (1-based)
const trackNumber = computed(() => props.index + 1)

// Winter-themed type colors
const getWinterTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    festive: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    parody: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  }
  return colors[type] || 'bg-sky-500/20 text-sky-300 border-sky-500/30'
}
</script>

<template>
  <NuxtLink
    :to="`/album/${track.albumId}/track/${track.id}`"
    class="track-card-winter relative rounded-2xl p-6 group cursor-pointer overflow-hidden block"
    :style="{ animationDelay: `${index * 100}ms` }"
  >
    <!-- Track Number with mountain/pine background -->
    <div class="absolute top-4 left-4 flex items-center gap-2">
      <div class="relative">
        <!-- Mountain shape -->
        <svg class="w-10 h-10 text-sky-700/50" viewBox="0 0 40 40" fill="currentColor">
          <path d="M20 5 L35 35 L5 35 Z" />
        </svg>
        <span class="absolute inset-0 flex items-center justify-center text-sky-200 font-bold text-sm pt-2">
          {{ String(trackNumber).padStart(2, '0') }}
        </span>
      </div>
    </div>

    <!-- Type Badge -->
    <div class="absolute top-4 right-4">
      <span :class="['px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border', getWinterTypeColor(track.type)]">
        {{ getTypeIcon(track.type) }} {{ track.type }}
      </span>
    </div>

    <!-- Track Info -->
    <div class="mt-14 pt-2">
      <h3 class="text-xl font-winter text-sky-50 group-hover:text-amber-400 transition-colors duration-300 mb-2 line-clamp-2">
        {{ track.title }}
      </h3>
      <p class="text-sky-300/70 text-sm mb-4 truncate">{{ track.subtitle }}</p>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between mt-4 pt-4 border-t border-sky-700/30">
      <span v-if="track.filename" class="text-sky-400/60 text-sm font-mono">{{ track.duration }}</span>
      <span v-else class="text-sky-600/50 text-xs italic">Bientôt disponible</span>

      <!-- Play hint -->
      <div
        class="flex items-center gap-2 text-sky-400/60 group-hover:text-amber-400 transition-colors"
        :class="{ 'opacity-50': !track.filename }"
      >
        <span class="text-xs uppercase tracking-wider">Écouter</span>
        <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>

    <!-- Hover glow effect - warm cabin glow -->
    <div class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
                bg-gradient-to-t from-amber-500/10 via-transparent to-transparent pointer-events-none"></div>
  </NuxtLink>
</template>
