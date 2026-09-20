<script setup lang="ts">
//// Imports
import * as icons from "lucide-vue-next";

const { locale, t } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const { theme, toggle: toggleTheme } = useTheme();

//// Language selector state
const langOpen = ref(false);
const langContainer = ref<HTMLElement>();

//// Language options
const languages: { code: "pt" | "en"; label: string; flag: string }[] = [
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "en", label: "English", flag: "🇺🇸" },
];

const currentLang = computed(() =>
  languages.find((l) => l.code === locale.value),
);

const themeToggleLabel = computed(() =>
  theme.value === "dark" ? t("navbar.enableLight") : t("navbar.enableDark"),
);

async function changeLanguage(code: "pt" | "en") {
  const path = switchLocalePath(code);

  if (path) {
    langOpen.value = false;
    window.location.href = path;
  }
}

function handleClickOutside(e: MouseEvent) {
  if (!langContainer.value?.contains(e.target as Node)) {
    langOpen.value = false;
  }
}

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));

//// Navigation links
const links = [
  { label: $t("navbar.home"), to: "/" },
  { label: $t("navbar.games"), to: "/games" },
  { label: $t("navbar.members"), to: "/members" },
];
</script>

<template>
  <!-- z-[60]: precisa ficar ACIMA de qualquer card (Card.vue/MemberCard.vue
       usam z-50 — necessário pra eles escaparem do overlay de blur da busca
       em /games, que é z-40). Como a navbar é `sticky` e os cards vivem
       dentro de um grid (que também cria stacking context via z-index em
       item de grid, mesmo sem `position` explícito), um EMPATE em z-50
       entre os dois é resolvido pela ordem no DOM — e os cards, vindo
       depois da navbar, venciam esse empate visualmente. Não é um caso de
       "aumentar z-index até resolver": a navbar precisa continuar acima de
       QUALQUER conteúdo de página por definição (é o chrome fixo do site),
       então ganha uma camada própria, só abaixo do GameModal (z-[100],
       que precisa cobrir até a navbar quando aberto). Os z-index internos
       da navbar (dropdown de idioma, z-50/z-10 abaixo) não precisam mudar:
       já vivem dentro do stacking context PRÓPRIO que esta `<nav>` cria (ela
       já tem `position` + `z-index` explícitos), então só competem entre si,
       nunca contra conteúdo de fora dela. -->
  <nav
    class="sticky top-0 z-[60] flex h-20 items-center justify-between border-b border-border-subtle bg-surface-page/85 px-4 backdrop-blur-md sm:h-24 sm:px-6 lg:px-8"
  >
    <NuxtLink to="/" class="flex h-full items-center gap-2 py-3 sm:py-4">
      <img
        src="/img/logo.png"
        alt="Pixel Mole Logo"
        class="h-full w-auto object-contain"
      />
    </NuxtLink>

    <!-- Navegação principal: só os links de página, sem nada de
         configuração de interface junto (ver grupo idioma+tema abaixo). -->
    <div class="flex items-center gap-1 sm:gap-2">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="rounded-lg px-3 py-2 text-base text-content-secondary transition-colors hover:bg-surface-hover hover:text-content-primary sm:px-4 sm:py-2.5 sm:text-lg"
        active-class="!text-accent"
      >
        {{ link.label }}
      </NuxtLink>
    </div>

    <!-- Configurações de interface: tema + idioma agrupados (não são
         navegação, são preferências de exibição) — mantidos juntos tanto no
         desktop quanto no mobile, com um divisor sutil só pra reforçar
         visualmente que formam um grupo à parte dos links acima. -->
    <div class="flex items-center gap-2 sm:gap-3">
      <button
        type="button"
        class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-content-secondary transition-colors duration-200 hover:bg-surface-hover hover:text-content-primary"
        :aria-label="themeToggleLabel"
        :title="themeToggleLabel"
        @click="toggleTheme"
      >
        <Transition name="theme-icon" mode="out-in">
          <component
            :is="theme === 'dark' ? icons['Sun'] : icons['Moon']"
            :key="theme"
            :size="18"
          />
        </Transition>
      </button>

      <span class="h-6 w-px shrink-0 bg-border-subtle" aria-hidden="true" />

      <!-- Seletor de idioma: mesmo padrão visual dos filtros da página
           principal (SearchBar/Select/MultiSelect) — GradientBorder +
           FILTER_CONTROL_CLASSES — em vez de um botão amarelo isolado. -->
      <div class="relative" ref="langContainer" :class="langOpen ? 'z-50' : 'z-10'">
        <GradientBorder :active="langOpen" class="relative z-50 h-full">
          <div
            class="flex min-w-0 cursor-pointer items-center transition-opacity duration-200 hover:opacity-80"
            :class="FILTER_CONTROL_CLASSES"
            @click="langOpen = !langOpen"
          >
            <span class="flex items-center gap-1.5 select-none">
              <span>{{ currentLang?.flag }}</span>
              <span class="uppercase">{{ currentLang?.code }}</span>
              <component
                :is="icons['ChevronDown']"
                :size="16"
                class="shrink-0 transition-transform duration-300"
                :class="{ 'rotate-270': !langOpen }"
              />
            </span>
          </div>
        </GradientBorder>

        <Transition name="dropdown">
          <div
            v-if="langOpen"
            class="absolute right-0 top-full z-50 mt-1 min-w-max overflow-hidden rounded-xl border border-border-strong bg-surface-overlay shadow-lg"
          >
            <button
              v-for="lang in languages"
              :key="lang.code"
              class="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors"
              :class="
                locale === lang.code
                  ? 'bg-pm-yellow font-medium text-pm-dark'
                  : 'text-content-secondary hover:bg-surface-hover hover:text-content-primary'
              "
              @click="
                changeLanguage(lang.code);
                langOpen = false;
              "
            >
              <span>{{ lang.flag }}</span>
              <span>{{ lang.label }}</span>
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.theme-icon-enter-active,
.theme-icon-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.3s ease;
}
.theme-icon-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.6);
}
.theme-icon-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.6);
}
</style>
