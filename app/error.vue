<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{
  error: NuxtError;
}>();
</script>

<template>
  <div class="container vh-100 d-flex justify-content-center align-items-center">
    <div>
      <h1>Error {{ error.statusCode }}</h1>
      <h5>Sorry, an error has occured. {{ error.message }}</h5>
      <p>Go back: <NuxtLink to="/" class="text-decoration-underline">mynpmlist.yizack.com</NuxtLink></p>
    </div>
  </div>
</template>
