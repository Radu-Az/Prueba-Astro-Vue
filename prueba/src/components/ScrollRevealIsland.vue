<template>
  <span class="hidden" aria-hidden="true"></span>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from "vue";

const observedElements = new Set();
let observer;

const revealElement = (element) => {
  element.classList.add("is-visible");
};

const handleIntersection = (entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    revealElement(entry.target);
    observer?.unobserve(entry.target);
  });
};

onMounted(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealTargets = [...document.querySelectorAll("[data-reveal]")];

  if (!revealTargets.length) return;
  if (prefersReducedMotion) {
    revealTargets.forEach(revealElement);
    return;
  }

  observer = new IntersectionObserver(handleIntersection, {
    threshold: 0.12,
    rootMargin: "0px 0px -8% 0px",
  });

  revealTargets.forEach((target, index) => {
    if (!target.style.transitionDelay) {
      target.style.transitionDelay = `${Math.min(index * 35, 260)}ms`;
    }
    observedElements.add(target);
    observer?.observe(target);
  });
});

onBeforeUnmount(() => {
  observedElements.forEach((element) => observer?.unobserve(element));
  observer?.disconnect();
  observedElements.clear();
});
</script>
