<script setup lang="ts">
import type { Album } from '~/types'

interface Props {
  album: Album
  index: number
}

const props = defineProps<Props>()

const { getAlbumTypeColor, getAlbumTypeIcon, getAlbumCover } = useAlbums()

// Theme based on album type
const isFestive = computed(() => props.album.id.includes('noel'))
const isCeltic = computed(() => props.album.id === 'gabrielle')
</script>

<template>
  <NuxtLink
    :to="`/album/${album.id}`"
    class="album-card relative group cursor-pointer block"
    :style="{ animationDelay: `${index * 100}ms` }"
  >
    <!-- Vinyl Cover Container -->
    <div class="relative mb-4">
      <VinylCover
        :cover-src="getAlbumCover(album)"
        :alt="album.title"
        size="md"
      />

      <!-- Type Badge -->
      <div class="absolute top-3 right-3 z-20">
        <span :class="['px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm', getAlbumTypeColor(album.type)]">
          {{ getAlbumTypeIcon(album.type) }}
        </span>
      </div>

      <!-- Year Badge -->
      <div class="absolute top-3 left-3 z-20">
        <span class="px-2 py-1 rounded-full text-xs font-semibold bg-zinc-900/70 text-zinc-300 backdrop-blur-sm">
          {{ album.year }}
        </span>
      </div>
    </div>

    <!-- Album Info (below the vinyl) -->
    <div class="px-2">
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

      <!-- Track count & Play hint -->
      <div class="flex items-center justify-between">
        <span class="text-zinc-500 text-sm">
          <template v-if="album.trackCount > 0">
            {{ album.trackCount }} {{ album.trackCount > 1 ? 'pistes' : 'piste' }}
          </template>
          <template v-else>
            <span class="italic">Bientôt</span>
          </template>
        </span>

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
    </div>
  </NuxtLink>
</template>
