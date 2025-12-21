<script setup lang="ts">
import type { Track } from '~/types'

interface Props {
  tracks: Track[]
  albumId: string
}

const props = defineProps<Props>()

const { getAudioSrc, getCoverSrc } = useTracks()
const {
  audioRef,
  isPlaying,
  currentTime,
  duration,
  progress,
  formattedCurrentTime,
  formattedDuration,
  initAudio,
  play,
  pause,
  togglePlay,
  seek,
  seekByPercent,
  onTimeUpdate,
  onLoadedMetadata,
  onEnded,
  onPlay,
  onPause,
} = useAudioPlayer()

// Current track state
const currentTrack = ref<Track | null>(null)
const currentTrackIndex = ref(-1)

// Lyrics panel state
const isLyricsPanelOpen = ref(false)
const lyricsPanelTrack = ref<Track | null>(null)

// Audio element ref
const audioElement = ref<HTMLAudioElement | null>(null)

// Current audio source
const audioSrc = computed(() => {
  if (!currentTrack.value) return ''
  return getAudioSrc(currentTrack.value)
})

// Initialize audio when element is available
watch(audioElement, (el) => {
  if (el) {
    initAudio(el)
  }
})

// Play a specific track
const playTrack = async (track: Track) => {
  const trackIndex = props.tracks.findIndex(t => t.id === track.id)

  if (currentTrack.value?.id === track.id) {
    // Same track - toggle play/pause
    await togglePlay()
  } else {
    // Different track - load and play
    currentTrack.value = track
    currentTrackIndex.value = trackIndex

    // Wait for audio source to update
    await nextTick()

    if (audioElement.value) {
      audioElement.value.load()
      audioElement.value.addEventListener('canplay', async () => {
        await play()
      }, { once: true })
    }
  }
}

// Open lyrics panel for a track
const openLyrics = (track: Track) => {
  lyricsPanelTrack.value = track
  isLyricsPanelOpen.value = true

  // If not currently playing this track, start playing it
  if (currentTrack.value?.id !== track.id) {
    playTrack(track)
  }
}

// Close lyrics panel
const closeLyricsPanel = () => {
  isLyricsPanelOpen.value = false
}

// Open karaoke mode (navigate to track page)
const openKaraoke = (track: Track) => {
  navigateTo(`/album/${track.albumId}/track/${track.id}`)
}

// Handle track ended - play next
const handleEnded = () => {
  onEnded()

  // Play next track if available
  if (currentTrackIndex.value < props.tracks.length - 1) {
    const nextTrack = props.tracks[currentTrackIndex.value + 1]
    if (nextTrack?.filename) {
      playTrack(nextTrack)
    }
  }
}

// Get progress for a specific track
const getTrackProgress = (track: Track): number => {
  if (currentTrack.value?.id !== track.id) return 0
  return progress.value
}

// Check if track is playing
const isTrackPlaying = (track: Track): boolean => {
  return currentTrack.value?.id === track.id && isPlaying.value
}

// Check if track is current
const isCurrentTrack = (track: Track): boolean => {
  return currentTrack.value?.id === track.id
}

// Expose for parent access
defineExpose({
  currentTrack,
  isPlaying,
  currentTime,
  playTrack,
  openLyrics,
  openKaraoke,
})
</script>

<template>
  <div class="album-player">
    <!-- Hidden Audio Element -->
    <ClientOnly>
      <audio
        ref="audioElement"
        :src="audioSrc"
        preload="metadata"
        @timeupdate="onTimeUpdate"
        @loadedmetadata="onLoadedMetadata"
        @ended="handleEnded"
        @play="onPlay"
        @pause="onPause"
      />
    </ClientOnly>

    <!-- Track List -->
    <div class="track-list space-y-1">
      <AlbumTrackRow
        v-for="(track, index) in tracks"
        :key="track.id"
        :track="track"
        :index="index"
        :is-playing="isTrackPlaying(track)"
        :is-current-track="isCurrentTrack(track)"
        :progress="getTrackProgress(track)"
        @play="playTrack"
        @open-lyrics="openLyrics"
        @open-karaoke="openKaraoke"
      />
    </div>

    <!-- Lyrics Panel -->
    <LyricsPanel
      :track="lyricsPanelTrack"
      :current-time="currentTime"
      :is-open="isLyricsPanelOpen"
      @close="closeLyricsPanel"
    />

    <!-- Mini Player Bar (when track is playing) -->
    <Transition name="slide-up">
      <div
        v-if="currentTrack && !isLyricsPanelOpen"
        class="mini-player fixed bottom-0 left-0 right-0 bg-emerald-950/95 backdrop-blur-lg border-t border-emerald-800/50 p-4 z-40"
      >
        <div class="container mx-auto flex items-center gap-4">
          <!-- Cover -->
          <div class="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <NuxtImg
              :src="getCoverSrc(currentTrack)"
              :alt="currentTrack.title"
              width="48"
              height="48"
              format="webp"
              quality="80"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Track Info -->
          <div class="flex-1 min-w-0">
            <h4 class="text-emerald-50 font-medium truncate">{{ currentTrack.title }}</h4>
            <p class="text-emerald-500/60 text-sm truncate">{{ currentTrack.subtitle }}</p>
          </div>

          <!-- Time -->
          <div class="hidden sm:block text-emerald-500/60 text-sm font-mono">
            {{ formattedCurrentTime }} / {{ formattedDuration }}
          </div>

          <!-- Controls -->
          <div class="flex items-center gap-2">
            <!-- Play/Pause -->
            <button
              class="w-12 h-12 rounded-full bg-amber-500 text-emerald-950 hover:bg-amber-400 transition-colors flex items-center justify-center"
              @click="togglePlay"
            >
              <svg v-if="!isPlaying" class="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            </button>

            <!-- Lyrics Button -->
            <button
              class="w-10 h-10 rounded-full bg-emerald-700/50 text-emerald-300 hover:bg-emerald-600/50 hover:text-amber-400 transition-colors flex items-center justify-center"
              @click="openLyrics(currentTrack)"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>

            <!-- Karaoke Button -->
            <button
              class="w-10 h-10 rounded-full bg-emerald-700/50 text-emerald-300 hover:bg-emerald-600/50 hover:text-amber-400 transition-colors flex items-center justify-center"
              @click="openKaraoke(currentTrack)"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Progress Bar -->
        <div
          class="absolute top-0 left-0 right-0 h-1 bg-emerald-800/50 cursor-pointer"
          @click="(e) => seekByPercent((e.offsetX / (e.target as HTMLElement).offsetWidth) * 100)"
        >
          <div
            class="h-full bg-gradient-to-r from-amber-500 to-amber-400"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

.mini-player {
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.3);
}
</style>
