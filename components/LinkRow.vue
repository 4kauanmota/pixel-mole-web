<script setup lang="ts">
//// Imports
import * as icons from "lucide-vue-next";

// Item de link grande e fácil de tocar, usado em pages/links.vue (a
// "linktree" do estúdio). `to` (rota interna) e `href` (link externo) são
// mutuamente exclusivos — mesma convenção de AppButton.vue, inclusive o
// motivo de usar dois ramos explícitos no template em vez de um único
// `<component :is="...">` dinâmico (resolver o componente fora do
// render/setup não garante instância ativa) — ver o comentário em
// AppButton.vue pra mais detalhes, é a mesma decisão aqui.
const props = defineProps<{
  to?: string;
  href?: string;
  label: string;
  description?: string;
  // Ícone: ou um path SVG de marca (BRAND_ICONS, prioridade) ou um nome de
  // ícone genérico do lucide-vue-next — mesma prioridade de GameLinkButton.
  iconPath?: string;
  icon?: string;
  // Cor de fundo do círculo do ícone (hex ou var(--...)) — cada tile pode
  // ter a sua (cor de marca da rede social, ou uma cor fixa da paleta pros
  // links internos do site).
  color?: string;
  // Cor do ÍCONE em si (não do fundo do círculo) — branco por padrão, igual
  // sempre foi. Só existe pra cobrir o caso do fundo ser claro demais pro
  // branco (hoje: Website, fundo amarelo `--pm-yellow`) sem precisar mudar
  // a cor de fundo do botão nem afetar nenhum outro ícone, que continuam
  // brancos exatamente como antes.
  iconColor?: string;
}>();

function getIcon(name?: string): any {
  if (!name) return null;
  return icons[name as keyof typeof icons];
}
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="link-row group flex w-full items-center gap-4 rounded-panel border border-border-subtle bg-surface-card px-4 py-3.5 text-left shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-accent hover:shadow-lg active:translate-y-0 sm:px-5 sm:py-4"
  >
    <span
      class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
      :style="{
        backgroundColor: color || 'var(--accent)',
        color: iconColor || '#fff',
      }"
    >
      <svg
        v-if="iconPath"
        viewBox="0 0 24 24"
        class="h-5 w-5 fill-current"
        aria-hidden="true"
      >
        <path :d="iconPath" />
      </svg>
      <component v-else :is="getIcon(icon)" :size="20" aria-hidden="true" />
    </span>
    <span class="min-w-0 flex-1">
      <span class="block truncate font-display text-base font-bold text-content-primary sm:text-lg">
        {{ label }}
      </span>
      <span
        v-if="description"
        class="block truncate text-sm text-content-secondary"
      >
        {{ description }}
      </span>
    </span>
    <component
      :is="getIcon('ChevronRight')"
      :size="20"
      class="shrink-0 text-content-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent"
      aria-hidden="true"
    />
  </NuxtLink>

  <a
    v-else-if="href"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="link-row group flex w-full items-center gap-4 rounded-panel border border-border-subtle bg-surface-card px-4 py-3.5 text-left shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-accent hover:shadow-lg active:translate-y-0 sm:px-5 sm:py-4"
  >
    <span
      class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
      :style="{
        backgroundColor: color || 'var(--accent)',
        color: iconColor || '#fff',
      }"
    >
      <svg
        v-if="iconPath"
        viewBox="0 0 24 24"
        class="h-5 w-5 fill-current"
        aria-hidden="true"
      >
        <path :d="iconPath" />
      </svg>
      <component v-else :is="getIcon(icon)" :size="20" aria-hidden="true" />
    </span>
    <span class="min-w-0 flex-1">
      <span class="block truncate font-display text-base font-bold text-content-primary sm:text-lg">
        {{ label }}
      </span>
      <span
        v-if="description"
        class="block truncate text-sm text-content-secondary"
      >
        {{ description }}
      </span>
    </span>
    <component
      :is="getIcon('ExternalLink')"
      :size="18"
      class="shrink-0 text-content-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
      aria-hidden="true"
    />
  </a>
</template>

<style scoped>
.link-row {
  /* Área de toque confortável no celular (pedido explícito do usuário):
     ~60px de altura mínima mesmo com pouco texto. */
  min-height: 60px;
}
</style>
