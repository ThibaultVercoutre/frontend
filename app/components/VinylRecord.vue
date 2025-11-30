<script setup lang="ts">
interface Props {
  isSpinning?: boolean
  coverSrc?: string
  size?: 'sm' | 'md' | 'lg'
  showPlayButton?: boolean
  theme?: 'celtic' | 'winter' | 'default'
  progress?: number // 0-100, track progress percentage
  showTonearm?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSpinning: false,
  coverSrc: '/vynile/Parangon_dune_soldate.jpeg',
  size: 'lg',
  showPlayButton: true,
  theme: 'celtic',
  progress: 0,
  showTonearm: true,
})

// Tonearm rotation based on playback state and progress
// When not playing: tonearm is lifted away (-15deg)
// When playing: tonearm starts at center (25deg) and moves to outer edge (5deg)
const tonearmRotation = computed(() => {
  if (!props.isSpinning) {
    return -30 // Lifted position
  }
  // Map progress (0-100) to angle
  // Start at center (25deg), end at outer edge (5deg)
  // As progress increases, angle decreases (moves toward outer edge)
  return 15 - (props.progress / 100) * 30
})

const tonearmTransform = computed(() => {
  return `rotate(${tonearmRotation.value}deg)`
})

const emit = defineEmits<{
  click: []
}>()

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'w-24 h-24 md:w-32 md:h-32',
    md: 'w-48 h-48 md:w-64 md:h-64',
    lg: 'w-72 h-72 md:w-96 md:h-96',
  }
  return sizes[props.size]
})

const labelSizeClasses = computed(() => {
  const sizes = {
    sm: 'w-8 h-8 md:w-10 md:h-10',
    md: 'w-14 h-14 md:w-18 md:h-18',
    lg: 'w-20 h-20 md:w-24 md:h-24',
  }
  return sizes[props.size]
})

const iconSizeClasses = computed(() => {
  const sizes = {
    sm: 'w-3 h-3 md:w-4 md:h-4',
    md: 'w-5 h-5 md:w-6 md:h-6',
    lg: 'w-6 h-6 md:w-7 md:h-7',
  }
  return sizes[props.size]
})

// Theme-based label styling
const labelGradientClasses = computed(() => {
  if (props.theme === 'winter') {
    return 'from-sky-900 via-sky-800 to-sky-950 border-sky-600/50'
  }
  if (props.theme === 'celtic') {
    return 'from-emerald-900 via-emerald-800 to-emerald-950 border-emerald-700/50'
  }
  return 'from-purple-900 via-purple-800 to-purple-950 border-purple-700/50'
})

const labelTextClasses = computed(() => {
  if (props.theme === 'winter') {
    return 'text-sky-200'
  }
  if (props.theme === 'celtic') {
    return 'text-emerald-300'
  }
  return 'text-purple-300'
})

const labelName = computed(() => {
  if (props.theme === 'winter') {
    return 'NOËL 2024'
  }
  return 'GABRIELLE'
})
</script>

