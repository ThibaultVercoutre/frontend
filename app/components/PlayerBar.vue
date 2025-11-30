<script setup lang="ts">
interface Props {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
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
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'default',
  isShuffleMode: false,
  isAutoPlay: false,
  hasPrevTrack: false,
  hasNextTrack: false,
})

const emit = defineEmits<{
  togglePlay: []
  seek: [time: number]
  volumeChange: [volume: number]
  toggleShuffle: []
  toggleAutoPlay: []
}>()

// Theme computed helpers
const isCeltic = computed(() => props.theme === 'celtic')
const isFestive = computed(() => props.theme === 'winter')

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

const onProgressHover = (event: MouseEvent) => {
  if (!progressBarRef.value) return
  const rect = progressBarRef.value.getBoundingClientRect()
  hoverProgress.value = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100))
}

// Handle seek from range input
const onSeek = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('seek', parseFloat(target.value))
}

// Handle volume change
const onVolumeChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('volumeChange', parseFloat(target.value))
}

// Toggle mute
const toggleMute = () => {
  emit('volumeChange', props.volume > 0 ? 0 : 1)
}
</script>

<template>
  <div
    :class="[
      'fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-zinc-950 via-zinc-900/95 to-zinc-900/90 backdrop-blur-lg border-t',
      isCeltic ? 'border-emerald-800/30' : '',
      isFestive ? 'border-sky-800/30' : '',
      !isCeltic && !isFestive ? 'border-purple-800/30' : ''
    ]"
  >
    <div class="container mx-auto px-6 py-4">
      <!-- Progress Bar -->
      <div
        ref="progressBarRef"
        class="relative w-full h-6 mb-2 group"
        @mouseenter="isHoveringProgress = true"
        @mouseleave="isHoveringProgress = false"
        @mousemove="onProgressHover"
      >
        <!-- Hover timecode tooltip -->
        <div
          v-if="isHoveringProgress && duration > 0"
          :class="[
            'absolute -top-8 px-2 py-1 text-xs font-mono rounded shadow-lg pointer-events-none transform -translate-x-1/2 z-20',
            isCeltic ? 'bg-emerald-900/90 text-amber-400' : '',
            isFestive ? 'bg-sky-900/90 text-amber-400' : '',
            !isCeltic && !isFestive ? 'bg-purple-900/90 text-pink-400' : ''
          ]"
          :style="{ left: `${hoverProgress}%` }"
        >
          {{ hoverTime }}
        </div>

        <!-- Background track -->
        <div class="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-zinc-700 rounded-full overflow-hidden">
          <!-- Progress fill -->
          <div
            :class="[
              'absolute inset-0 h-full origin-left will-change-transform bg-gradient-to-r',
              isCeltic ? 'from-emerald-500 to-amber-500' : '',
              isFestive ? 'from-sky-500 to-amber-500' : '',
              !isCeltic && !isFestive ? 'from-purple-500 to-pink-500' : ''
            ]"
            :style="{ transform: `scaleX(${progress / 100})` }"
          ></div>
        </div>

        <!-- Native range input -->
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
          class="absolute top-1/2 w-4 h-4 bg-amber-400 rounded-full shadow-lg pointer-events-none will-change-transform transition-transform duration-75 group-hover:scale-110"
          :style="{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }"
        ></div>
      </div>

      <div class="flex items-center justify-between">
        <!-- Time -->
        <div
          :class="[
            'text-sm font-mono w-24',
            isCeltic ? 'text-emerald-400/60' : '',
            isFestive ? 'text-sky-400/60' : '',
            !isCeltic && !isFestive ? 'text-purple-400/60' : ''
          ]"
        >
          {{ formattedCurrentTime }} / {{ formattedDuration }}
        </div>

        <!-- Center Controls -->
        <div class="flex items-center gap-2 sm:gap-4">
          <!-- Shuffle -->
          <button
            :class="[
              'p-2 transition-colors relative',
              isShuffleMode
                ? (isCeltic ? 'text-amber-400' : isFestive ? 'text-amber-400' : 'text-pink-400')
                : (isCeltic ? 'text-emerald-400/50 hover:text-emerald-400' : isFestive ? 'text-sky-400/50 hover:text-sky-400' : 'text-purple-400/50 hover:text-purple-400')
            ]"
            title="Lecture aléatoire"
            @click="emit('toggleShuffle')"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
            </svg>
            <span v-if="isShuffleMode" class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-current"></span>
          </button>

          <!-- Previous -->
          <NuxtLink
            :to="prevTrackUrl"
            :class="[
              'p-2 transition-colors',
              hasPrevTrack
                ? (isCeltic ? 'text-emerald-400/70 hover:text-amber-400' : isFestive ? 'text-sky-400/70 hover:text-amber-400' : 'text-purple-400/70 hover:text-pink-400')
                : 'text-zinc-600 cursor-not-allowed pointer-events-none'
            ]"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </NuxtLink>

          <!-- Play/Pause -->
          <button
            :class="[
              'w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-105 border-2 bg-gradient-to-br',
              isCeltic ? 'from-emerald-600 to-emerald-800 border-emerald-500/30 hover:from-amber-600 hover:to-amber-800 hover:border-amber-500/30' : '',
              isFestive ? 'from-sky-600 to-sky-800 border-sky-500/30 hover:from-amber-600 hover:to-amber-800 hover:border-amber-500/30' : '',
              !isCeltic && !isFestive ? 'from-purple-600 to-purple-800 border-purple-500/30 hover:from-pink-600 hover:to-pink-800 hover:border-pink-500/30' : ''
            ]"
            @click="emit('togglePlay')"
          >
            <svg v-if="!isPlaying" class="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <svg v-else class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          </button>

          <!-- Next -->
          <NuxtLink
            :to="nextTrackUrl"
            :class="[
              'p-2 transition-colors',
              hasNextTrack
                ? (isCeltic ? 'text-emerald-400/70 hover:text-amber-400' : isFestive ? 'text-sky-400/70 hover:text-amber-400' : 'text-purple-400/70 hover:text-pink-400')
                : 'text-zinc-600 cursor-not-allowed pointer-events-none'
            ]"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </NuxtLink>

          <!-- Auto-play -->
          <button
            :class="[
              'p-2 transition-colors relative',
              isAutoPlay
                ? (isCeltic ? 'text-amber-400' : isFestive ? 'text-amber-400' : 'text-pink-400')
                : (isCeltic ? 'text-emerald-400/50 hover:text-emerald-400' : isFestive ? 'text-sky-400/50 hover:text-sky-400' : 'text-purple-400/50 hover:text-purple-400')
            ]"
            title="Lecture automatique"
            @click="emit('toggleAutoPlay')"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
            </svg>
            <span v-if="isAutoPlay" class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-current"></span>
          </button>
        </div>

        <!-- Volume + Track info -->
        <div class="flex items-center gap-4">
          <!-- Volume Control -->
          <div class="flex items-center gap-2 group">
            <button
              :class="[
                'transition-colors',
                isCeltic ? 'text-emerald-400/60 hover:text-amber-400' : '',
                isFestive ? 'text-sky-400/60 hover:text-amber-400' : '',
                !isCeltic && !isFestive ? 'text-purple-400/60 hover:text-pink-400' : ''
              ]"
              @click="toggleMute"
            >
              <svg v-if="volume === 0" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
              <svg v-else-if="volume < 0.5" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            </button>
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
                    'h-full transition-colors',
                    isCeltic ? 'bg-emerald-500 group-hover:bg-amber-500' : '',
                    isFestive ? 'bg-sky-500 group-hover:bg-amber-500' : '',
                    !isCeltic && !isFestive ? 'bg-purple-500 group-hover:bg-pink-500' : ''
                  ]"
                  :style="{ width: `${volume * 100}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Track info -->
          <div
            :class="[
              'text-sm w-16 text-right',
              isCeltic ? 'text-emerald-500/60' : '',
              isFestive ? 'text-sky-500/60' : '',
              !isCeltic && !isFestive ? 'text-purple-500/60' : ''
            ]"
          >
            {{ trackIndex }} / {{ totalTracks }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
