<script setup lang="ts">
//// Imports
import * as icons from "lucide-vue-next";

//// Props
const props = defineProps<{
  name: string;
  color: string;
  icon?: string;
  variant?: "filled" | "outlined";
  // "sm" é o padrão (usado nos cards da grade). "lg" é usado no modal de
  // detalhes, onde as tags precisam de mais presença visual/leitura.
  size?: "sm" | "lg";
  // Quando true, exibe `name` exatamente como recebido, sem passar pelo
  // toLabel()/catálogo de tradução. Necessário para valores livres digitados
  // por humanos (ex.: o cargo de um membro num jogo), que não seguem o
  // padrão snake_case dos enums do banco e não devem ser reformatados nem
  // procurados no catálogo.
  raw?: boolean;
  // Qual catálogo de tradução usar pra `name` (ver useCatalogLabel) — tipos
  // de jogo (coming_soon, game_jam...) e tags de gênero (romance,
  // adventure...) vivem em namespaces diferentes no i18n. Ignorado quando
  // `raw` é true.
  kind?: "tags" | "types";
  // Usado só nas tags selecionadas como filtro (pages/index.vue): no hover,
  // sinaliza que o clique vai remover aquele filtro — fundo vermelho
  // translúcido + um "X" ao final do texto. Não muda o clique em si (quem
  // trata a remoção continua sendo o <span> que envolve a Tag ali, como já
  // documentado abaixo pro cursor); é só o indicativo visual. Nenhuma outra
  // Tag (cards, modal, dropdowns) passa essa prop, então o estilo fica
  // restrito a esse uso.
  removable?: boolean;
}>();

const { label } = useCatalogLabel();

const displayText = computed(() =>
  props.raw ? props.name : label(props.kind ?? "tags", props.name),
);

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
    class="flex max-w-full items-center rounded-full"
    :class="[sizeClasses, removable && removableClasses]"
    :style="style"
  >
    <component
      v-if="icon && icon"
      :is="getIcon(icon)"
      :size="iconSize"
      class="shrink-0"
    />
    <span class="min-w-0 truncate">{{ displayText }}</span>
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
