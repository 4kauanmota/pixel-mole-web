<script setup lang="ts">
//// Imports
import * as icons from "lucide-vue-next";

const { t } = useI18n();
const year = new Date().getFullYear();

//// Estúdio (nome + redes sociais) — vem do registro único `studio` no
// Supabase (ver useStudio.ts/utils/studio.ts), nunca mais fixo aqui.
// Compartilhado com HomeHero.vue e pages/links.vue: `load()` é seguro de
// chamar de qualquer um dos três (só a primeira chamada busca de verdade).
const { studio, load } = useStudio();
onMounted(load);

//// Redes sociais: resolução de ícone/cor por `platform` (jsonb →
// visual) mora em utils/socials.ts, compartilhada com pages/links.vue —
// nenhuma rede é hardcoded aqui, e uma rede nova cadastrada no banco
// (qualquer `platform` que já exista em LINK_PLATFORMS, ou nenhum — cai no
// ícone genérico) aparece sem precisar tocar neste componente.
const socialVisuals = computed(() => resolveSocialVisuals(studio.value?.socials));

function getIcon(name?: string): any {
  if (!name) return null;
  return icons[name as keyof typeof icons];
}
</script>

<template>
  <footer class="mt-12 border-t border-border-subtle bg-surface-alt sm:mt-16">
    <Container>
      <div
        class="grid grid-cols-1 gap-10 py-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-12 lg:py-14"
      >
        <!-- Identidade -->
        <div class="flex flex-col gap-4">
          <NuxtLink to="/" class="flex w-fit items-center gap-2.5">
            <img
              src="/img/logo.png"
              alt="Pixel Mole Logo"
              class="h-10 w-auto object-contain"
            />
            <!-- Nome do estúdio: vem de `studio.name` (Supabase) — em
                 branco por uma fração de segundo enquanto carrega, nunca um
                 valor fixo no código (ver comentário no <script>). -->
            <span
              v-if="studio?.name"
              class="font-display text-lg font-bold text-content-primary"
            >
              {{ studio.name }}
            </span>
          </NuxtLink>
          <p class="max-w-xs text-sm leading-relaxed text-content-secondary">
            {{ t("footer.about") }}
          </p>
        </div>

        <!-- Navegação -->
        <div class="flex flex-col gap-3">
          <h2 class="eyebrow">{{ t("footer.navHeading") }}</h2>
          <nav class="flex flex-col gap-2.5">
            <NuxtLink
              to="/"
              class="w-fit text-sm text-content-secondary transition-colors hover:text-content-primary"
            >
              {{ t("navbar.home") }}
            </NuxtLink>
            <NuxtLink
              to="/games"
              class="w-fit text-sm text-content-secondary transition-colors hover:text-content-primary"
            >
              {{ t("navbar.games") }}
            </NuxtLink>
            <NuxtLink
              to="/members"
              class="w-fit text-sm text-content-secondary transition-colors hover:text-content-primary"
            >
              {{ t("navbar.members") }}
            </NuxtLink>
            <!-- "/links" não entra na navbar principal (pedido explícito do
                 usuário) — só aqui no Footer, junto dos demais links de
                 navegação. -->
            <NuxtLink
              to="/links"
              class="w-fit text-sm text-content-secondary transition-colors hover:text-content-primary"
            >
              {{ t("navbar.links") }}
            </NuxtLink>
          </nav>
        </div>

        <!-- Redes sociais: uma entrada por item de `studio.socials`. Vazio
             (ainda carregando, campo nulo, ou nenhuma rede cadastrada) só
             deixa a fileira de ícones sem nada — o cabeçalho da coluna
             continua aparecendo normalmente, nada quebra. -->
        <div class="flex flex-col gap-3">
          <h2 class="eyebrow">{{ t("footer.socialsHeading") }}</h2>
          <div class="flex flex-wrap gap-3">
            <a
              v-for="social in socialVisuals"
              :key="social.key"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              :title="social.label"
              class="footer-social flex h-11 w-11 items-center justify-center rounded-full border border-border-strong text-content-secondary transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105 hover:border-transparent"
              :style="{
                '--brand-color': social.brandColor,
                '--brand-ink': social.inkColor,
              }"
            >
              <svg
                v-if="social.iconPath"
                viewBox="0 0 24 24"
                class="h-5 w-5 fill-current"
                aria-hidden="true"
              >
                <path :d="social.iconPath" />
              </svg>
              <component
                v-else
                :is="getIcon(social.iconName)"
                :size="20"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col gap-2 border-t border-border-subtle py-6 text-xs text-content-faint sm:flex-row sm:items-center sm:justify-between"
      >
        <p v-if="studio?.name">© {{ year }} {{ studio.name }}. {{ t("footer.rights") }}</p>
      </div>
    </Container>
  </footer>
</template>

<style scoped>
.footer-social {
  background-color: transparent;
  transition:
    background-color 0.3s ease-out,
    color 0.3s ease-out,
    transform 0.3s ease-out,
    border-color 0.3s ease-out;
}
.footer-social:hover {
  background-color: var(--brand-color);
  color: var(--brand-ink);
}
</style>
