<script setup lang="ts">
import type { Game, Tag, Type } from "~/types/game";

const props = defineProps<{
  game: Game;
}>();

const hovered = ref(false);

console.log("Rendering Card for game:", props.game);
</script>

<template>
  <NuxtLink
    :to="
      game.type.name === 'coming_soon'
        ? `/game/${game.name.toLowerCase().replace(/\s+/g, '-')}`
        : ''
    "
    class="z-50"
  >
    <GradientBorder
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
      :active="hovered"
      class="shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl w-full h-full cursor-pointer"
    >
      <li class="overflow-hidden rounded-xl border-pm-gray bg-pm-black">
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

        <div class="py-4 px-5">
          <h1 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            {{ game.name }}
          </h1>

          <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {{ game.description }}
          </p>

          <div class="flex flex-wrap gap-2">
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
</template>
