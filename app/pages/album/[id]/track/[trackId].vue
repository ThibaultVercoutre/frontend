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

// Template ref for audio element (defined here for proper SSR hydration)
const audioRef = useTemplateRef<HTMLAudioElement>('audioElement')

// Audio player
const {
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
  initAudio,
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
const handleLoadedMetadata = (event: Event) => {
  onLoadedMetadata(event)
  // Auto-start if autoplay/shuffle is enabled
  autoStartPlayback()
}

// Watch for audio element to become available (handles SSR hydration)
watch(audioRef, (audio) => {
  if (audio) {
    initAudio(audio)
  }
}, { immediate: true })

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
    <template v-if="isFestive">
      <Snowfall />
      <div class="cabin-glow"></div>
    </template>

    <!-- Audio element (hidden, client-only to avoid SSR hydration issues) -->
    <ClientOnly>
      <audio
        ref="audioElement"
        :src="audioSrc"
        crossorigin="anonymous"
        preload="auto"
        @timeupdate="onTimeUpdate($event)"
        @loadedmetadata="handleLoadedMetadata($event)"
        @ended="handleTrackEnded"
        @play="onPlay(); resumeVisualizer()"
        @pause="onPause"
      ></audio>
    </ClientOnly>

    <!-- Back Button - goes to album -->
    <div class="absolute top-6 left-6 z-20">
      <BackButton :to="`/album/${albumId}`" :label="album?.title || 'Album'" :theme="currentTheme" />
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
          :progress="progress"
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

    <!-- Player Bar -->
    <PlayerBar
      :is-playing="isPlaying"
      :current-time="currentTime"
      :duration="duration"
      :volume="volume"
      :formatted-current-time="formattedCurrentTime"
      :formatted-duration="formattedDuration"
      :progress="progress"
      :theme="currentTheme"
      :is-shuffle-mode="isShuffleMode"
      :is-auto-play="isAutoPlay"
      :prev-track-url="prevTrackUrl"
      :next-track-url="nextTrackUrl"
      :has-prev-track="!!prevTrack"
      :has-next-track="hasNextTrack"
      :track-index="trackIndexInAlbum"
      :total-tracks="albumTracks.length"
      @toggle-play="handleTogglePlay"
      @seek="handleSeek"
      @volume-change="handleVolumeChange"
      @toggle-shuffle="handleToggleShuffle"
      @toggle-auto-play="toggleAutoPlay"
    />

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
