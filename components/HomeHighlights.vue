<script setup lang="ts">
//// Imports
import type { Game } from "~/types/game";

// Faixa de destaques secundários da home — cada tile tem um "porquê"
// diferente do Hero/"Em destaque" (que já cobrem o jogo mais relevante no
// geral). Os rótulos ("Mais recente", "Disponível agora", "Em
// desenvolvimento") vêm de um dado REAL de cada jogo (id, presença de
// links, tipo) — nunca texto inventado. Quem monta a página (pages/index.vue)
// já decide QUAIS jogos entram aqui e com qual rótulo; este componente só
// exibe o que recebe, então cresce/encolhe sozinho: com poucos jogos pode
// mostrar só 1 tile, com o catálogo maior pode chegar a 3 — nunca mais que
// isso (o resto mora na seção "Nossos jogos" abaixo).
const props = defineProps<{
  items: { key: string; game: Game }[];
}>();

const { t } = useI18n();
const { localize } = useLocalizedText();

const labelKeys: Record<string, string> = {
  recent: "home.highlights.recent",
  available: "home.highlights.available",
  inDev: "home.highlights.inDev",
};

// Mesma regra de Card.vue: jogos "coming_soon" têm página própria; os
// outros tipos usam o GameModal reutilizável.
function hasOwnPage(game: Game): boolean {
  return game.type.slug === "coming_soon";
}
function gameHref(game: Game): string {
  return hasOwnPage(game)
    ? `/game/${stableText(game.name).toLowerCase().replace(/\s+/g, "-")}`
    : "";
}

// Um único modal compartilhado pelos tiles (só um pode estar aberto por
// vez) — evita instanciar N GameModal em paralelo pra N tiles. `activeGame`
// só é ATRIBUÍDO ao clicar (nunca voltar a `null` ao fechar) e `modalOpen`
// controla só a visibilidade — mesmo padrão de `v-model:open` do
// Card.vue/HomeHero.vue, necessário aqui pra deixar a transição de
// fechamento do GameModal (definida dentro dele mesmo) tocar normalmente,
// em vez do modal desmontar abruptamente no meio da animação.
const activeGame = ref<Game | null>(null);
const modalOpen = ref(false);
function handleClick(game: Game, e: Event) {
  if (!hasOwnPage(game)) {
    e.preventDefault();
    activeGame.value = game;
    modalOpen.value = true;
  }
}
</script>

<template>
  <!-- Nenhum tile aqui usa `vh`/`100vh` (nem em qualquer breakpoint): a
       altura vem de `aspect-*` (proporção fixa em relação à LARGURA, que já
       é limitada pelo grid) + padding do próprio conteúdo — nunca da altura
       da viewport. `aspect-[21/9]` (mais "baixo"/panorâmico que os
       16/10 de antes) reduz a altura da imagem sem tirar o destaque dela. -->
  <section v-if="items.length" class="mt-12 sm:mt-16 lg:mt-20">
    <div
      class="grid grid-cols-1 gap-4 sm:gap-5"
      :class="[
        items.length >= 2 ? 'sm:grid-cols-2' : '',
        items.length === 3 ? 'lg:grid-cols-3' : '',
      ]"
    >
      <NuxtLink
        v-for="item in items"
        :key="item.key"
        :to="gameHref(item.game)"
        class="group relative block aspect-[21/9] overflow-hidden rounded-panel border border-border-subtle shadow-lg shadow-black/20 transition-transform duration-300 hover:-translate-y-1"
        @click="handleClick(item.game, $event)"
      >
        <img
          :src="item.game.thumbnail"
          :alt="localize(item.game.name)"
          class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
        />
        <div class="absolute inset-0 flex flex-col justify-end gap-1 p-4 sm:p-5">
          <span class="eyebrow text-accent">{{ t(labelKeys[item.key]) }}</span>
          <h3 class="font-display text-lg font-bold text-white sm:text-xl">
            {{ localize(item.game.name) }}
          </h3>
        </div>
      </NuxtLink>
    </div>

    <GameModal v-if="activeGame" :game="activeGame" v-model:open="modalOpen" />
  </section>
</template>
