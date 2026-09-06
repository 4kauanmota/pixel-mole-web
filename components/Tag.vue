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
}>();

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

const sizeClasses = computed(() =>
  props.size === "lg"
    ? "gap-1.5 px-4 py-1.5 text-sm"
    : "gap-1 px-3 py-1 text-xs",
);

const iconSize = computed(() => (props.size === "lg" ? 18 : 16));
</script>

<template>
  <span
    class="flex items-center rounded-full cursor-pointer"
    :class="sizeClasses"
    :style="style"
  >
    <component
      v-if="icon && icon"
      :is="getIcon(icon)"
      :size="iconSize"
      class="shrink-0"
    />
    {{ toLabel(name) }}
  </span>
</template>
