<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as icons from "lucide-vue-next";

const props = defineProps<{
  modelValue: string[];
  options: { name: string; icon?: string }[];
}>();
const emit = defineEmits(["update:modelValue"]);

const { t } = useI18n();
const { label } = useCatalogLabel();
const open = ref(false);
const container = ref<HTMLElement>();

function handleClickOutside(e: MouseEvent) {
  if (!container.value?.contains(e.target as Node)) {
    open.value = false;
  }
}

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));

function getIcon(name?: string): any {
  if (!name) return null;
  return icons[name as keyof typeof icons];
}

function toggle(value: string) {
  const current = [...props.modelValue];
  const index = current.indexOf(value);
  if (index === -1) current.push(value);
  else current.splice(index, 1);
  emit("update:modelValue", current);
}
</script>

<template>
  <div class="relative" ref="container" :class="open ? 'z-50' : 'z-10'">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-40 backdrop-blur-sm bg-surface-scrim"
        @click="open = false"
      />
    </Transition>

    <GradientBorder radius="var(--radius-control)" :active="open" class="relative z-50 h-full">
      <div
        class="flex min-w-0 cursor-pointer items-center text-content-primary transition-opacity duration-200 hover:opacity-80 active:scale-80"
        :class="FILTER_CONTROL_CLASSES"
        @click="open = !open"
      >
        <span class="flex min-w-0 items-center gap-1 select-none">
          {{ t("filters.selectTags") }}
          <component
            :is="getIcon('ChevronDown')"
            :size="16"
            class="shrink-0 transition-transform duration-300"
            :class="{ 'rotate-270': !open }"
          />
        </span>
      </div>
    </GradientBorder>

    <Transition name="dropdown">
      <div
        v-if="open"
        class="absolute top-full right-0 min-w-max mt-1 z-50 rounded-xl overflow-hidden border border-border-strong bg-surface-overlay shadow-lg"
      >
        <div
          v-for="opt in options"
          :key="opt.name"
          class="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
          :class="
            modelValue.includes(opt.name)
              ? 'bg-pm-yellow hover:opacity-90'
              : 'hover:bg-surface-hover'
          "
          @click="toggle(opt.name)"
        >
          <span
            class="w-4 h-4 rounded border flex items-center justify-center text-xs"
            :class="
              modelValue.includes(opt.name)
                ? 'bg-pm-dark border-pm-dark text-pm-yellow'
                : 'border-border-strong text-transparent'
            "
          >
            ✓</span
          >
          <component
            :is="getIcon(opt.icon)"
            :size="16"
            class="shrink-0"
            :class="
              modelValue.includes(opt.name) ? 'text-pm-dark' : 'text-content-muted'
            "
          />
          <span
            :class="
              modelValue.includes(opt.name)
                ? 'text-pm-dark font-medium'
                : 'text-content-primary'
            "
          >
            {{ label("tags", opt.name) }}
          </span>
        </div>
      </div>
    </Transition>
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

.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
