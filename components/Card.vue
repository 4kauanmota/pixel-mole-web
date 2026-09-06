<script setup lang="ts">
import type { Game, Tag, Type } from "~/types/game";
const props = defineProps<{
  game: Game;
}>();
const hovered = ref(false);
const modalOpen = ref(false);

const isComingSoon = computed(() => props.game.type.name === "coming_soon");

function handleClick(e: Event) {
  if (!isComingSoon.value) {
    e.preventDefault();
    modalOpen.value = true;
  }
}
</script>

<template>
  <NuxtLink
    :to="
      isComingSoon
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

  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modalOpen" class="fixed inset-0 z-50 bg-black overflow-y-auto">
        <button
          class="fixed top-4 right-4 text-white bg-white/10 rounded-full w-8 h-8 flex items-center justify-center hover:bg-white/20 transition"
          @click="modalOpen = false"
        >
          ✕
        </button>

        <div class="max-w-6xl mx-auto px-6 py-16 flex gap-8">
          <div class="flex flex-col gap-3 w-1/2">
            <ImageViewer :fancybox-options="{}">
              <a
                v-for="(screenshot, i) in game.screenshots"
                :key="i"
                :href="screenshot"
                data-fancybox="gallery"
              >
                <img
                  :src="screenshot"
                  class="w-full rounded-lg object-cover cursor-zoom-in hover:opacity-80 transition"
                />
              </a>
            </ImageViewer>
          </div>

          <div class="w-1/2 sticky top-16 self-start">
            <div class="flex gap-2 mb-4">
              <Tag
                :name="game.type.name"
                :color="game.type.color"
                variant="outlined"
              />
            </div>
            <h2 class="text-3xl font-bold mb-4 text-white">
              {{ game.name }}
            </h2>
            <p class="text-gray-400 mb-6 leading-relaxed">
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
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
