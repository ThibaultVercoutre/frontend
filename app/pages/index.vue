<script setup lang="ts">
const { tracks } = useTracks()
</script>

<template>
  <div class="min-h-screen bg-pattern relative overflow-hidden">
    <!-- Celtic Border Frieze -->
    <div class="celtic-border celtic-border-top"></div>
    <div class="celtic-border celtic-border-bottom"></div>
    <div class="celtic-border celtic-border-left"></div>
    <div class="celtic-border celtic-border-right"></div>

    <!-- Floating Decorations -->
    <ClientOnly>
      <HomeDecorations />
    </ClientOnly>

    <!-- Main Content -->
    <div class="relative z-10 container mx-auto px-6 py-12">
      <!-- Hero Section -->
      <HomeHero :track-count="tracks.length" />

      <!-- Decorative Divider -->
      <HomeDivider />

      <!-- Track Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <TrackCard
          v-for="(track, index) in tracks"
          :key="track.id"
          :track="track"
          :index="index"
        />
      </div>

      <!-- Footer -->
      <HomeFooter />
    </div>
  </div>
</template>
