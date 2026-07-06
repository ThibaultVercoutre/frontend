<script setup lang="ts">
interface Props {
  coverSrc: string
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  alt: 'Album cover',
  size: 'lg',
  animated: true,
})

// Size mappings - wrapper includes extra space for vinyl offset
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        wrapper: 'w-52', // 40 + 30% = ~52
        container: 'w-40 h-40',
        vinyl: 'w-40 h-40',
        vinylOffset: 'translate-x-[30%]',
        label: 'w-14 h-14',
      }
    case 'md':
      return {
        wrapper: 'w-72', // 56 + 30% = ~72
        container: 'w-56 h-56',
        vinyl: 'w-56 h-56',
        vinylOffset: 'translate-x-[30%]',
        label: 'w-20 h-20',
      }
    case 'lg':
      return {
        wrapper: 'w-[22rem]', // 72 + 30% = ~94
        container: 'w-72 h-72',
        vinyl: 'w-72 h-72',
        vinylOffset: 'translate-x-[30%]',
        label: 'w-24 h-24',
      }
    case 'xl':
      return {
        wrapper: 'w-[26rem] md:w-[30rem]', // 80/96 + 30%
        container: 'w-80 h-80 md:w-96 md:h-96',
        vinyl: 'w-80 h-80 md:w-96 md:h-96',
        vinylOffset: 'translate-x-[30%]',
        label: 'w-28 h-28 md:w-32 md:h-32',
      }
    default:
      return {
        wrapper: 'w-[22rem]',
        container: 'w-72 h-72',
        vinyl: 'w-72 h-72',
        vinylOffset: 'translate-x-[30%]',
        label: 'w-24 h-24',
      }
  }
})
</script>

<template>
  <!-- Outer wrapper to contain vinyl overflow -->
  <div :class="[sizeClasses.wrapper, 'flex-shrink-0']">
    <div
      class="vinyl-cover-container relative"
      :class="[sizeClasses.container, { 'group': animated }]"
    >
    <!-- Vinyl Record (behind the sleeve) -->
    <div
      class="vinyl-record absolute top-0 right-0 z-0 transition-transform duration-500 ease-out"
      :class="[
        sizeClasses.vinyl,
        sizeClasses.vinylOffset,
        animated ? 'group-hover:translate-x-[50%]' : ''
      ]"
    >
      <!-- Vinyl disc -->
      <div
        class="w-full h-full rounded-full bg-zinc-950 shadow-2xl relative overflow-hidden"
        :class="{ 'group-hover:animate-spin-slow': animated }"
      >
        <!-- Album cover on the entire vinyl (decorative duplicate — hidden from screen readers) -->
        <div class="absolute inset-1 rounded-full overflow-hidden">
          <NuxtImg
            :src="coverSrc"
            alt=""
            aria-hidden="true"
            loading="lazy"
            width="400"
            height="400"
            format="webp"
            quality="80"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Vinyl grooves overlay (subtle lines over the image) -->
        <div class="absolute inset-0 rounded-full">
          <div class="absolute inset-4 rounded-full border border-black/20"/>
          <div class="absolute inset-8 rounded-full border border-black/15"/>
          <div class="absolute inset-12 rounded-full border border-black/20"/>
          <div class="absolute inset-16 rounded-full border border-black/15"/>
          <div class="absolute inset-20 rounded-full border border-black/20"/>
        </div>

        <!-- Vinyl edge (black rim) -->
        <div class="absolute inset-0 rounded-full border-4 border-zinc-900"/>

        <!-- Center label (emerald green) -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div
            class="rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-inner"
            :class="sizeClasses.label"
          >
            <!-- Inner label ring -->
            <div class="w-3/4 h-3/4 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center border border-emerald-400/30">
              <!-- Center hole -->
              <div class="w-2 h-2 rounded-full bg-zinc-900 shadow-inner"/>
            </div>
          </div>
        </div>

        <!-- Vinyl shine/reflection effect -->
        <div class="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-black/20"/>
        <div class="absolute inset-0 rounded-full bg-gradient-to-tl from-white/5 via-transparent to-transparent"/>
      </div>
    </div>

    <!-- Album Sleeve (front) -->
    <div
      class="album-sleeve relative z-10 w-full h-full rounded-lg overflow-hidden shadow-2xl bg-zinc-900"
    >
      <!-- Cover Image -->
      <NuxtImg
        :src="coverSrc"
        :alt="alt"
        width="400"
        height="400"
        format="webp"
        quality="85"
        class="w-full h-full object-cover"
      />

      <!-- Sleeve edge shadow -->
      <div class="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black/30 to-transparent"/>

      <!-- Sleeve worn effect -->
      <div class="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 pointer-events-none"/>
    </div>

    <!-- Sleeve shadow -->
    <div class="absolute -inset-2 rounded-xl bg-black/20 blur-xl -z-10"/>
    </div>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.group-hover\:animate-spin-slow:hover,
.group:hover .group-hover\:animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}

.vinyl-record {
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5));
}
</style>
