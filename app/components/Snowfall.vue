<script setup lang="ts">
// Generate random snowflakes with varied properties
const slowAnimations = ['animate-snow-slow-1', 'animate-snow-slow-2', 'animate-snow-slow-3']
const fastAnimations = ['animate-snow-fast-1', 'animate-snow-fast-2', 'animate-snow-fast-3']

// Seeded random for consistent but varied results
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

// Generate large slow snowflakes
const slowSnowflakes = Array.from({ length: 20 }, (_, i) => ({
  id: `slow-${i}`,
  left: `${seededRandom(i * 7 + 3) * 100}%`,
  delay: `${seededRandom(i * 11 + 5) * 12}s`,
  size: `${1.2 + seededRandom(i * 13 + 7) * 1.2}rem`,
  opacity: 0.15 + seededRandom(i * 17 + 9) * 0.25,
  animation: slowAnimations[i % 3],
}))

// Generate small fast snowflakes
const fastSnowflakes = Array.from({ length: 35 }, (_, i) => ({
  id: `fast-${i}`,
  left: `${seededRandom(i * 5 + 2) * 100}%`,
  delay: `${seededRandom(i * 7 + 4) * 8}s`,
  size: `${0.3 + seededRandom(i * 9 + 6) * 0.4}rem`,
  opacity: 0.1 + seededRandom(i * 11 + 8) * 0.2,
  animation: fastAnimations[i % 3],
}))
</script>

<template>
  <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <!-- Large slow snowflakes -->
    <div
      v-for="flake in slowSnowflakes"
      :key="flake.id"
      :class="['absolute text-white', flake.animation]"
      :style="{
        left: flake.left,
        animationDelay: flake.delay,
        fontSize: flake.size,
        opacity: flake.opacity,
      }"
    >❄</div>

    <!-- Small fast snowflakes -->
    <div
      v-for="flake in fastSnowflakes"
      :key="flake.id"
      :class="['absolute text-sky-200', flake.animation]"
      :style="{
        left: flake.left,
        animationDelay: flake.delay,
        fontSize: flake.size,
        opacity: flake.opacity,
      }"
    >•</div>
  </div>
</template>
