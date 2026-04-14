<script setup lang="ts">
//// Imports
const { locale, t } = useI18n();
const switchLocalePath = useSwitchLocalePath();

//// Language selector state
const langOpen = ref(false);
const langContainer = ref<HTMLElement>();

//// Language options
const languages: { code: "pt" | "en"; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
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
const links = [{ label: $t("navbar.games"), to: "/" }];
</script>

<template>
  <nav
    class="sticky top-0 z-50 flex items-center justify-between px-4 h-16 bg-pm-black"
  >
    <NuxtLink to="/" class="h-full flex items-center gap-2">
      <img
        src="/img/logo.png"
        alt="Pixel Mole Logo"
        class="h-full object-cover py-2"
      />
    </NuxtLink>

    <div class="flex items-center gap-1">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="text-sm px-3 py-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-[#2a2a2c] transition-colors"
        active-class="text-pm-yellow"
      >
        {{ link.label }}
      </NuxtLink>
    </div>

    <div class="relative" ref="langContainer">
      <GradientBorder :active="langOpen" radius="10px">
        <button
          class="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors bg-pm-yellow"
          @click="langOpen = !langOpen"
        >
          <span>{{ currentLang?.flag }}</span>
          <span class="uppercase">{{ currentLang?.code }}</span>
          <span
            class="text-xs opacity-50 transition-transform duration-200"
            :class="{ 'rotate-180': langOpen }"
            >▼</span
          >
        </button>
      </GradientBorder>

      <Transition name="dropdown">
        <div
          v-if="langOpen"
          class="absolute top-full right-0 mt-1 min-w-max rounded-xl overflow-hidden border border-[#3a3a3c] bg-[#1a1a1c] z-50"
        >
          <button
            v-for="lang in languages"
            :key="lang.code"
            class="flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors"
            :class="
              locale === lang.code
                ? 'bg-pm-yellow text-pm-dark font-medium'
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
