<script setup lang="ts">
interface Props {
  isSpinning?: boolean
  coverSrc?: string
  size?: 'sm' | 'md' | 'lg'
  showPlayButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSpinning: false,
  coverSrc: '/vynile/Parangon_dune_soldate.jpeg',
  size: 'lg',
  showPlayButton: true,
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
</script>

<template>
  <div
    class="vinyl-record relative rounded-full"
    :class="[sizeClasses, { 'vinyl-spinning': isSpinning }]"
    @click="emit('click')"
  >
    <!-- Vinyl Disc with Album Art -->
    <div class="absolute inset-0 rounded-full shadow-2xl overflow-hidden">
      <!-- Album Art as full background -->
      <img
        :src="coverSrc"
        alt="Album art"
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
          class="rounded-full bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 flex items-center justify-center shadow-inner border border-emerald-700/50 relative"
          :class="[labelSizeClasses, size === 'lg' ? 'border-3' : 'border']"
        >
          <!-- Label Design -->
          <div class="text-center">
            <svg :class="['mx-auto text-amber-500 mb-0.5', iconSizeClasses]" viewBox="0 0 100 120" fill="currentColor">
              <path d="M50 5 L95 20 L95 60 Q95 100 50 115 Q5 100 5 60 L5 20 Z" />
            </svg>
            <p v-if="size === 'lg'" class="text-emerald-300 text-[10px] font-bold tracking-wider">GABRIELLE</p>
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
</style>
