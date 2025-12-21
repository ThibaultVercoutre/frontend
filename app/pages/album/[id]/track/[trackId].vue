<script setup lang="ts">
// Composables
const route = useRoute()
const router = useRouter()
const { getAlbumById } = useAlbums()
const { getTrackById, getTracksByAlbum, getAudioSrc, getCoverSrc, getBackgroundSrc, getTrackIndexInAlbum } = useTracks()
const {
  isAutoPlay,
  isShuffleMode,
  toggleAutoPlay,
  toggleShuffleMode,
  initializeQueue,
  peekNextTrack,
  peekPrevTrack,
  getNextTrackUrl,
  getPrevTrackUrl,
  hasNextTrack: checkHasNextTrack,
  hasPrevTrack: checkHasPrevTrack,
  goToNextTrack,
  goToPrevTrack: goToPrevTrackQueue,
} = usePlayerQueue()

// Media Session API for lock screen controls
const {
  updateMetadata: updateMediaMetadata,
  updatePlaybackState,
  updatePositionState,
  setActionHandlers: setMediaSessionHandlers,
  clearActionHandlers: clearMediaSessionHandlers,
} = useMediaSession()

// Player storage for persistence
const {
  saveVolume,
  loadVolume,
  saveMuted,
  loadMuted,
  saveLastTrack,
  loadLastTrack,
  saveShuffleMode,
  saveAutoPlay,
  saveKaraokeMode,
  loadKaraokeMode,
} = usePlayerStorage()

// Fullscreen for karaoke mode
const { isFullscreen, toggleFullscreen } = useFullscreen()

// Route params
const albumId = computed(() => route.params.id as string)
const trackId = computed(() => Number(route.params.trackId))

// Album and track data
const album = computed(() => getAlbumById(albumId.value))
const track = computed(() => getTrackById(trackId.value))
const albumTracks = computed(() => getTracksByAlbum(albumId.value))
const trackIndexInAlbum = computed(() => getTrackIndexInAlbum(track.value))

// Page title with track and album name
useHead({
  title: computed(() => {
    if (track.value && album.value) {
      return `${track.value.title} - ${album.value.title} | TAG`
    }
    return 'Lecture - TAG'
  })
})

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
const backgroundSrc = computed(() => getBackgroundSrc(track.value))

// Template ref for audio element (defined here for proper SSR hydration)
const audioRef = useTemplateRef<HTMLAudioElement>('audioElement')

// Audio player
const {
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  progress,
  formattedCurrentTime,
  formattedDuration,
  togglePlay,
  seek,
  setVolume,
  toggleMute,
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
  setSectionStyle: setVisualizerSectionStyle,
  destroy: destroyVisualizer,
} = useAudioVisualizer()

// Visualizer gradient based on theme
const visualizerGradient = computed(() => {
  if (isCeltic.value) return 'celtic'
  if (isFestive.value) return 'winter'
  return 'default'
})

// Lyrics - MUST be called before computed properties that use currentSectionType
const {
  previousLyric,
  currentLyric,
  nextLyric,
  currentLyricIndex,
  currentSectionType,
  currentSectionNumber,
  hasLyrics,
  updateTime: updateLyricsTime,
} = useLyrics(trackId)

// Check if we should use pride colors (track 3 "Majorité de Minorité" during REFRAIN)
const usePrideColors = computed(() => trackId.value === 3 && currentSectionType.value === 'REFRAIN')

