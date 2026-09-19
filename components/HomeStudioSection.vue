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
    class="mt-16 grid grid-cols-1 items-center gap-10 rounded-panel border border-border-subtle bg-surface-panel p-6 sm:mt-24 sm:p-8 lg:mt-28 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:p-12"
  >
    <div class="flex flex-col gap-5">
      <span class="eyebrow text-accent">{{ t("home.studio.eyebrow") }}</span>
      <h2
        class="font-display text-3xl font-bold tracking-tight text-content-primary sm:text-4xl"
      >
        {{ t("home.studio.title") }}
      </h2>
      <p class="max-w-lg leading-relaxed text-content-secondary">
        {{ t("home.studio.description") }}
      </p>
    </div>

    <div class="grid grid-cols-2 gap-4 sm:gap-6">
      <div
        class="rounded-panel border border-border-subtle bg-surface-card p-6 text-center sm:p-8"
      >
        <p class="font-display text-4xl font-bold text-accent sm:text-5xl">
          {{ gameCount }}
        </p>
        <p class="mt-2 text-sm text-content-muted sm:text-base">
          {{ t("home.studio.statGames") }}
        </p>
      </div>
      <div
        class="rounded-panel border border-border-subtle bg-surface-card p-6 text-center sm:p-8"
      >
        <p class="font-display text-4xl font-bold text-accent sm:text-5xl">
          {{ memberCount }}
        </p>
        <p class="mt-2 text-sm text-content-muted sm:text-base">
          {{ t("home.studio.statTeam") }}
        </p>
      </div>
    </div>
  </section>
</template>
