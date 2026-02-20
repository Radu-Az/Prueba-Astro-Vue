<template>
  <!--
    Selector de horario:
    - Panel flotante.
    - Cierra al seleccionar un slot o al hacer click fuera.
  -->
  <div ref="scheduleRootRef" class="mt-5">
    <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{ copy.title }}</p>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{{ copy.description }}</p>

    <div class="relative z-40 mt-5 inline-block max-w-full">
      <button
        type="button"
        :aria-expanded="String(isPanelOpen)"
        aria-controls="contact-schedule-panel"
        class="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:text-slate-100"
        @click.stop="togglePanel"
      >
        <span class="inline-block h-2 w-2 rounded-full bg-cyan-500"></span>
        <span>{{ isPanelOpen ? copy.hideButton : copy.showButton }}</span>
      </button>

      <div
        id="contact-schedule-panel"
        :aria-hidden="String(!isPanelOpen)"
        :class="[
          'absolute left-0 top-[calc(100%+0.75rem)] z-40 w-[min(24rem,calc(100vw-3rem))] rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-2xl shadow-slate-900/40',
          isPanelOpen ? 'block' : 'hidden',
        ]"
      >
        <p class="mb-3 text-sm font-semibold text-slate-100">{{ copy.panelTitle }}</p>
        <ul class="space-y-2">
          <li v-for="slot in copy.slots" :key="slot">
            <button
              type="button"
              :data-slot="slot"
              :class="[
                'w-full rounded-xl border px-4 py-3 text-left text-sm transition',
                selectedSlotValue === slot
                  ? 'border-cyan-400 bg-cyan-900/40 text-cyan-100'
                  : 'border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-500',
              ]"
              @click.stop="selectSlot(slot)"
            >
              {{ slot }}
            </button>
          </li>
        </ul>
      </div>
    </div>

    <input type="hidden" name="horario" :value="selectedSlotValue" />

    <p
      v-if="selectedSlotValue"
      aria-live="polite"
      class="mt-5 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-slate-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-slate-200"
    >
      {{ copy.selectedLabel }} <strong>{{ selectedSlotValue }}</strong>
    </p>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

defineProps({
  copy: {
    type: Object,
    required: true,
  },
});

const scheduleRootRef = ref(null);
const isPanelOpen = ref(false);
const selectedSlotValue = ref("");

const setPanelState = (isOpen) => {
  isPanelOpen.value = isOpen;
};

const togglePanel = () => {
  setPanelState(!isPanelOpen.value);
};

const selectSlot = (slot) => {
  selectedSlotValue.value = slot;
  setPanelState(false);
};

const handleDocumentClick = (event) => {
  if (!(event.target instanceof Node)) return;
  if (!scheduleRootRef.value) return;
  if (!scheduleRootRef.value.contains(event.target)) setPanelState(false);
};

const handleEscape = (event) => {
  if (event.key === "Escape") setPanelState(false);
};

onMounted(() => {
  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("keydown", handleEscape);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleDocumentClick);
  document.removeEventListener("keydown", handleEscape);
});
</script>
