<script setup lang="ts">
//// Imports
import type { Member } from "@/types/member";
import Card from "~/components/Card.vue";
import { createClient } from "@supabase/supabase-js";

//// Route
const route = useRoute();
// O nick vem da URL, então pode estar percent-encoded (acentos, espaços
// etc. em teoria — na prática deve ser um slug simples, mas tratamos do
// mesmo jeito para não depender disso).
const nick = decodeURIComponent(route.params.nick as string);

const { t } = useI18n();

//// Supabase client and state
const member = ref<Member | null>(null);

// Mesmo padrão de loading das outras páginas: <AppLoader /> enquanto os
// dados não terminam de carregar, pra nunca deixar a página vazia.
const isLoading = ref(true);

const config: any = useRuntimeConfig();
const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseKey,
);

//// Fetching data from Supabase
async function getMember(): Promise<void> {
  // A query do membro só precisa saber QUAIS jogos e com qual cargo
  // (role_in_game) — o game:games(id) aqui é só pra identificar o jogo, não
  // pra buscar os dados dele. Os dados completos (thumbnail, tags, links,
  // créditos etc.) e a ORDEM de exibição vêm de fetchAllGames (mesma
  // função/query da página de Games), buscados em paralelo abaixo — assim
  // os jogos deste membro saem sempre com os mesmos dados e na mesma ordem
  // da página de Games, por construção.
  const [{ data, error }, allGames] = await Promise.all([
    supabase
      .from("members")
      .select(
        `
      *,
      socials:member_socials(platform, url),
      game_members(
        role_in_game,
        game:games(id)
      )
      `,
      )
      .eq("nick", nick)
      .maybeSingle(),
    fetchAllGames(supabase),
  ]);

  if (error) {
    // Causas mais comuns pra esse erro especificamente nos embeds
    // ("socials"/"game_members"): falta a foreign key entre a tabela e
    // `members`/`games` (o PostgREST precisa dela pra resolver o embed), ou
    // RLS habilitado sem policy de SELECT pra role anon/public.
    console.error(
      "[Supabase] Erro ao buscar member (se a mensagem mencionar 'member_socials', 'game_members' ou 'relationship', confira a foreign key e as policies de RLS dessas tabelas):",
      error,
    );
  }

  // Nick inexistente (ou erro de carregamento sem dado nenhum): mesmo
  // tratamento de página inexistente do Nuxt, já que o projeto ainda não
  // tem uma página de erro própria.
  if (!data) {
    showError(
      createError({
        statusCode: 404,
        statusMessage: t("members.notFound"),
        fatal: true,
      }),
    );
    return;
  }

  member.value = mapMember(data, allGames);
}

//// Lifecycle
onMounted(async () => {
  try {
    await getMember();
  } finally {
    isLoading.value = false;
  }
});

// `default_role` pode trazer 1 ou 2 cargos separados por vírgula — mesma
// lógica/cores do card da listagem (ver MemberCard.vue e
// SECONDARY_ROLE_COLOR em utils/formatters.ts), só que em tamanho "lg"
// (mesmo padrão que a tag única já usava aqui).
const memberRoles = computed(() => splitRoles(member.value?.defaultRole ?? ""));

