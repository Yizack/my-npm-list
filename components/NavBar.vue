<script setup>
const { loggedIn, user, clear } = useUserSession();
</script>

<template>
  <nav class="navbar navbar-expand bg-body-tertiary sticky-top">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">my <span class="text-primary-emphasis">npm</span> list</a>
      <div id="navbarSupportedContent" class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto mb-lg-0 gap-3">
          <li class="nav-item">
            <NuxtLink class="nav-link active" aria-current="page" to="/">Home</NuxtLink>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Site Stats</a>
          </li>
          <li v-if="loggedIn" class="nav-item dropdown">
            <button class="button btn border rounded-pill dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img :src="`https://avatars.githubusercontent.com/u/${user.ghId}?v=4`" alt="avatar" class="rounded-circle" width="24" height="24">
              {{ user.ghUser }}
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><NuxtLink class="dropdown-item" :to="`/user/${user.ghUser}`">Profile</NuxtLink></li>
              <li><a class="dropdown-item" href="#">Settings</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><button class="dropdown-item" @click="clear"><Icon name="solar:exit-linear" /> Logout</button></li>
            </ul>
          </li>
          <li v-else class="nav-item">
            <a class="btn btn-light rounded-pill d-flex align-items-center gap-2" href="/api/github/auth"><Icon name="bi:github" size="1.3em" />Login with GitHub</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
</script>
