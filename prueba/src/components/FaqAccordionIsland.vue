<template>
  <!--
    Acordeón FAQ:
    - Una respuesta abierta a la vez.
    - Estado inicial contraído.
  -->
  <div class="space-y-3">
    <article
      v-for="(item, itemIndex) in items"
      :key="`faq-${itemIndex}`"
      class="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm shadow-slate-200/70 transition hover:border-slate-300 dark:border-slate-700/80 dark:bg-slate-900/70 dark:shadow-slate-950/40 dark:hover:border-slate-600"
    >
      <button
        type="button"
        :aria-expanded="String(isOpen(itemIndex))"
        :aria-controls="`faq-answer-${itemIndex}`"
        class="group flex w-full items-center justify-between gap-4 text-left"
        @click="toggle(itemIndex)"
      >
        <span class="text-base font-semibold text-slate-900 sm:text-lg dark:text-slate-100">{{ item.question }}</span>
        <span
          class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition duration-300 group-hover:border-slate-400 group-hover:text-slate-700 dark:border-slate-700 dark:text-slate-400 dark:group-hover:border-slate-600 dark:group-hover:text-slate-200"
          :class="{ 'rotate-45 border-cyan-400 text-cyan-700': isOpen(itemIndex) }"
          aria-hidden="true"
        >
          +
        </span>
      </button>

      <div
        :id="`faq-answer-${itemIndex}`"
        class="grid transition-all duration-300 ease-out"
        :class="isOpen(itemIndex) ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
      >
        <div class="prose prose-sm max-w-none overflow-hidden text-slate-600 dark:prose-invert dark:text-slate-300">
          <p class="m-0 sm:text-base">{{ item.answer }}</p>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const openedIndex = ref(null);

const isOpen = (itemIndex) => openedIndex.value === itemIndex;

const toggle = (itemIndex) => {
  openedIndex.value = isOpen(itemIndex) ? null : itemIndex;
};
</script>
