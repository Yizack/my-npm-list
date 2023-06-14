<script setup>
setScrollBehavior();
</script>

<template>
  <NuxtLoadingIndicator :throttle="0" />
  <NuxtLayout>
    <div id="page">
      <NuxtPage />
      <BackToTop />
    </div>
  </NuxtLayout>
</template>
