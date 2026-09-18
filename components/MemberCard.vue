<script setup lang="ts">
//// Imports
import type { MemberSummary } from "~/types/member";

//// Props
const props = defineProps<{
  member: MemberSummary;
}>();

const hovered = ref(false);

// `default_role` pode trazer 1 ou 2 cargos separados por vírgula — o
// primeiro sempre vira a tag amarela de sempre; o segundo (se existir) vira
// a nova tag roxa (ver SECONDARY_ROLE_COLOR).
const roles = computed(() => splitRoles(props.member.defaultRole));

// Nomes até esse tamanho sempre aparecem por completo — mesmo que precisem
// quebrar em 2 linhas (ex.: "Liana Toledo", com 12 caracteres) — em vez de
// serem cortados por pouco com reticências. Só nomes REALMENTE longos
// (acima do limite) continuam sendo truncados numa linha só, como antes.
const NAME_TRUNCATE_THRESHOLD = 16;
const nameFits = computed(
  () => props.member.name.length <= NAME_TRUNCATE_THRESHOLD,
);
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
          <!-- Truncamento com exceção: nomes curtos/médios (ver
               NAME_TRUNCATE_THRESHOLD) usam break-words e podem ocupar 2
               linhas em vez de serem cortados; só nomes muito longos mantêm
               o line-clamp-1 de sempre. -->
          <h1
            class="text-xl font-bold text-white sm:text-2xl"
            :class="nameFits ? 'break-words' : 'line-clamp-1'"
          >
            {{ member.name }}
          </h1>

          <p class="line-clamp-1 text-sm text-gray-500 sm:text-base">
            @{{ member.nick }}
          </p>

          <!-- Cargo(s): a tag amarela de sempre, mais uma segunda tag roxa
               quando o membro tem 2 cargos (ver splitRoles) — visualmente
               distintas (outlined vs. preenchida) mas ambas cores da
               identidade do estúdio. -->
          <div v-if="roles.length" class="mt-2 flex flex-wrap gap-1.5">
            <Tag
              v-if="roles[0]"
              :name="roles[0]"
              raw
              color="var(--pm-yellow)"
              variant="outlined"
              class="max-w-full"
            />
            <Tag
              v-if="roles[1]"
              :name="roles[1]"
              raw
              :color="SECONDARY_ROLE_COLOR"
              variant="filled"
              class="max-w-full"
            />
          </div>
        </div>
      </li>
    </GradientBorder>
  </NuxtLink>
</template>
