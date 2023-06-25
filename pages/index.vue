<script setup>
const { data: users } = await useFetch("/api/recent");
</script>

<template>
  <main>
    <div class="row g-2">
      <div class="ms-auto col-lg-5">
        <div class="bg-body-tertiary rounded-3 p-3 p-lg-4">
          <h2>Recently joined users</h2>
          <div class="d-flex flex-column gap-2">
            <div v-for="user of users" :key="user.ghId">
              <div class="d-flex gap-2 align-items-center">
                <NuxtLink :to="`/user/${user.ghUser}`" class="d-flex align-items-center">
                  <img :src="`https://avatars.githubusercontent.com/u/${user.ghId}?v=4&s=24`" alt="avatar" class="rounded-circle me-2" width="24" height="24">
                  <span class="text-break"><strong>{{ user.ghUser }}</strong></span>
                </NuxtLink>
                <Icon class="flex-shrink-0" name="solar:clock-circle-linear" />
                <span class="flex-fill flex-shrink-0">{{ getTimeAgo(user.joined) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
