<script setup lang="ts">
import type { GameType, Tag } from "~/data/games";

const props = defineProps<{
  title: string;
  image: string;
  description: string;
  tags: Tag[] | GameType[];
  type: GameType;
}>();

const hovered = ref(false);
</script>

<template>
  <NuxtLink
    :to="
      type.value === 'coming_soon'
        ? `/game/${title.toLowerCase().replace(/\s+/g, '-')}`
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
            :src="image"
            :alt="title"
            class="h-full w-full object-cover transition-transform duration-500"
            :class="{ 'scale-110': hovered }"
          />
        </div>

        <div class="flex pl-4 pt-4">
          <Tag :key="type.value" :tag="type" variant="outlined" class="flex" />
        </div>

        <div class="py-4 px-5">
          <h1 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            {{ title }}
          </h1>

          <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {{ description }}
          </p>

          <div class="flex flex-wrap gap-2">
            <Tag v-for="tag in tags" :key="tag.value" :tag="tag" />
          </div>
        </div>
      </li>
    </GradientBorder>
  </NuxtLink>
</template>
