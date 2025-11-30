<script setup lang="ts">
const route = useRoute()
const { getAlbumById, getAlbumCover, getAlbumTypeColor, getAlbumTypeIcon } = useAlbums()
const { getTracksByAlbum } = useTracks()

const albumId = computed(() => route.params.id as string)
const album = computed(() => getAlbumById(albumId.value))
const tracks = computed(() => getTracksByAlbum(albumId.value))

// Theme detection
const isFestive = computed(() => albumId.value.includes('noel'))
const isCeltic = computed(() => albumId.value === 'gabrielle')
</script>

<template>
  <!-- Celtic Theme (Gabrielle) -->
  <div v-if="isCeltic" class="min-h-screen bg-pattern relative overflow-hidden">
    <!-- Celtic Border Frieze -->
    <div class="celtic-border celtic-border-top"></div>
    <div class="celtic-border celtic-border-bottom"></div>
    <div class="celtic-border celtic-border-left"></div>
    <div class="celtic-border celtic-border-right"></div>

    <!-- Floating Decorations -->
    <ClientOnly>
      <HomeDecorations />
    </ClientOnly>

    <!-- Back Button -->
    <div class="absolute top-6 left-6 z-20">
      <BackButton label="Albums" />
    </div>

    <!-- Main Content -->
    <div class="relative z-10 container mx-auto px-6 py-12">
      <!-- Album Header -->
      <div class="flex flex-col md:flex-row items-center gap-8 mb-12 pt-8">
        <!-- Album Cover -->
        <div class="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0">
          <img
            :src="getAlbumCover(album)"
            :alt="album?.title"
            class="w-full h-full object-cover rounded-2xl shadow-2xl"
          />
          <div class="absolute -inset-4 rounded-3xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 blur-2xl -z-10"></div>
        </div>

        <!-- Album Info -->
        <div class="text-center md:text-left">
          <span
            v-if="album"
            :class="['inline-block px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wider mb-4', getAlbumTypeColor(album.type)]"
          >
            {{ getAlbumTypeIcon(album.type) }} {{ album.type }}
          </span>

          <h1 class="text-4xl md:text-6xl font-medieval text-epic mb-2">
            {{ album?.title }}
          </h1>
          <p class="text-emerald-400/70 text-xl mb-4">{{ album?.subtitle }}</p>

          <div class="flex items-center justify-center md:justify-start gap-4 text-emerald-500/60">
            <span>{{ album?.year }}</span>
            <span>•</span>
            <span>{{ tracks.length }} {{ tracks.length > 1 ? 'pistes' : 'piste' }}</span>
          </div>
        </div>
      </div>

      <HomeDivider />

      <!-- Tracks List -->
      <div v-if="tracks.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <TrackCard
          v-for="(track, index) in tracks"
          :key="track.id"
          :track="track"
          :index="index"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-20">
        <svg class="w-24 h-24 mx-auto text-emerald-700/30 mb-6" viewBox="0 0 100 120" fill="currentColor">
          <path d="M50 5 L95 20 L95 60 Q95 100 50 115 Q5 100 5 60 L5 20 Z" />
        </svg>
        <p class="text-emerald-500/50 text-xl">Bientôt disponible...</p>
        <p class="text-emerald-600/30 text-sm mt-2">Les pistes de cet album arrivent prochainement</p>
      </div>

      <HomeFooter />
    </div>
  </div>

  <!-- Festive Theme (Noel) -->
  <div v-else-if="isFestive" class="min-h-screen bg-festive bg-festive-pattern relative overflow-hidden">
    <!-- Snowflakes -->
    <ClientOnly>
      <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div v-for="i in 20" :key="i" class="absolute text-white/20 animate-snowfall" :style="{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${8 + Math.random() * 6}s`
        }">❄</div>
      </div>
    </ClientOnly>

    <!-- Back Button -->
    <div class="absolute top-6 left-6 z-20">
      <BackButton label="Albums" />
    </div>

    <!-- Main Content -->
    <div class="relative z-10 container mx-auto px-6 py-12">
      <!-- Album Header -->
      <div class="flex flex-col md:flex-row items-center gap-8 mb-12 pt-8">
        <!-- Album Cover -->
        <div class="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0">
          <img
            :src="getAlbumCover(album)"
            :alt="album?.title"
            class="w-full h-full object-cover rounded-2xl shadow-2xl"
            @error="($event.target as HTMLImageElement).src = '/albums/default.jpeg'"
          />
          <div class="absolute -inset-4 rounded-3xl bg-gradient-to-br from-red-500/20 to-green-500/20 blur-2xl -z-10"></div>
        </div>

        <!-- Album Info -->
        <div class="text-center md:text-left">
          <span
            v-if="album"
            :class="['inline-block px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wider mb-4', getAlbumTypeColor(album.type)]"
          >
            {{ getAlbumTypeIcon(album.type) }} {{ album.type }}
          </span>

          <h1 class="text-4xl md:text-6xl font-bold text-festive mb-2">
            {{ album?.title }}
          </h1>
          <p class="text-red-400/70 text-xl mb-4">{{ album?.subtitle }}</p>

          <div class="flex items-center justify-center md:justify-start gap-4 text-red-500/60">
            <span>{{ album?.year }}</span>
            <span>•</span>
            <span>{{ tracks.length }} {{ tracks.length > 1 ? 'pistes' : 'piste' }}</span>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="flex items-center justify-center gap-4 mb-12">
        <div class="h-px w-24 bg-gradient-to-r from-transparent to-red-500/30"></div>
        <span class="text-2xl">🎄</span>
        <div class="h-px w-24 bg-gradient-to-l from-transparent to-green-500/30"></div>
      </div>

      <!-- Tracks List -->
      <div v-if="tracks.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <TrackCard
          v-for="(track, index) in tracks"
          :key="track.id"
          :track="track"
          :index="index"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-20">
        <span class="text-6xl mb-6 block">🎁</span>
        <p class="text-red-400/50 text-xl">Bientôt disponible...</p>
        <p class="text-red-500/30 text-sm mt-2">Les chants de Noël arrivent prochainement</p>
      </div>

      <!-- Footer -->
      <footer class="mt-20 text-center py-8 border-t border-red-800/30">
        <div class="flex items-center justify-center gap-2 text-red-600/40 text-sm">
          <span>🎄</span>
          <span>TAG &copy; {{ new Date().getFullYear() }}</span>
          <span>🎄</span>
        </div>
      </footer>
    </div>
  </div>

  <!-- Default Theme (fallback) -->
  <div v-else class="min-h-screen bg-neutral bg-neutral-pattern relative overflow-hidden">
    <!-- Back Button -->
    <div class="absolute top-6 left-6 z-20">
      <BackButton label="Albums" />
    </div>

    <!-- Main Content -->
    <div class="relative z-10 container mx-auto px-6 py-12">
      <!-- Album Header -->
      <div class="flex flex-col md:flex-row items-center gap-8 mb-12 pt-8">
        <div class="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0">
          <img
            :src="getAlbumCover(album)"
            :alt="album?.title"
            class="w-full h-full object-cover rounded-2xl shadow-2xl"
          />
          <div class="absolute -inset-4 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-2xl -z-10"></div>
        </div>

        <div class="text-center md:text-left">
          <span
            v-if="album"
            :class="['inline-block px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wider mb-4', getAlbumTypeColor(album.type)]"
          >
            {{ getAlbumTypeIcon(album.type) }} {{ album.type }}
          </span>

          <h1 class="text-4xl md:text-6xl font-bold text-tag mb-2">
            {{ album?.title }}
          </h1>
          <p class="text-zinc-400 text-xl mb-4">{{ album?.subtitle }}</p>

          <div class="flex items-center justify-center md:justify-start gap-4 text-zinc-500">
            <span>{{ album?.year }}</span>
            <span>•</span>
            <span>{{ tracks.length }} {{ tracks.length > 1 ? 'pistes' : 'piste' }}</span>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="flex items-center justify-center gap-4 mb-12">
        <div class="h-px w-24 bg-gradient-to-r from-transparent to-purple-500/30"></div>
        <div class="w-2 h-2 rounded-full bg-purple-500/50"></div>
        <div class="h-px w-24 bg-gradient-to-l from-transparent to-pink-500/30"></div>
      </div>

      <!-- Tracks List -->
      <div v-if="tracks.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <TrackCard
          v-for="(track, index) in tracks"
          :key="track.id"
          :track="track"
          :index="index"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-20">
        <div class="w-24 h-24 mx-auto rounded-2xl bg-zinc-800 flex items-center justify-center mb-6">
          <span class="text-4xl">🎵</span>
        </div>
        <p class="text-zinc-400 text-xl">Bientôt disponible...</p>
        <p class="text-zinc-600 text-sm mt-2">Les pistes arrivent prochainement</p>
      </div>

      <!-- Footer -->
      <footer class="mt-20 text-center py-8 border-t border-zinc-800">
        <div class="flex items-center justify-center gap-2 text-zinc-600 text-sm">
          <div class="w-6 h-6 rounded bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
            <span class="text-xs font-bold text-white">T</span>
          </div>
          <span>TAG &copy; {{ new Date().getFullYear() }}</span>
        </div>
      </footer>
    </div>
  </div>
</template>
