<script setup lang="ts">
interface Track {
  id: number
  title: string
  subtitle: string
  duration: string
  type: 'epic' | 'celtic' | 'military'
  filename?: string
}

const tracks: Track[] = [
  { id: 1, title: 'De nos jours plus rien ne va', subtitle: 'Chant de révolte', duration: '0:00', type: 'epic', filename: 'De_nos_jours_plus_rien_de_va' },
  { id: 2, title: "Parangon d'une Soldate", subtitle: 'Hymne héroïque', duration: '0:00', type: 'military', filename: "Parangon_d'une_soldate" },
  { id: 3, title: 'L\'Assaut Final', subtitle: 'Bataille épique', duration: '0:00', type: 'epic' },
  { id: 4, title: 'Les Fils de la Terre', subtitle: 'Marche triomphale', duration: '0:00', type: 'military' },
  { id: 5, title: 'Brumes d\'Émeraude', subtitle: 'Ballade mystique', duration: '0:00', type: 'celtic' },
  { id: 6, title: 'Sang et Gloire', subtitle: 'Cri de ralliement', duration: '0:00', type: 'epic' },
  { id: 7, title: 'Le Serment', subtitle: 'Hymne solennel', duration: '0:00', type: 'military' },
  { id: 8, title: 'Racines Profondes', subtitle: 'Mélodie ancestrale', duration: '0:00', type: 'celtic' },
]

const route = useRoute()
const trackId = computed(() => Number(route.params.id))
const track = computed(() => tracks.find(t => t.id === trackId.value))

// Audio source - utilise le filename si disponible
const audioSrc = computed(() => {
  if (track.value?.filename) {
    return `/audio/${track.value.filename}.mp3`
  }
  return ''
})

// Player state
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.8)
const audioRef = ref<HTMLAudioElement | null>(null)

// Audio Visualizer
const BAR_COUNT = 100 // Half count - will be mirrored
const barHeights = ref<number[]>(new Array(BAR_COUNT).fill(0))

// Mirrored bars: left side (reversed) + right side (normal) = symmetric from center
const mirroredBarHeights = computed(() => {
  const reversed = [...barHeights.value].reverse()
  return [...reversed, ...barHeights.value]
})

let audioContext: AudioContext | null = null
let analyser: AnalyserNode | null = null
let dataArray: Uint8Array | null = null
let source: MediaElementAudioSourceNode | null = null
let animationId: number | null = null
let isAudioContextInitialized = false

const initAudioContext = () => {
  if (isAudioContextInitialized || !audioRef.value) return

  try {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 512 // Plus de détail
    analyser.smoothingTimeConstant = 0.75

    source = audioContext.createMediaElementSource(audioRef.value)
    source.connect(analyser)
    analyser.connect(audioContext.destination)

    dataArray = new Uint8Array(analyser.frequencyBinCount)
    isAudioContextInitialized = true
    console.log('Audio context initialized successfully')
  } catch (e) {
    console.error('Failed to initialize audio context:', e)
  }
}

const updateVisualizer = () => {
  // Update timeline at 60fps - check actual audio state, not isPlaying ref
  const isActuallyPlaying = audioRef.value && !audioRef.value.paused

  if (isActuallyPlaying) {
    currentTime.value = audioRef.value!.currentTime
    // Sync isPlaying state if needed
    if (!isPlaying.value) isPlaying.value = true
  }

  if (!isActuallyPlaying) {
    // Sync isPlaying state if needed
    if (isPlaying.value && audioRef.value) isPlaying.value = false
    // Fade out smoothly when paused
    for (let i = 0; i < BAR_COUNT; i++) {
      barHeights.value[i] = (barHeights.value[i] ?? 0) * 0.9
    }
    animationId = requestAnimationFrame(updateVisualizer)
    return
  }

  if (!analyser || !dataArray) {
    animationId = requestAnimationFrame(updateVisualizer)
    return
  }

  // @ts-expect-error - Uint8Array type mismatch with Web Audio API
  analyser.getByteFrequencyData(dataArray)

  // Map frequency data to bar heights with interpolation
  const dataLength = dataArray.length
  for (let i = 0; i < BAR_COUNT; i++) {
    // Sample from the frequency data
    const dataIndex = Math.floor((i / BAR_COUNT) * dataLength)
    const value = dataArray[dataIndex] || 0
    // Smooth transition
    const targetHeight = (value / 255) * 100
    barHeights.value[i] = (barHeights.value[i] ?? 0) * 0.3 + targetHeight * 0.7
  }

  animationId = requestAnimationFrame(updateVisualizer)
}

