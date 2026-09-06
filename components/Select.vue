<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as icons from "lucide-vue-next";

const props = defineProps<{
  modelValue: string;
  options: string[];
}>();
const emit = defineEmits(["update:modelValue"]);

const open = ref(false);
const container = ref<HTMLElement>();

function handleClickOutside(e: MouseEvent) {
  if (!container.value?.contains(e.target as Node)) {
    open.value = false;
  }
}

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));

function select(value: string) {
  emit("update:modelValue", value);
}
</script>

<template>
  <div class="relative" ref="container" :class="open ? 'z-50' : 'z-10'">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-40 backdrop-blur-sm bg-black/40"
        @click="open = false"
      />
    </Transition>

    <GradientBorder :active="open" class="relative z-50 h-full">
      <div
        class="flex flex-col gap-2 p-4 cursor-pointer transition-opacity duration-200 hover:opacity-80"
        @click="open = !open"
      >
        <span class="text-sm select-none flex items-center gap-1">
          {{ toLabel(options.find((o) => o === modelValue) as string) }}
          <component
            :is="icons['ChevronDown']"
            :size="16"
            class="transition-transform duration-300"
            :class="{ 'rotate-270': !open }"
          />
        </span>
      </div>
    </GradientBorder>

    <Transition name="dropdown">
      <div
        v-if="open"
        class="absolute top-full right-0 min-w-max mt-1 z-50 rounded-xl overflow-hidden border border-gray-700 bg-[#1a1a1c]"
      >
        <div
          v-for="option in options"
          :key="option"
          class="flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors"
          :class="
            modelValue === option
              ? 'bg-pm-yellow hover:opacity-90'
              : 'hover:bg-[#2a2a2c]'
          "
          @click="select(option)"
        >
          <span
            :class="
              modelValue === option ? 'text-pm-dark font-medium' : 'text-white'
            "
          >
            {{ toLabel(option) }}
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
