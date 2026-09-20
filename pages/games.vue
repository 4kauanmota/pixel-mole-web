<script setup lang="ts">
//// Imports
import { TAGS, GAME_TYPES } from "@/data/games";
import type { Game, Tag, Type } from "@/types/game";
import Card from "~/components/Card.vue";
import { createClient } from "@supabase/supabase-js";

const { localize } = useLocalizedText();

//// Supabase client and state
const allTypes = ref<Type[]>([]);
const allTags = ref<Tag[]>([]);
const allGames = ref<Game[]>([]);

// Enquanto os dados essenciais (tipos, tags e jogos) não tiverem terminado
// de carregar, mostramos o <AppLoader /> no lugar dos filtros/grade — assim
// a página nunca fica vazia ou com elementos incompletos.
const isLoading = ref(true);

const config: any = useRuntimeConfig();
const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseKey,
);

//// Filtering logic
const searchQuery = ref("");
const selectedStatus = ref("all_games");
const selectedTags = ref<string[]>([]);

const filteredGames = computed((): Game[] => {
  return allGames.value.filter((game) => {
    const matchesName = localize(game.name)
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());

    const matchesDescription = localize(game.description)
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());

    // `selectedStatus`/`selectedTags` guardam SLUGS (estáveis, nunca
    // traduzidos) — nunca o `name` multilíngue. Ver types/game.ts.
    const matchesStatus =
      selectedStatus.value === "all_games" ||
      game.type.slug === selectedStatus.value.toLowerCase();

    const matchesTag =
      selectedTags.value.length === 0 ||
      selectedTags.value.every((selected) =>
        game.tags.some((tag) => tag.slug === selected),
      );

    return (matchesName || matchesDescription) && matchesStatus && matchesTag;
  });
});

//// Fetching data from Supabase
async function getAllTypes(): Promise<void> {
  const { data, error } = await supabase
    .from("game_types")
    .select()
    .order("id");

  if (error) console.error("[Supabase] Erro ao buscar game_types:", error);

  allTypes.value = (data ?? [])
    .map(normalizeType)
    .filter(Boolean) as Type[];
}

async function getAllTags(): Promise<void> {
  const { data, error } = await supabase.from("tags").select();

  if (error) console.error("[Supabase] Erro ao buscar tags:", error);

  allTags.value = (data ?? []).map(normalizeTag).filter(Boolean) as Tag[];
}

// Query/mapeamento completos vivem em fetchAllGames (utils/games.ts) —
// extraídos daqui pra serem reaproveitados por qualquer outro lugar que
// precise dos jogos na MESMA ordem desta página (ver
// pages/members/[nick].vue), em vez de duplicar a lógica. Nenhuma mudança
// de comportamento: mesma query, mesmo mapeamento, mesmo resultado de
// antes — só extraído pra função própria.
async function getAllGames(): Promise<void> {
  allGames.value = await fetchAllGames(supabase);
}

//// Lifecycle
onMounted(async () => {
  try {
    await Promise.all([getAllTypes(), getAllTags(), getAllGames()]);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <NavBar />

  <Container>
    <main>
      <AppLoader v-if="isLoading" />

      <template v-else>
        <!-- Cabeçalho leve da página: só título + traço de destaque (sem
             virar mais um "bloco"/painel) — dá identidade e um único <h1>
             real pra página, que antes não tinha nenhum. -->
        <div v-reveal class="mb-8 sm:mb-10">
          <h1
            class="font-display text-3xl font-bold tracking-tight text-content-primary sm:text-4xl"
          >
            {{ $t("navbar.games") }}
          </h1>
          <div
            class="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-pm-yellow to-pm-orange"
          />
        </div>

        <div
          class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
          :class="selectedTags.length ? 'mb-4 sm:mb-6' : 'mb-6 sm:mb-8'"
        >
          <SearchBar v-model="searchQuery" class="sm:flex-1" />

          <div class="flex gap-3">
            <Select
              v-model="selectedStatus"
              :options="allTypes"
              class="min-w-0 flex-1 sm:flex-initial"
            />

            <MultiSelect
              v-model="selectedTags"
              :options="allTags"
              class="min-w-0 flex-1 sm:flex-initial"
            />
          </div>
        </div>

        <div v-auto-animate>
          <div
            v-if="selectedTags.length"
            class="flex flex-wrap gap-2 mb-6 sm:mb-8"
            v-auto-animate
          >
            <span
              v-for="tag in selectedTags"
              :key="tag"
              class="cursor-pointer"
              @click="selectedTags = selectedTags.filter((t) => t !== tag)"
            >
              <Tag
                :name="allTags.find((o) => o.slug === tag)?.name || ''"
                :color="allTags.find((o) => o.slug === tag)?.color || ''"
                :icon="allTags.find((o) => o.slug === tag)?.icon || ''"
                removable
                format-slug
              />
            </span>
          </div>
        </div>

        <CardContainer v-auto-animate>
          <Card v-for="game in filteredGames" :key="game.id" :game="game" />
        </CardContainer>
      </template>
    </main>
  </Container>

  <AppFooter />
</template>
