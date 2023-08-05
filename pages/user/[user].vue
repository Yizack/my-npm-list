<script setup>
const { loggedIn, user: session } = useUserSession();
const { params } = useRoute();
const { data: user } = await useFetch(`/api/users/${params.user}`);

if (!user.value.ghUser) {
  throw createError({
    statusCode: 404,
    message: `User not found: '${params.user}'`,
    fatal: true
  });
}

useSeoMeta({
  title: `${user.value.ghUser} (${user.value.name}) | ${SITE.name}`,
  description: user.value.bio,
  keywords: `${user.value.ghUser}, npm, packages, github, list, dependencies, devDependencies, user, profile`,
  // Open Graph
  ogType: "website",
  ogTitle: `${user.value.ghUser} (${user.value.name}) | ${SITE.name}`,
  ogSiteName: SITE.name,
  ogDescription: user.value.bio,
  ogUrl: `${SITE.url}/user/${user.value.ghUser}`,
  // Twitter
  twitterCard: "summary",
  twitterTitle: `${user.value.ghUser} (${user.value.name}) | ${SITE.name}`,
  twitterCreator: SITE.author.twitter,
  twitterDescription: user.value.bio
});

useHead({
  link: [
    { rel: "canonical", href: `${SITE.url}/user/${user.value.ghUser}` }
  ]
});

const isUpdating = ref(false);
const search = ref("");
const filter = ref(1);
const desc = ref(true);
const toast = ref({
  message: "",
  success: false
});

const filteredPackages = computed(() => {
  const packages = user.value.packages.filter(pkg => pkg.name.toLowerCase().includes(search.value.toLowerCase()));
  // sort by count
  switch (filter.value) {
  case 1:
    return packages.sort((a, b) => desc.value ? b.count - a.count : a.count - b.count);
  // sort by name
  case 2:
    return packages.sort((a, b) => desc.value ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name));
  // sort by versions length
  case 3:
    return packages.sort((a, b) => desc.value ? b.versions.split(",").length - a.versions.split(",").length : a.versions.split(",").length - b.versions.split(",").length);
  default:
    return packages;
  }
});

const updateList = async () => {
  const time = new Date().getTime();
  if (time - user.value.listUpdated < 1000 * 60 * 30 && !user.value.packages.length !== 0) {
    return alert("You can only update a user's list once every 30 minutes. Please try again later.");
  }
  isUpdating.value = true;
  const repos = await $fetch("/api/github/repos", {
    method: "POST",
    body: {
      ghUser: user.value.ghUser,
      ghId: user.value.ghId
    }
  }).catch(() => ({ packages: [] }));
  user.value.packages = repos.packages;
  user.value.listUpdated = time;
  if (repos.packages.length) {
    toast.value.success = true;
    toast.value.message = `Found ${repos.packages.length} ${repos.packages.length > 1 ? "packages" : "package"}`;
  }
  else {
    toast.value.success = false;
    toast.value.message = "An error occurred while fetching the packages. Please try again later";
  }
  const { $bootstrap } = useNuxtApp();
  $bootstrap.showToast("#notification");
  isUpdating.value = false;
};
</script>

