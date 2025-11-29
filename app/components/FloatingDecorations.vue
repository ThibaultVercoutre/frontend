<script setup lang="ts">
// Simple floating decorations for track pages
</script>

<template>
  <ClientOnly>
    <!-- Sword -->
    <div class="fixed top-20 right-10 animate-float opacity-10 pointer-events-none">
      <svg class="w-16 h-32 text-amber-600" viewBox="0 0 50 120" fill="currentColor">
        <path d="M25 0 L28 80 L35 85 L35 90 L28 88 L28 110 L32 115 L32 120 L18 120 L18 115 L22 110 L22 88 L15 90 L15 85 L22 80 Z" />
      </svg>
    </div>
    <!-- Shield -->
    <div class="fixed bottom-40 left-10 animate-swing opacity-10 pointer-events-none">
      <svg class="w-20 h-24 text-emerald-700" viewBox="0 0 100 120" fill="currentColor">
        <path d="M50 5 L95 20 L95 60 Q95 100 50 115 Q5 100 5 60 L5 20 Z" />
      </svg>
    </div>
  </ClientOnly>
</template>
