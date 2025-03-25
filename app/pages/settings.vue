<script setup lang="ts">
definePageMeta({ middleware: "session" });

const { user } = useUserSession();

const saving = ref(false);
const toast = ref({ message: "", success: false });
const countryForm = ref({ search: "", code: "", searching: false, focus: false });
const countriesFilter = computed(() => {
  return countries.getAll().filter((c) => {
    const normalized_input = normalize(countryForm.value.search.toLocaleLowerCase());
    const normalized_name = normalize(c.name.toLocaleLowerCase());
    const wordsMatch = normalized_input.split(" ").map(char => normalized_name.includes(char)).every(Boolean);
    if (wordsMatch) {
      return c;
    }
    return false;
  });
});

const removeCountry = () => {
  countryForm.value.focus = false;
  countryForm.value.search = "";
  countryForm.value.code = "";
  if (!user.value) return;
  user.value.country = null;
};

const selectCountry = (country: { name: string, code: string }) => {
  countryForm.value.focus = false;
  countryForm.value.search = country.name;
  countryForm.value.code = country.code;
  if (!user.value) return;
  user.value.country = country.code;
};

const saveProfile = async () => {
  if (!user.value) return;
  saving.value = true;
  const req = await $fetch(`/api/users/${user.value.ghUser}`, {
    method: "PUT",
    body: user.value
  }).catch(() => null);
  if (req && req.ghId) {
    const { $bootstrap } = useNuxtApp();
    $bootstrap.showToast("#notification");
    toast.value.success = true;
    toast.value.message = "Profile saved successfully";
  }
  else {
    toast.value.success = false;
    toast.value.message = "An error occurred while saving your profile";
  }
  saving.value = false;
};

onMounted(() => {
  if (!user.value || !user.value.country) return;
  countryForm.value.search = countries.getName(user.value.country);
  countryForm.value.code = user.value.country ? user.value.country : "";
});
</script>

<template>
  <section v-if="user">
    <form @submit.prevent="saveProfile()">
      <div class="row g-2 row-cols-1">
        <div class="col">
          <div class="bg-body-tertiary rounded-3 p-3 p-lg-4">
            <h3 class="mb-3">Profile</h3>
            <div class="form-floating mb-2">
              <input type="text" class="form-control" placeholder="Username" :value="user.ghUser" readonly>
              <label>Username</label>
            </div>
            <div class="form-floating mb-2">
              <input v-model.trim="user.name" type="text" class="form-control" placeholder="Name" required>
              <label>Name</label>
            </div>
            <div class="form-floating mb-2">
              <textarea v-model.trim="user.bio" class="form-control" placeholder="Bio" :style="{ height: '100px' }" />
              <label>Bio</label>
            </div>
            <div class="position-relative">
              <div class="input-group">
                <span class="input-group-text">
                  <Twemoji v-if="countryForm.code" :emoji="countries.getEmoji(user.country)" size="2rem" />
                  <Icon v-else name="solar:magnifer-linear" size="1.5em" />
                </span>
                <div class="form-floating position-relative">
                  <input v-model="countryForm.search" type="text" class="form-control" placeholder="Country" @focus="countryForm.focus = true;">
                  <label>Country</label>
                  <button v-if="countryForm.focus" type="button" class="btn btn-danger position-absolute end-0 top-50 translate-middle-y me-2" @click="removeCountry()"><Icon name="solar:trash-bin-minimalistic-linear" size="1.3rem" /></button>
                </div>
              </div>
              <div v-if="countryForm.focus" class="position-relative z-3 mt-2">
                <ul class="select-list position-absolute rounded border bg-body py-2 px-0 shadow w-100 m-0">
                  <li v-for="countryOption of countriesFilter" :key="countryOption.code" role="button" class="py-2 px-3" @click="selectCountry(countryOption)">
                    <Twemoji :emoji="countryOption.emoji" class="me-2" size="2rem" png />
                    {{ countryOption.name }}
                  </li>
                  <li v-if="!countriesFilter.length" class="py-2 px-3"><i>No results found</i></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="bg-body-tertiary rounded-3 p-3 p-lg-4">
            <h3 class="mb-3">Links</h3>
            <div class="d-flex gap-2 align-items-center mb-2">
              <div class="input-group">
                <span class="input-group-text">
                  <Icon name="bi:github" size="1.5em" />
                </span>
                <div class="form-floating flex-fill">
                  <input type="text" class="form-control" placeholder="Github" :value="`https://github.com/${user.ghUser}`" readonly>
                  <label>Github</label>
                </div>
              </div>
            </div>
            <div class="d-flex gap-2 align-items-center">
              <div class="input-group">
                <span class="input-group-text">
                  <Icon name="solar:earth-bold" size="1.5em" />
                </span>
                <div class="form-floating flex-fill">
                  <input v-model.trim="user.website" type="url" class="form-control" placeholder="Website">
                  <label>Website</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col d-grid">
          <button v-if="saving" class="btn btn-primary rounded-pill" disabled>
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </button>
          <button v-else type="submit" class="btn btn-primary rounded-pill">Save</button>
        </div>
      </div>
    </form>
    <NotificationToast :user="user" :text="toast.message" :success="toast.success" />
  </section>
</template>
