<script setup lang="ts">
import type { Track } from '~/types'

interface Props {
  track: Track
  index: number
  isPlaying: boolean
  isCurrentTrack: boolean
  progress: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  play: [track: Track]
  openLyrics: [track: Track]
  openKaraoke: [track: Track]
}>()

const { getCoverSrc, getTypeIcon } = useTracks()

const trackNumber = computed(() => props.index + 1)

const handlePlay = () => {
  if (props.track.filename) {
    emit('play', props.track)
  }
}

const handleOpenLyrics = () => {
  if (props.track.filename) {
    emit('openLyrics', props.track)
  }
}

const handleOpenKaraoke = () => {
  if (props.track.filename) {
    emit('openKaraoke', props.track)
  }
}
</script>

<template>
  <div
    class="album-track-row group relative"
    :class="{
      'is-playing': isCurrentTrack && isPlaying,
      'is-current': isCurrentTrack,
      'is-disabled': !track.filename
    }"
  >
    <!-- Main Row Content -->
    <div class="track-content flex items-center gap-4 p-3 rounded-lg transition-all duration-300">
      <!-- Track Number -->
      <div class="w-8 text-center text-emerald-500/60 font-mono text-sm">
        <span v-if="!isCurrentTrack || !isPlaying">{{ String(trackNumber).padStart(2, '0') }}</span>
        <!-- Playing indicator -->
        <div v-else class="flex items-center justify-center gap-0.5">
          <span class="playing-bar"></span>
          <span class="playing-bar"></span>
          <span class="playing-bar"></span>
        </div>
      </div>

      <!-- Cover -->
      <div class="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-emerald-900/30">
        <NuxtImg
          :src="getCoverSrc(track)"
          :alt="track.title"
          width="48"
          height="48"
          format="webp"
          quality="80"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Title & Subtitle (clickable for lyrics) -->
      <button
        class="flex-1 text-left min-w-0"
        :disabled="!track.filename"
        @click="handleOpenLyrics"
      >
        <h3
          class="text-emerald-50 font-medium truncate transition-colors duration-300"
          :class="{
            'group-hover:text-amber-400': track.filename,
            'text-emerald-500/50': !track.filename
          }"
        >
          {{ track.title }}
        </h3>
        <p class="text-emerald-500/60 text-sm truncate">
          {{ track.subtitle }}
        </p>
      </button>

      <!-- Type Badge -->
      <div class="hidden sm:block text-lg" :title="track.type">
        {{ getTypeIcon(track.type) }}
      </div>

      <!-- Play Button -->
      <button
        class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
        :class="{
          'bg-amber-500 text-emerald-950 hover:bg-amber-400': track.filename,
          'bg-emerald-800/30 text-emerald-600/30 cursor-not-allowed': !track.filename
        }"
        :disabled="!track.filename"
        @click="handlePlay"
      >
        <svg v-if="!isPlaying || !isCurrentTrack" class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
        <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
        </svg>
      </button>

      <!-- Karaoke Button -->
      <NuxtLink
        :to="track.filename ? `/album/${track.albumId}/track/${track.id}` : undefined"
        class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
        :class="{
          'bg-emerald-700/50 text-emerald-300 hover:bg-emerald-600/50 hover:text-amber-400': track.filename,
          'bg-emerald-800/30 text-emerald-600/30 cursor-not-allowed pointer-events-none': !track.filename
        }"
        title="Mode Karaoke"
        @click.prevent="handleOpenKaraoke"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
        </svg>
      </NuxtLink>
    </div>

    <!-- Progress Bar -->
    <div class="progress-container h-1 mx-3 mb-1 rounded-full bg-emerald-800/30 overflow-hidden">
      <div
        class="progress-bar h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-100"
        :style="{ width: isCurrentTrack ? `${progress}%` : '0%' }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.album-track-row {
  @apply border-b border-emerald-800/20;
}

.album-track-row:last-child {
  @apply border-b-0;
}

.album-track-row.is-current .track-content {
  @apply bg-amber-500/10;
}

.album-track-row.is-playing .track-content {
  @apply bg-amber-500/15;
}

.album-track-row.is-disabled {
  @apply opacity-50;
}

.album-track-row:not(.is-disabled):hover .track-content {
  @apply bg-emerald-800/30;
}

/* Playing animation bars */
.playing-bar {
  @apply w-0.5 bg-amber-500 rounded-full;
  animation: playing-bar 0.8s ease-in-out infinite;
}

.playing-bar:nth-child(1) {
  @apply h-2;
  animation-delay: 0s;
}

.playing-bar:nth-child(2) {
  @apply h-3;
  animation-delay: 0.2s;
}

.playing-bar:nth-child(3) {
  @apply h-2;
  animation-delay: 0.4s;
}

@keyframes playing-bar {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.5);
  }
}
</style>
