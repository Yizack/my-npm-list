<script setup lang="ts">
const { loggedIn, user, clear } = useUserSession();
</script>

<template>
  <nav class="navbar navbar-expand-md bg-body-tertiary sticky-top shadow">
    <div class="container-fluid">
      <button class="navbar-toggler border-0 rounded-pill" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon" />
      </button>
      <NuxtLink class="navbar-brand ms-2 ms-md-0 me-auto" to="/">my <span class="text-primary-emphasis">npm</span> list</NuxtLink>
      <div id="offcanvasNavbar" class="offcanvas offcanvas-start text-white bg-dark" tabindex="-1" aria-labelledby="offcanvasNavbarLabel">
        <div class="offcanvas-header">
          <NuxtLink class="navbar-brand" to="/">my <span class="text-primary-emphasis">npm</span> list</NuxtLink>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav ms-auto mb-lg-0 gap-md-3">
            <li v-for="(page, i) of pages" :key="i" class="nav-item" data-bs-dismiss="offcanvas">
              <NuxtLink class="nav-link" :to="page.path">{{ page.name }}</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
      <div class="ms-3">
        <div v-if="user && loggedIn" class="nav-item dropdown">
          <button class="button btn btn-dark rounded-pill dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <img :src="`https://avatars.githubusercontent.com/u/${user.ghId}?v=4`" alt="avatar" class="rounded-circle" width="24" height="24">
            <span class="d-none d-md-inline ms-2">{{ user.ghUser }}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><NuxtLink class="dropdown-item" :to="`/user/${user.ghUser}`">Profile</NuxtLink></li>
            <li><NuxtLink class="dropdown-item" to="/settings">Settings</NuxtLink></li>
            <li><hr class="dropdown-divider"></li>
            <li><button class="dropdown-item" @click="clear"><Icon name="solar:exit-linear" /> Logout</button></li>
          </ul>
        </div>
        <div v-else class="nav-item">
          <a class="btn btn-light rounded-pill d-flex align-items-center gap-2 text-decoration-none" href="/auth/github">
            <Icon name="bi:github" size="1.3em" />
            <span>Login <span class="d-none d-md-inline">with GitHub</span></span>
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
export default {
  data () {
    return {
      pages: [
        { name: "Home", path: "/" }
      ]
    };
  }
};
</script>
