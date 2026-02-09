<script setup lang="ts">
import type { Track, LyricLine } from '~/types'

interface Props {
  track: Track | null
  currentTime: number
  isOpen: boolean
  theme?: 'celtic' | 'winter' | 'default'
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'celtic'
})

const emit = defineEmits<{
  close: []
}>()

// Get track cover
const { getCoverSrc } = useTracks()
const coverSrc = computed(() => props.track ? getCoverSrc(props.track) : '')

// Get lyrics for current track
const trackId = computed(() => props.track?.id ?? 0)
const { lyrics, currentLyricIndex, fetchLyrics, hasLyrics, updateTime } = useLyrics(trackId)

// Fetch lyrics when track changes
watch(() => props.track?.id, async (newId) => {
  if (newId) {
    await fetchLyrics()
  }
}, { immediate: true })

// Update lyrics time
watch(() => props.currentTime, (time) => {
  updateTime(time)
})

// Theme-aware colors
const panelBg = computed(() => {
  if (props.theme === 'winter') return 'bg-sky-950/90'
  if (props.theme === 'default') return 'bg-zinc-900/90'
  return 'bg-emerald-950/90'
})

const headerBg = computed(() => {
  if (props.theme === 'winter') return 'bg-sky-950/50'
  if (props.theme === 'default') return 'bg-zinc-900/50'
  return 'bg-emerald-950/50'
})

const borderColor = computed(() => {
  if (props.theme === 'winter') return 'border-sky-800/50'
  if (props.theme === 'default') return 'border-zinc-700/50'
  return 'border-emerald-800/50'
})

const titleColor = computed(() => {
  if (props.theme === 'winter') return 'text-sky-300'
  if (props.theme === 'default') return 'text-purple-300'
  return 'text-amber-400'
})

const subtitleColor = computed(() => {
  if (props.theme === 'winter') return 'text-sky-500/60'
  if (props.theme === 'default') return 'text-zinc-400/60'
  return 'text-emerald-500/60'
})

const closeBtnClass = computed(() => {
  if (props.theme === 'winter') return 'bg-sky-800/50 text-sky-300 hover:bg-sky-700/50'
  if (props.theme === 'default') return 'bg-zinc-700/50 text-zinc-300 hover:bg-zinc-600/50'
  return 'bg-emerald-800/50 text-emerald-300 hover:bg-emerald-700/50'
})

const sectionHeaderColor = computed(() => {
  if (props.theme === 'winter') return 'text-sky-400/50'
  if (props.theme === 'default') return 'text-zinc-500/50'
  return 'text-emerald-600/50'
})

const activeLineColor = computed(() => {
  if (props.theme === 'winter') return 'text-sky-300 font-semibold scale-105 origin-left'
  if (props.theme === 'default') return 'text-purple-300 font-semibold scale-105 origin-left'
  return 'text-amber-400 font-semibold scale-105 origin-left'
})

const pastLineColor = computed(() => {
  if (props.theme === 'winter') return 'text-sky-400/80'
  if (props.theme === 'default') return 'text-zinc-400/80'
  return 'text-emerald-400/80'
})

const futureLineColor = computed(() => {
  if (props.theme === 'winter') return 'text-sky-500/40'
  if (props.theme === 'default') return 'text-zinc-500/40'
  return 'text-emerald-500/40'
})

const instrumentalColor = computed(() => {
  if (props.theme === 'winter') return 'text-sky-600/30 italic'
  if (props.theme === 'default') return 'text-zinc-600/30 italic'
  return 'text-emerald-600/30 italic'
})

const emptyColor = computed(() => {
  if (props.theme === 'winter') return 'text-sky-500/50'
  if (props.theme === 'default') return 'text-zinc-400/50'
  return 'text-emerald-500/50'
})

const emptySubColor = computed(() => {
  if (props.theme === 'winter') return 'text-sky-600/30'
  if (props.theme === 'default') return 'text-zinc-600/30'
  return 'text-emerald-600/30'
})

const emptyIconColor = computed(() => {
  if (props.theme === 'winter') return 'text-sky-700/30'
  if (props.theme === 'default') return 'text-zinc-700/30'
  return 'text-emerald-700/30'
})

