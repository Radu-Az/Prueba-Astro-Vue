<template>
  <!--
    Captación newsletter:
    - Validación simple de email.
    - Simula envío y guarda estado local.
  -->
  <div class="max-w-xl">
    <form class="flex flex-col gap-3 sm:flex-row sm:items-start" @submit.prevent="handleSubmit">
      <label class="w-full">
        <span class="sr-only">Email</span>
        <input
          v-model.trim="emailValue"
          type="email"
          name="newsletter_email"
          autocomplete="email"
          placeholder="tu@email.com"
          class="w-full rounded-full border border-slate-300 bg-white/95 px-5 py-3 text-sm text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        />
      </label>

      <button
        type="submit"
        class="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-65"
        :disabled="isSubmitting || isSubscribed"
      >
        {{ submitLabel }}
      </button>
    </form>

    <p v-if="errorMessage" class="mt-3 text-sm text-rose-600">{{ errorMessage }}</p>
    <p v-if="isSubscribed" class="mt-3 text-sm text-emerald-700">{{ copy.success }}</p>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

const SUBSCRIPTION_STORAGE_KEY = "orbit_newsletter_subscription";

const { copy } = defineProps({
  copy: {
    type: Object,
    required: true,
  },
});

const emailValue = ref("");
const errorMessage = ref("");
const isSubmitting = ref(false);
const isSubscribed = ref(false);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const submitLabel = computed(() => {
  if (isSubscribed.value) return copy.submitDone;
  if (isSubmitting.value) return copy.submitLoading;
  return copy.submitIdle;
});

const persistSubscription = () => {
  window.localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, "true");
};

const handleSubmit = async () => {
  errorMessage.value = "";

  if (!emailPattern.test(emailValue.value)) {
    errorMessage.value = copy.invalidEmail;
    return;
  }

  isSubmitting.value = true;
  await new Promise((resolve) => setTimeout(resolve, 700));
  isSubmitting.value = false;
  isSubscribed.value = true;
  persistSubscription();
};

onMounted(() => {
  isSubscribed.value = window.localStorage.getItem(SUBSCRIPTION_STORAGE_KEY) === "true";
});
</script>