const startVisualizer = () => {
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume()
  }
  if (!animationId) {
    animationId = requestAnimationFrame(updateVisualizer)
  }
}

const stopVisualizer = () => {
  // Don't cancel animation - let it fade out
}

// Format time in mm:ss
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Progress percentage
const progress = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

// Toggle play/pause
const togglePlay = async () => {
  if (!audioRef.value) {
    console.error('Audio ref not available')
    return
  }

  // Initialize audio context on first play (requires user interaction)
  if (!isAudioContextInitialized) {
    initAudioContext()
  }

  if (isPlaying.value) {
    audioRef.value.pause()
    stopVisualizer()
    isPlaying.value = false
  } else {
    try {
      await audioRef.value.play()
      startVisualizer()
      isPlaying.value = true
    } catch (error) {
      console.error('Error playing audio:', error)
    }
  }
}

// Volume bar ref and drag state
const volumeBarRef = ref<HTMLElement | null>(null)
const isDraggingVolume = ref(false)

// Seek using native range input
const onSeek = (event: Event) => {
  const target = event.target as HTMLInputElement
  const newTime = parseFloat(target.value)
  currentTime.value = newTime
  if (audioRef.value) {
    audioRef.value.currentTime = newTime
  }
}

// Update time
const updateTime = () => {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime
  }
}

// Set duration when metadata loads
const onLoadedMetadata = () => {
  if (audioRef.value) {
    duration.value = audioRef.value.duration
  }
}

// Volume control (used for both click and drag)
const setVolumeFromPosition = (clientX: number) => {
  if (!volumeBarRef.value) return
  const rect = volumeBarRef.value.getBoundingClientRect()
  volume.value = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  if (audioRef.value) {
    audioRef.value.volume = volume.value
  }
}

// Volume drag handlers
const startVolumeDrag = (event: MouseEvent) => {
  isDraggingVolume.value = true
  setVolumeFromPosition(event.clientX)
  document.addEventListener('mousemove', onVolumeDrag)
  document.addEventListener('mouseup', stopVolumeDrag)
}

const onVolumeDrag = (event: MouseEvent) => {
  if (isDraggingVolume.value) {
    setVolumeFromPosition(event.clientX)
  }
}

const stopVolumeDrag = () => {
  isDraggingVolume.value = false
  document.removeEventListener('mousemove', onVolumeDrag)
  document.removeEventListener('mouseup', stopVolumeDrag)
}

// Get type color
const getTypeColor = (type: Track['type']) => {
  switch (type) {
    case 'epic': return 'text-red-400'
    case 'celtic': return 'text-emerald-400'
    case 'military': return 'text-amber-400'
  }
}

// Lifecycle hooks (at end to ensure all functions are defined)
onMounted(() => {
  // Start animation loop even when not playing (for fade effects)
  animationId = requestAnimationFrame(updateVisualizer)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (audioContext) {
    audioContext.close()
  }
  // Cleanup volume drag event listeners
  document.removeEventListener('mousemove', onVolumeDrag)
  document.removeEventListener('mouseup', stopVolumeDrag)
})
</script>

