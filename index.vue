<script setup lang="ts">
import { GAMES, TAGS, GAME_TYPES, type Tag } from "@/data/games";
import Card from "~/components/Card.vue";

const searchQuery = ref("");

const selectedStatus = ref("all");
const selectedTags = ref<string[]>([]);

const statusOptions = Object.values(GAME_TYPES);

const tagOptions = Object.values(TAGS);

const filteredGames = computed(() => {
  return GAMES.filter((game) => {
    const matchesName = game.name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());

    const matchesDescription = game.description
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());

    const matchesStatus =
      selectedStatus.value === "all" ||
      game.type.value === selectedStatus.value.toLowerCase();

    const matchesTag =
      selectedTags.value.length === 0 ||
      selectedTags.value.every((selected) =>
        game.tags.some((tag) => tag.value === selected),
      );

    return (matchesName || matchesDescription) && matchesStatus && matchesTag;
  });
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

        <Select v-model="selectedStatus" :options="statusOptions" />

        <MultiSelect v-model="selectedTags" :options="tagOptions" />
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
              :tag="tagOptions.find((o) => o.value === tag) as Tag"
              variant="outlined"
            />
          </span>
        </div>
      </div>

      <div>
        <CardContainer v-auto-animate>
          <Card
            v-for="game in filteredGames"
            :key="game.name"
            :title="game.name"
            :description="game.description"
            :image="game.image"
            :tags="game.tags"
            :type="game.type"
          />
        </CardContainer>
      </div>
    </main>
  </Container>
</template>
