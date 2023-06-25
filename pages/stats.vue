<script setup>
const { data: counters } = useFetch("/api/stats");

const description = "Statistics about the packages used by registered users.";

useSeoMeta({
  title: `Stats | ${SITE.name}`,
  description,
  keywords: "stats, statistics, npm, packages, users, list, registry",
  // Open Graph
  ogType: "website",
  ogTitle: `Stats | ${SITE.name}`,
  ogSiteName: SITE.name,
  ogDescription: description,
  ogUrl: `${SITE.url}/stats`,
  // Twitter
  twitterCard: "summary",
  twitterTitle: `Stats | ${SITE.name}`,
  twitterCreator: SITE.author.twitter,
  twitterDescription: description
});

useHead({
  link: [
    { rel: "canonical", href: `${SITE.url}/stats` }
  ]
});
</script>

<template>
  <main>
    <div class="row g-2">
      <div v-for="(counter, i) of counters" :key="i" class="col-lg-3 col-md-4 col-sm-6">
        <div class="bg-body-tertiary rounded-3 p-3 p-lg-4 h-100 d-flex position-relative">
          <div class="text-center m-auto">
            <h1><strong>{{ counter.value }}</strong></h1>
            <h4 v-if="counter.ref">
              <NuxtLink :to="`/${counter.type}/${counter.ref}`">{{ counter.ref }}</NuxtLink>
            </h4>
            <h5 class="text-muted m-0">{{ counter.description }}</h5>
          </div>
          <div class="position-absolute top-0 end-0 my-3 mx-3">
            <span v-if="counter.ref" class="bg-primary rounded-pill px-2 py-1 fw-bold">{{ counter.type }}</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
