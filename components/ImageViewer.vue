<script setup>
import { ref, onMounted, onUpdated, onUnmounted } from "vue";
import { Fancybox } from "@fancyapps/ui/dist/fancybox/";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

// Definindo as Props
const props = defineProps({
  fancyboxOptions: {
    type: Object,
    default: () => ({}),
  },
});

// Referência para o elemento HTML do container
const container = ref(null);

// Inicializa o Fancybox ao montar o componente
onMounted(() => {
  Fancybox.bind(container.value, "[data-fancybox]", {
    ...(props.fancyboxOptions || {}),
  });
});

// Atualiza o Fancybox caso o conteúdo mude (reatividade)
onUpdated(() => {
  Fancybox.unbind(container.value);
  Fancybox.close();
  Fancybox.bind(container.value, "[data-fancybox]", {
    ...(props.fancyboxOptions || {}),
  });
});

// Destrói o Fancybox ao desmontar o componente para evitar vazamento de memória
onUnmounted(() => {
  Fancybox.unbind(container.value);
  Fancybox.close();
});
</script>

<template>
  <div ref="container">
    <slot></slot>
  </div>
</template>
