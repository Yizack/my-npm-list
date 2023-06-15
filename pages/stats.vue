<script setup>
const { data: counters } = useFetch("/api/stats");
</script>

<template>
  <main>
    <div class="row g-2">
      <div v-for="(counter, i) of counters" :key="i" class="col-lg-3 col-md-4 col-sm-6">
        <div class="bg-body-tertiary rounded-3 p-3 p-lg-4 h-100">
          <div class="text-center">
            <h1>{{ counter.value }}</h1>
            <h5 class="text-muted m-0">{{ counter.description }}</h5>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
