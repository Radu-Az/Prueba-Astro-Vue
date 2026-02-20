<template>
  <!--
    Grid bento interactivo:
    - Hover/focus en desktop.
    - Tap en móvil.
  -->
  <div class="grid grid-cols-1 items-start gap-4 md:grid-cols-6">
    <article
      v-for="(card, cardIndex) in cards"
      :key="`${card.title}-${cardIndex}`"
      :class="[
        'service-card group relative z-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 px-5 py-4 text-center shadow-sm shadow-slate-200/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-300/40 dark:border-slate-700/80 dark:bg-slate-900/75 dark:shadow-slate-950/40 dark:hover:shadow-slate-950/60',
        card.size,
      ]"
      role="button"
      tabindex="0"
      :aria-expanded="isCardOpen(cardIndex) ? 'true' : 'false'"
      :aria-label="`${detailsLabel} ${card.title}`"
      @click="handleCardClick(cardIndex)"
      @keydown="handleCardKeydown($event, cardIndex)"
    >
      <div class="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white to-transparent dark:from-slate-900" aria-hidden="true"></div>

      <span
        class="service-icon absolute bottom-2 left-1/2 z-10 -translate-x-1/2 text-xs font-semibold leading-none text-slate-400 transition-all duration-300 group-hover:opacity-0 group-focus-within:opacity-0 dark:text-slate-500"
        :class="{ 'opacity-0': isCardOpen(cardIndex) }"
        aria-hidden="true"
      >
        +
      </span>

      <h3
        class="service-title absolute left-4 right-4 top-1/2 z-10 -translate-y-1/2 break-words text-center text-lg font-semibold uppercase leading-tight tracking-[0.08em] text-slate-900 transition-all duration-300 group-hover:-translate-y-12 group-hover:opacity-0 group-focus-within:-translate-y-12 group-focus-within:opacity-0 dark:text-slate-100 sm:text-xl"
        :class="{ '-translate-y-12 opacity-0': isCardOpen(cardIndex) }"
      >
        {{ card.title }}
      </h3>

      <p
        class="service-description pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4 text-center text-base leading-relaxed text-slate-600 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 dark:text-slate-300"
        :class="{ 'opacity-100': isCardOpen(cardIndex) }"
      >
        {{ card.description }}
      </p>
    </article>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

const { cards, detailsLabel } = defineProps({
  cards: {
    type: Array,
    required: true,
  },
  detailsLabel: {
    type: String,
    default: "Ver detalles de",
  },
});

const openedCardIndex = ref(null);
const isMobileViewport = ref(false);
const interactiveKeys = new Set(["Enter", " "]);

let mediaQuery;

const isCardOpen = (cardIndex) => openedCardIndex.value === cardIndex;

const closeAllCards = () => {
  openedCardIndex.value = null;
};

const toggleCard = (cardIndex) => {
  openedCardIndex.value = isCardOpen(cardIndex) ? null : cardIndex;
};

const updateViewportMode = (event) => {
  isMobileViewport.value = event.matches;
  if (!event.matches) closeAllCards();
};

const handleCardClick = (cardIndex) => {
  if (!isMobileViewport.value) return;
  toggleCard(cardIndex);
};

const handleCardKeydown = (event, cardIndex) => {
  if (!interactiveKeys.has(event.key)) return;
  event.preventDefault();
  toggleCard(cardIndex);
};

const handleEscape = (event) => {
  if (event.key !== "Escape") return;
  closeAllCards();
};

onMounted(() => {
  mediaQuery = window.matchMedia("(max-width: 767px)");
  updateViewportMode(mediaQuery);
  mediaQuery.addEventListener("change", updateViewportMode);
  document.addEventListener("keydown", handleEscape);
});

onBeforeUnmount(() => {
  if (mediaQuery) mediaQuery.removeEventListener("change", updateViewportMode);
  document.removeEventListener("keydown", handleEscape);
});
</script>
