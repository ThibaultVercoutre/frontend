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

// Shuffle and repeat modes
const isShuffleOn = ref(false)
const repeatMode = ref<'none' | 'all' | 'one'>('none') // none, all (infinite), one (single track)

// Shuffled track order
const shuffledIndices = ref<number[]>([])
const currentShufflePosition = ref(-1)

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

// Generate shuffled indices
const generateShuffledIndices = () => {
  const playableTracks = props.tracks
    .map((t, i) => ({ track: t, index: i }))
    .filter(item => item.track.filename)

  const indices = playableTracks.map(item => item.index)

  // Fisher-Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = indices[i]!
    indices[i] = indices[j]!
    indices[j] = temp
  }

  shuffledIndices.value = indices
}

// Toggle shuffle mode
const toggleShuffle = () => {
  isShuffleOn.value = !isShuffleOn.value
  if (isShuffleOn.value) {
    generateShuffledIndices()
    // Find current track in shuffled order
    if (currentTrackIndex.value >= 0) {
      currentShufflePosition.value = shuffledIndices.value.indexOf(currentTrackIndex.value)
      if (currentShufflePosition.value === -1) {
        currentShufflePosition.value = 0
      }
    }
  }
}

// Cycle through repeat modes
const cycleRepeatMode = () => {
  if (repeatMode.value === 'none') {
    repeatMode.value = 'all'
  } else if (repeatMode.value === 'all') {
    repeatMode.value = 'one'
  } else {
    repeatMode.value = 'none'
  }
}

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

// Open lyrics panel for a track (without starting playback)
const openLyrics = (track: Track) => {
  lyricsPanelTrack.value = track
  isLyricsPanelOpen.value = true
}

// Close lyrics panel
const closeLyricsPanel = () => {
  isLyricsPanelOpen.value = false
}

// Open karaoke mode (navigate to track page)
const openKaraoke = (track: Track) => {
  navigateTo(`/album/${track.albumId}/track/${track.id}`)
}

// Get next track index based on shuffle/repeat mode
const getNextTrackIndex = (): number | null => {
  const playableTracks = props.tracks
    .map((t, i) => ({ track: t, index: i }))
    .filter(item => item.track.filename)

  if (playableTracks.length === 0) return null

  if (isShuffleOn.value) {
    // Shuffle mode
    const nextShufflePos = currentShufflePosition.value + 1
    if (nextShufflePos < shuffledIndices.value.length) {
      return shuffledIndices.value[nextShufflePos] ?? null
    } else if (repeatMode.value === 'all') {
      // Regenerate shuffle and start over
      generateShuffledIndices()
      currentShufflePosition.value = -1
      return shuffledIndices.value[0] ?? null
    }
    return null
  } else {
    // Sequential mode
    const currentIdx = currentTrackIndex.value
    const nextPlayableIdx = playableTracks.findIndex(item => item.index > currentIdx)

    if (nextPlayableIdx !== -1) {
      return playableTracks[nextPlayableIdx]?.index ?? null
    } else if (repeatMode.value === 'all') {
      // Loop back to first playable track
      return playableTracks[0]?.index ?? null
    }
    return null
  }
}

// Handle track ended - play next based on mode
const handleEnded = () => {
  onEnded()

  // Repeat one mode - replay same track
  if (repeatMode.value === 'one' && currentTrack.value) {
    if (audioElement.value) {
      audioElement.value.currentTime = 0
      play()
    }
    return
  }

  // Get next track
  const nextIndex = getNextTrackIndex()
  if (nextIndex !== null) {
    const nextTrack = props.tracks[nextIndex]
    if (nextTrack?.filename) {
      if (isShuffleOn.value) {
        currentShufflePosition.value++
      }
      playTrack(nextTrack)
    }
  }
}

// Progress bar dragging state
const isDragging = ref(false)
const progressBarElement = ref<HTMLElement | null>(null)

// Calculate percentage from mouse/touch position
const getPercentageFromEvent = (event: MouseEvent | TouchEvent, element: HTMLElement): number => {
  const rect = element.getBoundingClientRect()
  const clientX = 'touches' in event ? event.touches[0]!.clientX : event.clientX
  const clickX = clientX - rect.left
  return Math.max(0, Math.min(100, (clickX / rect.width) * 100))
}

