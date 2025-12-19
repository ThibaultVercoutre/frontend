<script setup lang="ts">
import type { LyricLine } from '~/types'

type SectionType = LyricLine['type']

interface Props {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted?: boolean
  formattedCurrentTime: string
  formattedDuration: string
  progress: number
  theme?: 'celtic' | 'winter' | 'default'
  isShuffleMode?: boolean
  isAutoPlay?: boolean
  prevTrackUrl?: string
  nextTrackUrl?: string
  hasPrevTrack?: boolean
  hasNextTrack?: boolean
  trackIndex: number
  totalTracks: number
  sectionType?: SectionType
  trackId?: number
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'default',
  isMuted: false,
  isShuffleMode: false,
  isAutoPlay: false,
  hasPrevTrack: false,
  hasNextTrack: false,
  sectionType: 'INSTRUMENTAL',
  trackId: 0,
})

// Check if we should use pride colors (track 3 "Majorité de Minorité" during REFRAIN)
const usePrideColors = computed(() => props.trackId === 3 && props.sectionType === 'REFRAIN')

const emit = defineEmits<{
  togglePlay: []
  seek: [time: number]
  volumeChange: [volume: number]
  toggleMute: []
  toggleShuffle: []
  toggleAutoPlay: []
}>()

// Pride flag gradient (for "Majorité de Minorité" REFRAIN)
const prideGradient = 'linear-gradient(to right, #EF4444, #F97316, #FACC15, #22C55E, #3B82F6, #9333EA)'

// Section-based progress bar gradient (CSS style)
const sectionGradientStyle = computed(() => {
  // Use pride colors for track 3 REFRAIN
  if (usePrideColors.value) {
    return prideGradient
  }

  const gradients: Record<SectionType, string> = {
    INTRO: 'linear-gradient(to right, #2563eb, #60a5fa)',
    COUPLET: 'linear-gradient(to right, #16a34a, #4ade80)',
    REFRAIN: 'linear-gradient(to right, #f97316, #facc15)',
    CHORUS: 'linear-gradient(to right, #f43f5e, #f472b6)',
    VERSE: 'linear-gradient(to right, #0d9488, #2dd4bf)',
    BRIDGE: 'linear-gradient(to right, #9333ea, #e879f9)',
    OUTRO: 'linear-gradient(to right, #6b7280, #9ca3af)',
    INSTRUMENTAL: 'linear-gradient(to right, #d97706, #06b6d4)',
  }
  return gradients[props.sectionType] || gradients.INSTRUMENTAL
})

// Section-based thumb color
const sectionThumbColor = computed(() => {
  // Pride: use a rainbow gradient background for the thumb
  if (usePrideColors.value) {
    return 'bg-gradient-to-r from-red-500 via-green-500 to-purple-500'
  }

  const colors: Record<SectionType, string> = {
    INTRO: 'bg-blue-400',
    COUPLET: 'bg-green-400',
    REFRAIN: 'bg-yellow-400',
    CHORUS: 'bg-pink-400',
    VERSE: 'bg-teal-400',
    BRIDGE: 'bg-fuchsia-400',
    OUTRO: 'bg-gray-400',
    INSTRUMENTAL: 'bg-cyan-400',
  }
  return colors[props.sectionType] || colors.INSTRUMENTAL
})

// Section-based play button gradient
const sectionPlayButton = computed(() => {
  // Pride: rainbow gradient for play button
  if (usePrideColors.value) {
    return 'from-red-600 via-green-500 to-purple-600 border-pink-400/30 hover:from-red-500 hover:via-green-400 hover:to-purple-500'
  }

  const gradients: Record<SectionType, string> = {
    INTRO: 'from-blue-600 to-blue-800 border-blue-500/30 hover:from-blue-500 hover:to-blue-700',
    COUPLET: 'from-green-600 to-green-800 border-green-500/30 hover:from-green-500 hover:to-green-700',
    REFRAIN: 'from-orange-500 to-amber-700 border-orange-400/30 hover:from-orange-400 hover:to-amber-600',
    CHORUS: 'from-rose-500 to-rose-700 border-rose-400/30 hover:from-rose-400 hover:to-rose-600',
    VERSE: 'from-teal-600 to-teal-800 border-teal-500/30 hover:from-teal-500 hover:to-teal-700',
    BRIDGE: 'from-purple-600 to-purple-800 border-purple-500/30 hover:from-fuchsia-500 hover:to-fuchsia-700',
    OUTRO: 'from-gray-500 to-gray-700 border-gray-400/30 hover:from-gray-400 hover:to-gray-600',
    INSTRUMENTAL: 'from-amber-600 to-amber-800 border-amber-500/30 hover:from-cyan-500 hover:to-cyan-700',
  }
  return gradients[props.sectionType] || gradients.INSTRUMENTAL
})

