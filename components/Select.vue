<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as icons from "lucide-vue-next";

const props = defineProps<{
  modelValue: string;
  options: string[];
  // Namespace de tradução usado pra exibir cada opção (ver useCatalogLabel)
  // — "types" pro filtro de status de jogo, que é o único uso hoje.
  kind?: "tags" | "types";
}>();
const emit = defineEmits(["update:modelValue"]);

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

function select(value: string) {
  emit("update:modelValue", value);
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
        class="flex min-w-0 cursor-pointer items-center text-content-primary transition-opacity duration-200 hover:opacity-80"
        :class="FILTER_CONTROL_CLASSES"
        @click="open = !open"
      >
        <span class="flex min-w-0 items-center gap-1 select-none">
          <!-- leading-6: a fonte cursiva do site precisa de mais espaço
               vertical do que o line-height padrão do Tailwind pra essa
               fonte; sem isso, o "overflow-hidden" do truncate corta o
               rabinho de letras com descendente (ex.: o "g" de "games"). -->
          <span class="truncate leading-6">{{
            label(kind ?? "types", options.find((o) => o === modelValue) as string)
          }}</span>
          <component
            :is="icons['ChevronDown']"
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
          v-for="option in options"
          :key="option"
          class="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
          :class="
            modelValue === option
              ? 'bg-pm-yellow hover:opacity-90'
              : 'hover:bg-surface-hover'
          "
          @click="select(option)"
        >
          <span
            :class="
              modelValue === option
                ? 'text-pm-dark font-medium'
                : 'text-content-primary'
            "
          >
            {{ label(kind ?? "types", option) }}
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