// Start dragging (also handles click)
const startDrag = (event: MouseEvent | TouchEvent) => {
  isDragging.value = true
  progressBarElement.value = event.currentTarget as HTMLElement

  // Prevent text selection during drag
  event.preventDefault()

  // Add document listeners
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchmove', onDrag)
  document.addEventListener('touchend', stopDrag)

  // Seek to initial position
  if (progressBarElement.value) {
    const percentage = getPercentageFromEvent(event, progressBarElement.value)
    seekByPercent(percentage)
  }
}

// During drag
const onDrag = (event: MouseEvent | TouchEvent) => {
  if (!isDragging.value || !progressBarElement.value) return

  const percentage = getPercentageFromEvent(event, progressBarElement.value)
  seekByPercent(percentage)
}

// Stop dragging
const stopDrag = () => {
  isDragging.value = false
  progressBarElement.value = null

  // Remove document listeners
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)
}

// Cleanup on unmount
onUnmounted(() => {
  stopDrag()
})

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

    <!-- Mini Player Bar (always visible when track is playing) -->
    <Transition name="slide-up">
      <div
        v-if="currentTrack"
        class="mini-player fixed bottom-0 left-0 bg-emerald-950/95 backdrop-blur-lg border-t border-emerald-800/50 p-4 z-40 transition-all duration-300"
        :class="isLyricsPanelOpen ? 'right-0 sm:right-96' : 'right-0'"
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
            <!-- Shuffle Button -->
            <button
              class="w-10 h-10 rounded-full transition-colors flex items-center justify-center"
              :class="isShuffleOn ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-700/50 text-emerald-300 hover:bg-emerald-600/50 hover:text-amber-400'"
              title="Lecture aléatoire"
              @click="toggleShuffle"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
              </svg>
            </button>

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

            <!-- Repeat Button -->
            <button
              class="w-10 h-10 rounded-full transition-colors flex items-center justify-center relative"
              :class="repeatMode !== 'none' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-700/50 text-emerald-300 hover:bg-emerald-600/50 hover:text-amber-400'"
              :title="repeatMode === 'none' ? 'Répétition désactivée' : repeatMode === 'all' ? 'Répéter tout' : 'Répéter une piste'"
              @click="cycleRepeatMode"
            >
              <svg v-if="repeatMode !== 'one'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
              </svg>
              <span v-if="repeatMode === 'one'" class="absolute -bottom-0.5 -right-0.5 text-[10px] font-bold bg-amber-500 text-emerald-950 rounded-full w-4 h-4 flex items-center justify-center">1</span>
            </button>

            <!-- Lyrics Button -->
            <button
              class="w-10 h-10 rounded-full transition-colors flex items-center justify-center"
              :class="isLyricsPanelOpen ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-700/50 text-emerald-300 hover:bg-emerald-600/50 hover:text-amber-400'"
              title="Paroles"
              @click="isLyricsPanelOpen ? closeLyricsPanel() : openLyrics(currentTrack)"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>

            <!-- Karaoke Button -->
            <button
              class="w-10 h-10 rounded-full bg-emerald-700/50 text-emerald-300 hover:bg-emerald-600/50 hover:text-amber-400 transition-colors flex items-center justify-center"
              title="Mode Karaoké"
              @click="openKaraoke(currentTrack)"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Progress Bar (interactive with drag support) -->
        <div
          class="absolute top-0 left-0 right-0 h-2 bg-emerald-800/50 cursor-pointer group/progress transition-all"
          :class="{ 'h-3': isDragging }"
          @mousedown="startDrag"
          @touchstart="startDrag"
          @click.stop
        >
          <div
            class="h-full bg-gradient-to-r from-amber-500 to-amber-400 relative pointer-events-none"
            :style="{ width: `${progress}%` }"
          >
            <!-- Drag handle -->
            <div
              class="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-400 rounded-full shadow-lg transition-transform"
              :class="isDragging ? 'scale-125 opacity-100' : 'opacity-0 group-hover/progress:opacity-100'"
            ></div>
          </div>
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
