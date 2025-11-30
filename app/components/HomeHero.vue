<script setup lang="ts">
interface Props {
  albumCount: number
}

defineProps<Props>()
</script>

<template>
  <div class="text-center mb-16 animate-fade-in-up">
    <!-- Shield Icon -->
    <div class="inline-block mb-6">
      <svg class="w-20 h-24 text-amber-600 drop-shadow-lg" viewBox="0 0 100 120" fill="currentColor">
        <path d="M50 5 L95 20 L95 60 Q95 100 50 115 Q5 100 5 60 L5 20 Z" />
        <!-- Inner design -->
        <path d="M50 20 L75 30 L75 55 Q75 85 50 95 Q25 85 25 55 L25 30 Z" fill="currentColor" opacity="0.3" />
        <text x="50" y="65" text-anchor="middle" class="text-2xl font-bold fill-emerald-950">T</text>
      </svg>
    </div>

    <!-- Title -->
    <h1 class="text-5xl md:text-7xl font-medieval text-epic mb-4">
      TAG
    </h1>

    <!-- Subtitle -->
    <p class="text-emerald-400/70 text-xl md:text-2xl font-light tracking-wide">
      Chants de Guerre & Légendes
    </p>

    <!-- Album count -->
    <p class="text-emerald-600/50 text-sm mt-4 uppercase tracking-widest">
      {{ albumCount }} {{ albumCount > 1 ? 'Albums' : 'Album' }}
    </p>
  </div>
</template>
