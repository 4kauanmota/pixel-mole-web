<script setup lang="ts">
//// Imports
import * as icons from "lucide-vue-next";
import { LINK_PLATFORMS } from "@/data/games";
import type { GameLink } from "~/types/game";

//// Props
const props = defineProps<{
  link: GameLink;
}>();

//// Platform config (falls back gracefully for unmapped slugs)
const config = computed(() => LINK_PLATFORMS[props.link.platform]);
const color = computed(() => config.value?.color || "#3a3a3c");
const label = computed(
  () => props.link.label || config.value?.label || toLabel(props.link.platform),
);

// Plataformas "genéricas" (sem logo de marca, ex: site/e-mail) já indicam
// qual ícone do lucide usar. Para as demais, tentamos carregar o ícone de
// marca oficial via simple-icons e só usamos o ícone genérico se a imagem
// falhar (plataforma não encontrada no simple-icons).
const imageFailed = ref(false);
const isGeneric = computed(() => !!config.value?.icon);
const showFallbackIcon = computed(() => isGeneric.value || imageFailed.value);
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
    <!-- Ícone de marca (simple-icons): crossfade branco -> escuro no hover -->
    <template v-if="!showFallbackIcon">
      <img
        :src="`https://cdn.simpleicons.org/${link.platform}/ffffff`"
        :alt="label"
        class="absolute h-5 w-5 opacity-100 transition-opacity duration-300 ease-out group-hover/link:opacity-0"
        draggable="false"
        @error="imageFailed = true"
      />
      <img
        :src="`https://cdn.simpleicons.org/${link.platform}/272528`"
        alt=""
        aria-hidden="true"
        class="absolute h-5 w-5 opacity-0 transition-opacity duration-300 ease-out group-hover/link:opacity-100"
        draggable="false"
      />
    </template>

    <!-- Ícone genérico (lucide): só muda a cor no hover -->
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
