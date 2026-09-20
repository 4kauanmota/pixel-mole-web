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
const { localize } = useLocalizedText();

// Nome do estúdio: vem do registro `studio` (Supabase), nunca fixo aqui —
// compartilhado com AppFooter.vue via useStudio() (mesmo `load()` seguro de
// chamar dos dois lugares, só a primeira busca de verdade). "Pixel Mole"
// só entra como ÚLTIMO recurso, enquanto `studio` ainda carrega ou se a
// linha ainda não existir no banco — nunca a fonte de verdade do nome.
const { studio, load } = useStudio();
onMounted(load);
const studioName = computed(() => studio.value?.name || "Pixel Mole");

// Mesma regra de Card.vue: jogos "coming_soon" têm página própria; os
// outros tipos usam o GameModal reutilizável.
const hasOwnPage = computed(() => props.game?.type.slug === "coming_soon");
const gameHref = computed(() =>
  hasOwnPage.value
    ? `/game/${stableText(props.game!.name).toLowerCase().replace(/\s+/g, "-")}`
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
      <!-- Altura deliberadamente baseada em `px`, nunca `vh`: a seção não
           pode virar um "hero fullscreen" em nenhuma tela (regra explícita
           pedida pelo usuário). Valores reduzidos de novo nesta rodada (era
           min-h 460/560/640px + py-16/20/28) — a altura vem principalmente
           do PRÓPRIO conteúdo (título + texto + botões), não de um mínimo
           forçado; isso garante que o topo da próxima seção já apareça
           insinuado na primeira dobra em qualquer tamanho de tela. -->
      <div
        class="flex min-h-[300px] flex-col justify-end gap-4 py-8 sm:min-h-[340px] sm:py-10 lg:min-h-[380px] lg:py-12"
      >
        <!-- O eyebrow "Estúdio de jogos indie" que ficava aqui foi removido
             por pedido explícito do usuário — a Home fica melhor começando
             direto pelo título, sem essa apresentação. Nenhum substituto
             foi colocado no lugar; o `flex-col gap-4` abaixo já se
             reorganiza sozinho (não sobra vazio nenhum onde o eyebrow
             estava, porque o layout nunca reservava um espaço fixo pra ele
             — cada item só ocupa a altura do próprio conteúdo). -->
        <div v-reveal class="flex max-w-2xl flex-col gap-4">
          <h1
            class="font-display text-2xl font-bold leading-[1.05] tracking-tight text-content-primary sm:text-3xl lg:text-4xl"
          >
            {{ game ? localize(game.name) : studioName }}
          </h1>

          <Tag
            v-if="game"
            :name="game.type.name"
            :color="game.type.color"
            variant="outlined"
            size="lg"
            format-slug
            class="w-fit"
          />

          <p
            class="max-w-xl text-base leading-relaxed text-content-secondary sm:text-lg"
          >
            {{ game ? localize(game.description) : t("home.hero.fallback") }}
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
