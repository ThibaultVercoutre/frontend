<script setup lang="ts">
// Composables
const route = useRoute()
const { getAlbumById } = useAlbums()
const { getTrackById, getTracksByAlbum, getAudioSrc, getCoverSrc, getTrackIndexInAlbum } = useTracks()

// Route params
const albumId = computed(() => route.params.id as string)
const trackId = computed(() => Number(route.params.trackId))

// Album and track data
const album = computed(() => getAlbumById(albumId.value))
const track = computed(() => getTrackById(trackId.value))
const albumTracks = computed(() => getTracksByAlbum(albumId.value))
const trackIndexInAlbum = computed(() => getTrackIndexInAlbum(track.value))

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

// Navigation - previous/next track in album
const prevTrack = computed(() => {
  const idx = albumTracks.value.findIndex(t => t.id === trackId.value)
  return idx > 0 ? albumTracks.value[idx - 1] : null
})

const nextTrack = computed(() => {
  const idx = albumTracks.value.findIndex(t => t.id === trackId.value)
  return idx < albumTracks.value.length - 1 ? albumTracks.value[idx + 1] : null
})

const prevTrackUrl = computed(() =>
  prevTrack.value ? `/album/${albumId.value}/track/${prevTrack.value.id}` : undefined
)

const nextTrackUrl = computed(() =>
  nextTrack.value ? `/album/${albumId.value}/track/${nextTrack.value.id}` : undefined
)

// Toggle karaoke mode
const toggleKaraokeMode = () => {
  isKaraokeMode.value = !isKaraokeMode.value
}

// Handle play toggle with visualizer initialization
const handleTogglePlay = async () => {
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

    <!-- Back Button - goes to album -->
    <div class="absolute top-6 left-6 z-20">
      <BackButton :to="`/album/${albumId}`" :label="album?.title || 'Album'" />
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

    <!-- Player Bar with album-aware navigation -->
    <div class="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-zinc-950 via-zinc-900/95 to-zinc-900/90 backdrop-blur-lg border-t border-emerald-800/30">
      <div class="container mx-auto px-6 py-4">
        <!-- Progress Bar -->
        <div class="relative w-full h-6 mb-2 group">
          <div class="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-zinc-700 rounded-full overflow-hidden">
            <div
              class="absolute inset-0 h-full bg-gradient-to-r from-emerald-500 to-amber-500 origin-left will-change-transform"
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
            class="absolute top-1/2 w-4 h-4 bg-amber-400 rounded-full shadow-lg pointer-events-none will-change-transform transition-transform duration-75 group-hover:scale-110"
            :style="{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }"
          ></div>
        </div>

        <div class="flex items-center justify-between">
          <!-- Time -->
          <div class="text-emerald-400/60 text-sm font-mono w-24">
            {{ formattedCurrentTime }} / {{ formattedDuration }}
          </div>

          <!-- Center Controls -->
          <div class="flex items-center gap-4">
            <!-- Previous -->
            <NuxtLink
              :to="prevTrackUrl"
              :class="['p-2 transition-colors', prevTrack ? 'text-emerald-400/70 hover:text-amber-400' : 'text-zinc-600 cursor-not-allowed pointer-events-none']"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </NuxtLink>

            <!-- Play/Pause -->
            <button
              class="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center
                     hover:from-amber-600 hover:to-amber-800 transition-all duration-300 shadow-lg hover:scale-105
                     border-2 border-emerald-500/30 hover:border-amber-500/30"
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
              :class="['p-2 transition-colors', nextTrack ? 'text-emerald-400/70 hover:text-amber-400' : 'text-zinc-600 cursor-not-allowed pointer-events-none']"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </NuxtLink>
          </div>

          <!-- Volume + Track info -->
          <div class="flex items-center gap-4">
            <!-- Volume Control -->
            <div class="flex items-center gap-2 group">
              <button
                class="text-emerald-400/60 hover:text-amber-400 transition-colors"
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
                    class="h-full bg-emerald-500 group-hover:bg-amber-500 transition-colors"
                    :style="{ width: `${volume * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Track info -->
            <div class="text-emerald-500/60 text-sm w-16 text-right">
              {{ trackIndexInAlbum }} / {{ albumTracks.length }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating decorations -->
    <FloatingDecorations />
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
