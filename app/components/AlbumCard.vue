<script setup lang="ts">
import type { Album } from '~/types'

interface Props {
  album: Album
  index: number
}

const props = defineProps<Props>()

const { getAlbumCover } = useAlbums()

// Theme based on album type
const isFestive = computed(() => props.album.id.includes('noel'))
const isCeltic = computed(() => props.album.id === 'gabrielle')
</script>

<template>
  <NuxtLink
    :to="`/album/${album.id}`"
    class="album-card relative group cursor-pointer block w-fit"
    :style="{ animationDelay: `${index * 100}ms` }"
  >
    <!-- Vinyl Cover Container -->
    <div class="mb-4">
      <VinylCover
        :cover-src="getAlbumCover(album)"
        :alt="album.title"
        size="md"
        :priority="index === 0"
      />
    </div>

    <!-- Album Info (below the vinyl) - constrained to sleeve width -->
    <div class="w-56 px-2">
      <h3
        :class="[
          'text-lg mb-1 transition-colors duration-300 truncate',
          isCeltic ? 'font-medieval text-epic group-hover:text-amber-400' : '',
          isFestive ? 'font-winter text-winter group-hover:text-amber-400' : '',
          !isCeltic && !isFestive ? 'font-bold text-white group-hover:text-purple-400' : ''
        ]"
      >
        {{ album.title }}
      </h3>
      <p :class="['text-sm mb-2 truncate', isFestive ? 'text-sky-300/70' : 'text-zinc-400']">{{ album.subtitle }}</p>

      <!-- Year & Track count -->
      <div class="flex items-center gap-2 text-zinc-500 text-sm mb-2">
        <span>{{ album.year }}</span>
        <span>•</span>
        <span v-if="album.trackCount > 0">
          {{ album.trackCount }} {{ album.trackCount > 1 ? 'pistes' : 'piste' }}
        </span>
        <span v-else class="italic">Bientôt</span>
      </div>

      <!-- Play hint -->
      <div
        :class="[
          'flex items-center gap-1 transition-colors text-xs',
          isCeltic ? 'text-emerald-500/60 group-hover:text-amber-400' : '',
          isFestive ? 'text-sky-400/60 group-hover:text-amber-400' : '',
          !isCeltic && !isFestive ? 'text-zinc-500 group-hover:text-purple-400' : ''
        ]"
      >
        <span class="uppercase tracking-wider">Écouter</span>
        <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  </NuxtLink>
</template>
