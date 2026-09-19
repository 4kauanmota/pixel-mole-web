<script setup lang="ts">
//// Imports
import type { Game } from "@/types/game";
import type { MemberSummary } from "@/types/member";
import { createClient } from "@supabase/supabase-js";

// Nova página inicial do estúdio (`/`) — apresentação da Pixel Mole, não a
// listagem de jogos (que agora mora em /games, ver pages/games.vue). Usa
// dados reais do Supabase (jogos e equipe), então escala sozinha conforme o
// catálogo/time crescem, sem nenhum conteúdo fictício.

//// Supabase client and state
const allGames = ref<Game[]>([]);
const allMembers = ref<MemberSummary[]>([]);

// Mesmo padrão de loading das outras páginas: <AppLoader /> enquanto os
// dados essenciais não terminam de carregar.
const isLoading = ref(true);

const config: any = useRuntimeConfig();
const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseKey,
);

//// Dados derivados
// Jogo em destaque: mesmo critério usado no Hero e na seção "Em destaque"
// (ver getFeaturedGame em utils/games.ts). Sem jogos cadastrados -> null, e
// cada seção trata esse caso sem quebrar nem inventar conteúdo.
const featuredGame = computed<Game | null>(() =>
  getFeaturedGame(allGames.value),
);

// Destaques secundários (HomeHighlights.vue): cada um tem um "porquê"
// diferente do Hero/Spotlight, sempre derivado de um dado REAL do jogo —
// nunca hardcoded por id/nome, então continua fazendo sentido com 2, 6 ou
// 20 jogos no catálogo:
//   - "recent": o de maior id que ainda não apareceu (aproximação de "mais
//     recente" — mesmo critério de getFeaturedGame, já que o modelo não tem
//     campo de data).
//   - "available": o primeiro (nessa mesma ordem) que já tem pelo menos um
//     link de plataforma cadastrado — ou seja, jogável/comprável em algum
//     lugar agora.
//   - "inDev": o primeiro "coming_soon" que ainda não apareceu.
// Cada jogo só entra UMA vez no total (Hero/Spotlight + aqui), pra não
// repetir o mesmo tile com rótulos diferentes; se não sobrar nenhum jogo
// distinto pra uma categoria, ela simplesmente não aparece — a seção toda
// some quando não sobra nenhuma (ver HomeHighlights.vue).
const highlightItems = computed(() => {
  const used = new Set<number>();
  if (featuredGame.value) used.add(featuredGame.value.id);

  const byRecency = [...allGames.value].sort((a, b) => b.id - a.id);
  const items: { key: string; game: Game }[] = [];

  const recent = byRecency.find((game) => !used.has(game.id));
  if (recent) {
    items.push({ key: "recent", game: recent });
    used.add(recent.id);
  }

  const available = byRecency.find(
    (game) => !used.has(game.id) && (game.links?.length ?? 0) > 0,
  );
  if (available) {
    items.push({ key: "available", game: available });
    used.add(available.id);
  }

  const inDev = byRecency.find(
    (game) => !used.has(game.id) && game.type.name === "coming_soon",
  );
  if (inDev) {
    items.push({ key: "inDev", game: inDev });
    used.add(inDev.id);
  }

  return items;
});

// Prévia de "Nossos jogos": os de maior id primeiro (aproximação de "mais
// recentes", mesmo critério usado em getFeaturedGame — o modelo de dados não
// tem campo de data), limitada a um punhado pra manter a home enxuta. O
// catálogo completo mora em /games; esta lista cresce sozinha junto com ele.
const HOME_GAMES_LIMIT = 8;
const homeGames = computed(() =>
  [...allGames.value].sort((a, b) => b.id - a.id).slice(0, HOME_GAMES_LIMIT),
);

// Prévia da equipe: só uma amostra — a listagem completa mora em /members.
const HOME_TEAM_LIMIT = 4;
const teamPreview = computed(() => allMembers.value.slice(0, HOME_TEAM_LIMIT));

//// Fetching data from Supabase
// Reaproveita fetchAllGames/fetchAllMembers (utils/games.ts, utils/members.ts)
// — mesmas funções/queries já usadas por /games e /members, então os dados
// aqui são sempre consistentes com o resto do site.
async function loadGames(): Promise<void> {
  allGames.value = await fetchAllGames(supabase);
}
async function loadMembers(): Promise<void> {
  allMembers.value = await fetchAllMembers(supabase);
}

//// Lifecycle
onMounted(async () => {
  try {
    await Promise.all([loadGames(), loadMembers()]);
  } finally {
    isLoading.value = false;
  }
});

// Log central pros erros contidos pelos <NuxtErrorBoundary> abaixo — nunca
// silenciosos: aparecem no console igual um erro não tratado apareceria,
// só não derrubam o resto da página/navegação junto.
function logSectionError(section: string) {
  return (error: unknown) => {
    console.error(`[Home] Falha ao renderizar a seção "${section}":`, error);
  };
}
</script>

<template>
  <NavBar />

  <AppLoader v-if="isLoading" />

  <template v-else>
    <!-- Cada seção da home fica isolada num <NuxtErrorBoundary> próprio: se
         uma delas falhar por algum motivo inesperado (dado que a normalização
         em utils/mappers.ts não previu), só aquela seção some — a navbar, o
         footer, a navegação entre páginas e as demais seções continuam
         funcionando normalmente. Isso é uma rede de segurança, não o
         tratamento do problema em si (esse já é feito na origem, nos
         mappers/componentes) — ver utils/mappers.ts, GameGallery.vue,
         GameCredits.vue, useContrastColor.ts. -->

    <!-- Hero fora do <Container>: de propósito, pra ocupar a largura
         inteira da viewport (arte do jogo em destaque de fundo) — as demais
         seções ficam dentro do <Container> de sempre, junto do resto do
         site. -->
    <NuxtErrorBoundary @error="logSectionError('Hero')">
      <HomeHero :game="featuredGame" />
      <template #error></template>
    </NuxtErrorBoundary>

    <Container>
      <main>
        <NuxtErrorBoundary
          v-if="featuredGame"
          @error="logSectionError('Em destaque')"
        >
          <HomeSpotlight :game="featuredGame" />
          <template #error></template>
        </NuxtErrorBoundary>

        <NuxtErrorBoundary @error="logSectionError('Destaques secundários')">
          <HomeHighlights :items="highlightItems" />
          <template #error></template>
        </NuxtErrorBoundary>

        <NuxtErrorBoundary @error="logSectionError('Nossos jogos')">
          <HomeGamesSection :games="homeGames" />
          <template #error></template>
        </NuxtErrorBoundary>

        <NuxtErrorBoundary @error="logSectionError('Identidade do estúdio')">
          <HomeStudioSection
            :game-count="allGames.length"
            :member-count="allMembers.length"
          />
          <template #error></template>
        </NuxtErrorBoundary>

        <NuxtErrorBoundary @error="logSectionError('Equipe')">
          <HomeTeamSection :members="teamPreview" />
          <template #error></template>
        </NuxtErrorBoundary>
      </main>
    </Container>
  </template>

  <AppFooter />
</template>
