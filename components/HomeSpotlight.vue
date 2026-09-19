<script setup lang="ts">
//// Imports
import type { Game } from "~/types/game";

// Seção editorial "Em destaque" da home (`/`) — separada do Hero de
// propósito: o Hero é a apresentação rápida (identidade + CTA), esta seção é
// um mergulho maior no jogo mais relevante no momento (mesma heurística do
// Hero, ver getFeaturedGame em utils/games.ts), com galeria, descrição
// completa e todas as tags. Só existe quando há um jogo em destaque.
const props = defineProps<{
  game: Game;
}>();

const { t } = useI18n();

const hasOwnPage = computed(() => props.game.type.name === "coming_soon");
const gameHref = computed(() =>
  hasOwnPage.value
    ? `/game/${props.game.name.toLowerCase().replace(/\s+/g, "-")}`
    : undefined,
);

const modalOpen = ref(false);
function handleClick(e: Event) {
  if (!hasOwnPage.value) {
    e.preventDefault();
    modalOpen.value = true;
  }
}
</script>

<template>
  <section class="mt-16 sm:mt-24 lg:mt-28">
    <div v-reveal class="mb-8 sm:mb-10">
      <span class="eyebrow text-accent">{{ t("home.spotlight.eyebrow") }}</span>
      <h2
        class="mt-2 font-display text-3xl font-bold tracking-tight text-content-primary sm:text-4xl"
      >
        {{ t("home.spotlight.title") }}
      </h2>
    </div>

    <div
      v-reveal
      class="grid grid-cols-1 gap-8 rounded-panel border border-border-subtle bg-surface-panel p-6 sm:p-8 lg:grid-cols-5 lg:gap-10 lg:p-10"
    >
      <div class="lg:col-span-3">
        <GameGallery
          :banner="game.thumbnail"
          :screenshots="game.screenshots"
          :alt="game.name"
        />
      </div>

      <div class="flex flex-col gap-5 lg:col-span-2">
        <div class="flex flex-wrap items-center gap-2.5">
          <Tag
            :name="game.type.name"
            :color="game.type.color"
            kind="types"
            variant="outlined"
            size="lg"
          />
          <Tag
            v-for="tag in game.tags"
            :key="tag.name"
            :name="tag.name"
            :color="tag.color"
            :icon="tag.icon"
            kind="tags"
          />
        </div>

        <h3 class="font-display text-2xl font-bold text-content-primary sm:text-3xl">
          {{ game.name }}
        </h3>

        <p class="whitespace-pre-line leading-relaxed text-content-secondary">
          {{ game.description }}
        </p>

        <AppButton
          :to="gameHref"
          class="mt-auto"
          icon="ArrowRight"
          @click="handleClick"
        >
          {{ t("home.spotlight.cta") }}
        </AppButton>
      </div>
    </div>

    <GameModal :game="game" v-model:open="modalOpen" />
  </section>
</template>
