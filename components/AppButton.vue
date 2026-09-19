<script setup lang="ts">
//// Imports
import * as icons from "lucide-vue-next";

// Botão de CTA genérico — não existia um componente de botão reutilizável
// antes deste (cada lugar reimplementava seu próprio <button>/<a> estilizado
// avulso). Nasceu para os CTAs da nova home (`/`), mas não tem nada
// específico dela: qualquer página pode reaproveitar.
//
// `to` (rota interna, via NuxtLink) e `href` (link externo) são mutuamente
// exclusivos — se nenhum dos dois for passado, renderiza como <button>
// (útil pra ações via @click, ex.: abrir um modal). Três ramos explícitos no
// template (em vez de um único <component :is="...">) de propósito: evita
// resolver "NuxtLink" dinamicamente via resolveComponent() dentro de uma
// computed (que roda fora do call-stack de setup/render e não tem garantia
// de instância ativa) — cada ramo é só o elemento certo, direto.
const props = withDefaults(
  defineProps<{
    to?: string;
    href?: string;
    variant?: "solid" | "outline";
    size?: "md" | "lg";
    // Ícone à direita do texto (lucide-vue-next) — desliza sutilmente no
    // hover, reforçando a ideia de "avançar" (ex.: "Saiba mais", "Ver
    // todos os jogos").
    icon?: string;
  }>(),
  {
    variant: "solid",
    size: "md",
  },
);

function getIcon(name?: string): any {
  if (!name) return null;
  return icons[name as keyof typeof icons];
}

const sizeClasses = computed(() =>
  props.size === "lg"
    ? "px-7 py-3.5 text-base sm:px-8 sm:py-4 sm:text-lg"
    : "px-5 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base",
);

const variantClasses = computed(() =>
  props.variant === "solid"
    ? "bg-accent text-accent-contrast shadow-lg shadow-accent/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30 active:translate-y-0"
    : "border-2 border-border-strong text-content-primary hover:-translate-y-0.5 hover:border-accent hover:text-accent active:translate-y-0",
);

const baseClasses =
  "app-button group inline-flex w-fit shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-control font-display font-bold transition-all duration-300 ease-out";

const iconSize = computed(() => (props.size === "lg" ? 20 : 18));
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="[baseClasses, sizeClasses, variantClasses]"
  >
    <slot />
    <component
      :is="getIcon(icon)"
      v-if="icon"
      :size="iconSize"
      class="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
    />
  </NuxtLink>

  <a
    v-else-if="href"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    :class="[baseClasses, sizeClasses, variantClasses]"
  >
    <slot />
    <component
      :is="getIcon(icon)"
      v-if="icon"
      :size="iconSize"
      class="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
    />
  </a>

  <button
    v-else
    type="button"
    :class="[baseClasses, sizeClasses, variantClasses]"
  >
    <slot />
    <component
      :is="getIcon(icon)"
      v-if="icon"
      :size="iconSize"
      class="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
    />
  </button>
</template>
