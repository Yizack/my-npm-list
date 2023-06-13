<script setup>
const { loggedIn, user } = useUserSession();
const { params } = useRoute();
const { data: pkg } = await useFetch(`/api/packages/stats/${params.name}`);
</script>

<template>
  {{ pkg }}
</template>