// Section-based text color for secondary elements
const sectionTextColor = computed(() => {
  if (usePrideColors.value) return 'text-pink-400'

  const colors: Record<SectionType, string> = {
    INTRO: 'text-blue-400',
    COUPLET: 'text-green-400',
    REFRAIN: 'text-orange-400',
    CHORUS: 'text-rose-400',
    VERSE: 'text-teal-400',
    BRIDGE: 'text-purple-400',
    OUTRO: 'text-gray-400',
    INSTRUMENTAL: 'text-amber-400',
  }
  return colors[props.sectionType] || colors.INSTRUMENTAL
})

// Section-based muted text color
const sectionTextMuted = computed(() => {
  if (usePrideColors.value) return 'text-pink-400/60'

  const colors: Record<SectionType, string> = {
    INTRO: 'text-blue-400/60',
    COUPLET: 'text-green-400/60',
    REFRAIN: 'text-orange-400/60',
    CHORUS: 'text-rose-400/60',
    VERSE: 'text-teal-400/60',
    BRIDGE: 'text-purple-400/60',
    OUTRO: 'text-gray-400/60',
    INSTRUMENTAL: 'text-amber-400/60',
  }
  return colors[props.sectionType] || colors.INSTRUMENTAL
})

// Section-based hover text color
const sectionTextHover = computed(() => {
  if (usePrideColors.value) return 'hover:text-purple-300'

  const colors: Record<SectionType, string> = {
    INTRO: 'hover:text-blue-300',
    COUPLET: 'hover:text-green-300',
    REFRAIN: 'hover:text-yellow-300',
    CHORUS: 'hover:text-pink-300',
    VERSE: 'hover:text-teal-300',
    BRIDGE: 'hover:text-fuchsia-300',
    OUTRO: 'hover:text-gray-300',
    INSTRUMENTAL: 'hover:text-cyan-300',
  }
  return colors[props.sectionType] || colors.INSTRUMENTAL
})

// Section-based border color
const sectionBorder = computed(() => {
  if (usePrideColors.value) return 'border-pink-600/30'

  const colors: Record<SectionType, string> = {
    INTRO: 'border-blue-800/30',
    COUPLET: 'border-green-800/30',
    REFRAIN: 'border-orange-800/30',
    CHORUS: 'border-rose-800/30',
    VERSE: 'border-teal-800/30',
    BRIDGE: 'border-purple-800/30',
    OUTRO: 'border-gray-700/30',
    INSTRUMENTAL: 'border-amber-800/30',
  }
  return colors[props.sectionType] || colors.INSTRUMENTAL
})

// Section-based volume bar color
const sectionVolumeBar = computed(() => {
  if (usePrideColors.value) return 'bg-gradient-to-r from-red-500 via-green-500 to-purple-500'

  const colors: Record<SectionType, string> = {
    INTRO: 'bg-blue-500',
    COUPLET: 'bg-green-500',
    REFRAIN: 'bg-orange-500',
    CHORUS: 'bg-rose-500',
    VERSE: 'bg-teal-500',
    BRIDGE: 'bg-purple-500',
    OUTRO: 'bg-gray-500',
    INSTRUMENTAL: 'bg-amber-500',
  }
  return colors[props.sectionType] || colors.INSTRUMENTAL
})

// Section-based active button color (for shuffle/autoplay when active)
const sectionActiveColor = computed(() => {
  if (usePrideColors.value) return 'text-pink-300'

  const colors: Record<SectionType, string> = {
    INTRO: 'text-blue-300',
    COUPLET: 'text-green-300',
    REFRAIN: 'text-yellow-300',
    CHORUS: 'text-pink-300',
    VERSE: 'text-teal-300',
    BRIDGE: 'text-fuchsia-300',
    OUTRO: 'text-gray-300',
    INSTRUMENTAL: 'text-cyan-300',
  }
  return colors[props.sectionType] || colors.INSTRUMENTAL
})

