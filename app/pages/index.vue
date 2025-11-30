<script setup lang="ts">
const { albums } = useAlbums()
</script>

<template>
  <div class="min-h-screen bg-neutral bg-neutral-pattern relative overflow-hidden">
    <!-- Main Content -->
    <div class="relative z-10 container mx-auto px-6 py-12">
      <!-- Hero Section -->
      <div class="text-center mb-16 animate-fade-in-up pt-8">
        <!-- Logo -->
        <div class="inline-block mb-6">
          <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-2xl shadow-purple-500/20">
            <span class="text-5xl font-bold text-white font-modern">T</span>
          </div>
        </div>

        <!-- Title -->
        <h1 class="text-5xl md:text-7xl font-bold text-tag mb-4">
          TAG
        </h1>

        <!-- Subtitle -->
        <p class="text-zinc-400 text-xl md:text-2xl font-light tracking-wide">
          Groupe musical indépendant
        </p>

        <!-- Album count -->
        <p class="text-zinc-600 text-sm mt-4 uppercase tracking-widest">
          {{ albums.length }} {{ albums.length > 1 ? 'Albums' : 'Album' }}
        </p>
      </div>

      <!-- Divider -->
      <div class="flex items-center justify-center gap-4 mb-12">
        <div class="h-px w-24 bg-gradient-to-r from-transparent to-purple-500/30"></div>
        <div class="w-2 h-2 rounded-full bg-purple-500/50"></div>
        <div class="h-px w-24 bg-gradient-to-l from-transparent to-pink-500/30"></div>
      </div>

      <!-- Albums Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AlbumCard
          v-for="(album, index) in albums"
          :key="album.id"
          :album="album"
          :index="index"
        />
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