// Auto-scroll to current lyric
const lyricsContainer = ref<HTMLElement | null>(null)

watch(currentLyricIndex, (index) => {
  if (lyricsContainer.value && index >= 0) {
    const lyricElements = lyricsContainer.value.querySelectorAll('.lyric-line')
    const currentElement = lyricElements[index] as HTMLElement
    if (currentElement) {
      currentElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }
})

// Get section label
const getSectionLabel = (lyric: LyricLine): string => {
  if (lyric.type === 'INSTRUMENTAL') return ''
  return `${lyric.type} ${lyric.number}`
}

// Check if this is a new section
const isNewSection = (index: number): boolean => {
  if (index === 0) return true
  const current = lyrics.value[index]
  const previous = lyrics.value[index - 1]
  if (!current || !previous) return false
  return current.type !== previous.type || current.number !== previous.number
}
</script>

<template>
  <Transition name="slide">
    <div
      v-if="isOpen && track"
      :class="['lyrics-panel fixed right-0 top-0 h-full w-full sm:w-96 border-l z-50 flex flex-col overflow-hidden', borderColor]"
    >
      <!-- Background with blurred cover -->
      <div class="absolute inset-0 -z-10">
        <NuxtImg
          v-if="coverSrc"
          :src="coverSrc"
          :alt="track.title"
          class="w-full h-full object-cover blur-2xl scale-110 opacity-30"
        />
        <div :class="['absolute inset-0', panelBg]"></div>
      </div>

      <!-- Header -->
      <div :class="['flex items-center gap-4 p-4 border-b', borderColor, headerBg]">
        <!-- Cover -->
        <div class="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
          <NuxtImg
            v-if="coverSrc"
            :src="coverSrc"
            :alt="track.title"
            width="56"
            height="56"
            format="webp"
            quality="80"
            class="w-full h-full object-cover"
          />
        </div>
        <!-- Track info -->
        <div class="flex-1 min-w-0">
          <h3 :class="[titleColor, theme === 'celtic' ? 'font-medieval' : 'font-bold', 'text-lg truncate']">{{ track.title }}</h3>
          <p :class="[subtitleColor, 'text-sm truncate']">{{ track.subtitle }}</p>
        </div>
        <button
          :class="['w-10 h-10 rounded-full hover:text-white transition-colors flex items-center justify-center flex-shrink-0', closeBtnClass]"
          @click="emit('close')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Lyrics Content -->
      <div
        ref="lyricsContainer"
        class="flex-1 overflow-y-auto p-6 space-y-2"
      >
        <template v-if="hasLyrics && lyrics.length > 0">
          <template v-for="(lyric, index) in lyrics" :key="index">
            <!-- Section Header -->
            <div
              v-if="isNewSection(index) && lyric.type !== 'INSTRUMENTAL'"
              :class="['section-header text-xs uppercase tracking-widest font-semibold mt-6 mb-2 first:mt-0', sectionHeaderColor]"
            >
              {{ getSectionLabel(lyric) }}
            </div>

            <!-- Lyric Line -->
            <p
              class="lyric-line text-lg leading-relaxed transition-all duration-300 py-1"
              :class="[
                index === currentLyricIndex ? activeLineColor : '',
                index < currentLyricIndex && index !== currentLyricIndex ? pastLineColor : '',
                index > currentLyricIndex ? futureLineColor : '',
                lyric.type === 'INSTRUMENTAL' ? instrumentalColor : ''
              ]"
            >
              {{ lyric.text }}
            </p>
          </template>
        </template>

        <!-- No lyrics available -->
        <div v-else class="flex flex-col items-center justify-center h-full text-center">
          <svg :class="['w-16 h-16 mb-4', emptyIconColor]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <p :class="emptyColor">Paroles non disponibles</p>
          <p :class="[emptySubColor, 'text-sm mt-2']">Profitez de la musique !</p>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Backdrop for mobile -->
  <Transition name="fade">
    <div
      v-if="isOpen && track"
      class="fixed inset-0 bg-black/50 z-40 sm:hidden"
      @click="emit('close')"
    ></div>
  </Transition>
</template>

<style scoped>
.lyrics-panel {
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.3);
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.lyric-line {
  transform-origin: left center;
}
</style>
