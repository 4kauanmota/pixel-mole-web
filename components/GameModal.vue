<script setup lang="ts">
//// Imports
import * as icons from "lucide-vue-next";
import type { Game } from "~/types/game";

//// Props / emits
// Modal reutilizável para os jogos menores (Game Jams etc). Recebe qualquer
// `Game` e se adapta à quantidade de imagens, tags, descrição e links
// disponíveis — nenhum desses campos é obrigatório.
const props = defineProps<{
  game: Game;
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

function close() {
  emit("update:open", false);
}

//// Fechar com ESC + travar o scroll do body enquanto o modal está aberto
function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") close();
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeydown);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeydown);
    }
  },
);

onUnmounted(() => {
  document.body.style.overflow = "";
  window.removeEventListener("keydown", handleKeydown);
});

//// Dados derivados (só renderiza cada seção se houver conteúdo)
const hasBanner = computed(() => !!props.game.thumbnail);
const hasScreenshots = computed(() => !!props.game.screenshots?.length);
const hasGallery = computed(() => hasBanner.value || hasScreenshots.value);
const hasTags = computed(() => !!props.game.tags?.length);
const hasDescription = computed(() => !!props.game.description);
const visibleLinks = computed(
  () => props.game.links?.filter((link) => !!link.url) ?? [],
);
const hasLinks = computed(() => !!visibleLinks.value.length);
const hasInfo = computed(
  () => hasTags.value || hasDescription.value || hasLinks.value,
);
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-backdrop">
      <div
        v-if="open"
        class="fixed inset-0 z-[100] overflow-y-auto bg-black/70 px-4 py-8 backdrop-blur-sm sm:py-16"
        @click.self="close"
      >
        <Transition name="modal-panel">
          <div
            v-if="open"
            class="relative mx-auto w-full max-w-[1400px] rounded-2xl border border-pm-gray bg-pm-black shadow-2xl"
            role="dialog"
            aria-modal="true"
            :aria-label="game.name"
          >
            <!-- Brilho ambiente sutil, reforça a sensação de profundidade -->
            <div
              class="pointer-events-none absolute inset-0 -z-10 rounded-[2rem] opacity-30 blur-3xl"
              :style="{
                background: `radial-gradient(circle at 25% 0%, ${game.type.color}, transparent 60%)`,
              }"
            />

            <button
              class="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-pm-yellow text-pm-dark shadow-lg transition-transform duration-300 hover:scale-110 hover:rotate-90 active:scale-95 sm:-right-3 sm:-top-3"
              aria-label="Fechar"
              @click="close"
            >
              <component :is="icons['X']" :size="20" />
            </button>

            <div class="p-6 sm:p-8 lg:p-10">
              <!-- Cabeçalho -->
              <div class="mb-6 sm:mb-8">
                <Tag
                  :name="game.type.name"
                  :color="game.type.color"
                  variant="outlined"
                  size="lg"
                  class="mb-3 inline-flex"
                />
                <h2
                  class="max-w-3xl break-words text-3xl font-bold text-white sm:text-4xl"
                >
                  {{ game.name }}
                </h2>
              </div>

              <!-- Mídia (banner + screenshots) + informações lado a lado -->
              <div class="grid grid-cols-1 gap-8 lg:grid-cols-5">
                <div :class="hasInfo ? 'lg:col-span-3' : 'lg:col-span-5'">
                  <GameGallery
                    v-if="hasGallery"
                    :banner="game.thumbnail"
                    :screenshots="game.screenshots"
                    :alt="game.name"
                  />
                </div>

                <div
                  v-if="hasInfo"
                  class="flex flex-col gap-6 lg:col-span-2"
                >
                  <div v-if="hasTags">
                    <h3
                      class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      Tags
                    </h3>
                    <div class="flex flex-wrap gap-2.5">
                      <Tag
                        v-for="tag in game.tags"
                        :key="tag.name"
                        :name="tag.name"
                        :color="tag.color"
                        :icon="tag.icon"
                        size="lg"
                      />
                    </div>
                  </div>

                  <div v-if="hasDescription">
                    <h3
                      class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      Sobre o jogo
                    </h3>
                    <p
                      class="whitespace-pre-line leading-relaxed text-gray-400"
                    >
                      {{ game.description }}
                    </p>
                  </div>

                  <div
                    v-if="hasLinks"
                    class="mt-auto rounded-2xl border border-pm-gray/60 bg-white/[0.03] p-5"
                  >
                    <h3
                      class="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      Disponível em
                    </h3>
                    <div class="flex flex-wrap gap-3">
                      <GameLinkButton
                        v-for="link in visibleLinks"
                        :key="link.platform"
                        :link="link"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 0.25s ease;
}
.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

.modal-panel-enter-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-panel-leave-active {
  transition: all 0.2s ease-in;
}
.modal-panel-enter-from,
.modal-panel-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}
</style>
