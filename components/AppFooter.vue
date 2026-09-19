<script setup lang="ts">
//// Imports
import * as icons from "lucide-vue-next";
import { BRAND_ICONS } from "@/data/brandIcons";

const { t } = useI18n();
const year = new Date().getFullYear();

//// Redes sociais do estúdio. Ícone neutro em repouso — no hover, o círculo
// se preenche com a cor característica da própria plataforma (ver
// `--brand-color`/`--brand-ink` no <style> abaixo), então a pessoa percebe
// visualmente que aquele ícone é interativo sem precisar de mais nenhum
// efeito. Site oficial usa a cor de destaque do próprio estúdio (não é uma
// "marca" externa como as outras três).
const socials = [
  {
    key: "website",
    href: "https://pixelmole.com.br",
    label: "pixelmole.com.br",
    icon: "Globe",
    brandColor: "var(--pm-yellow)",
    inkColor: "var(--pm-dark)",
  },
  {
    key: "youtube",
    href: "https://www.youtube.com/@PixelMole",
    label: "@PixelMole",
    iconPath: BRAND_ICONS.youtube,
    brandColor: "#ff0000",
    inkColor: "#ffffff",
  },
  {
    key: "instagram",
    href: "https://www.instagram.com/pixelmole.studio",
    label: "@pixelmole.studio",
    iconPath: BRAND_ICONS.instagram,
    brandColor: "#e4405f",
    inkColor: "#ffffff",
  },
  {
    key: "tiktok",
    href: "https://www.tiktok.com/@pixel.mole",
    label: "@pixel.mole",
    iconPath: BRAND_ICONS.tiktok,
    brandColor: "#000000",
    inkColor: "#ffffff",
  },
];

function getIcon(name?: string): any {
  if (!name) return null;
  return icons[name as keyof typeof icons];
}
</script>

<template>
  <footer class="mt-16 border-t border-border-subtle bg-surface-alt sm:mt-24">
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
            <span class="font-display text-lg font-bold text-content-primary">
              Pixel Mole
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
          </nav>
        </div>

        <!-- Redes sociais -->
        <div class="flex flex-col gap-3">
          <h2 class="eyebrow">{{ t("footer.socialsHeading") }}</h2>
          <div class="flex flex-wrap gap-3">
            <a
              v-for="social in socials"
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
                :is="getIcon(social.icon)"
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
        <p>© {{ year }} Pixel Mole. {{ t("footer.rights") }}</p>
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
