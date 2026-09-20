<script setup lang="ts">
// Seção de identidade do estúdio, entre "Nossos jogos" e a equipe —
// deliberadamente curta e visual (números grandes) em vez de texto corrido,
// pra não virar mais um bloco de parágrafo na página. Os números vêm de
// dados reais (contagem de jogos/membros já carregados pela página), nunca
// fabricados.
defineProps<{
  gameCount: number;
  memberCount: number;
}>();

const { t } = useI18n();
</script>

<template>
  <section
    v-reveal
    class="mt-12 grid grid-cols-1 items-center gap-8 rounded-panel border border-border-subtle bg-surface-panel p-5 sm:mt-16 sm:p-6 lg:mt-20 lg:grid-cols-[1.2fr_1fr] lg:gap-12 lg:p-8"
  >
    <div class="flex flex-col gap-4">
      <span class="eyebrow text-accent">{{ t("home.studio.eyebrow") }}</span>
      <h2
        class="font-display text-2xl font-bold tracking-tight text-content-primary sm:text-3xl"
      >
        {{ t("home.studio.title") }}
      </h2>
      <p class="max-w-lg leading-relaxed text-content-secondary">
        {{ t("home.studio.description") }}
      </p>
    </div>

    <div class="grid grid-cols-2 gap-4 sm:gap-5">
      <div
        class="rounded-panel border border-border-subtle bg-surface-card p-5 text-center sm:p-6"
      >
        <p class="font-display text-3xl font-bold text-accent sm:text-4xl">
          {{ gameCount }}
        </p>
        <p class="mt-2 text-sm text-content-muted sm:text-base">
          {{ t("home.studio.statGames") }}
        </p>
      </div>
      <div
        class="rounded-panel border border-border-subtle bg-surface-card p-5 text-center sm:p-6"
      >
        <p class="font-display text-3xl font-bold text-accent sm:text-4xl">
          {{ memberCount }}
        </p>
        <p class="mt-2 text-sm text-content-muted sm:text-base">
          {{ t("home.studio.statTeam") }}
        </p>
      </div>
    </div>
  </section>
</template>
