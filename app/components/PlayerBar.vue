<script setup lang="ts">
interface Props {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  formattedCurrentTime: string
  formattedDuration: string
  progress: number
  trackId: number
  totalTracks: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  togglePlay: []
  seek: [time: number]
  volumeChange: [volume: number]
}>()

// Volume bar refs and state
const volumeBarRef = ref<HTMLElement | null>(null)
const isDraggingVolume = ref(false)

// Handle seek from range input
const onSeek = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('seek', parseFloat(target.value))
}

// Volume control
const setVolumeFromPosition = (clientX: number) => {
  if (!volumeBarRef.value) return
  const rect = volumeBarRef.value.getBoundingClientRect()
  const newVolume = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  emit('volumeChange', newVolume)
}

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

onUnmounted(() => {
  document.removeEventListener('mousemove', onVolumeDrag)
  document.removeEventListener('mouseup', stopVolumeDrag)
})
</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-zinc-950 via-zinc-900/95 to-zinc-900/90 backdrop-blur-lg border-t border-emerald-800/30">
    <div class="container mx-auto px-6 py-4">
      <!-- Progress Bar -->
      <div class="relative w-full h-6 mb-2 group">
        <!-- Background track -->
        <div class="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-zinc-700 rounded-full overflow-hidden">
          <!-- Progress fill -->
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
        <div class="text-emerald-400/60 text-sm font-mono w-24">
          {{ formattedCurrentTime }} / {{ formattedDuration }}
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
            class="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center
                   hover:from-amber-600 hover:to-amber-800 transition-all duration-300 shadow-lg hover:scale-105
                   border-2 border-emerald-500/30 hover:border-amber-500/30"
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
            :to="trackId < totalTracks ? `/track/${trackId + 1}` : undefined"
            :class="['p-2 transition-colors', trackId < totalTracks ? 'text-emerald-400/70 hover:text-amber-400' : 'text-zinc-600 cursor-not-allowed']"
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
            class="w-20 h-1.5 bg-zinc-700 rounded-full cursor-pointer group/vol relative select-none"
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
                :class="[isDraggingVolume ? 'scale-125 opacity-100' : 'opacity-0 group-hover/vol:opacity-100']"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
