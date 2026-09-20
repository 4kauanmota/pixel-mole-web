<script setup lang="ts">
import * as icons from "lucide-vue-next";

// "Linktree" oficial do Pixel Mole (`/links`) — página pensada pra ser o
// link da bio no Instagram/TikTok: mobile-first, um único fluxo vertical de
// links grandes, sem a navbar/estrutura de grid do resto do site (que não
// faz sentido pra quem chega direto de uma rede social e só quer achar um
// link rápido). Não entra na navbar principal (pedido do usuário) — só o
// Footer aponta pra cá.
//
// Página EXCLUSIVAMENTE de redes sociais (pedido explícito do usuário) —
// antes também tinha atalhos pro site/jogos/equipe, removidos daqui; essas
// páginas continuam acessíveis normalmente pela navbar/Footer do resto do
// site. Todo o conteúdo (nome, redes sociais) vem do MESMO registro
// `studio` já usado por HomeHero.vue/AppFooter.vue via useStudio() — nada
// duplicado/hardcoded aqui.
const { t } = useI18n();
const { theme, toggle: toggleTheme } = useTheme();
const { studio, isLoading, load } = useStudio();
onMounted(load);

const studioName = computed(() => studio.value?.name || "Pixel Mole");
const socialVisuals = computed(() => resolveSocialVisuals(studio.value?.socials));

const themeToggleLabel = computed(() =>
  theme.value === "dark" ? t("navbar.enableLight") : t("navbar.enableDark"),
);

const year = new Date().getFullYear();
</script>

<template>
  <div class="relative min-h-screen">
    <!-- Alternância de tema: página não tem a navbar do resto do site (de
         propósito, ver comentário acima), mas quem chega direto de fora
         ainda precisa de um jeito de trocar entre dark/light — mesmo botão
         e mesmos ícones já usados no NavBar. -->
    <button
      type="button"
      class="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-content-secondary transition-colors duration-200 hover:bg-surface-hover hover:text-content-primary sm:right-5 sm:top-5"
      :aria-label="themeToggleLabel"
      :title="themeToggleLabel"
      @click="toggleTheme"
    >
      <component
        :is="theme === 'dark' ? icons['Sun'] : icons['Moon']"
        :size="18"
      />
    </button>

    <AppLoader v-if="isLoading" :message="t('loading.links')" />

    <main v-else class="mx-auto flex min-h-screen w-full max-w-[480px] flex-col px-5 py-12 sm:max-w-[520px] sm:py-16">
      <!-- Cabeçalho: logo e texto lado a lado (como antes), mas agora o
           BLOCO inteiro (logo + texto) é centralizado horizontalmente na
           página — `justify-center` no <header> centra o conjunto, e o
           texto em si continua alinhado à esquerda dentro desse conjunto
           (não centralizado internamente, só o conjunto como um todo). A
           logo continua "livre" (sem círculo/moldura/fundo próprio). Só o
           cabeçalho muda — os links abaixo continuam com o
           alinhamento/tamanho/espaçamento de sempre, sem nenhuma mudança. -->
      <header class="flex items-center justify-center gap-4 sm:gap-6">
        <img
          src="/img/logo.png"
          :alt="studioName"
          class="h-16 w-16 shrink-0 object-contain sm:h-24 sm:w-24"
        />
        <div class="flex min-w-0 flex-col gap-1.5 text-left">
          <h1 class="font-display text-2xl font-bold text-content-primary sm:text-3xl">
            {{ studioName }}
          </h1>
          <p class="text-sm leading-relaxed text-content-secondary sm:text-base">
            {{ t("footer.about") }}
          </p>
        </div>
      </header>

      <!-- Página exclusivamente de redes sociais (pedido explícito do
           usuário) — os antigos atalhos pro site/jogos/equipe foram
           removidos daqui; só a lista de `studio.socials` permanece. Sem
           nenhuma rede cadastrada (ainda carregando, campo vazio ou nulo),
           a lista simplesmente fica vazia — a página não quebra, só mostra
           o cabeçalho sozinho. Ordem/tamanho/largura/alinhamento/espaçamento
           de cada link (LinkRow) não foram tocados, só o cabeçalho acima e
           o que aparece abaixo dele mudou. -->
      <div class="mt-8 flex flex-col gap-3 sm:mt-10 sm:gap-3.5">
        <LinkRow
          v-for="social in socialVisuals"
          :key="social.key"
          :href="social.href"
          :label="social.label"
          :icon-path="social.iconPath"
          :icon="social.iconName"
          :color="social.brandColor"
          :icon-color="social.key === 'website' ? 'var(--pm-dark)' : undefined"
        />
      </div>

      <p class="mt-10 text-center text-xs text-content-faint sm:mt-12">
        © {{ year }} {{ studioName }}
      </p>
    </main>
  </div>
</template>