<template>
  <div class="vinyl-container relative">
    <!-- Tonearm -->
    <div
      v-if="showTonearm && size === 'lg'"
      class="tonearm-wrapper absolute -top-4 -right-4 z-20"
    >
      <div
        class="tonearm"
        :style="{ transform: tonearmTransform }"
      >
        <svg
          class="tonearm-svg w-40 h-48 md:w-48 md:h-56"
          viewBox="0 0 100 120"
          fill="none"
        >
          <!-- Pivot base -->
          <circle cx="85" cy="10" r="8" fill="#27272a" stroke="#3f3f46" stroke-width="1" />
          <circle cx="85" cy="10" r="4" fill="#52525b" />

          <!-- Main arm -->
          <line
            x1="85" y1="14"
            x2="85" y2="70"
            stroke="#71717a"
            stroke-width="4"
            stroke-linecap="round"
          />

          <!-- Arm to headshell -->
          <line
            x1="85" y1="70"
            x2="35" y2="100"
            stroke="#71717a"
            stroke-width="3"
            stroke-linecap="round"
          />

          <!-- Headshell -->
          <rect x="25" y="96" width="15" height="10" rx="2" fill="#52525b" />

          <!-- Cartridge -->
          <rect x="28" y="106" width="9" height="6" fill="#1a1a1a" />

          <!-- Stylus -->
          <line x1="32" y1="112" x2="32" y2="118" stroke="#a1a1aa" stroke-width="1" />

          <!-- Diamond -->
          <circle cx="32" cy="118" r="2" fill="#fbbf24" class="stylus-tip" />

          <!-- Glow when playing -->
          <circle
            v-if="isSpinning"
            cx="32" cy="118" r="4"
            fill="#fbbf24"
            opacity="0.5"
            class="stylus-glow"
          />
        </svg>
      </div>
    </div>

    <!-- Vinyl Record -->
    <div
      class="vinyl-record relative rounded-full"
      :class="[sizeClasses, { 'vinyl-spinning': isSpinning }]"
      @click="emit('click')"
    >
      <!-- Vinyl Disc with Album Art -->
      <div class="absolute inset-0 rounded-full shadow-2xl overflow-hidden">
        <!-- Album Art as full background -->
        <NuxtImg
          :src="coverSrc"
          alt="Album art"
          :width="size === 'lg' ? 384 : size === 'md' ? 256 : 128"
          :height="size === 'lg' ? 384 : size === 'md' ? 256 : 128"
          format="webp"
          quality="80"
          :loading="size === 'lg' ? 'eager' : 'lazy'"
          :fetchpriority="size === 'lg' ? 'high' : undefined"
          class="absolute inset-0 w-full h-full object-cover"
        />

        <!-- Dark overlay for vinyl effect -->
        <div class="absolute inset-0 bg-black/40"></div>

        <!-- Vinyl Grooves overlay -->
        <template v-if="size === 'lg'">
          <div class="absolute inset-4 rounded-full border border-white/20"></div>
          <div class="absolute inset-8 rounded-full border border-black/30"></div>
          <div class="absolute inset-12 rounded-full border border-white/15"></div>
          <div class="absolute inset-16 rounded-full border border-black/25"></div>
          <div class="absolute inset-20 rounded-full border border-white/20"></div>
          <div class="absolute inset-24 rounded-full border border-black/30"></div>
          <div class="absolute inset-28 rounded-full border border-white/15"></div>
        </template>
        <template v-else>
          <div class="absolute inset-2 rounded-full border border-white/20"></div>
          <div class="absolute inset-4 rounded-full border border-black/30"></div>
          <div class="absolute inset-6 rounded-full border border-white/15"></div>
        </template>

        <!-- Reflective shine -->
        <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>

        <!-- Center Label -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div
            :class="[
              'rounded-full bg-gradient-to-br flex items-center justify-center shadow-inner border relative',
              labelGradientClasses,
              labelSizeClasses,
              size === 'lg' ? 'border-3' : 'border'
            ]"
          >
            <!-- Label Design - Celtic (Shield) -->
            <div v-if="theme === 'celtic'" class="text-center">
              <svg :class="['mx-auto text-amber-500 mb-0.5', iconSizeClasses]" viewBox="0 0 100 120" fill="currentColor">
                <path d="M50 5 L95 20 L95 60 Q95 100 50 115 Q5 100 5 60 L5 20 Z" />
              </svg>
              <p v-if="size === 'lg'" :class="[labelTextClasses, 'text-[10px] font-bold tracking-wider']">{{ labelName }}</p>
            </div>

            <!-- Label Design - Winter (Pine Tree) -->
            <div v-else-if="theme === 'winter'" class="text-center">
              <svg :class="['mx-auto text-sky-300 mb-0.5', iconSizeClasses]" viewBox="0 0 24 24" fill="currentColor">
                <!-- Pine tree -->
                <path d="M12 2L6 10h2l-3 6h3l-4 6h16l-4-6h3l-3-6h2L12 2z" />
              </svg>
              <p v-if="size === 'lg'" :class="[labelTextClasses, 'text-[8px] font-bold tracking-wider']">{{ labelName }}</p>
            </div>

            <!-- Label Design - Default -->
            <div v-else class="text-center">
              <svg :class="['mx-auto text-pink-400 mb-0.5', iconSizeClasses]" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
              </svg>
              <p v-if="size === 'lg'" :class="[labelTextClasses, 'text-[10px] font-bold tracking-wider']">{{ labelName }}</p>
            </div>

            <!-- Center Hole -->
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                class="rounded-full bg-zinc-900 border border-zinc-600 shadow-inner"
                :class="size === 'lg' ? 'w-3 h-3 md:w-4 md:h-4' : 'w-2 h-2'"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Play Button Overlay (slot for customization) -->
      <slot name="overlay" />
    </div>
  </div>
</template>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
}

.vinyl-container {
  padding-right: 2.5rem;
  padding-top: 1rem;
}

.vinyl-record {
  transition: transform 0.3s ease-out;
}

.vinyl-spinning {
  animation: spin 3s linear infinite;
}

.vinyl-record:not(.vinyl-spinning) {
  animation: spin 3s linear infinite;
  animation-play-state: paused;
}

/* Tonearm styles */
.tonearm {
  transform-origin: 85% 8.3%; /* Pivot at (85/100, 10/120) */
  transition: transform 0.4s ease-out;
}

.tonearm-svg {
  filter: drop-shadow(1px 2px 4px rgba(0, 0, 0, 0.5));
}

.stylus-tip {
  filter: drop-shadow(0 0 2px #fbbf24);
}

.stylus-glow {
  animation: glow-pulse 1s ease-in-out infinite;
}
</style>
