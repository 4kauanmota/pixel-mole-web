<script setup lang="ts">
//// Imports
import * as icons from "lucide-vue-next";
import type { LocalizedText } from "~/types/i18n";

//// Props
const props = defineProps<{
  // Aceita tanto o formato multilíngue novo vindo do Supabase (jsonb
  // { pt, en }) quanto uma string simples (campos ainda não migrados, ou
  // texto já resolvido/montado pelo próprio componente-pai — ver
  // roleSummary em pages/members/[nick].vue). Sempre resolvido pro idioma
  // atual via useLocalizedText() (ver `displayText` abaixo). Substitui as
  // antigas props `raw`/`kind` (useCatalogLabel): agora qualquer texto
  // passado aqui já sai pronto para exibição, sem tratamento adicional
  // neste componente.
  name: LocalizedText | string;
  color: string;
  icon?: string;
  variant?: "filled" | "outlined";
  // "sm" é o padrão (usado nos cards da grade). "lg" é usado no modal de
  // detalhes, onde as tags precisam de mais presença visual/leitura.
  size?: "sm" | "lg";
  // Usado só nas tags selecionadas como filtro (pages/index.vue): no hover,
  // sinaliza que o clique vai remover aquele filtro — fundo vermelho
  // translúcido + um "X" ao final do texto. Não muda o clique em si (quem
  // trata a remoção continua sendo o <span> que envolve a Tag ali, como já
  // documentado abaixo pro cursor); é só o indicativo visual. Nenhuma outra
  // Tag (cards, modal, dropdowns) passa essa prop, então o estilo fica
  // restrito a esse uso.
  removable?: boolean;
  // Opt-in: quando true, o texto pode quebrar em várias linhas em vez de
  // truncar numa só (ver MemberCard.vue, cargo default_role — texto que
  // NUNCA pode ficar cortado/escondido). Sem essa prop (padrão = false), o
  // comportamento é EXATAMENTE o de sempre (truncate + pill arredondada) —
  // nenhum outro uso da Tag no site é afetado. Uma pill totalmente
  // arredondada não fica bem com texto em 2+ linhas (vira uma "cápsula"
  // esticada), então junto da quebra de linha a forma também muda pra um
  // badge com cantos menos arredondados (rounded-lg) e alinhamento pelo
  // topo (items-start), em vez de centralizado.
  wrap?: boolean;
  // Opt-in: reaplica o tratamento que existia antes da migração pra jsonb
  // (ver utils/formatters.ts -> toLabel()) sobre o texto JÁ localizado —
  // troca "_" por espaço e capitaliza só a primeira letra (ex.:
  // "visual_novel" -> "Visual novel"). A tradução continua funcionando
  // normalmente (localize() roda primeiro, sempre); isso só arruma a
  // formatação de valores que ainda vêm com underscore do Supabase.
  // Usado nas tags de gênero (game.tags) e no badge de tipo (game.type) —
  // pedido explícito do usuário, nos dois casos. Sem essa prop (padrão =
  // false), nenhum outro uso da Tag no site é afetado.
  formatSlug?: boolean;
}>();

const { localize } = useLocalizedText();

const displayText = computed(() => {
  const text = localize(props.name);
  return props.formatSlug ? toLabel(text) : text;
});

//// Utils
function getIcon(name?: string): any {
  if (!name) return null;
  return icons[name as keyof typeof icons];
}

//// Computed styles
const style = computed(() => {
  if (props.variant === "outlined") {
    return {
      border: `1px solid ${props.color}`,
      color: props.color,
      backgroundColor: "transparent",
    };
  }

  return {
    backgroundColor: props.color,
    color: useContrastColor(props.color),
  };
});

// Tags "outlined" (o tipo do jogo: Coming Soon / Game Jam) têm menos
// contraste por causa do fundo transparente, então usam bold pra
// continuarem fáceis de identificar. As "filled" já têm contraste de sobra
// com a cor sólida de fundo, então usam um peso mais discreto.
const sizeClasses = computed(() => {
  const base =
    props.size === "lg"
      ? "gap-1.5 px-4 py-2 text-sm"
      : "gap-1.5 px-3 py-1.5 text-xs";
  const weight = props.variant === "outlined" ? "font-bold" : "font-medium";
  return `${base} ${weight}`;
});

// Hover de remoção (só quando removable): sobrescreve a cor de fundo — e,
// por herança do `currentColor`, o texto e os ícones — com um vermelho
// translúcido. Mesma técnica de override com `!` já usada no selo de tipo
// sobre a thumbnail do card (Card.vue) pra vencer o `:style` inline acima.
// "group" só controla a opacidade do "X" logo abaixo, sem precisar de JS.
const removableClasses =
  "group transition-colors duration-200 hover:!border-red-500/50 hover:!bg-red-500/15 hover:!text-red-400";

const iconSize = computed(() => (props.size === "lg" ? 18 : 16));
</script>

<template>
  <!-- Cursor: a Tag NUNCA define o próprio cursor (nem "pointer" nem
       "default") — propositalmente. `cursor` é uma propriedade CSS
       herdada: um elemento que não define a sua própria assume o valor do
       ancestral mais próximo que definiu um. Isso faz o comportamento ser
       automaticamente correto nos três contextos que a Tag aparece:
         - Puramente informativa (ex.: seção "Tags" do GameModal, cargo na
           página individual do membro): nenhum ancestral define cursor ->
           herda o padrão do navegador (visualmente = seta normal).
         - Dentro de um card inteiro clicável (Card.vue, MemberCard.vue):
           o `cursor-pointer` já está no elemento raiz do GradientBorder,
           bem acima na árvore -> a tag herda "pointer" dele, então passar
           o mouse sobre ela não parece "sair" da área clicável do card.
         - Tags de filtro removíveis (pages/index.vue, "Selecionar tags"):
           o <span> que envolve cada Tag ali já tem `cursor-pointer` e o
           @click de remoção -> a tag herda "pointer" dele também.
       Se alguma Tag ganhar uma ação de clique própria no futuro, ela deve
       então SIM declarar `cursor-pointer` explicitamente na própria classe
       — o que não quebra esse mecanismo, só deixa de depender dele. -->
  <span
    class="flex max-w-full"
    :class="[
      sizeClasses,
      removable && removableClasses,
      wrap ? 'items-start rounded-lg' : 'items-center rounded-full',
    ]"
    :style="style"
  >
    <component
      v-if="icon && icon"
      :is="getIcon(icon)"
      :size="iconSize"
      class="shrink-0"
    />
    <span class="min-w-0" :class="wrap ? 'whitespace-normal break-words' : 'truncate'">{{ displayText }}</span>
    <!-- Sempre renderizado (não v-if em cima do hover) e só com a opacidade
         animada: assim o espaço do "X" já fica reservado desde o início e
         a tag não muda de tamanho/empurra as vizinhas ao passar o mouse. -->
    <component
      v-if="removable"
      :is="getIcon('X')"
      :size="iconSize"
      class="shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
    />
  </span>
</template>