// Section-based glow colors for vinyl
const sectionGlowClass = computed(() => {
  // Pride: multi-color glow
  if (usePrideColors.value) {
    return { playing: 'bg-pink-500', idle: 'bg-purple-500' }
  }

  const sectionType = currentSectionType.value
  const defaultColors = { playing: 'bg-amber-500', idle: 'bg-cyan-500' }
  const colors: Record<string, { playing: string, idle: string }> = {
    INTRO: { playing: 'bg-blue-500', idle: 'bg-blue-600' },
    COUPLET: { playing: 'bg-green-500', idle: 'bg-green-600' },
    REFRAIN: { playing: 'bg-orange-500', idle: 'bg-yellow-500' },
    CHORUS: { playing: 'bg-rose-500', idle: 'bg-pink-500' },
    VERSE: { playing: 'bg-teal-500', idle: 'bg-teal-600' },
    BRIDGE: { playing: 'bg-purple-500', idle: 'bg-fuchsia-500' },
    OUTRO: { playing: 'bg-gray-400', idle: 'bg-gray-500' },
    INSTRUMENTAL: defaultColors,
  }
  return colors[sectionType] ?? defaultColors
})

// Section-based play button colors
const sectionPlayButtonClass = computed(() => {
  // Pride: rainbow gradient button
  if (usePrideColors.value) {
    return 'bg-gradient-to-br from-red-800/80 via-green-700/80 to-purple-800/80 border-pink-400/30 group-hover:border-red-400/50 group-hover:from-red-700/80 group-hover:via-green-600/80 group-hover:to-purple-700/80'
  }

  const sectionType = currentSectionType.value
  const defaultClass = 'bg-amber-900/80 border-amber-500/30 group-hover:border-cyan-400/50 group-hover:bg-amber-800/80'
  const colors: Record<string, string> = {
    INTRO: 'bg-blue-900/80 border-blue-500/30 group-hover:border-blue-400/50 group-hover:bg-blue-800/80',
    COUPLET: 'bg-green-900/80 border-green-500/30 group-hover:border-green-400/50 group-hover:bg-green-800/80',
    REFRAIN: 'bg-orange-900/80 border-orange-500/30 group-hover:border-yellow-400/50 group-hover:bg-orange-800/80',
    CHORUS: 'bg-rose-900/80 border-rose-500/30 group-hover:border-pink-400/50 group-hover:bg-rose-800/80',
    VERSE: 'bg-teal-900/80 border-teal-500/30 group-hover:border-teal-400/50 group-hover:bg-teal-800/80',
    BRIDGE: 'bg-purple-900/80 border-purple-500/30 group-hover:border-fuchsia-400/50 group-hover:bg-purple-800/80',
    OUTRO: 'bg-gray-800/80 border-gray-500/30 group-hover:border-gray-400/50 group-hover:bg-gray-700/80',
    INSTRUMENTAL: defaultClass,
  }
  return colors[sectionType] ?? defaultClass
})

// Section-based muted text color for hints
const sectionTextMutedClass = computed(() => {
  if (usePrideColors.value) {
    return 'text-pink-500/40 hover:text-purple-400/60'
  }

  const sectionType = currentSectionType.value
  const defaultClass = 'text-amber-500/40 hover:text-cyan-500/60'
  const colors: Record<string, string> = {
    INTRO: 'text-blue-500/40 hover:text-blue-400/60',
    COUPLET: 'text-green-500/40 hover:text-green-400/60',
    REFRAIN: 'text-orange-500/40 hover:text-yellow-400/60',
    CHORUS: 'text-rose-500/40 hover:text-pink-400/60',
    VERSE: 'text-teal-500/40 hover:text-teal-400/60',
    BRIDGE: 'text-purple-500/40 hover:text-fuchsia-400/60',
    OUTRO: 'text-gray-500/40 hover:text-gray-400/60',
    INSTRUMENTAL: defaultClass,
  }
  return colors[sectionType] ?? defaultClass
})

// Refs
const visualizerRef = ref<HTMLElement | null>(null)
const karaokeHeaderRef = ref<InstanceType<typeof import('~/components/KaraokeHeader.vue').default> | null>(null)
const mainContainerRef = ref<HTMLElement | null>(null)
const preloadAudioRef = ref<HTMLAudioElement | null>(null)

// Karaoke mode
const isKaraokeMode = ref(false)

