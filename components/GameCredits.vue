<script setup lang="ts">
//// Imports
import * as icons from "lucide-vue-next";
import type { GameMember } from "~/types/game";

//// Props
// Créditos da equipe que participou do jogo — seção discreta na coluna de
// informações do GameModal (junto do painel "Disponível em", no fim), sem
// competir visualmente com nome/descrição/imagem/tags do jogo.
const props = defineProps<{
  members: GameMember[];
}>();

//// Agrupamento por função (role_in_game): dinâmico, na ordem em que os
// membros chegam da API — nenhuma função é assumida/fixa de antemão, só as
// que realmente existirem nos dados desse jogo. role_in_game é texto livre
// digitado por humanos (mesmo motivo da prop `raw` em Tag.vue), então nunca
// passa por toLabel() aqui.
const groupedMembers = computed(() => {
  const groups: { role: string; members: GameMember[] }[] = [];
  const byRole = new Map<string, GameMember[]>();

  for (const member of props.members) {
    let list = byRole.get(member.roleInGame);
    if (!list) {
      list = [];
      byRole.set(member.roleInGame, list);
      groups.push({ role: member.roleInGame, members: list });
    }
    list.push(member);
  }

  return groups;
});

//// Ícone único por membro dentro desta lista: atribuído pela posição no
// array recebido (não pela função), ciclando por um pequeno conjunto de
// ícones de identidade/pessoa do lucide-vue-next — só um marcador visual
// pra diferenciar cada pessoa de relance, sem relação com o cargo exercido.
const MEMBER_ICONS = [
  "User",
  "UserRound",
  "UserCheck",
  "Contact",
  "IdCard",
  "Fingerprint",
  "Smile",
  "UserCog",
];

const iconByNick = computed(() => {
  const map = new Map<string, string>();
  props.members.forEach((member, i) => {
    map.set(member.nick, MEMBER_ICONS[i % MEMBER_ICONS.length]);
  });
  return map;
});

function getIcon(name?: string): any {
  if (!name) return null;
  return icons[name as keyof typeof icons];
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div v-for="group in groupedMembers" :key="group.role">
      <h3 class="eyebrow mb-1.5">
        {{ group.role }}
      </h3>

      <div class="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
        <template v-for="(member, i) in group.members" :key="member.nick">
          <!-- Rota reaproveitada de MemberCard.vue (/members/[nick]), usando
               sempre o nick vindo dos dados — nunca inferido do nome. -->
          <NuxtLink
            :to="`/members/${encodeURIComponent(member.nick)}`"
            :title="member.name"
            class="group inline-flex items-center gap-1 text-content-secondary transition-colors duration-200 hover:text-accent"
          >
            <component
              :is="getIcon(iconByNick.get(member.nick))"
              :size="13"
              class="shrink-0 text-content-muted transition-colors duration-200 group-hover:text-accent"
            />
            @{{ member.nick }}
          </NuxtLink>
          <span
            v-if="i < group.members.length - 1"
            class="text-content-faint"
            aria-hidden="true"
          >
            ·
          </span>
        </template>
      </div>
    </div>
  </div>
</template>
