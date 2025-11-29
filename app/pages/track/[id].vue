<script setup lang="ts">
// Composables
const route = useRoute()
const { tracks, getTrackById, getAudioSrc, getCoverSrc } = useTracks()

// Track ID from route
const trackId = computed(() => Number(route.params.id))
const track = computed(() => getTrackById(trackId.value))

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
  destroy: destroyVisualizer,
} = useAudioVisualizer()

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

// Toggle karaoke mode
const toggleKaraokeMode = () => {
  isKaraokeMode.value = !isKaraokeMode.value
}

// Handle play toggle with visualizer initialization
const handleTogglePlay = async () => {
  // Initialize visualizer on first play
  if (!isVisualizerInitialized.value && visualizerRef.value && audioRef.value) {
    initVisualizer(visualizerRef.value, audioRef.value)
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

// Lifecycle
onMounted(() => {
  startLoop()
})

onUnmounted(() => {
  stopLoop()
  destroyVisualizer()
  cleanupAudio()
})
</script>

<template>
  <div class="min-h-screen bg-pattern relative overflow-hidden flex flex-col">
    <!-- Audio element (hidden) -->
    <audio
      ref="audioRef"
      :src="audioSrc"
      crossorigin="anonymous"
      preload="auto"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
      @play="onPlay(); resumeVisualizer()"
      @pause="onPause"
    ></audio>

    <!-- Back Button -->
    <div class="absolute top-6 left-6 z-20">
      <BackButton />
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
      <TrackInfo :track="track" size="lg" />

      <!-- Vinyl Container -->
      <div class="relative">
        <!-- Vinyl Glow -->
        <div
          class="absolute inset-0 rounded-full blur-3xl transition-opacity duration-500"
          :class="isPlaying ? 'opacity-30 bg-amber-500' : 'opacity-10 bg-emerald-500'"
        ></div>

        <!-- Vinyl Record -->
        <VinylRecord
          :is-spinning="isPlaying"
          :cover-src="coverSrc"
          size="lg"
        >
          <template #overlay>
            <!-- Play Button Overlay -->
            <button
              class="absolute inset-0 flex items-center justify-center rounded-full group"
              @click="handleTogglePlay"
            >
              <div
                class="w-20 h-20 md:w-24 md:h-24 rounded-full bg-emerald-900/80 backdrop-blur-sm flex items-center justify-center
                       border-2 border-emerald-500/30 group-hover:border-amber-500/50 group-hover:bg-emerald-800/80
                       transition-all duration-300 group-hover:scale-110 shadow-xl"
                :class="{ 'opacity-0 group-hover:opacity-100': isPlaying }"
              >
                <svg v-if="!isPlaying" class="w-10 h-10 md:w-12 md:h-12 text-emerald-100 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <svg v-else class="w-10 h-10 md:w-12 md:h-12 text-emerald-100" fill="currentColor" viewBox="0 0 24 24">
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
          class="text-emerald-500/40 text-xs uppercase tracking-wider hover:text-amber-500/60 transition-colors"
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
      :track-id="trackId"
      :total-tracks="tracks.length"
      @toggle-play="handleTogglePlay"
      @seek="handleSeek"
      @volume-change="handleVolumeChange"
    />

    <!-- Floating decorations -->
    <FloatingDecorations />
  </div>
</template>

<style scoped>
/* Karaoke mode styles */
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