// Preload next track audio
const nextTrackAudioSrc = computed(() => {
  const next = nextTrack.value
  return next ? getAudioSrc(next) : null
})

// Navigation - previous/next track in album (using peek for UI, no side effects)
const prevTrack = computed(() => {
  return peekPrevTrack(albumTracks.value, trackId.value)
})

const nextTrack = computed(() => {
  return peekNextTrack(albumTracks.value, trackId.value)
})

// Check if there's a next/prev track available (for UI state)
const hasNextTrackComputed = computed(() => {
  return checkHasNextTrack(albumTracks.value, trackId.value)
})

const hasPrevTrackComputed = computed(() => {
  return checkHasPrevTrack(albumTracks.value, trackId.value)
})

const prevTrackUrl = computed(() => {
  return getPrevTrackUrl(albumId.value, albumTracks.value, trackId.value)
})

const nextTrackUrl = computed(() => {
  return getNextTrackUrl(albumId.value, albumTracks.value, trackId.value)
})

// Handle track end - autoplay next (only when autoplay is enabled)
const handleTrackEnded = () => {
  onEnded()
  // Only auto-advance if autoplay is on
  // Shuffle just changes the ORDER, it doesn't enable auto-advance
  if (isAutoPlay.value) {
    const nextUrl = goToNextTrack(albumId.value, albumTracks.value, trackId.value)
    if (nextUrl) {
      router.push(nextUrl)
    }
  }
}

// Toggle shuffle with current context and persistence
const handleToggleShuffle = () => {
  toggleShuffleMode(albumTracks.value, trackId.value)
  saveShuffleMode(isShuffleMode.value)
}

// Toggle karaoke mode with persistence
const toggleKaraokeMode = () => {
  isKaraokeMode.value = !isKaraokeMode.value
  saveKaraokeMode(isKaraokeMode.value)
}