// Progress bar hover state for timecode tooltip
const progressBarRef = ref<HTMLElement | null>(null)
const isHoveringProgress = ref(false)
const hoverProgress = ref(0)
const hoverTime = computed(() => {
  const time = (hoverProgress.value / 100) * props.duration
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

// Local dragging state for immediate visual feedback
const isDragging = ref(false)
const dragProgress = ref(0)

// Use local progress when dragging, otherwise use prop
const displayProgress = computed(() => {
  return isDragging.value ? dragProgress.value : props.progress
})

const onProgressHover = (event: MouseEvent) => {
  if (!progressBarRef.value) return
  const rect = progressBarRef.value.getBoundingClientRect()
  hoverProgress.value = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100))
}

// Handle click on progress bar for immediate seek
const onProgressClick = (event: MouseEvent) => {
  if (!progressBarRef.value || props.duration <= 0) return
  const rect = progressBarRef.value.getBoundingClientRect()
  const clickProgress = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100))
  const newTime = (clickProgress / 100) * props.duration
  dragProgress.value = clickProgress
  isDragging.value = true
  emit('seek', newTime)
  // Reset dragging state after a short delay to let parent update
  setTimeout(() => {
    isDragging.value = false
  }, 50)
}

// Handle seek from range input
const onSeek = (event: Event) => {
  const target = event.target as HTMLInputElement
  const newTime = parseFloat(target.value)
  // Update local state immediately for visual feedback
  dragProgress.value = (newTime / props.duration) * 100
  isDragging.value = true
  emit('seek', newTime)
  // Reset dragging state after parent updates
  setTimeout(() => {
    isDragging.value = false
  }, 50)
}

// Handle volume change
const onVolumeChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('volumeChange', parseFloat(target.value))
}

// Toggle mute
const handleToggleMute = () => {
  emit('toggleMute')
}

// Check if audio is muted (either via mute toggle or volume at 0)
const isMutedOrSilent = computed(() => props.isMuted || props.volume === 0)
</script>

