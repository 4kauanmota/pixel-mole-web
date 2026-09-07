<script setup lang="ts">
//// Imports
import type { MemberSummary } from "~/types/member";

//// Props
const props = defineProps<{
  member: MemberSummary;
}>();

const hovered = ref(false);
</script>

<template>
  <NuxtLink
    :to="`/members/${encodeURIComponent(member.nick)}`"
    class="z-50 block h-full"
  >
    <GradientBorder
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
      :active="hovered"
      class="h-full w-full cursor-pointer shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
    >
      <!-- Composição horizontal (foto à esquerda, informações à direita) em
           vez de um bloco vertical centralizado — evita o card quase
           quadrado com espaço vazio ao redor da foto: o espaço ao lado dela
           agora é onde nome/@nick/cargo vivem, não sobra vazio. Mesmo
           padrão já usado no cabeçalho da página individual do membro
           (foto + bloco de texto lado a lado). -->
      <li
        class="flex h-full items-center gap-4 overflow-hidden rounded-xl border-pm-gray bg-pm-black p-4 sm:gap-5 sm:p-5"
      >
        <!-- Zoom no hover fica só na FOTO, dentro da própria área (mesmo
             mecanismo do thumbnail em Card.vue) — passar a escala pro
             círculo em si (root do MemberAvatar) faria a foto crescer pra
             fora da área dela, "aumentando" visualmente o card. -->
        <MemberAvatar
          :nick="member.nick"
          :name="member.name"
          :zoomed="hovered"
          class="h-20 w-20 shrink-0 shadow-md shadow-black/30 sm:h-24 sm:w-24"
        />

        <!-- Hierarquia: nome (destaque, branco, maior) -> @nick (discreto,
             cinza) -> cargo (badge outlined, mesmo padrão usado na página
             individual do membro) — cada um com um peso visual diferente,
             sem competir entre si. -->
        <div class="min-w-0 flex-1">
          <h1 class="line-clamp-1 text-xl font-bold text-white sm:text-2xl">
            {{ member.name }}
          </h1>

          <p class="line-clamp-1 text-sm text-gray-500 sm:text-base">
            @{{ member.nick }}
          </p>

          <Tag
            v-if="member.defaultRole"
            :name="member.defaultRole"
            raw
            color="var(--pm-yellow)"
            variant="outlined"
            class="mt-2 inline-flex max-w-full"
          />
        </div>
      </li>
    </GradientBorder>
  </NuxtLink>
</template>
