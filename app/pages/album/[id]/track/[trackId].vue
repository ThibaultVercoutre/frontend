<script setup lang="ts">
// Composables
const route = useRoute()
const router = useRouter()
const { getAlbumById } = useAlbums()
const { getTrackById, getTracksByAlbum, getAudioSrc, getCoverSrc, getTrackIndexInAlbum } = useTracks()
const {
  isAutoPlay,
  isShuffleMode,
  toggleAutoPlay,
  toggleShuffleMode,
  initializeQueue,
  getNextTrack,
  goToNextTrack,
} = usePlayerQueue()

// Route params
const albumId = computed(() => route.params.id as string)
const trackId = computed(() => Number(route.params.trackId))

// Album and track data
const album = computed(() => getAlbumById(albumId.value))
const track = computed(() => getTrackById(trackId.value))
const albumTracks = computed(() => getTracksByAlbum(albumId.value))
const trackIndexInAlbum = computed(() => getTrackIndexInAlbum(track.value))

// Theme detection based on album
const isFestive = computed(() => albumId.value.includes('noel'))
const isCeltic = computed(() => albumId.value === 'gabrielle')
const currentTheme = computed(() => {
  if (isCeltic.value) return 'celtic'
  if (isFestive.value) return 'winter'
  return 'default'
})

// Audio source
const audioSrc = computed(() => getAudioSrc(track.value))
const coverSrc = computed(() => getCoverSrc(track.value))

// Audio player
const {
  audioRef,
  isPlaying,
  currentTime,
  duration,
  volume,
  progress,
  formattedCurrentTime,
  formattedDuration,
  togglePlay,
  seek,
  setVolume,
  onTimeUpdate,
  onLoadedMetadata,
  onEnded,
  onPlay,
  onPause,
  startLoop,
  stopLoop,
  cleanup: cleanupAudio,
} = useAudioPlayer()

// Audio visualizer
const {
  isInitialized: isVisualizerInitialized,
  init: initVisualizer,
  moveTo: moveVisualizerTo,
  resume: resumeVisualizer,
  setGradient: setVisualizerGradient,
  destroy: destroyVisualizer,
} = useAudioVisualizer()

// Visualizer gradient based on theme
const visualizerGradient = computed(() => {
  if (isCeltic.value) return 'celtic'
  if (isFestive.value) return 'winter'
  return 'default'
})

// Lyrics
const {
  previousLyric,
  currentLyric,
  nextLyric,
  currentLyricIndex,
  hasLyrics,
  updateTime: updateLyricsTime,
} = useLyrics(trackId)

// Refs
const visualizerRef = ref<HTMLElement | null>(null)
const karaokeHeaderRef = ref<InstanceType<typeof import('~/components/KaraokeHeader.vue').default> | null>(null)

// Karaoke mode
const isKaraokeMode = ref(false)

// Navigation - previous/next track in album
const prevTrack = computed(() => {
  const idx = albumTracks.value.findIndex(t => t.id === trackId.value)
  return idx > 0 ? albumTracks.value[idx - 1] : null
})

const nextTrack = computed(() => {
  if (isShuffleMode.value) {
    return getNextTrack(albumTracks.value, trackId.value)
  }
  const idx = albumTracks.value.findIndex(t => t.id === trackId.value)
  return idx < albumTracks.value.length - 1 ? albumTracks.value[idx + 1] : null
})

// Check if there's a next track available (for UI state)
const hasNextTrack = computed(() => {
  if (isShuffleMode.value || isAutoPlay.value) return true
  const idx = albumTracks.value.findIndex(t => t.id === trackId.value)
  return idx < albumTracks.value.length - 1
})

const prevTrackUrl = computed(() =>
  prevTrack.value ? `/album/${albumId.value}/track/${prevTrack.value.id}` : undefined
)

const nextTrackUrl = computed(() => {
  const next = nextTrack.value
  return next ? `/album/${albumId.value}/track/${next.id}` : undefined
})

// Handle track end - autoplay next
const handleTrackEnded = () => {
  onEnded()
  if (isAutoPlay.value || isShuffleMode.value) {
    const nextUrl = goToNextTrack(albumId.value, albumTracks.value, trackId.value)
    if (nextUrl) {
      router.push(nextUrl)
    }
  }
}

// Toggle shuffle with current context
const handleToggleShuffle = () => {
  toggleShuffleMode(albumTracks.value, trackId.value)
}

// Toggle karaoke mode
const toggleKaraokeMode = () => {
  isKaraokeMode.value = !isKaraokeMode.value
}