// Handle play toggle with visualizer initialization
const handleTogglePlay = async () => {
  if (!isVisualizerInitialized.value && audioRef.value) {
    // Use the correct container based on karaoke mode
    const container = isKaraokeMode.value
      ? karaokeHeaderRef.value?.visualizerRef
      : visualizerRef.value

    if (container) {
      initVisualizer(container, audioRef.value)
      // Set initial section style if lyrics are available
      if (hasLyrics.value) {
        setVisualizerSectionStyle(currentSectionType.value, currentSectionNumber.value, trackId.value)
      } else {
        setVisualizerGradient(visualizerGradient.value)
      }
    }
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
  saveVolume(newVolume)
}

// Handle mute toggle with persistence
const handleToggleMute = () => {
  toggleMute()
  saveMuted(!isMuted.value)
}

// Handle shuffle toggle with persistence
const handleToggleAutoPlay = () => {
  toggleAutoPlay()
  saveAutoPlay(isAutoPlay.value)
}

// Navigate to previous track (uses queue history in shuffle mode)
const goToPrevTrack = () => {
  const prevUrl = goToPrevTrackQueue(albumId.value, albumTracks.value, trackId.value)
  if (prevUrl) {
    router.push(prevUrl)
  }
}

// Navigate to next track (consumes from shuffle queue if enabled)
const goToNextTrackManual = () => {
  const nextUrl = goToNextTrack(albumId.value, albumTracks.value, trackId.value)
  if (nextUrl) {
    router.push(nextUrl)
  }
}

// Sync lyrics with audio time and update media session position
watch(currentTime, (time) => {
  updateLyricsTime(time)
  // Update media session position every 5 seconds to avoid too many calls
  if (Math.floor(time) % 5 === 0) {
    updatePositionState(duration.value, time)
  }
})

// Save playback position periodically for resume
watch(currentTime, (time) => {
  // Save every 3 seconds for better resume accuracy
  if (Math.floor(time) % 3 === 0 && time > 0) {
    saveLastTrack(albumId.value, trackId.value, time)
  }
})

// Update media session when track changes (client-side only)
watch(track, (newTrack) => {
  if (newTrack && import.meta.client) {
    const fullCoverUrl = coverSrc.value ? new URL(coverSrc.value, window.location.origin).href : undefined
    updateMediaMetadata(newTrack, fullCoverUrl)
  }
}, { immediate: true })

// Update media session playback state
watch(isPlaying, (playing) => {
  updatePlaybackState(playing ? 'playing' : 'paused')
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

// Update visualizer style when lyric section changes
watch([currentSectionType, currentSectionNumber], ([sectionType, sectionNumber]) => {
  if (isVisualizerInitialized.value && hasLyrics.value) {
    setVisualizerSectionStyle(sectionType, sectionNumber, trackId.value)
  }
})

// Auto-start playback when autoplay/shuffle is active
const autoStartPlayback = async () => {
  if ((isAutoPlay.value || isShuffleMode.value) && audioRef.value) {
    // Initialize visualizer if needed - use correct container based on karaoke mode
    if (!isVisualizerInitialized.value) {
      const container = isKaraokeMode.value
        ? karaokeHeaderRef.value?.visualizerRef
        : visualizerRef.value

      if (container) {
        initVisualizer(container, audioRef.value)
        // Set initial section style if lyrics are available
        if (hasLyrics.value) {
          setVisualizerSectionStyle(currentSectionType.value, currentSectionNumber.value, trackId.value)
        } else {
          setVisualizerGradient(visualizerGradient.value)
        }
      }
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

    // Restore playback position if same track
    const lastTrack = loadLastTrack()
    if (lastTrack && lastTrack.trackId === trackId.value && lastTrack.position > 0) {
      const seekToSavedPosition = () => {
        seek(lastTrack.position)
        // Also sync lyrics time to the restored position
        updateLyricsTime(lastTrack.position)
        audio.removeEventListener('loadedmetadata', seekToSavedPosition)
      }
      if (audio.readyState >= 1) {
        seek(lastTrack.position)
        updateLyricsTime(lastTrack.position)
      } else {
        audio.addEventListener('loadedmetadata', seekToSavedPosition)
      }
    }

    // If audio already has metadata loaded (browser cache), sync duration/time immediately
    if (audio.readyState >= 1) {
      onLoadedMetadata()
      // Also sync lyrics time
      updateLyricsTime(currentTime.value)
    }
  }
}, { immediate: true })

// Keyboard controls
const SEEK_STEP = 5 // seconds
const VOLUME_STEP = 0.1

const handleKeydown = (event: KeyboardEvent) => {
  // Ignore if user is typing in an input
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
    return
  }

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      seek(Math.max(0, currentTime.value - SEEK_STEP))
      break
    case 'ArrowRight':
      event.preventDefault()
      seek(Math.min(duration.value, currentTime.value + SEEK_STEP))
      break
    case 'ArrowUp':
      event.preventDefault()
      setVolume(Math.min(1, volume.value + VOLUME_STEP))
      break
    case 'ArrowDown':
      event.preventDefault()
      setVolume(Math.max(0, volume.value - VOLUME_STEP))
      break
    case ' ':
      event.preventDefault()
      handleTogglePlay()
      break
    case 'm':
    case 'M':
      event.preventDefault()
      toggleMute()
      break
  }
}

// Lifecycle
onMounted(() => {
  startLoop()
  // Initialize shuffle queue if shuffle mode is active
  initializeQueue(albumTracks.value, trackId.value)

  // Initial sync of lyrics time (handles SSR hydration)
  updateLyricsTime(currentTime.value)

  // Add keyboard event listener
  window.addEventListener('keydown', handleKeydown)

  // Load saved volume from localStorage
  const savedVolume = loadVolume()
  setVolume(savedVolume)

  // Load saved mute state
  const savedMuted = loadMuted()
  if (savedMuted) {
    toggleMute()
  }

  // Load saved karaoke mode
  const savedKaraokeMode = loadKaraokeMode()
  if (savedKaraokeMode) {
    isKaraokeMode.value = true
  }

  // Setup Media Session action handlers
  setMediaSessionHandlers({
    onPlay: () => handleTogglePlay(),
    onPause: () => handleTogglePlay(),
    onSeekBackward: () => seek(Math.max(0, currentTime.value - SEEK_STEP)),
    onSeekForward: () => seek(Math.min(duration.value, currentTime.value + SEEK_STEP)),
    onPreviousTrack: goToPrevTrack,
    onNextTrack: goToNextTrackManual,
  })
})

onUnmounted(() => {
  stopLoop()
  destroyVisualizer()
  cleanupAudio()

  // Remove keyboard event listener
  window.removeEventListener('keydown', handleKeydown)

  // Clear media session handlers
  clearMediaSessionHandlers()

  // Save final position
  if (currentTime.value > 0) {
    saveLastTrack(albumId.value, trackId.value, currentTime.value)
  }
})

// Swipe gestures for mobile track navigation
useSwipeGesture(mainContainerRef, {
  threshold: 80,
  onSwipeLeft: goToNextTrackManual,
  onSwipeRight: goToPrevTrack,
})
</script>

<template>
  <div
    ref="mainContainerRef"
    :class="[
      'min-h-screen relative overflow-hidden flex flex-col touch-pan-y',
      !backgroundSrc && isCeltic ? 'bg-pattern' : '',
      !backgroundSrc && isFestive ? 'bg-winter bg-winter-pattern' : '',
      !backgroundSrc && !isCeltic && !isFestive ? 'bg-neutral bg-neutral-pattern' : '',
      backgroundSrc ? 'bg-zinc-950' : ''
    ]"
  >
    <!-- Custom Track Background -->
    <div
      v-if="backgroundSrc"
      class="absolute inset-0 z-0"
    >
      <!-- Background Image -->
      <NuxtImg
        :src="backgroundSrc"
        alt=""
        class="absolute inset-0 w-full h-full object-cover"
        format="webp"
        quality="80"
        loading="eager"
        fetchpriority="high"
      />
      <!-- Dark overlay for readability -->
      <div class="absolute inset-0 bg-black/50"></div>
      <!-- Pattern overlay (fleur-de-lys etc.) -->
      <div
        :class="[
          'absolute inset-0',
          isCeltic ? 'bg-pattern-overlay' : '',
          isFestive ? 'bg-winter-pattern' : '',
          !isCeltic && !isFestive ? 'bg-neutral-pattern' : ''
        ]"
      ></div>
    </div>

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
      <!-- Preload next track audio for seamless transition -->
      <audio
        v-if="nextTrackAudioSrc"
        ref="preloadAudioRef"
        :src="nextTrackAudioSrc"
        preload="metadata"
      ></audio>
    </ClientOnly>

    <!-- Back Button - goes to album -->
    <div class="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
      <BackButton :to="`/album/${albumId}`" :label="album?.title || 'Album'" :theme="currentTheme" :section-type="currentSectionType" :track-id="trackId" />
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
      class="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-28 sm:pb-32 pt-16 sm:pt-0 relative z-10"
    >
      <!-- Track Info -->
      <TrackInfo :track="track" size="lg" :theme="currentTheme" />

      <!-- Vinyl Container -->
      <div class="relative">
        <!-- Vinyl Glow -->
        <div
          class="absolute inset-0 rounded-full blur-3xl transition-all duration-500"
          :class="[
            isPlaying ? 'opacity-30' : 'opacity-10',
            isPlaying ? sectionGlowClass.playing : sectionGlowClass.idle
          ]"
        ></div>

        <!-- Vinyl Record -->
        <VinylRecord
          :is-spinning="isPlaying"
          :cover-src="coverSrc"
          size="lg"
          :theme="currentTheme"
          :progress="progress"
          :current-time="currentTime"
        >
          <template #overlay>
            <!-- Play Button Overlay -->
            <button
              class="absolute inset-0 flex items-center justify-center rounded-full group"
              @click="handleTogglePlay"
            >
              <div
                :class="[
                  'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full backdrop-blur-sm flex items-center justify-center',
                  'border-2 transition-all duration-500 group-hover:scale-110 shadow-xl',
                  { 'opacity-0 group-hover:opacity-100': isPlaying },
                  sectionPlayButtonClass
                ]"
              >
                <svg v-if="!isPlaying" class="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <svg v-else class="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
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
      class="flex-1 flex flex-col px-4 sm:px-6 pb-28 sm:pb-32 relative z-10 karaoke-mode"
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

      <!-- Karaoke controls: Section indicator + Fullscreen + Exit hint -->
      <div class="flex items-center justify-center gap-4 pb-4">
        <!-- Section indicator -->
        <span
          v-if="currentSectionType !== 'INSTRUMENTAL'"
          :class="[
            'text-xs font-medium uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-sm transition-colors duration-500',
            usePrideColors ? 'bg-gradient-to-r from-red-500/20 via-green-500/20 to-purple-500/20 text-pink-300' : 'bg-zinc-800/50',
            !usePrideColors && currentSectionType === 'INTRO' ? 'text-blue-400' : '',
            !usePrideColors && currentSectionType === 'COUPLET' ? 'text-green-400' : '',
            !usePrideColors && currentSectionType === 'REFRAIN' ? 'text-orange-400' : '',
            !usePrideColors && currentSectionType === 'CHORUS' ? 'text-rose-400' : '',
            !usePrideColors && currentSectionType === 'VERSE' ? 'text-teal-400' : '',
            !usePrideColors && currentSectionType === 'BRIDGE' ? 'text-purple-400' : '',
            !usePrideColors && currentSectionType === 'OUTRO' ? 'text-gray-400' : '',
          ]"
        >
          {{ currentSectionType }} {{ currentSectionNumber }}
        </span>

        <!-- Fullscreen button -->
        <button
          :class="[
            'p-2 rounded-full backdrop-blur-sm transition-colors duration-500 bg-zinc-800/50',
            sectionTextMutedClass
          ]"
          :title="isFullscreen ? 'Quitter le plein écran' : 'Plein écran'"
          @click="toggleFullscreen()"
        >
          <svg v-if="!isFullscreen" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
          </svg>
          <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
          </svg>
        </button>

        <!-- Exit karaoke hint -->
        <button
          :class="[
            'text-xs uppercase tracking-wider transition-colors duration-500',
            sectionTextMutedClass
          ]"
          @click="toggleKaraokeMode"
        >
          Quitter
        </button>
      </div>
    </div>

    <!-- Player Bar -->
    <PlayerBar
      :is-playing="isPlaying"
      :current-time="currentTime"
      :duration="duration"
      :volume="volume"
      :is-muted="isMuted"
      :formatted-current-time="formattedCurrentTime"
      :formatted-duration="formattedDuration"
      :progress="progress"
      :theme="currentTheme"
      :is-shuffle-mode="isShuffleMode"
      :is-auto-play="isAutoPlay"
      :prev-track-url="prevTrackUrl"
      :next-track-url="nextTrackUrl"
      :has-prev-track="hasPrevTrackComputed"
      :has-next-track="hasNextTrackComputed"
      :track-index="trackIndexInAlbum"
      :total-tracks="albumTracks.length"
      :section-type="currentSectionType"
      :track-id="trackId"
      @toggle-play="handleTogglePlay"
      @seek="handleSeek"
      @volume-change="handleVolumeChange"
      @toggle-mute="handleToggleMute"
      @toggle-shuffle="handleToggleShuffle"
      @toggle-auto-play="handleToggleAutoPlay"
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
