<script setup lang="ts">
import type { Game } from "~/types/game";
const props = defineProps<{
  game: Game;
}>();
const hovered = ref(false);
const modalOpen = ref(false);

// Jogos maiores ("coming_soon") vão ganhar uma página própria futuramente.
// Todos os outros tipos (ex.: game_jam) são jogos menores e usam o
// GameModal reutilizável para exibir os detalhes.
const hasOwnPage = computed(() => props.game.type.name === "coming_soon");

function handleClick(e: Event) {
  if (!hasOwnPage.value) {
    e.preventDefault();
    modalOpen.value = true;
  }
}
</script>

<template>
  <NuxtLink
    :to="
      hasOwnPage
        ? `/game/${game.name.toLowerCase().replace(/\s+/g, '-')}`
        : ''
    "
    class="z-50"
    @click="handleClick"
  >
    <GradientBorder
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
      :active="hovered"
      class="shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl w-full h-full cursor-pointer"
    >
      <li
        class="overflow-hidden rounded-xl border-pm-gray bg-pm-black flex flex-col h-full"
      >
        <div class="h-48 overflow-hidden">
          <img
            :src="game.thumbnail"
            :alt="game.name"
            class="h-full w-full object-cover transition-transform duration-500"
            :class="{ 'scale-110': hovered }"
          />
        </div>
        <div class="flex pl-4 pt-4">
          <Tag
            :key="game.type.name"
            :name="game.type.name"
            :color="game.type.color"
            variant="outlined"
            class="flex"
          />
        </div>

        <div class="py-4 px-5 flex flex-col flex-1">
          <h1 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            {{ game.name }}
          </h1>

          <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {{ game.description }}
          </p>

          <div class="flex flex-wrap gap-2 mt-auto">
            <Tag
              v-for="tag in game.tags"
              :key="tag.name"
              :name="tag.name"
              :color="tag.color"
              :icon="tag.icon"
            />
          </div>
        </div>
      </li>
    </GradientBorder>
  </NuxtLink>

  <GameModal :game="game" v-model:open="modalOpen" />
</template>
