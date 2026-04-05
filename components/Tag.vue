<script setup lang="ts">
import * as icons from "lucide-vue-next";
import type { Tag, GameType } from "~/data/games";

const props = defineProps<{
  tag: Tag | GameType;
  variant?: "filled" | "outlined";
}>();

function getIcon(name?: string): any {
  if (!name) return null;
  return icons[name as keyof typeof icons];
}

const style = computed(() => {
  if (props.variant === "outlined") {
    return {
      border: `1px solid ${props.tag.color}`,
      color: props.tag.color,
      backgroundColor: "transparent",
    };
  }
  return {
    backgroundColor: props.tag.color,
    color: useContrastColor(props.tag.color),
  };
});
</script>

<template>
  <span
    class="flex items-center gap-1 px-3 py-1 rounded-full text-xs cursor-pointer"
    :style="style"
  >
    <component
      v-if="'icon' in tag && tag.icon"
      :is="getIcon(tag.icon)"
      :size="16"
      class="shrink-0"
    />
    {{ tag.label }}
  </span>
</template>
