<script setup lang="ts">
import * as icons from "lucide-vue-next";
import type { Game } from "~/types/game";
const props = defineProps<{
  game: Game;
  // Cargo específico que um membro exerceu *neste* jogo (ex.: "Programador").
  // Passado apenas pela página de membro (/members/[nick]), que reaproveita
  // este MESMO card (sem nenhuma outra alteração) pra listar os jogos em
  // que a pessoa atuou. É só uma informação COMPLEMENTAR — o card continua
  // sendo o card de jogo de sempre, com todas as informações normais
  // (thumbnail, tipo, descrição, tags de gênero) intactas.
  roleLabel?: string;
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
    class="z-50 block h-full"
    @click="handleClick"
  >
    <GradientBorder
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
      :active="hovered"
      radius="var(--radius-card)"
      class="h-full w-full cursor-pointer shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      <li
        class="flex h-full flex-col overflow-hidden rounded-card border-border bg-surface-card"
      >
        <!-- Thumbnail: proporção 16/10, com o tipo do jogo sobreposto como
             selo (mesmo padrão "outlined" usado no GameModal para o tipo),
             liberando espaço vertical pro conteúdo abaixo. -->
        <div class="relative aspect-[16/10] w-full overflow-hidden">
          <img
            :src="game.thumbnail"
            :alt="game.name"
            class="h-full w-full object-cover transition-transform duration-500"
            :class="{ 'scale-110': hovered }"
          />
          <div
            class="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/0 to-black/0"
          />
          <Tag
            :key="game.type.name"
            :name="game.type.name"
            :color="game.type.color"
            kind="types"
            variant="outlined"
            class="absolute left-3 top-3 !bg-black/55 backdrop-blur-sm"
          />
        </div>

        <div class="flex flex-1 flex-col gap-3 p-4 sm:p-5">
          <h2 class="line-clamp-1 text-lg font-bold text-content-primary sm:text-xl">
            {{ game.name }}
          </h2>

          <p class="line-clamp-2 text-sm leading-relaxed text-content-secondary">
            {{ game.description }}
          </p>

          <!-- Cargo do membro NESTE jogo (só na página de um membro, via
               `roleLabel`): vem logo depois da descrição, em fluxo normal
               (sem forçar espaço) — informação diferente das tags de
               gênero, por isso discreta (texto, não outra Tag colorida),
               com um ícone de pessoa. -->
          <div
            v-if="roleLabel"
            class="flex items-center gap-1.5 text-sm text-content-secondary"
          >
            <component
              :is="icons['User']"
              :size="14"
              class="shrink-0 text-accent"
            />
            <span class="truncate">{{ roleLabel }}</span>
          </div>

          <!-- Tags do jogo (gênero/tema): mesmo padrão "filled" (cor sólida
               de fundo) de sempre. Ancoradas na base do card (`mt-auto`),
               com uma linha divisória — mesmo comportamento que o card já
               tinha antes de existir `roleLabel`, só que agora o cargo do
               membro (quando presente) fica entre a descrição e essa
               âncora, em vez de disputar o mesmo espaço das tags. -->
          <div
            v-if="game.tags.length"
            class="mt-auto flex flex-wrap gap-1.5 border-t border-border-subtle pt-3"
          >
            <Tag
              v-for="tag in game.tags"
              :key="tag.name"
              :name="tag.name"
              :color="tag.color"
              :icon="tag.icon"
              kind="tags"
            />
          </div>
        </div>
      </li>
    </GradientBorder>
  </NuxtLink>

  <GameModal :game="game" v-model:open="modalOpen" />
</template>
