<script setup lang="ts">
//// Imports
import * as icons from "lucide-vue-next";
import { LINK_PLATFORMS } from "@/data/games";
import { BRAND_ICONS } from "@/data/brandIcons";
import type { GameLink } from "~/types/game";

//// Props
const props = defineProps<{
  link: GameLink;
}>();

//// Platform key: `platform` é a fonte da verdade (fica exatamente como
// gravado no Supabase, ex.: "linkedin", "itch.io") — a URL nunca é
// inspecionada pra decidir o ícone, só é usada como destino do link (href).
const platformKey = computed(() => props.link.platform);

//// Platform config (falls back gracefully for unmapped slugs)
const config = computed(() => LINK_PLATFORMS[platformKey.value]);
const color = computed(() => config.value?.color || "#3a3a3c");
const label = computed(
  () => props.link.label || config.value?.label || toLabel(platformKey.value),
);

// Ícone de marca (SVG embutido localmente, sem depender de nenhum CDN
// externo — ver data/brandIcons.ts). Prioridade: marca específica > ícone
// genérico configurado em LINK_PLATFORMS (ex.: e-mail, site) > fallback
// genérico (Link2). Nunca cai pro fallback quando existe um ícone
// específico pra essa plataforma.
const brandIconPath = computed(() => BRAND_ICONS[platformKey.value]);
const hasBrandIcon = computed(() => !!brandIconPath.value);
const fallbackIconName = computed(() => config.value?.icon || "Link2");

function getIcon(name: string): any {
  return icons[name as keyof typeof icons];
}
</script>

<template>
  <a
    :href="link.url"
    target="_blank"
    rel="noopener noreferrer"
    class="link-badge group/link relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-110 active:scale-95"
    :style="{ '--badge-color': color }"
  >
    <!-- Ícone de marca: mesmo tratamento de cor (branco -> escuro no hover)
         do ícone genérico abaixo, só que com o path SVG oficial da
         plataforma em vez de um ícone do lucide. -->
    <svg
      v-if="hasBrandIcon"
      viewBox="0 0 24 24"
      class="h-5 w-5 fill-current text-white transition-colors duration-300 ease-out group-hover/link:text-pm-dark"
      aria-hidden="true"
    >
      <path :d="brandIconPath" />
    </svg>

    <!-- Ícone genérico (lucide): usado pra plataformas sem ícone de marca
         (ex.: site/e-mail) ou realmente desconhecidas. -->
    <component
      :is="getIcon(fallbackIconName)"
      v-else
      :size="20"
      class="text-white transition-colors duration-300 ease-out group-hover/link:text-pm-dark"
    />

    <span
      class="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-pm-gray bg-pm-black px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover/link:opacity-100"
    >
      {{ label }}
    </span>
  </a>
</template>

<style scoped>
.link-badge {
  background-color: var(--badge-color);
  transition:
    background-color 0.3s ease-out,
    transform 0.3s ease-out;
}

.link-badge:hover {
  background-color: var(--pm-yellow);
}
</style>