// Handle play toggle with visualizer initialization
const handleTogglePlay = async () => {
  if (!isVisualizerInitialized.value && visualizerRef.value && audioRef.value) {
    initVisualizer(visualizerRef.value, audioRef.value)
    setVisualizerGradient(visualizerGradient.value)
  }

  const isNowPlaying = await togglePlay()

  if (isNowPlaying) {
    resumeVisualizer()
  }
}

// Handle seek from player bar
const handleSeek = (time: number) => {
  seek(time)
}

// Handle volume change from player bar
const handleVolumeChange = (newVolume: number) => {
  setVolume(newVolume)
}

// Sync lyrics with audio time
watch(currentTime, (time) => {
  updateLyricsTime(time)
})

// Move visualizer when karaoke mode changes
watch(isKaraokeMode, async (newValue) => {
  await nextTick()

  const container = newValue
    ? karaokeHeaderRef.value?.visualizerRef
    : visualizerRef.value

  if (container) {
    moveVisualizerTo(container)
  }
})

// Update visualizer gradient when theme changes
watch(visualizerGradient, (newGradient) => {
  if (isVisualizerInitialized.value) {
    setVisualizerGradient(newGradient)
  }
})

// Auto-start playback when autoplay/shuffle is active
const autoStartPlayback = async () => {
  if ((isAutoPlay.value || isShuffleMode.value) && audioRef.value) {
    // Initialize visualizer if needed
    if (!isVisualizerInitialized.value && visualizerRef.value) {
      initVisualizer(visualizerRef.value, audioRef.value)
      setVisualizerGradient(visualizerGradient.value)
    }

    try {
      await audioRef.value.play()
      resumeVisualizer()
    } catch (e) {
      // Autoplay might be blocked by browser, user will need to click
      console.warn('Autoplay blocked by browser:', e)
    }
  }
}

// Watch for audio ready to auto-start
const handleLoadedMetadata = () => {
  onLoadedMetadata()
  // Auto-start if autoplay/shuffle is enabled
  autoStartPlayback()
}

// Lifecycle
onMounted(() => {
  startLoop()
  // Initialize shuffle queue if shuffle mode is active
  initializeQueue(albumTracks.value, trackId.value)
})

onUnmounted(() => {
  stopLoop()
  destroyVisualizer()
  cleanupAudio()
})
</script>

