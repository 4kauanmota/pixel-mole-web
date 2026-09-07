<script setup lang="ts">
//// Imports
// Foto vem dos assets do projeto (assets/img/members/[nick]), não do
// Supabase — ver utils/memberPhotos.ts.

//// Props
const props = defineProps<{
  nick: string;
  name: string;
  // "lg" é usado na página individual (única foto "hero" da página — vale a
  // pena carregar imediatamente). "sm" (padrão) é usado nos cards da
  // listagem, que podem estar fora da dobra — ver `loading`.
  size?: "sm" | "lg";
  // true pra pular o lazy loading (imagem já visível ao carregar a página).
  eager?: boolean;
  // true (controlado por quem usa o componente, ex.: hover no card do
  // membro) pra aplicar o zoom na FOTO. O zoom é feito na <img> em si —
  // que já vive dentro do círculo com overflow-hidden — nunca no círculo
  // (root do componente), senão a foto cresce pra fora da própria área em
  // vez de dar zoom "recortado" nela mesma (mesmo mecanismo já usado no
  // thumbnail do Card.vue).
  zoomed?: boolean;
}>();

const photo = computed(() => getMemberPhoto(props.nick));
const loaded = ref(false);
const failed = ref(false);

// Ao trocar de membro (navegação entre páginas individuais reaproveitando o
// mesmo componente), reseta o estado — senão a foto nova nasceria já
// marcada como "carregada"/"falhou" por causa da anterior.
watch(
  () => props.nick,
  () => {
    loaded.value = false;
    failed.value = false;
  },
);

// Só tenta mostrar a <img> se existir uma foto pra esse nick E ela não
// tiver falhado ao carregar. As iniciais (fallback) ficam visíveis sempre
// que não há foto, a foto falhou, OU ela ainda está carregando — assim o
// navegador nunca chega a mostrar o nome do arquivo, texto alternativo ou
// espaço quebrado no lugar da imagem: sempre há algo visualmente completo
// (o próprio placeholder) por baixo.
const showImage = computed(() => !!photo.value && !failed.value);
const showInitials = computed(() => !showImage.value || !loaded.value);

const initialsSize = computed(() =>
  props.size === "lg" ? "text-4xl" : "text-2xl",
);
</script>

<template>
  <!-- Sem tamanho fixo aqui de propósito: quem usa este componente sempre
       passa h-*/w-* via `class` (fallthrough attr do Vue). Se o componente
       também definisse h-full/w-full no próprio root, as duas classes de
       tamanho concorreriam pela mesma propriedade CSS e o resultado passa a
       depender da ordem de geração do Tailwind (não da ordem no HTML) — foi
       exatamente isso que esticou o avatar num oval no card em telas
       estreitas. -->
  <div
    class="relative flex items-center justify-center overflow-hidden rounded-full border-2 border-pm-gray bg-pm-gray"
  >
    <span
      v-if="showInitials"
      class="font-bold text-white"
      :class="initialsSize"
    >
      {{ getInitials(name) }}
    </span>

    <img
      v-if="showImage"
      :src="photo"
      :alt="name"
      :loading="eager ? 'eager' : 'lazy'"
      class="absolute inset-0 h-full w-full object-cover transition-all duration-300"
      :class="[
        loaded ? 'opacity-100' : 'opacity-0',
        zoomed ? 'scale-110' : 'scale-100',
      ]"
      @load="loaded = true"
      @error="failed = true"
    />
  </div>
</template>
