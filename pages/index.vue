<script setup lang="ts">
//// Imports
import { TAGS, GAME_TYPES } from "@/data/games";
import type { Game, Tag, Type } from "@/types/game";
import Card from "~/components/Card.vue";
import { createClient } from "@supabase/supabase-js";

//// Supabase client and state
const allTypes = ref<Type[]>([]);
const allTags = ref<Tag[]>([]);
const allGames = ref<Game[]>([]);

const config: any = useRuntimeConfig();
const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseKey,
);

//// Filtering logic
const searchQuery = ref("");
const selectedStatus = ref("all");
const selectedTags = ref<string[]>([]);

const filteredGames = computed((): Game[] => {
  return allGames.value.filter((game) => {
    const matchesName = game.name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());

    const matchesDescription = game.description
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());

    const matchesStatus =
      selectedStatus.value === "all" ||
      game.type.name === selectedStatus.value.toLowerCase();

    const matchesTag =
      selectedTags.value.length === 0 ||
      selectedTags.value.every((selected) =>
        game.tags.some((tag) => tag.name === selected),
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

  allTypes.value = (data as Type[]) ?? [];
}

async function getAllTags(): Promise<void> {
  const { data, error } = await supabase.from("tags").select();

  if (error) console.error("[Supabase] Erro ao buscar tags:", error);

  allTags.value = (data as Tag[]) ?? [];
}

async function getAllGames(): Promise<void> {
  const { data, error } = await supabase.from("games").select(`
  *,
  type:game_types(*),
  tags:game_tags(tag:tag_id(*)),
  links:game_links(platform, url)
  `);

  if (error) {
    // Causas mais comuns pra esse erro especificamente na parte "links":
    // 1. Não existe uma foreign key entre game_links.game_id e games.id
    //    (o PostgREST precisa dela pra resolver o embed).
    // 2. RLS habilitado em game_links sem uma policy de SELECT pra role
    //    anon/public (tabela nova no Supabase já nasce com RLS ligado e
    //    sem nenhuma policy, então toda leitura vem vazia/bloqueada).
    console.error(
      "[Supabase] Erro ao buscar games (se a mensagem mencionar 'game_links' ou 'relationship', confira a foreign key e as policies de RLS dessa tabela):",
      error,
    );
  }

  allGames.value = ((data as Game[]) ?? []).map(mapGame);
}

//// Lifecycle
onMounted(() => {
  Promise.all([getAllTypes(), getAllTags(), getAllGames()]);
});
</script>

<template>
  <NavBar />

  <Container>
    <main>
      <div
        class="flex justify-between align-items-center gap-4"
        :class="{ 'mb-8': !selectedTags.length, 'mb-4': selectedTags.length }"
      >
        <SearchBar v-model="searchQuery" />

        <Select
          v-model="selectedStatus"
          :options="allTypes.map((type) => type.name)"
        />

        <MultiSelect v-model="selectedTags" :options="allTags" />
      </div>

      <div v-auto-animate>
        <div
          v-if="selectedTags.length"
          class="flex flex-wrap gap-2 mb-8"
          v-auto-animate
        >
          <span
            v-for="tag in selectedTags"
            :key="tag"
            class="cursor-pointer"
            @click="selectedTags = selectedTags.filter((t) => t !== tag)"
          >
            <Tag
              :name="allTags.find((o) => o.name === tag)?.name || ''"
              :color="allTags.find((o) => o.name === tag)?.color || ''"
              :icon="allTags.find((o) => o.name === tag)?.icon || ''"
            />
          </span>
        </div>
      </div>

      <div>
        <CardContainer v-auto-animate>
          <Card v-for="game in filteredGames" :key="game.name" :game="game" />
        </CardContainer>
      </div>
    </main>
  </Container>
</template>
