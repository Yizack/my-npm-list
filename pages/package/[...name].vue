<script setup>
const { params } = useRoute();
const packageName = params.name.join("/");
const { data: pkg } = await useFetch(`/api/packages/stats/${packageName}`);
const { data: npm } = await useFetch(`https://registry.npmjs.org/${packageName}`);
</script>

<template>
  <main>
    <div class="row g-2">
      <div class="col-lg-12">
        <div class="bg-body-tertiary rounded-3 p-3 p-lg-4">
          <h2>{{ pkg.name }}</h2>
          <p v-if="npm.description">{{ npm.description }}</p>
          <div class="d-flex align-items-center gap-2 mb-2">
            <Icon name="solar:calendar-bold" size="1.3em" />
            <span>Added: {{ formatDate(pkg.added, true) }}</span>
          </div>
          <div class="d-flex align-items-center gap-2 mb-2">
            <Icon name="solar:clock-circle-bold" size="1.3em" />
            <span>Last fetch: {{ formatDate(pkg.lastFetch, true) }}</span>
          </div>
          <div v-if="npm.homepage" class="d-flex align-items-center gap-2 mb-2">
            <Icon name="solar:earth-bold" size="1.3em" />
            <a :href="npm.homepage" target="_blank">Homepage</a>
          </div>
          <div class="d-flex align-items-center gap-2 mb-2">
            <Icon name="logos:npm-icon" size="1.3em" />
            <a :href="`https://www.npmjs.com/package/${pkg.name}`" target="_blank">npmjs.com/package/{{ pkg.name }}</a>
          </div>
          <div v-if="npm.keywords" class="d-flex gap-2 mb-2">
            <span v-for="keyword in npm.keywords" :key="keyword" class="bg-body rounded-pill px-2">{{ keyword }}</span>
          </div>
        </div>
      </div>
      <div class="col-lg-12">
        <div class="bg-body-tertiary rounded-3 p-3 p-lg-4">
          <div class="d-flex gap-2 align-items-center mb-2">
            <h4 class="m-0">Used by</h4>
            <span class="bg-body rounded-pill px-3">{{ pkg.users.length }}</span>
          </div>
          <p>List of users who have used this package in their projects on GitHub and fetched them on this website.</p>
          <div class="d-flex gap-2">
            <NuxtLink v-for="pkgUser of pkg.users" :key="pkgUser.ghId" :to="`/user/${pkgUser.ghUser}`">
              <img :src="`https://avatars.githubusercontent.com/u/${pkgUser.ghId}?v=4`" alt="avatar" class="rounded-circle" width="48" height="48">
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
