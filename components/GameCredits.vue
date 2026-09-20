<script setup lang="ts">
//// Imports
import * as icons from "lucide-vue-next";
import type { GameMember } from "~/types/game";

//// Props
// Créditos da equipe que participou do jogo — seção discreta na coluna de
// informações do GameModal (junto do painel "Disponível em", no fim), sem
// competir visualmente com nome/descrição/imagem/tags do jogo.
const props = defineProps<{
  // Opcional/nullable de propósito: hoje o único uso real (GameModal.vue)
  // já passa `game.members ?? []`, mas este componente não deveria
  // depender disso — se algum outro lugar passar `undefined`/`null` no
  // futuro, ele continua funcionando (lista vazia) em vez de quebrar.
  members?: GameMember[] | null;
}>();

const { localize } = useLocalizedText();

const membersList = computed(() => props.members ?? []);

//// Agrupamento por função (role_in_game): dinâmico, na ordem em que os
// membros chegam da API — nenhuma função é assumida/fixa de antemão, só as
// que realmente existirem nos dados desse jogo. role_in_game agora pode vir
// como texto multilíngue (jsonb) OU string simples (campo ainda não
// migrado) — agrupamos pelo texto já resolvido no idioma atual (via
// localize()), não pelo valor bruto, senão dois objetos com o mesmo
// conteúdo (mas referências diferentes) virariam grupos separados.
const groupedMembers = computed(() => {
  const groups: { role: string; members: GameMember[] }[] = [];
  const byRole = new Map<string, GameMember[]>();

  for (const member of membersList.value) {
    const roleText = localize(member.roleInGame);
    let list = byRole.get(roleText);
    if (!list) {
      list = [];
      byRole.set(roleText, list);
      groups.push({ role: roleText, members: list });
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
  membersList.value.forEach((member, i) => {
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