<template>
  <div class="min-h-screen bg-pattern relative overflow-hidden flex flex-col">
    <!-- Audio element (hidden) -->
    <audio
      ref="audioRef"
      :src="audioSrc"
      crossorigin="anonymous"
      @timeupdate="updateTime"
      @loadedmetadata="onLoadedMetadata"
      @ended="isPlaying = false; stopVisualizer()"
      @play="isPlaying = true; startVisualizer()"
      @pause="isPlaying = false"
      preload="auto"
    ></audio>

    <!-- Back Button -->
    <div class="absolute top-6 left-6 z-20">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 text-emerald-400/70 hover:text-amber-400 transition-colors group"
      >
        <svg class="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span class="text-sm uppercase tracking-wider">Retour</span>
      </NuxtLink>
    </div>

    <!-- Audio Visualizer Background - Mirrored from center, full width -->
    <ClientOnly>
      <div class="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div class="w-full h-full flex items-center justify-center gap-[2px]">
          <div
            v-for="(height, index) in mirroredBarHeights"
            :key="index"
            class="visualizer-bar flex-1"
            :style="{
              height: `${Math.max(4, height * 4)}px`,
              opacity: isPlaying ? 0.8 : 0.1,
              background: `linear-gradient(180deg,
                rgba(201, 162, 39, ${0.4 + (height / 100) * 0.6}) 0%,
                rgba(16, 185, 129, ${0.5 + (height / 100) * 0.5}) 50%,
                rgba(139, 26, 26, ${0.6 + (height / 100) * 0.4}) 100%)`,
              boxShadow: isPlaying && height > 15 ? `0 0 ${height / 5}px rgba(16, 185, 129, 0.7)` : 'none'
            }"
          ></div>
        </div>
      </div>
    </ClientOnly>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col items-center justify-center px-6 pb-32 relative z-10">
      <!-- Track Info -->
      <div class="text-center mb-12 animate-fade-in-up">
        <p :class="['text-sm uppercase tracking-widest mb-2', getTypeColor(track?.type || 'epic')]">
          {{ track?.type }}
        </p>
        <h1 class="text-4xl md:text-6xl font-medieval text-epic mb-3">
          {{ track?.title }}
        </h1>
        <p class="text-emerald-400/60 text-lg">{{ track?.subtitle }}</p>
      </div>

      <!-- Vinyl Container -->
      <div class="relative">
        <!-- Vinyl Glow -->
        <div
          class="absolute inset-0 rounded-full blur-3xl transition-opacity duration-500"
          :class="isPlaying ? 'opacity-30 bg-amber-500' : 'opacity-10 bg-emerald-500'"
        ></div>

        <!-- Vinyl Record -->
        <div
          class="vinyl-record relative w-72 h-72 md:w-96 md:h-96 rounded-full"
          :class="{ 'vinyl-spinning': isPlaying }"
        >
          <!-- Outer Ring -->
          <div class="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 shadow-2xl">
            <!-- Vinyl Grooves -->
            <div class="absolute inset-4 rounded-full border border-zinc-700/50"></div>
            <div class="absolute inset-8 rounded-full border border-zinc-700/30"></div>
            <div class="absolute inset-12 rounded-full border border-zinc-700/50"></div>
            <div class="absolute inset-16 rounded-full border border-zinc-700/30"></div>
            <div class="absolute inset-20 rounded-full border border-zinc-700/50"></div>
            <div class="absolute inset-24 rounded-full border border-zinc-700/30"></div>

            <!-- Reflective shine -->
            <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>

            <!-- Center Label -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 flex items-center justify-center shadow-inner border-4 border-emerald-700/50">
                <!-- Label Design -->
                <div class="text-center">
                  <svg class="w-8 h-8 md:w-10 md:h-10 mx-auto text-amber-500 mb-1" viewBox="0 0 100 120" fill="currentColor">
                    <path d="M50 5 L95 20 L95 60 Q95 100 50 115 Q5 100 5 60 L5 20 Z" />
                  </svg>
                  <p class="text-emerald-300 text-xs font-bold tracking-wider">GABRIELLE</p>
                </div>
              </div>
            </div>

            <!-- Center Hole -->
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="w-3 h-3 md:w-4 md:h-4 rounded-full bg-zinc-900 border-2 border-zinc-700"></div>
            </div>
          </div>
        </div>

        <!-- Play Button Overlay -->
        <button
          @click="togglePlay"
          class="absolute inset-0 flex items-center justify-center rounded-full group"
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
      </div>
    </div>

    <!-- Player Bar -->
    <div class="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-zinc-950 via-zinc-900/95 to-zinc-900/90 backdrop-blur-lg border-t border-emerald-800/30">
      <div class="container mx-auto px-6 py-4">
        <!-- Progress Bar - Native range input -->
        <div class="relative w-full h-6 mb-2 group">
          <!-- Background track -->
          <div class="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-zinc-700 rounded-full overflow-hidden">
            <!-- Progress fill - GPU accelerated with scaleX -->
            <div
              class="absolute inset-0 h-full bg-gradient-to-r from-emerald-500 to-amber-500 origin-left will-change-transform"
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
            class="progress-slider absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10"
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
          <div class="text-emerald-400/60 text-sm font-mono w-24">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </div>

          <!-- Center Controls -->
          <div class="flex items-center gap-4">
            <!-- Previous -->
            <NuxtLink
              :to="trackId > 1 ? `/track/${trackId - 1}` : undefined"
              :class="['p-2 transition-colors', trackId > 1 ? 'text-emerald-400/70 hover:text-amber-400' : 'text-zinc-600 cursor-not-allowed']"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </NuxtLink>

            <!-- Play/Pause -->
            <button
              @click="togglePlay"
              class="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center
                     hover:from-amber-600 hover:to-amber-800 transition-all duration-300 shadow-lg hover:scale-105
                     border-2 border-emerald-500/30 hover:border-amber-500/30"
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
              :to="trackId < tracks.length ? `/track/${trackId + 1}` : undefined"
              :class="['p-2 transition-colors', trackId < tracks.length ? 'text-emerald-400/70 hover:text-amber-400' : 'text-zinc-600 cursor-not-allowed']"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </NuxtLink>
          </div>

          <!-- Volume -->
          <div class="flex items-center gap-2 w-28 justify-end">
            <svg class="w-5 h-5 text-emerald-400/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
            </svg>
            <div
              ref="volumeBarRef"
              class="w-20 h-1.5 bg-zinc-700 rounded-full cursor-pointer group relative select-none"
              @mousedown="startVolumeDrag"
            >
              <div
                class="h-full bg-emerald-500 rounded-full relative"
                :class="{ 'transition-all': !isDraggingVolume }"
                :style="{ width: `${volume * 100}%` }"
              >
                <!-- Draggable thumb -->
                <div
                  class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-400 rounded-full shadow-lg transition-transform"
                  :class="[isDraggingVolume ? 'scale-125 opacity-100' : 'opacity-0 group-hover:opacity-100']"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating decorations -->
    <ClientOnly>
      <div class="fixed top-20 right-10 animate-float opacity-10 pointer-events-none">
        <svg class="w-16 h-32 text-amber-600" viewBox="0 0 50 120" fill="currentColor">
          <path d="M25 0 L28 80 L35 85 L35 90 L28 88 L28 110 L32 115 L32 120 L18 120 L18 115 L22 110 L22 88 L15 90 L15 85 L22 80 Z" />
        </svg>
      </div>
      <div class="fixed bottom-40 left-10 animate-swing opacity-10 pointer-events-none">
        <svg class="w-20 h-24 text-emerald-700" viewBox="0 0 100 120" fill="currentColor">
          <path d="M50 5 L95 20 L95 60 Q95 100 50 115 Q5 100 5 60 L5 20 Z" />
        </svg>
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
/* Vinyl spinning animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.vinyl-record {
  transition: transform 0.3s ease-out;
}

.vinyl-spinning {
  animation: spin 3s linear infinite;
}

/* Pause the animation smoothly */
.vinyl-record:not(.vinyl-spinning) {
  animation: spin 3s linear infinite;
  animation-play-state: paused;
}

/* Visualizer bars - centered, grows up and down */
.visualizer-bar {
  min-height: 4px;
  min-width: 1px;
  border-radius: 2px;
  transform-origin: center;
  will-change: height, opacity;
  transition: height 60ms ease-out;
}
</style>
