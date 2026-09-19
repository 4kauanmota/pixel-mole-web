<script setup lang="ts">
//// Imports
import type { MemberSummary } from "@/types/member";
import MemberCard from "~/components/MemberCard.vue";
import { createClient } from "@supabase/supabase-js";

//// Supabase client and state
const allMembers = ref<MemberSummary[]>([]);

// Igual à página inicial: enquanto os membros não terminarem de carregar,
// mostramos o <AppLoader /> no lugar da grade — a página nunca fica vazia
// ou com conteúdo incompleto.
const isLoading = ref(true);

const config: any = useRuntimeConfig();
const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseKey,
);

//// Fetching data from Supabase
// Query/mapeamento completos vivem em fetchAllMembers (utils/members.ts) —
// extraídos daqui pra serem reaproveitados por qualquer outro lugar que
// precise da equipe (hoje, a prévia da nova home em `/`), mesmo padrão já
// usado por fetchAllGames. Nenhuma mudança de comportamento.
async function getAllMembers(): Promise<void> {
  allMembers.value = await fetchAllMembers(supabase);
}

//// Lifecycle
onMounted(async () => {
  try {
    await getAllMembers();
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <NavBar />

  <Container>
    <main>
      <AppLoader v-if="isLoading" :message="$t('loading.members')" />

      <template v-else>
        <!-- Cabeçalho aberto, sem card/bloco de fundo atrás — mesma
             abordagem do topo da página de jogos (título + traço de
             destaque, texto direto no background). Mesmas informações de
             antes (título, texto de apresentação, contagem), só que
             integradas à página em vez de dentro de um painel. -->
        <div v-reveal class="mb-8 sm:mb-10">
          <h1
            class="font-display text-3xl font-bold tracking-tight text-content-primary sm:text-4xl"
          >
            {{ $t("members.title") }}
          </h1>
          <div
            class="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-pm-yellow to-pm-orange"
          />
          <p class="mt-4 max-w-xl leading-relaxed text-content-secondary">
            {{ $t("members.intro") }}
          </p>
          <p
            v-if="allMembers.length"
            class="mt-3 text-sm font-medium text-accent"
          >
            {{ $t("members.count", { count: allMembers.length }) }}
          </p>
        </div>

        <CardContainer v-auto-animate>
          <MemberCard
            v-for="member in allMembers"
            :key="member.nick"
            :member="member"
          />
        </CardContainer>
      </template>
    </main>
  </Container>

  <AppFooter />
</template>
