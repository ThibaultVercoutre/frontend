<script setup lang="ts">
import type { Track } from '~/types'

interface Props {
  track: Track
  index: number
}

const props = defineProps<Props>()

const { getTypeColor, getTypeIcon } = useTracks()

// Track number within the album (1-based)
const trackNumber = computed(() => props.index + 1)
</script>

<template>
  <NuxtLink
    :to="`/album/${track.albumId}/track/${track.id}`"
    class="track-card relative rounded-2xl p-6 group cursor-pointer overflow-hidden block"
    :style="{ animationDelay: `${index * 100}ms` }"
  >
    <!-- Track Number with shield background -->
    <div class="absolute top-4 left-4 flex items-center gap-2">
      <div class="relative">
        <svg class="w-10 h-12 text-emerald-700/50" viewBox="0 0 100 120" fill="currentColor">
          <path d="M50 5 L95 20 L95 60 Q95 100 50 115 Q5 100 5 60 L5 20 Z" />
        </svg>
        <span class="absolute inset-0 flex items-center justify-center text-emerald-200 font-bold text-sm">
          {{ String(trackNumber).padStart(2, '0') }}
        </span>
      </div>
    </div>

    <!-- Type Badge -->
    <div class="absolute top-4 right-4">
      <span :class="['px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider', getTypeColor(track.type)]">
        {{ getTypeIcon(track.type) }} {{ track.type }}
      </span>
    </div>

    <!-- Track Info -->
    <div class="mt-14 pt-2">
      <h3 class="text-xl font-medieval text-emerald-50 group-hover:text-amber-400 transition-colors duration-300 mb-2 line-clamp-2">
        {{ track.title }}
      </h3>
      <p class="text-emerald-400/70 text-sm mb-4 truncate">{{ track.subtitle }}</p>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between mt-4 pt-4 border-t border-emerald-700/30">
      <span v-if="track.filename" class="text-emerald-500/60 text-sm font-mono">{{ track.duration }}</span>
      <span v-else class="text-zinc-600 text-xs italic">Bientôt disponible</span>

      <!-- Play hint -->
      <div
        class="flex items-center gap-2 text-emerald-500/60 group-hover:text-amber-400 transition-colors"
        :class="{ 'opacity-50': !track.filename }"
      >
        <span class="text-xs uppercase tracking-wider">Écouter</span>
        <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>

    <!-- Hover glow effect -->
    <div class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
                bg-gradient-to-t from-amber-500/5 via-transparent to-transparent pointer-events-none"></div>
  </NuxtLink>
</template>
