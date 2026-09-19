<script setup lang="ts">
//// Imports
import * as icons from "lucide-vue-next";

//// Props
// O banner é a imagem de capa do jogo — a mesma usada como thumbnail no
// card da grade — reaproveitada aqui como a primeira imagem em destaque.
// Os screenshots são as imagens adicionais do jogo, exibidos em galeria
// logo abaixo do banner (estrutura inspirada em páginas de loja como a da
// Steam: banner em destaque no topo → screenshots abaixo). Funciona com
// qualquer quantidade de screenshots: se houver mais do que cabem na
// grade, o último tile mostra "+N" e o lightbox continua navegável por
// todas as imagens (banner incluso).
const props = defineProps<{
  banner?: string;
  screenshots: string[];
  alt: string;
}>();

const MAX_VISIBLE_SHOTS = 4;

const hasBanner = computed(() => !!props.banner);
const visibleShots = computed(() =>
  props.screenshots.slice(0, MAX_VISIBLE_SHOTS),
);
const hiddenShots = computed(() => props.screenshots.slice(MAX_VISIBLE_SHOTS));
const remainingCount = computed(() =>
  Math.max(0, props.screenshots.length - MAX_VISIBLE_SHOTS),
);
const totalImages = computed(
  () => (hasBanner.value ? 1 : 0) + props.screenshots.length,
);

//// Leve tilt 3D no banner ao mover o mouse (só desktop)
const bannerTile = ref<HTMLElement>();

function handleBannerMove(e: MouseEvent) {
  const el = bannerTile.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  el.style.setProperty("--tilt-x", `${(-y * 4).toFixed(2)}deg`);
  el.style.setProperty("--tilt-y", `${(x * 4).toFixed(2)}deg`);
}

function resetBannerTilt() {
  bannerTile.value?.style.setProperty("--tilt-x", "0deg");
  bannerTile.value?.style.setProperty("--tilt-y", "0deg");
}
</script>

<template>
  <ImageViewer :fancybox-options="{}">
    <div class="flex flex-col gap-3">
      <!-- Banner principal (thumbnail do jogo) -->
      <a
        v-if="hasBanner"
        ref="bannerTile"
        :href="banner"
        data-fancybox="gallery"
        class="banner-tile group relative block aspect-video cursor-zoom-in overflow-hidden rounded-2xl border border-border shadow-2xl shadow-black/50 sm:aspect-[16/9] lg:aspect-[16/8]"
        @mousemove="handleBannerMove"
        @mouseleave="resetBannerTilt"
      >
        <img
          :src="banner"
          :alt="alt"
          class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div
          class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <div
          v-if="totalImages > 1"
          class="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur-sm"
        >
          <component :is="icons['Images']" :size="14" />
          {{ totalImages }}
        </div>
      </a>

      <!-- Screenshots -->
      <div
        v-if="screenshots.length"
        class="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        <a
          v-for="(shot, i) in visibleShots"
          :key="i"
          :href="shot"
          data-fancybox="gallery"
          class="group relative block aspect-video cursor-zoom-in overflow-hidden rounded-xl border border-border shadow-md shadow-black/30 transition-transform duration-300 hover:-translate-y-0.5"
        >
          <img
            :src="shot"
            :alt="`${alt} - screenshot ${i + 1}`"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div
            v-if="i === visibleShots.length - 1 && remainingCount > 0"
            class="absolute inset-0 flex items-center justify-center bg-black/70 text-lg font-bold text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-black/60"
          >
            +{{ remainingCount }}
          </div>
        </a>

        <!-- Âncoras invisíveis: mantêm os screenshots além da grade navegáveis no lightbox -->
        <a
          v-for="(shot, i) in hiddenShots"
          :key="`extra-${i}`"
          :href="shot"
          data-fancybox="gallery"
          class="hidden"
        />
      </div>
    </div>
  </ImageViewer>
</template>

<style scoped>
.banner-tile {
  transform: perspective(1200px) rotateX(var(--tilt-x, 0deg))
    rotateY(var(--tilt-y, 0deg));
  transition: transform 0.2s ease-out;
  will-change: transform;
}
</style>
