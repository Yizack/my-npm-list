<script setup lang="ts">
const { params } = useRoute("package-name");
const packageName = params.name?.join("/");
const { data: pkg } = await useFetch(`/api/packages/stats/${packageName}`);

if (!pkg.value) {
  throw createError({
    statusCode: 404,
    message: `Package not found: '${packageName}'`,
    fatal: true
  });
}

useSeoMeta({
  title: `Package: ${packageName} | ${SITE.name}`,
  description: pkg.value.npm?.description,
  keywords: pkg.value.npm?.keywords,
  // Open Graph
  ogType: "website",
  ogTitle: `Package: ${packageName} | ${SITE.name}`,
  ogSiteName: SITE.name,
  ogDescription: pkg.value.npm?.description,
  ogUrl: `${SITE.url}/package/${packageName}`,
  // Twitter
  twitterCard: "summary",
  twitterTitle: `Package: ${packageName} | ${SITE.name}`,
  twitterCreator: SITE.author.twitter,
  twitterDescription: pkg.value.npm?.description
});

useHead({
  link: [
    { rel: "canonical", href: `${SITE.url}/package/${packageName}` }
  ]
});
</script>

<template>
  <main v-if="pkg && pkg.npm">
    <div class="row g-2">
      <div class="col-lg-12">
        <div class="bg-body-tertiary rounded-3 p-3 p-lg-4">
          <p class="m-0 text-muted"><Icon class="flex-shrink-0" name="solar:box-bold" /> Package</p>
          <h2>{{ pkg.name }}</h2>
          <p v-if="pkg.npm.description">{{ pkg.npm.description }}</p>
          <div class="d-flex align-items-center gap-2 mb-2">
            <Icon name="solar:calendar-bold" size="1.3em" />
            <span>First fetch: {{ formatDate(pkg.added, true) }}</span>
          </div>
          <div class="d-flex align-items-center gap-2 mb-2">
            <Icon name="solar:clock-circle-bold" size="1.3em" />
            <span>Last fetch: {{ formatDate(pkg.lastFetch, true) }}</span>
          </div>
          <div v-if="pkg.npm.homepage" class="d-flex align-items-center gap-2 mb-2">
            <Icon name="solar:earth-bold" size="1.3em" />
            <a :href="pkg.npm.homepage" target="_blank">Homepage</a>
          </div>
          <div class="d-flex align-items-center gap-2 mb-2">
            <Icon name="logos:npm-icon" size="1.3em" />
            <a :href="`https://www.npmjs.com/package/${pkg.name}`" target="_blank">npmjs.com/package/{{ pkg.name }}</a>
          </div>
          <div v-if="pkg.npm.keywords" class="d-flex gap-2 flex-wrap">
            <span v-for="keyword in pkg.npm.keywords" :key="keyword" class="bg-body rounded-pill px-2 py-1">{{ keyword }}</span>
          </div>
        </div>
      </div>
      <div class="col-lg-12">
        <div class="bg-body-tertiary rounded-3 p-3 p-lg-4">
          <div class="d-flex gap-2 align-items-center mb-2">
            <h4 class="m-0">Used by</h4>
            <span class="bg-body rounded-pill px-3">{{ pkg.users.length }}</span>
          </div>
          <p>List of users who have used <span class="text-primary-emphasis"><strong>{{ pkg.name }}</strong></span> in their projects on GitHub and fetched them on this website.</p>
          <div class="d-flex gap-2">
            <NuxtLink v-for="pkgUser of pkg.users" :key="pkgUser.ghId" :to="`/user/${pkgUser.ghUser}`" data-bs-toggle="popover" data-bs-trigger="hover" :data-bs-content="userHtmlInfo(pkgUser, pkg.name)" data-bs-placement="top" data-bs-container="body" data-bs-html="true">
              <img :src="`https://avatars.githubusercontent.com/u/${pkgUser.ghId}?v=4`" alt="avatar" class="rounded-circle" width="48" height="48">
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
export default {
  mounted () {
    this.$nuxt.$bootstrap.initPopover();
  },
  beforeUnmount () {
    this.$nuxt.$bootstrap.disposePopover();
  },
  methods: {
    userHtmlInfo (user: { ghId: number, ghUser: string, ghName: string, count: number }, pkg: string) {
      return `
        <div class="d-flex gap-2 align-items-center mb-2">
          <img src="https://avatars.githubusercontent.com/u/${user.ghId}?v=4" alt="avatar" class="rounded-circle" width="48" height="48">
          <div>
            <h6 class="m-0">${user.ghName}</h6>
            <p class="m-0 text-muted">${user.ghUser}</p>
          </div>
        </div>
        <p class="m-0">Has used <strong class="text-primary-emphasis">${pkg}</strong> <strong>${user.count}</strong> ${user.count > 1 ? "times" : "time"}.</p>
      `.replace(/\s+/gm, " ").trim();
    }
  }
};
</script>
