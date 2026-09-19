<script setup lang="ts">
import { ref } from "vue";

defineProps<{ modelValue: string }>();
defineEmits(["update:modelValue"]);

const { t } = useI18n();
const focused = ref(false);
</script>

<template>
  <div class="flex-1 relative" :class="focused ? 'z-50' : 'z-10'">
    <Transition name="fade">
      <div
        v-if="focused"
        class="fixed inset-0 z-40 backdrop-blur-sm bg-surface-scrim"
        @click="focused = false"
      />
    </Transition>

    <GradientBorder radius="var(--radius-control)" :active="focused" class="relative z-50 h-full">
      <input
        type="text"
        :value="modelValue"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
        @focus="focused = true"
        @blur="focused = false"
        :placeholder="t('filters.searchPlaceholder')"
        class="h-full w-full bg-transparent text-content-primary placeholder:text-content-muted"
        :class="FILTER_CONTROL_CLASSES"
      />
    </GradientBorder>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
