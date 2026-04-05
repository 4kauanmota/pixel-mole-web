<script setup lang="ts">
//// Imports
import { TAGS, GAME_TYPES } from "@/data/games";
import type { Game, Tag, Type } from "~/types/game";
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
  const { data } = await supabase.from("game_types").select();

  allTypes.value = data as Type[];
}

async function getAllTags(): Promise<void> {
  const { data } = await supabase.from("tags").select();

  allTags.value = data as Tag[];
}

async function getAllGames(): Promise<void> {
  const { data } = await supabase.from("games").select(`
  *,
  type:game_types(*),
  tags:game_tags(tag:tag_id(*))
  `);

  allGames.value = (data as Game[]).map(mapGame);
}

//// Lifecycle
onMounted(() => {
  Promise.all([getAllTypes(), getAllTags(), getAllGames()]);
});
</script>

<template>
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