<template>
  <div
    :class="[
      'fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-zinc-950 via-zinc-900/95 to-zinc-900/90 backdrop-blur-lg border-t transition-colors duration-500',
      sectionBorder
    ]"
  >
    <div class="container mx-auto px-3 py-3 sm:px-6 sm:py-4">
      <!-- Progress Bar -->
      <div
        ref="progressBarRef"
        class="relative w-full h-6 mb-2 group cursor-pointer"
        @mouseenter="isHoveringProgress = true"
        @mouseleave="isHoveringProgress = false"
        @mousemove="onProgressHover"
        @click="onProgressClick"
      >
        <!-- Hover timecode tooltip -->
        <div
          v-if="isHoveringProgress && duration > 0"
          :class="[
            'absolute -top-8 px-2 py-1 text-xs font-mono rounded shadow-lg pointer-events-none transform -translate-x-1/2 z-20 bg-zinc-900/90 transition-colors duration-500',
            sectionTextColor
          ]"
          :style="{ left: `${hoverProgress}%` }"
        >
          {{ hoverTime }}
        </div>

        <!-- Background track -->
        <div class="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-zinc-700 rounded-full overflow-hidden">
          <!-- Progress fill -->
          <div
            class="h-full transition-[background-image] duration-500"
            :style="{
              width: `${displayProgress}%`,
              backgroundImage: sectionGradientStyle,
            }"
          ></div>
        </div>

        <!-- Native range input (hidden but functional) -->
        <input
          type="range"
          min="0"
          :max="duration || 100"
          :value="currentTime"
          step="0.1"
          class="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10"
          @input="onSeek"
        />

        <!-- Custom thumb -->
        <div
          :class="[
            'absolute top-1/2 w-4 h-4 rounded-full shadow-lg pointer-events-none will-change-transform group-hover:scale-110',
            sectionThumbColor
          ]"
          :style="{ left: `${displayProgress}%`, transform: 'translate(-50%, -50%)', transition: isDragging ? 'none' : 'all 0.1s ease-out' }"
        ></div>
      </div>

      <div class="flex items-center justify-between">
        <!-- Time -->
        <div
          :class="[
            'text-xs sm:text-sm font-mono transition-colors duration-500',
            sectionTextMuted
          ]"
        >
          <span>{{ formattedCurrentTime }}</span>
          <span class="hidden sm:inline"> / {{ formattedDuration }}</span>
        </div>

        <!-- Center Controls -->
        <div class="flex items-center gap-1 sm:gap-4">
          <!-- Shuffle -->
          <button
            :class="[
              'p-1.5 sm:p-2 transition-colors duration-500 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-lg',
              isShuffleMode
                ? sectionActiveColor
                : [sectionTextMuted, sectionTextHover]
            ]"
            :aria-label="isShuffleMode ? 'Désactiver la lecture aléatoire' : 'Activer la lecture aléatoire'"
            :aria-pressed="isShuffleMode"
            title="Lecture aléatoire"
            @click="emit('toggleShuffle')"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
            </svg>
            <span v-if="isShuffleMode" class="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current"></span>
          </button>

          <!-- Previous -->
          <NuxtLink
            :to="prevTrackUrl"
            :class="[
              'p-1 sm:p-2 transition-colors duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-lg',
              hasPrevTrack
                ? [sectionTextMuted, sectionTextHover]
                : 'text-zinc-600 cursor-not-allowed pointer-events-none'
            ]"
            aria-label="Piste précédente"
            :aria-disabled="!hasPrevTrack"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </NuxtLink>

          <!-- Play/Pause -->
          <button
            :class="[
              'w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg hover:scale-105 border-2 bg-gradient-to-br focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900',
              sectionPlayButton
            ]"
            :aria-label="isPlaying ? 'Pause' : 'Lecture'"
            @click="emit('togglePlay')"
          >
            <svg v-if="!isPlaying" class="w-5 h-5 sm:w-7 sm:h-7 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            <svg v-else class="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          </button>

          <!-- Next -->
          <NuxtLink
            :to="nextTrackUrl"
            :class="[
              'p-1 sm:p-2 transition-colors duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-lg',
              hasNextTrack
                ? [sectionTextMuted, sectionTextHover]
                : 'text-zinc-600 cursor-not-allowed pointer-events-none'
            ]"
            aria-label="Piste suivante"
            :aria-disabled="!hasNextTrack"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </NuxtLink>

          <!-- Auto-play -->
          <button
            :class="[
              'p-1.5 sm:p-2 transition-colors duration-500 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-lg',
              isAutoPlay
                ? sectionActiveColor
                : [sectionTextMuted, sectionTextHover]
            ]"
            :aria-label="isAutoPlay ? 'Désactiver la lecture automatique' : 'Activer la lecture automatique'"
            :aria-pressed="isAutoPlay"
            title="Lecture automatique"
            @click="emit('toggleAutoPlay')"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
            </svg>
            <span v-if="isAutoPlay" class="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current"></span>
          </button>
        </div>

        <!-- Volume + Track info -->
        <div class="flex items-center gap-2 sm:gap-4">
          <!-- Volume Control -->
          <div class="flex items-center gap-2 group">
            <!-- Mute button (visible on mobile and desktop) -->
            <button
              :class="[
                'transition-colors duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-lg p-1',
                sectionTextMuted,
                sectionTextHover
              ]"
              :aria-label="isMutedOrSilent ? 'Activer le son' : 'Couper le son'"
              :aria-pressed="isMutedOrSilent"
              @click="handleToggleMute"
            >
              <svg v-if="isMutedOrSilent" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
              <svg v-else-if="volume < 0.5" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            </button>
            <!-- Volume slider (desktop only) -->
            <div class="relative w-20 h-6 hidden sm:block">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                :value="volume"
                class="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10"
                @input="onVolumeChange"
              />
              <div class="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-zinc-700 rounded-full overflow-hidden">
                <div
                  :class="[
                    'h-full transition-colors duration-500',
                    sectionVolumeBar
                  ]"
                  :style="{ width: `${volume * 100}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Track info (hidden on mobile) -->
          <div
            :class="[
              'text-sm text-right hidden sm:block transition-colors duration-500',
              sectionTextMuted
            ]"
          >
            {{ trackIndex }} / {{ totalTracks }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hide native range input thumb so it doesn't block clicks */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
}
</style>
