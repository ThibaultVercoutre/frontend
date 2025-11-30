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
    class="album-card relative rounded-2xl overflow-hidden group cursor-pointer block aspect-square"
    :style="{ animationDelay: `${index * 100}ms` }"
  >
    <!-- Album Cover Background -->
    <div class="absolute inset-0">
      <img
        :src="getAlbumCover(album)"
        :alt="album.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        @error="($event.target as HTMLImageElement).src = '/albums/default.jpeg'"
      />
      <!-- Overlay gradient -->
      <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
    </div>

    <!-- Type Badge -->
    <div class="absolute top-4 right-4 z-10">
      <span :class="['px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm', getAlbumTypeColor(album.type)]">
        {{ getAlbumTypeIcon(album.type) }} {{ album.type }}
      </span>
    </div>

    <!-- Year Badge -->
    <div class="absolute top-4 left-4 z-10">
      <span class="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-900/70 text-zinc-300 backdrop-blur-sm">
        {{ album.year }}
      </span>
    </div>

    <!-- Album Info -->
    <div class="absolute bottom-0 left-0 right-0 p-6 z-10">
      <h3
        :class="[
          'text-2xl mb-1 transition-colors duration-300',
          isCeltic ? 'font-medieval text-epic group-hover:text-amber-400' : '',
          isFestive ? 'font-bold text-festive group-hover:text-yellow-400' : '',
          !isCeltic && !isFestive ? 'font-bold text-white group-hover:text-purple-400' : ''
        ]"
      >
        {{ album.title }}
      </h3>
      <p class="text-zinc-400 text-sm mb-3">{{ album.subtitle }}</p>

      <!-- Track count -->
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
            'flex items-center gap-2 transition-colors',
            isCeltic ? 'text-emerald-500/60 group-hover:text-amber-400' : '',
            isFestive ? 'text-red-400/60 group-hover:text-yellow-400' : '',
            !isCeltic && !isFestive ? 'text-zinc-500 group-hover:text-purple-400' : ''
          ]"
        >
          <span class="text-xs uppercase tracking-wider">Découvrir</span>
          <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Hover glow effect -->
    <div
      :class="[
        'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none',
        isCeltic ? 'bg-gradient-to-t from-amber-500/10 via-transparent to-transparent' : '',
        isFestive ? 'bg-gradient-to-t from-red-500/10 via-transparent to-transparent' : '',
        !isCeltic && !isFestive ? 'bg-gradient-to-t from-purple-500/10 via-transparent to-transparent' : ''
      ]"
    ></div>
  </NuxtLink>
</template>
