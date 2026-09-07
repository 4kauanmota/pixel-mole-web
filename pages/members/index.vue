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
async function getAllMembers(): Promise<void> {
  // Listagem só precisa de nome e cargo (ver types/member.ts) — nada de
  // bio, redes sociais ou jogos aqui, que só a página individual usa.
  //
  // Sem "photo": a tabela `members` não tem essa coluna (a foto vem dos
  // assets do projeto, não do Supabase — ver utils/memberPhotos.ts).
  // Pedir uma coluna inexistente faz a query INTEIRA falhar (erro
  // "column does not exist"), o que já aconteceu aqui antes e deixava a
  // grade vazia sem nenhum aviso visível.
  const { data, error } = await supabase
    .from("members")
    .select("id, name, nick, default_role")
    .order("name");

  if (error) {
    console.error("[Supabase] Erro ao buscar members:", error);
  }

  allMembers.value = ((data as any[]) ?? []).map(mapMemberSummary);
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
        <!-- Introdução: painel com o mesmo fundo opaco dos cards (bg-pm-black,
             como em Card.vue/MemberCard.vue) + a borda sutil usada nos
             painéis do GameModal. Só o conteúdo textual (título, texto de
             apresentação e a contagem real de membros) — sem logo ou
             qualquer elemento decorativo adicional. -->
        <div
          class="mb-6 rounded-2xl border border-pm-gray/60 bg-pm-black p-6 text-center sm:mb-8 sm:p-10 sm:text-left"
        >
          <h1 class="mb-2 text-3xl font-bold text-white sm:text-4xl">
            {{ $t("members.title") }}
          </h1>
          <p class="max-w-xl leading-relaxed text-gray-400">
            {{ $t("members.intro") }}
          </p>
          <p
            v-if="allMembers.length"
            class="mt-4 text-sm font-medium text-pm-yellow"
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
</template>