// Resumo das atuações do membro nos jogos do estúdio: agrupa
// member.games[].roleInGame, contando quantas vezes cada cargo se repete
// (ex.: "Programador · 3x") em vez de listar cada jogo separadamente.
// Ordenado do cargo mais recorrente pro menos recorrente.
const roleSummary = computed(() => {
  const counts = new Map<string, number>();
  for (const game of member.value?.games ?? []) {
    counts.set(game.roleInGame, (counts.get(game.roleInGame) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([role, count]) => ({ role, count }))
    .sort((a, b) => b.count - a.count);
});
</script>

<template>
  <NavBar />

  <Container>
    <main>
      <AppLoader v-if="isLoading" :message="$t('loading.member')" />

      <template v-else-if="member">
        <!-- Apresentação do membro: foto, nome, @nick, cargo, redes sociais
             e "Sobre" tudo dentro de UM ÚNICO container — antes eram 3
             painéis separados (cabeçalho/bio/redes), o que sobrava espaço
             vazio e lia como uma sequência de cards soltos. O fundo aqui é
             o mesmo bg-pm-black usado no <li> do Card.vue e no painel do
             GameModal (o "escuro" real dos cards do site) — não o
             bg-white/[0.03], que é o painel INTERNO mais claro usado pra
             sub-seções dentro de um container pm-black (é o que a caixa de
             redes sociais abaixo reaproveita, no mesmo espírito da seção
             "Disponível em" do GameModal). -->
        <div
          class="mb-6 rounded-2xl border border-pm-gray/60 bg-pm-black p-6 sm:mb-8 sm:p-8 lg:p-10"
        >
          <!-- Área principal (foto + nome/@nick/cargo) e área complementar
               (redes sociais) lado a lado em telas largas; empilha em
               telas estreitas. -->
          <div
            class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10"
          >
            <div
              class="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:text-left"
            >
              <MemberAvatar
                :nick="member.nick"
                :name="member.name"
                size="lg"
                eager
                class="h-32 w-32 shrink-0 shadow-xl shadow-black/40 sm:h-40 sm:w-40"
              />

              <div class="min-w-0">
                <h1
                  class="break-words text-3xl font-bold text-white sm:text-4xl"
                >
                  {{ member.name }}
                </h1>
                <p class="mt-1 text-gray-500">@{{ member.nick }}</p>

                <!-- Cargo(s): mesma tag amarela de sempre, mais uma segunda
                     tag roxa quando o membro tem 2 cargos (ver splitRoles
                     em utils/formatters.ts) — mesmo tratamento do card da
                     listagem (MemberCard.vue). -->
                <div
                  v-if="memberRoles.length"
                  class="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start"
                >
                  <Tag
                    v-if="memberRoles[0]"
                    :name="memberRoles[0]"
                    raw
                    color="var(--pm-yellow)"
                    variant="outlined"
                    size="lg"
                  />
                  <Tag
                    v-if="memberRoles[1]"
                    :name="memberRoles[1]"
                    raw
                    :color="SECONDARY_ROLE_COLOR"
                    variant="filled"
                    size="lg"
                  />
                </div>
              </div>
            </div>

            <!-- Redes sociais: mesma ideia da seção "Disponível em" do
                 GameModal (título em caps + fileira de botões), mas SEM o
                 painel próprio (nada de fundo/borda aqui) — encaixada direto
                 ao lado da foto/info pra parecer parte natural do membro,
                 não um "card dentro do card". Só aparece quando o membro tem
                 pelo menos uma rede cadastrada. O ícone de cada botão vem do
                 campo `platform` (fonte de verdade — ver LINK_PLATFORMS/
                 BRAND_ICONS em data/games.ts e GameLinkButton.vue), nunca
                 da URL. -->
            <div
              v-if="member.socials.length"
              class="flex shrink-0 flex-col items-center gap-3 lg:items-end"
            >
              <h2
                class="text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                {{ $t("members.socials") }}
              </h2>
              <div class="flex flex-wrap justify-center gap-3 lg:justify-end">
                <GameLinkButton
                  v-for="social in member.socials"
                  :key="social.url"
                  :link="social"
                />
              </div>
            </div>
          </div>

          <!-- Sobre: dentro do mesmo container, com uma linha divisória
               discreta (mesmo padrão usado entre as tags e a descrição no
               Card.vue) em vez de outra caixa própria. Sem max-w: o texto
               ocupa toda a largura livre do container (que já tem seu
               próprio limite via <Container> na página), em vez de ficar
               preso numa coluna estreita com espaço vazio sobrando ao
               lado. -->
          <div
            v-if="member.description"
            class="mt-8 border-t border-white/10 pt-6"
          >
            <h2
              class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              {{ $t("members.about") }}
            </h2>
            <p class="whitespace-pre-line leading-relaxed text-gray-400">
              {{ member.description }}
            </p>
          </div>

          <!-- Atuações: resumo visual de todas as funções que o membro já
               exerceu nos jogos do estúdio, agregadas por cargo (ver
               roleSummary) — mesmo cargo em vários jogos vira "Cargo · Nx"
               em vez de se repetir. Mesmo padrão de divisória/título dos
               outros blocos deste container, com as mesmas tags outlined
               amarelas já usadas pra cargo (não usa a cor roxa, que é
               exclusiva das tags de cargo GERAL do membro logo acima). -->
          <div v-if="roleSummary.length" class="mt-8 border-t border-white/10 pt-6">
            <h2
              class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              {{ $t("members.roles") }}
            </h2>
            <div class="flex flex-wrap gap-2">
              <Tag
                v-for="entry in roleSummary"
                :key="entry.role"
                :name="`${entry.role} · ${entry.count}x`"
                raw
                color="var(--pm-yellow)"
                variant="outlined"
                icon="User"
              />
            </div>
          </div>
        </div>

        <!-- Jogos do membro: reaproveita o mesmo <Card> da grade de jogos
             (mesmo hover, mesma navegação pra página/modal do jogo), só
             passando o cargo específico dele naquele jogo via `role-label`
             (ver components/Card.vue). Membro sem jogos ainda tem uma
             página válida — só mostramos uma mensagem no lugar da grade. -->
        <section>
          <h2
            class="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500"
          >
            {{ $t("members.games") }}
          </h2>

          <CardContainer v-if="member.games.length" v-auto-animate>
            <Card
              v-for="game in member.games"
              :key="game.name"
              :game="game"
              :role-label="game.roleInGame"
            />
          </CardContainer>

          <p v-else class="text-sm text-gray-500">
            {{ $t("members.noGames") }}
          </p>
        </section>
      </template>
    </main>
  </Container>
</template>
