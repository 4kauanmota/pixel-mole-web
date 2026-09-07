<script setup lang="ts">
//// Imports
import * as icons from "lucide-vue-next";

const { locale, t } = useI18n();
const switchLocalePath = useSwitchLocalePath();

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
  { label: $t("navbar.games"), to: "/" },
  { label: $t("navbar.members"), to: "/members" },
];
</script>

<template>
  <nav
    class="sticky top-0 z-50 flex h-20 items-center justify-between bg-pm-black px-4 sm:h-24 sm:px-6 lg:px-10"
  >
    <NuxtLink to="/" class="flex h-full items-center gap-2 py-3 sm:py-4">
      <img
        src="/img/logo.png"
        alt="Pixel Mole Logo"
        class="h-full w-auto object-contain"
      />
    </NuxtLink>

    <div class="flex items-center gap-1 sm:gap-2">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="rounded-lg px-3 py-2 text-base text-gray-500 transition-colors hover:bg-[#2a2a2c] hover:text-white sm:px-4 sm:py-2.5 sm:text-lg"
        active-class="text-pm-yellow"
      >
        {{ link.label }}
      </NuxtLink>
    </div>

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
          class="absolute right-0 top-full z-50 mt-1 min-w-max overflow-hidden rounded-xl border border-gray-700 bg-[#1a1a1c]"
        >
          <button
            v-for="lang in languages"
            :key="lang.code"
            class="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors"
            :class="
              locale === lang.code
                ? 'bg-pm-yellow font-medium text-pm-dark'
                : 'text-gray-400 hover:bg-[#2a2a2c] hover:text-white'
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
</style>
