<template>
  <button
    type="button"
    :aria-pressed="String(isDarkMode)"
    :title="isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
    :class="buttonClass"
    @click="toggleTheme"
  >
    <span class="sr-only">{{ isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro" }}</span>

    <svg
      v-if="isDarkMode"
      class="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
      />
    </svg>

    <svg
      v-else
      class="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path stroke-linecap="round" d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
    </svg>
  </button>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

const THEME_STORAGE_KEY = "orbit_theme_mode";

const { compact = false } = defineProps({
  compact: {
    type: Boolean,
    default: false,
  },
});

const isDarkMode = ref(false);

const setThemeClass = (useDarkMode) => {
  document.documentElement.classList.toggle("dark", useDarkMode);
  document.documentElement.style.backgroundColor = useDarkMode ? "#020617" : "#f8fafc";
  document.documentElement.style.colorScheme = useDarkMode ? "dark" : "light";
  isDarkMode.value = useDarkMode;
};

const getPreferredTheme = () => {
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "dark") return true;
  if (savedTheme === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const persistTheme = (useDarkMode) => {
  window.localStorage.setItem(THEME_STORAGE_KEY, useDarkMode ? "dark" : "light");
};

const toggleTheme = () => {
  const nextThemeIsDark = !isDarkMode.value;
  setThemeClass(nextThemeIsDark);
  persistTheme(nextThemeIsDark);
};

const buttonClass = computed(() =>
  compact
    ? "inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white/90 text-slate-700 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:text-slate-100"
    : "inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white/90 text-slate-700 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:text-slate-100",
);

onMounted(() => {
  setThemeClass(getPreferredTheme());
});
</script>
