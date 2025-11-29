<script setup lang="ts">
// Floating decorative elements for the home page
// Triskell path from user's SVG
const triskellPath = "M 302.006 20.998 c 71.726 -7.26 134.733 40.484 140.982 106.986 c 4.546 48.375 -18.553 86.059 -52.993 102.987 c -37.139 18.255 -77.43 6.8 -96.988 -13.999 c -31.249 -33.231 -15.92 -96.87 27.997 -92.988 c 7.261 0.642 24.237 6.716 21.997 22.997 c -1.781 12.944 -18.06 5.356 -19.997 18.998 c -1.818 12.794 10.758 21.715 20.997 22.997 c 21.091 2.639 33.709 -10.689 39.995 -21.998 c 20.604 -37.064 -8.478 -77.328 -39.995 -88.989 c -63.613 -23.534 -125.618 33.88 -120.985 102.987 c 3.494 52.117 36.388 86.55 78.99 102.987 c 23.792 9.18 52.211 11.99 78.99 6 c 24.613 -5.507 47.526 -15.888 74.991 -15.998 c 52.459 -0.21 86.603 18.219 111.985 40.995 c 30.594 27.45 56.235 69.701 51.994 127.983 c -3.933 54.025 -40.122 96.892 -83.99 113.986 c -74.454 29.014 -153.154 -18.427 -153.98 -91.989 c -0.596 -53.047 45.952 -99.658 97.987 -80.989 c 16.781 6.021 30.724 21.791 33.996 36.995 c 7.403 34.389 -22.818 49.9 -35.995 39.995 c -10.94 -8.225 3.47 -17.445 -5 -26.997 c -13.483 -15.207 -37.79 4.833 -38.995 25.997 c -1.527 26.854 20.624 43.878 33.996 48.994 c 27.281 10.438 53.606 -1.534 67.991 -12.999 c 15.935 -12.699 29.044 -34.541 30.996 -57.992 c 3.021 -36.269 -13.877 -64.904 -32.995 -81.99 c -20.825 -18.609 -47.512 -30.752 -85.989 -27.996 c -56.749 4.065 -96.253 45.565 -110.986 88.989 c -9.774 28.808 -12.047 51.66 -24.997 74.99 c -32.222 58.047 -110.723 112.233 -200.975 74.99 c -40.103 -16.548 -81.583 -55.782 -85.989 -112.985 c -4.479 -58.141 26.205 -102.745 64.992 -120.985 c 52.439 -24.66 105.46 -1.162 125.984 32.996 c 15.6 25.962 13.89 70.233 -8.999 91.988 c -17.306 16.448 -43.748 19.243 -60.992 9.999 c -19.665 -10.542 -23.781 -43.602 -6 -47.994 c 14.014 -3.461 10.988 10.783 23.997 8.999 c 21.731 -2.981 13.192 -40.494 -7.999 -49.994 c -38.486 -17.252 -73.924 18.962 -77.99 50.994 c -4.444 35.013 13.425 59.872 30.996 73.99 c 14.575 11.712 35.922 22.326 61.992 21.998 c 62.56 -0.788 114.729 -55.287 108.986 -130.984 c -3.467 -45.701 -28.243 -70.237 -57.993 -99.987 c -25.589 -25.588 -48.443 -59.359 -51.994 -104.987 c -4.002 -51.436 12.238 -88.87 33.996 -115.985 C 225.232 47.554 259.917 25.257 302.006 20.998 Z"
</script>

<template>
  <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <!-- Triskell top-left (spinning) -->
    <div class="absolute top-20 left-10 animate-float opacity-10" style="animation-delay: 0s">
      <svg class="w-24 h-24 text-amber-600 triskell-spin" viewBox="0 0 650 650" fill="currentColor">
        <path :d="triskellPath" />
      </svg>
    </div>

    <!-- Triskell top-right (spinning reverse) -->
    <div class="absolute top-40 right-20 animate-float opacity-10" style="animation-delay: 2s">
      <svg class="w-20 h-20 text-emerald-500 triskell-spin-reverse" viewBox="0 0 650 650" fill="currentColor">
        <path :d="triskellPath" />
      </svg>
    </div>

    <!-- Triskell bottom-left (spinning) -->
    <div class="absolute bottom-40 left-1/4 animate-float opacity-10" style="animation-delay: 4s">
      <svg class="w-28 h-28 text-amber-600 triskell-spin" viewBox="0 0 650 650" fill="currentColor">
        <path :d="triskellPath" />
      </svg>
    </div>

    <!-- Triskell bottom-right (spinning reverse) -->
    <div class="absolute bottom-60 right-1/3 animate-float-reverse opacity-10" style="animation-delay: 1s">
      <svg class="w-16 h-16 text-emerald-500 triskell-spin-reverse" viewBox="0 0 650 650" fill="currentColor">
        <path :d="triskellPath" />
      </svg>
    </div>

    <!-- Sword top-right -->
    <div class="absolute top-1/3 right-10 animate-float opacity-5" style="animation-delay: 1s">
      <svg class="w-12 h-32 text-zinc-400" viewBox="0 0 50 120" fill="currentColor">
        <path d="M25 0 L28 80 L35 85 L35 90 L28 88 L28 110 L32 115 L32 120 L18 120 L18 115 L22 110 L22 88 L15 90 L15 85 L22 80 Z" />
      </svg>
    </div>

    <!-- Sword bottom-left -->
    <div class="absolute bottom-1/3 left-16 animate-float opacity-5" style="animation-delay: 3s">
      <svg class="w-12 h-32 text-zinc-400" viewBox="0 0 50 120" fill="currentColor">
        <path d="M25 0 L28 80 L35 85 L35 90 L28 88 L28 110 L32 115 L32 120 L18 120 L18 115 L22 110 L22 88 L15 90 L15 85 L22 80 Z" />
      </svg>
    </div>

    <!-- Shield center-left -->
    <div class="absolute top-1/2 left-20 animate-swing opacity-5" style="animation-delay: 2.5s">
      <svg class="w-16 h-20 text-emerald-700" viewBox="0 0 100 120" fill="currentColor">
        <path d="M50 5 L95 20 L95 60 Q95 100 50 115 Q5 100 5 60 L5 20 Z" />
      </svg>
    </div>

    <!-- Shield bottom-right -->
    <div class="absolute bottom-20 right-1/4 animate-swing opacity-5" style="animation-delay: 1.5s">
      <svg class="w-16 h-20 text-emerald-700" viewBox="0 0 100 120" fill="currentColor">
        <path d="M50 5 L95 20 L95 60 Q95 100 50 115 Q5 100 5 60 L5 20 Z" />
      </svg>
    </div>
  </div>
</template>
