<script setup>
import { countries } from "~/utils/countries";

definePageMeta({ middleware: "session" });
</script>

<template>
  <section>
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
              <textarea v-model.trim="user.bio" class="form-control" placeholder="Bio" :style="{ height: '100px' }" required />
              <label>Bio</label>
            </div>
            <div class="position-relative">
              <div class="input-group">
                <span class="input-group-text">
                  <Twemoji v-if="country.code" :emoji="countries.getEmoji(user.country)" size="2rem" />
                  <Icon v-else name="solar:magnifer-linear" size="1.5em" />
                </span>
                <div class="form-floating position-relative">
                  <input v-model="country.search" type="text" class="form-control" placeholder="Country" @focus="country.focus = true;">
                  <label>Country</label>
                  <button v-if="country.focus" type="button" class="btn btn-danger position-absolute end-0 top-50 translate-middle-y me-2" @click="removeCountry()"><Icon name="solar:trash-bin-minimalistic-linear" size="1.3rem" /></button>
                </div>
              </div>
              <div v-if="country.focus" class="position-relative z-3 mt-2">
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
                  <input v-model="user.website" type="url" class="form-control" placeholder="Website">
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
    <NotificationToast :user="user" text="Your profile has been saved." />
  </section>
</template>

<script>
export default {
  data () {
    return {
      user: useUserSession().user,
      saving: false,
      country: {
        search: "",
        code: null,
        searching: false,
        focus: false
      }
    };
  },
  computed: {
    countriesFilter () {
      return countries.getAll().filter((country) => {
        const normalized_input = normalize(this.country.search.toLocaleLowerCase());
        const normalized_name = normalize(country.name.toLocaleLowerCase());
        const wordsMatch = normalized_input.split(" ").map(char => normalized_name.includes(char)).every(Boolean);
        if (wordsMatch) {
          return country;
        }
        return false;
      });
    }
  },
  created () {
    this.country.search = countries.getName(this.user.country);
    this.country.code = this.user.country;
  },
  methods: {
    removeCountry () {
      this.country.focus = false;
      this.country.search = "";
      this.country.code = null;
      this.user.country = null;
    },
    selectCountry (country) {
      this.country.focus = false;
      this.country.search = country.name;
      this.country.code = country.code;
      this.user.country = country.code;
    },
    async saveProfile () {
      this.saving = true;
      const req = await $fetch(`/api/users/${this.user.ghUser}`, {
        method: "PUT",
        body: this.user
      }).catch(() => ({}));
      if (req.ghId) {
        this.$nuxt.$bootstrap.showToast("#notification");
      }
      this.saving = false;
    }
  }
};
</script>