<template>
  <main>
    <div class="row g-2">
      <div class="col-lg-3">
        <div class="bg-body-tertiary rounded-3 p-3 p-lg-4">
          <div class="text-center">
            <img :src="`https://avatars.githubusercontent.com/u/${user.ghId}?v=4`" alt="avatar" class="rounded-circle" width="128" height="128">
            <h3 class="mb-0">{{ user.name }}</h3>
            <p class="text-muted">{{ user.ghUser }}</p>
          </div>
          <p>{{ user.bio }}</p>
          <div class="d-flex align-items-center gap-2 mb-2">
            <Icon class="flex-shrink-0" name="bi:github" size="1.3em" />
            <a :href="`https://github.com/${user.ghUser}`" target="_blank">github.com/{{ user.ghUser }}</a>
          </div>
          <div v-if="user.website" class="d-flex align-items-center gap-2 mb-2 text-break">
            <Icon class="flex-shrink-0" name="solar:earth-bold" size="1.3em" />
            <a :href="user.website" target="_blank">{{ user.website }}</a>
          </div>
          <div v-if="user.country" class="d-flex align-items-center gap-2 mb-2 text-break">
            <Twemoji class="flex-shrink-0" :emoji="countries.getEmoji(user.country)" size="1.3em" />
            {{ countries.getName(user.country) }}
          </div>
          <div class="d-flex align-items-center gap-2 mb-2">
            <Icon class="flex-shrink-0" name="solar:calendar-bold" size="1.3em" />
            <span>Joined on {{ formatDate(user.joined) }}</span>
          </div>
          <div class="d-flex align-items-center gap-2 mb-2">
            <Icon class="flex-shrink-0" name="solar:box-bold" size="1.3em" />
            {{ user.packages.length }} packages used
          </div>
          <div v-if="loggedIn" class="d-grid gap-2">
            <button v-if="isUpdating" class="btn btn-primary rounded-pill" disabled>
              <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </button>
            <button v-else class="btn btn-primary rounded-pill" @click="updateList()">Update List</button>
            <NuxtLink v-if="session.ghId === user.ghId" class="btn btn-dark rounded-pill" to="/settings">Edit Profile</NuxtLink>
          </div>
        </div>
      </div>
      <div class="col-lg-9">
        <div class="bg-body-tertiary rounded-3 p-3 mb-2">
          <h2 class="mb-0">Packages List</h2>
          <p class="text-muted small">Last updated: {{ user.listUpdated ? getTimeAgo(user.listUpdated) : 'Never' }}</p>
          <p class="mb-0">A list of packages that <strong class="text-primary-emphasis">{{ user.ghUser }}</strong> has used in their projects on GitHub.</p>
        </div>
        <div class="row g-2">
          <div class="col-12">
            <div class="bg-body-tertiary rounded-3 p-2 d-flex flex-wrap flex-lg-nowrap gap-2">
              <div class="input-group">
                <span class="input-group-text"><Icon name="solar:magnifer-linear" /></span>
                <input v-model="search" type="text" class="form-control" placeholder="Search for a package">
              </div>
              <div class="input-group">
                <select v-model="filter" class="form-select">
                  <option :value="0" disabled>Sort by</option>
                  <option :value="1">Times used</option>
                  <option :value="2">Alphabetical</option>
                  <option :value="3">Versions</option>
                </select>
                <button class="btn btn-primary" :style="{ width:'3rem' }" @click="desc = !desc">
                  <Transition name="tab" mode="out-in">
                    <Icon v-if="desc" name="solar:list-arrow-down-minimalistic-linear" size="1.2rem" />
                    <Icon v-else name="solar:list-arrow-up-minimalistic-linear" size="1.2rem" />
                  </Transition>
                </button>
              </div>
            </div>
          </div>
          <TransitionGroup name="tab">
            <div v-for="pkg in filteredPackages" :key="pkg.id" class="col-md-6 col-xl-4">
              <div class="bg-body-tertiary rounded-3 p-3 h-100">
                <div class="d-flex gap-2 align-items-center mb-2">
                  <a :href="`https://www.npmjs.com/package/${pkg.name}`">
                    <Icon name="logos:npm-icon" size="1.3em" />
                  </a>
                  <NuxtLink class="d-flex" :to="`/package/${pkg.name}`">
                    <h5 class="m-0 text-break">{{ pkg.name }}</h5>
                  </NuxtLink>
                </div>
                <div class="d-flex flex-wrap gap-2 small">
                  <span class="bg-body px-2 py-1 rounded-pill">Used {{ pkg.count }} {{ pkg.count > 1 ? 'times' : 'time' }}</span>
                  <div v-for="(version, i) of pkg.versions.split(',')" :key="i" class="bg-body px-2 py-1 rounded-pill">{{ version }}</div>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
        <div v-if="!filteredPackages.length" class="text-center mt-2">
          <p class="mb-0">No packages found.</p>
        </div>
      </div>
    </div>
    <NotificationToast :user="user" :text="toast.message" :success="toast.success" />
  </main>
</template>
