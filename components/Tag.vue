<script setup lang="ts">
//// Imports
import * as icons from "lucide-vue-next";

//// Props
const props = defineProps<{
  name: string;
  color: string;
  icon?: string;
  variant?: "filled" | "outlined";
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
</script>

<template>
  <span
    class="flex items-center gap-1 px-3 py-1 rounded-full text-xs cursor-pointer"
    :style="style"
  >
    <component
      v-if="icon && icon"
      :is="getIcon(icon)"
      :size="16"
      class="shrink-0"
    />
    {{ toLabel(name) }}
  </span>
</template>