<template>
  <div
    :class="[
      'min-h-screen relative overflow-hidden flex flex-col',
      isCeltic ? 'bg-pattern' : '',
      isFestive ? 'bg-winter bg-winter-pattern' : '',
      !isCeltic && !isFestive ? 'bg-neutral bg-neutral-pattern' : ''
    ]"
  >
    <!-- Winter Snowfall -->
    <ClientOnly v-if="isFestive">
      <Snowfall />
      <div class="cabin-glow"></div>
    </ClientOnly>

    <!-- Audio element (hidden) -->
    <audio
      ref="audioRef"
      :src="audioSrc"
      crossorigin="anonymous"
      preload="auto"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
      @ended="handleTrackEnded"
      @play="onPlay(); resumeVisualizer()"
      @pause="onPause"
    ></audio>

    <!-- Back Button - goes to album -->
    <div class="absolute top-6 left-6 z-20">
      <BackButton :label="album?.title || 'Album'" :theme="currentTheme" />
    </div>

    <!-- Audio Visualizer Background (hidden in karaoke mode) -->
    <ClientOnly>
      <div
        v-show="!isKaraokeMode"
        ref="visualizerRef"
        class="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
        :class="isPlaying ? 'opacity-70' : 'opacity-20'"
      ></div>
    </ClientOnly>

    <!-- Main Content - Normal Mode -->
    <div
      v-if="!isKaraokeMode"
      class="flex-1 flex flex-col items-center justify-center px-6 pb-32 relative z-10"
    >
      <!-- Track Info -->
      <TrackInfo :track="track" size="lg" :theme="currentTheme" />

      <!-- Vinyl Container -->
      <div class="relative">
        <!-- Vinyl Glow -->
        <div
          class="absolute inset-0 rounded-full blur-3xl transition-opacity duration-500"
          :class="[
            isPlaying ? 'opacity-30' : 'opacity-10',
            isCeltic ? (isPlaying ? 'bg-amber-500' : 'bg-emerald-500') : '',
            isFestive ? (isPlaying ? 'bg-amber-500' : 'bg-sky-500') : '',
            !isCeltic && !isFestive ? (isPlaying ? 'bg-pink-500' : 'bg-purple-500') : ''
          ]"
        ></div>

        <!-- Vinyl Record -->
        <VinylRecord
          :is-spinning="isPlaying"
          :cover-src="coverSrc"
          size="lg"
          :theme="currentTheme"
        >
          <template #overlay>
            <!-- Play Button Overlay -->
            <button
              class="absolute inset-0 flex items-center justify-center rounded-full group"
              @click="handleTogglePlay"
            >
              <div
                :class="[
                  'w-20 h-20 md:w-24 md:h-24 rounded-full backdrop-blur-sm flex items-center justify-center',
                  'border-2 transition-all duration-300 group-hover:scale-110 shadow-xl',
                  { 'opacity-0 group-hover:opacity-100': isPlaying },
                  isCeltic ? 'bg-emerald-900/80 border-emerald-500/30 group-hover:border-amber-500/50 group-hover:bg-emerald-800/80' : '',
                  isFestive ? 'bg-sky-900/80 border-sky-500/30 group-hover:border-amber-500/50 group-hover:bg-sky-800/80' : '',
                  !isCeltic && !isFestive ? 'bg-purple-900/80 border-purple-500/30 group-hover:border-pink-500/50 group-hover:bg-purple-800/80' : ''
                ]"
              >
                <svg v-if="!isPlaying" class="w-10 h-10 md:w-12 md:h-12 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <svg v-else class="w-10 h-10 md:w-12 md:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              </div>
            </button>
          </template>
        </VinylRecord>
      </div>

      <!-- Mini Lyrics Preview (click to enter karaoke mode) -->
      <div v-if="hasLyrics" class="mt-8">
        <LyricsPreview
          :previous-lyric="previousLyric"
          :current-lyric="currentLyric"
          :next-lyric="nextLyric"
          @click="toggleKaraokeMode"
        />
      </div>
    </div>

    <!-- Main Content - Karaoke Mode -->
    <div
      v-else
      class="flex-1 flex flex-col px-6 pb-32 relative z-10 karaoke-mode"
    >
      <!-- Karaoke Header with Mini Vinyl + Visualizer -->
      <KaraokeHeader
        ref="karaokeHeaderRef"
        :track="track"
        :is-playing="isPlaying"
        :cover-src="coverSrc"
        :theme="currentTheme"
        @exit-karaoke="toggleKaraokeMode"
      />

      <!-- Karaoke Lyrics -->
      <KaraokeLyrics
        :previous-lyric="previousLyric"
        :current-lyric="currentLyric"
        :next-lyric="nextLyric"
        :current-index="currentLyricIndex"
      />

      <!-- Exit karaoke mode hint -->
      <div class="text-center pb-4">
        <button
          :class="[
            'text-xs uppercase tracking-wider transition-colors',
            isCeltic ? 'text-emerald-500/40 hover:text-amber-500/60' : '',
            isFestive ? 'text-sky-500/40 hover:text-amber-500/60' : '',
            !isCeltic && !isFestive ? 'text-purple-500/40 hover:text-pink-500/60' : ''
          ]"
          @click="toggleKaraokeMode"
        >
          Cliquer sur le vinyle pour quitter
        </button>
      </div>
    </div>

    <!-- Player Bar with album-aware navigation -->
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
        <div class="relative w-full h-6 mb-2 group">
          <div class="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-zinc-700 rounded-full overflow-hidden">
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
          <input
            type="range"
            min="0"
            :max="duration || 100"
            :value="currentTime"
            step="0.1"
            class="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10"
            @input="(e) => handleSeek(parseFloat((e.target as HTMLInputElement).value))"
          />
          <div
            :class="[
              'absolute top-1/2 w-4 h-4 rounded-full shadow-lg pointer-events-none will-change-transform transition-transform duration-75 group-hover:scale-110',
              isFestive ? 'bg-amber-400' : 'bg-amber-400'
            ]"
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
              @click="handleToggleShuffle"
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
                prevTrack ? (isCeltic ? 'text-emerald-400/70 hover:text-amber-400' : isFestive ? 'text-sky-400/70 hover:text-amber-400' : 'text-purple-400/70 hover:text-pink-400') : 'text-zinc-600 cursor-not-allowed pointer-events-none'
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
              @click="handleTogglePlay"
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
                hasNextTrack ? (isCeltic ? 'text-emerald-400/70 hover:text-amber-400' : isFestive ? 'text-sky-400/70 hover:text-amber-400' : 'text-purple-400/70 hover:text-pink-400') : 'text-zinc-600 cursor-not-allowed pointer-events-none'
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
              @click="toggleAutoPlay"
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
                @click="setVolume(volume > 0 ? 0 : 1)"
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
                  @input="(e) => handleVolumeChange(parseFloat((e.target as HTMLInputElement).value))"
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
              {{ trackIndexInAlbum }} / {{ albumTracks.length }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating decorations (Celtic theme only) -->
    <FloatingDecorations v-if="isCeltic" />
  </div>
</template>

<style scoped>
.karaoke-mode {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
