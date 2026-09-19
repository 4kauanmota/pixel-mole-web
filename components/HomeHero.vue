<script setup lang="ts">
//// Imports
import type { Game } from "~/types/game";

// Hero da nova home (`/`) — usa o jogo "mais relevante" no momento (ver
// getFeaturedGame em utils/games.ts, escolhido por quem monta a página) pra
// dar cara de apresentação de estúdio, não de banner genérico. Sem nenhum
// jogo cadastrado ainda, cai num estado só com a identidade do estúdio, sem
// inventar conteúdo.
const props = defineProps<{
  game: Game | null;
}>();

const { t } = useI18n();

// Mesma regra de Card.vue: jogos "coming_soon" têm página própria; os
// outros tipos usam o GameModal reutilizável.
const hasOwnPage = computed(() => props.game?.type.name === "coming_soon");
const gameHref = computed(() =>
  hasOwnPage.value
    ? `/game/${props.game!.name.toLowerCase().replace(/\s+/g, "-")}`
    : undefined,
);

const modalOpen = ref(false);
function handlePrimaryClick(e: Event) {
  if (props.game && !hasOwnPage.value) {
    e.preventDefault();
    modalOpen.value = true;
  }
}

// Link de plataforma direto (Steam/itch.io/...), quando existir — primeiro
// da lista, mesma ordem já usada no GameModal ("Disponível em").
const primaryLink = computed(() => props.game?.links?.[0]);
</script>

<template>
  <section class="relative overflow-hidden border-b border-border-subtle">
    <!-- Arte do jogo em destaque como fundo do Hero, com gradientes por cima
         garantindo leitura do texto em qualquer imagem/tema. Sem jogo ainda
         cadastrado: só o brilho ambiente da marca (mesmo mecanismo de
         body::before em main.css), pra não deixar a seção "quebrada" ou
         vazia. -->
    <div class="absolute inset-0" aria-hidden="true">
      <img
        v-if="game?.thumbnail"
        :src="game.thumbnail"
        :alt="''"
        class="h-full w-full scale-105 object-cover"
      />
      <div
        v-else
        class="h-full w-full"
        style="
          background:
            radial-gradient(
              70rem 50rem at 15% -10%,
              var(--ambient-1),
              transparent 60%
            ),
            radial-gradient(
              60rem 44rem at 100% 10%,
              var(--ambient-2),
              transparent 55%
            );
        "
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-surface-page via-surface-page/85 to-surface-page/25"
      />
      <div
        class="absolute inset-0 bg-gradient-to-r from-surface-page/95 via-surface-page/30 to-transparent"
      />
    </div>

    <Container class="relative">
      <div
        class="flex min-h-[460px] flex-col justify-end gap-6 py-16 sm:min-h-[560px] sm:py-20 lg:min-h-[640px] lg:py-28"
      >
        <div v-reveal class="flex max-w-2xl flex-col gap-5">
          <span class="eyebrow flex items-center gap-2 text-accent">
            <img
              src="/img/logo.png"
              alt=""
              class="h-5 w-5 object-contain"
              aria-hidden="true"
            />
            {{ t("home.hero.eyebrow") }}
          </span>

          <h1
            class="font-display text-4xl font-bold leading-[1.05] tracking-tight text-content-primary sm:text-5xl lg:text-6xl"
          >
            {{ game ? game.name : "Pixel Mole" }}
          </h1>

          <Tag
            v-if="game"
            :name="game.type.name"
            :color="game.type.color"
            kind="types"
            variant="outlined"
            size="lg"
            class="w-fit"
          />

          <p
            class="max-w-xl text-base leading-relaxed text-content-secondary sm:text-lg"
          >
            {{ game ? game.description : t("home.hero.fallback") }}
          </p>

          <div class="mt-2 flex flex-wrap items-center gap-4">
            <AppButton
              v-if="game"
              :to="gameHref"
              size="lg"
              icon="ArrowRight"
              @click="handlePrimaryClick"
            >
              {{ t("home.hero.ctaPrimary") }}
            </AppButton>
            <AppButton v-else to="/games" size="lg" icon="ArrowRight">
              {{ t("home.games.viewAll") }}
            </AppButton>

            <AppButton
              v-if="primaryLink"
              :href="primaryLink.url"
              variant="outline"
              size="lg"
              icon="ExternalLink"
            >
              {{ t("home.hero.ctaPlatform") }}
            </AppButton>
          </div>
        </div>
      </div>
    </Container>

    <GameModal v-if="game" :game="game" v-model:open="modalOpen" />
  </section>
</template>
