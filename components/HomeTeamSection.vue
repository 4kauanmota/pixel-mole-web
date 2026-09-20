<script setup lang="ts">
//// Imports
import type { MemberSummary } from "~/types/member";

// Prévia da equipe na home (`/`) — reaproveita o MESMO MemberCard/
// CardContainer da listagem completa (/members), sem nenhuma variação de
// comportamento. Quem monta a página já entrega a lista limitada (ver
// pages/index.vue), então este componente escala sozinho conforme a equipe
// cresce.
defineProps<{
  members: MemberSummary[];
}>();

const { t } = useI18n();
</script>

<template>
  <section class="mt-12 sm:mt-16 lg:mt-20">
    <div
      v-reveal
      class="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8"
    >
      <div>
        <span class="eyebrow text-accent">{{ t("home.team.eyebrow") }}</span>
        <h2
          class="mt-2 font-display text-2xl font-bold tracking-tight text-content-primary sm:text-3xl"
        >
          {{ t("home.team.title") }}
        </h2>
      </div>

      <AppButton to="/members" variant="outline" icon="ArrowRight">
        {{ t("home.team.viewAll") }}
      </AppButton>
    </div>

    <!-- Mesmo cuidado de HomeGamesSection.vue: v-reveal nunca vai no
         CardContainer nem em ancestral direto dos cards (ver comentário lá
         e o histórico do bug em Card.vue/MemberCard.vue). -->
    <CardContainer v-if="members.length" v-auto-animate>
      <MemberCard
        v-for="member in members"
        :key="member.nick"
        :member="member"
      />
    </CardContainer>
  </section>
</template>
