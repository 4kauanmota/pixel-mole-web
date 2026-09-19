<script setup lang="ts">
// Loading genérico exibido enquanto os dados essenciais de uma página ainda
// não terminaram de carregar do Supabase.
//
// Para trocar por um loading personalizado no futuro: basta reescrever o
// <template> abaixo (ou os estilos do spinner) — a página que usa este
// componente só faz `<AppLoader v-if="isLoading" />` e não precisa de
// nenhuma alteração.
//
// `message` é opcional (mantém o texto de jogos como padrão, usado na
// página inicial) — outras páginas (ex.: membros) passam sua própria
// mensagem via `:message="$t('loading.members')"`.
defineProps<{
  message?: string;
}>();
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-4 py-24 sm:py-32"
    role="status"
    aria-live="polite"
  >
    <span
      class="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-accent"
      aria-hidden="true"
    />
    <p class="text-sm text-content-muted">{{ message ?? $t("loading.games") }}</p>
  </div>
</template>
