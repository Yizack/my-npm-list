<script setup>
const { loggedIn, user: session } = useUserSession();
const { params } = useRoute();
const { data: user } = await useFetch(`/api/users/${params.user}`);

if (!user.value.ghUser) {
  navigateTo("/404");
}

const isUpdating = ref(false);

const updateList = async () => {
  const time = new Date().getTime();
  if (time - user.value.listUpdated < 1000 * 60 * 0 && !user.value.packages.length !== 0) {
    return alert("You can only update your list once every 30 minutes. Please try again later.");
  }
  isUpdating.value = true;
  const repos = await $fetch("/api/github/repos").catch(() => ({ packages: [] }));
  user.value.packages = repos.packages;
  user.value.listUpdated = time;
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
            <Icon name="bi:github" size="1.3em" />
            <a :href="`https://github.com/${user.ghUser}`" target="_blank">github.com/{{ user.ghUser }}</a>
          </div>
          <div v-if="user.website" class="d-flex align-items-center gap-2 mb-2">
            <Icon name="solar:earth-bold" size="1.3em" />
            <a :href="user.website" target="_blank">{{ user.website }}</a>
          </div>
          <div class="d-flex align-items-center gap-2 mb-2">
            <Icon name="solar:calendar-bold" size="1.3em" />
            <span>Joined on {{ formatDate(user.joined) }}</span>
          </div>
          <div class="d-flex align-items-center gap-2 mb-2">
            <Icon name="solar:box-bold" size="1.3em" />
            {{ user.packages.length }} packages used
          </div>
          <div v-if="loggedIn && session.ghId === user.ghId" class="d-grid gap-2">
            <button v-if="isUpdating" class="btn btn-primary rounded-pill" disabled>
              <div class="spinner-border spinner-border-sm text-light" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </button>
            <button v-else class="btn btn-primary rounded-pill" @click="updateList()">Update List</button>
            <button class="btn bg-body-secondary border rounded-pill">Edit Profile</button>
          </div>
        </div>
      </div>
      <div class="col-lg-9">
        <div class="bg-body-tertiary rounded-3 p-3 mb-2">
          <h2 class="mb-0">Packages List</h2>
          <p class="text-muted small">Last updated: {{ user.listUpdated ? formatDate(user.listUpdated, true) : 'Never' }}</p>
          <p class="mb-0">A list of packages that <strong class="text-primary-emphasis">{{ user.ghUser }}</strong> has used in their projects on GitHub.</p>
        </div>
        <div class="row g-2">
          <TransitionGroup name="tab">
            <div v-for="pkg in user.packages" :key="pkg.id" class="col-lg-6">
              <div class="bg-body-tertiary rounded-3 p-3">
                <div class="d-flex gap-2 align-items-center mb-2">
                  <a :href="`https://www.npmjs.com/package/${pkg.name}`">
                    <Icon name="logos:npm-icon" size="1.3em" />
                  </a>
                  <NuxtLink class="d-flex" :to="`/package/${pkg.name}`">
                    <h5 class="m-0">{{ pkg.name }}</h5>
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
        <div v-if="!user.packages.length" class="text-center mt-2">
          <p class="mb-0">No packages found.</p>
        </div>
      </div>
    </div>
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div id="notification" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <img :src="`https://avatars.githubusercontent.com/u/${user.ghId}?v=4`" height="20" width="20" class="rounded-circle me-2">
          <strong class="me-auto">{{ user.ghUser }}</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close" />
        </div>
        <div class="toast-body">
          Found {{ user.packages.length }} {{ user.packages.length > 1 ? 'packages' : 'package' }}.
        </div>
      </div>
    </div>
  </main>
</template>
