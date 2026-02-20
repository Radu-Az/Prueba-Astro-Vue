<template>
  <!--
    Calculadora orientativa:
    - Estima un rango de inversión según alcance.
    - Envía el resultado en un input hidden.
  -->
  <section class="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6">
    <header>
      <p class="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">{{ copy.kicker }}</p>
      <h3 class="mt-2 text-lg font-semibold text-slate-900">{{ copy.title }}</h3>
    </header>

    <div class="mt-5 grid gap-4 sm:grid-cols-2">
      <label class="flex flex-col gap-2">
        <span class="text-sm font-semibold text-slate-700">{{ copy.projectType }}</span>
        <select
          v-model="selectedProjectType"
          name="tipo_proyecto_estimado"
          class="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        >
          <option v-for="projectOption in copy.projectTypeOptions" :key="projectOption.value" :value="projectOption.value">
            {{ projectOption.label }}
          </option>
        </select>
      </label>

      <label class="flex flex-col gap-2">
        <span class="text-sm font-semibold text-slate-700">{{ copy.priority }}</span>
        <select
          v-model="selectedTimeline"
          name="plazo_estimado"
          class="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        >
          <option value="normal">{{ copy.normalTimeline }}</option>
          <option value="express">{{ copy.expressTimeline }}</option>
        </select>
      </label>
    </div>

    <label class="mt-4 flex flex-col gap-2">
      <span class="text-sm font-semibold text-slate-700">{{ copy.sectionsLabel }}: {{ sectionCount }}</span>
      <input
        v-model.number="sectionCount"
        type="range"
        min="3"
        max="18"
        step="1"
        name="secciones_estimadas"
        class="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-cyan-600"
      />
    </label>

    <fieldset class="mt-4">
      <legend class="text-sm font-semibold text-slate-700">{{ copy.extras }}</legend>
      <div class="mt-2 grid gap-2 sm:grid-cols-2">
        <label
          v-for="extraOption in copy.extraOptions"
          :key="extraOption.value"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
        >
          <input v-model="selectedExtras" type="checkbox" :value="extraOption.value" class="h-4 w-4 accent-cyan-600" />
          <span>{{ extraOption.label }}</span>
        </label>
      </div>
    </fieldset>

    <div class="mt-5 rounded-xl border border-cyan-200/80 bg-cyan-50 px-4 py-3 text-sm text-slate-700 sm:text-base">
      {{ copy.estimatedRange }}: <strong>{{ formattedMinBudget }} - {{ formattedMaxBudget }}</strong>
    </div>

    <input type="hidden" name="presupuesto_estimado" :value="`${formattedMinBudget} - ${formattedMaxBudget}`" />
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

const { copy } = defineProps({
  copy: {
    type: Object,
    required: true,
  },
});

const basePricesByProjectType = {
  landing: 1200,
  corporativa: 2200,
  app: 3800,
  optimizacion: 900,
};

const extraPriceByOption = {
  copy: 280,
  seo: 240,
  idiomas: 350,
  integraciones: 320,
};

const selectedProjectType = ref("corporativa");
const selectedTimeline = ref("normal");
const sectionCount = ref(8);
const selectedExtras = ref([]);

const timelineMultiplier = computed(() => (selectedTimeline.value === "express" ? 1.2 : 1));

const sectionsPrice = computed(() => {
  const includedSections = 6;
  const extraSectionPrice = 120;
  return Math.max(sectionCount.value - includedSections, 0) * extraSectionPrice;
});

const extrasPrice = computed(() =>
  selectedExtras.value.reduce((sum, extraValue) => sum + (extraPriceByOption[extraValue] ?? 0), 0),
);

const basePrice = computed(() => basePricesByProjectType[selectedProjectType.value] ?? 1200);

const finalPrice = computed(() => (basePrice.value + sectionsPrice.value + extrasPrice.value) * timelineMultiplier.value);
const minBudget = computed(() => Math.round(finalPrice.value * 0.9));
const maxBudget = computed(() => Math.round(finalPrice.value * 1.1));

const formatCurrency = (value) => `${new Intl.NumberFormat(copy.locale ?? "es-ES").format(value)} EUR`;

const formattedMinBudget = computed(() => formatCurrency(minBudget.value));
const formattedMaxBudget = computed(() => formatCurrency(maxBudget.value));
</script>
