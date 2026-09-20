<script setup lang="ts">
//// Imports
import type { Game } from "~/types/game";

// Prévia de "Nossos jogos" na home (`/`) — reaproveita o MESMO Card/
// CardContainer da listagem completa (/games), sem nenhuma variação de
// comportamento (mesmo hover, mesma navegação/modal). Quem monta a página já
// entrega a lista já limitada/ordenada (ver pages/index.vue) — este
// componente só exibe o que recebe, então escala sozinho conforme o
// catálogo cresce.
defineProps<{
  games: Game[];
}>();

const { t } = useI18n();
</script>

<template>
  <section class="mt-12 sm:mt-16 lg:mt-20">
    <div
      v-reveal
      class="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8"
    >
      <div>
        <span class="eyebrow text-accent">{{ t("home.games.eyebrow") }}</span>
        <h2
          class="mt-2 font-display text-2xl font-bold tracking-tight text-content-primary sm:text-3xl"
        >
          {{ t("home.games.title") }}
        </h2>
      </div>

      <AppButton to="/games" variant="outline" icon="ArrowRight">
        {{ t("home.games.viewAll") }}
      </AppButton>
    </div>

    <!-- IMPORTANTE: nunca aplicar v-reveal (ou qualquer classe/diretiva com
         `transform`) neste <CardContainer> ou em qualquer ancestral direto
         dos cards — um `transform` ativo cria um novo stacking context que
         prende o z-index dos cards, quebrando a exclusão deles do blur de
         busca/filtros da página /games (bug já resolvido, ver Card.vue). -->
    <CardContainer v-if="games.length" v-auto-animate>
      <Card v-for="game in games" :key="game.id" :game="game" />
    </CardContainer>

    <p v-else class="text-content-muted">{{ t("home.games.empty") }}</p>
  </section>
</template>
