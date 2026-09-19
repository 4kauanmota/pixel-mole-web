<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{ radius?: string; active?: boolean }>();
const focused = ref(false);
const isActive = computed(() =>
  props.active !== undefined ? props.active : focused.value,
);
</script>

<template>
  <div
    class="gradient-border"
    :class="{ active: isActive }"
    :style="{ '--radius': radius ?? '12px' }"
    @focusin="focused = true"
    @focusout="focused = false"
  >
    <slot />
  </div>
</template>

<style scoped>
.gradient-border {
  position: relative;
  border-radius: var(--radius);
  padding: 2px;
  background: var(--border-strong);
}

.gradient-border::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: var(--radius);
  background: linear-gradient(var(--angle), var(--pm-yellow), var(--pm-orange));
  animation: spin 6s linear infinite;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.gradient-border.active::before {
  opacity: 1;
}

.gradient-border > :deep(*) {
  position: relative;
  z-index: 1;
  border-radius: calc(var(--radius) - 2px);
  background: var(--surface-card);
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
}

@property --angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

@keyframes spin {
  to {
    --angle: 360deg;
  }
}
</style>
