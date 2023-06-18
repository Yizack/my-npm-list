<script setup>
import countries from "~/assets/countries.json";
definePageMeta({ middleware: "session" });
const { user } = useUserSession();
</script>

<template>
  <section>
    <form>
      <div class="row g-2">
        <div class="col-lg-12">
          <div class="bg-body-tertiary rounded-3 p-3 p-lg-4">
            <div class="form-floating mb-2">
              <input type="text" class="form-control" placeholder="Username" :value="user.ghUser" readonly>
              <label>Username</label>
            </div>
            <div class="form-floating mb-2">
              <input type="text" class="form-control" placeholder="Name" :value="user.name" required>
              <label>Name</label>
            </div>
            <div class="form-floating mb-2">
              <textarea class="form-control" placeholder="Bio" :value="user.bio" :style="{ height: '100px' }" required />
              <label>Bio</label>
            </div>
            <div class="position-relative">
              <div class="input-group">
                <!--v-for="country of countries" :key="country.code"-->
                <span class="input-group-text">
                  <Twemoji v-if="form.country" :emoji="getCountryEmoji()" size="2rem" />
                  <Icon v-else name="solar:magnifer-linear" />
                </span>
                <div class="form-floating position-relative">
                  <input v-model="countrySearch" type="text" class="form-control" placeholder="Select country" @focus="countryFocus = true;">
                  <label>Select country</label>
                  <button v-if="countryFocus" type="button" class="btn btn-danger position-absolute end-0 top-50 translate-middle-y me-2" @click="removeCountry()"><Icon name="solar:trash-bin-minimalistic-linear" size="1.3rem" /></button>
                </div>
              </div>
              <div class="position-relative z-3 mt-2">
                <ul :class="`select-list position-absolute rounded border bg-body py-2 px-0 shadow w-100 m-0 ${countryFocus ? 'd-block' : 'd-none'}`">
                  <li v-for="country of countriesFilter" :key="country.code" role="button" class="py-2 px-3" @click="selectCountry($event, country)">
                    <Twemoji :emoji="country.emoji" class="me-2" size="2rem" />
                    {{ country.name }}
                  </li>
                  <li v-if="!countriesFilter.length" class="py-2 px-3"><i>Not results found</i></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-12">
          <div class="bg-body-tertiary rounded-3 p-3 p-lg-4">
            <div class="d-flex gap-2 align-items-center mb-2">
              <Icon name="bi:github" size="1.5em" />
              <div class="form-floating flex-fill">
                <input type="text" class="form-control" placeholder="Github" :value="`https://github.com/${user.ghUser}`" required>
                <label>Github</label>
              </div>
            </div>
            <div class="d-flex gap-2 align-items-center">
              <Icon name="solar:earth-bold" size="1.5em" />
              <div class="form-floating flex-fill">
                <input type="text" class="form-control" placeholder="Webside" :value="user.twitterUser" required>
                <label>Website</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </section>
</template>

<script>
export default {
  data () {
    return {
      form: {
        country: ""
      },
      countrySearch: "",
      countrySearching: false,
      countryFocus: false
    };
  },
  computed: {
    countriesFilter () {
      return countries.filter((country) => {
        const normalized_input = normalize(this.countrySearch.toLocaleLowerCase());
        const normalized_name = normalize(country.name.toLocaleLowerCase());
        const wordsMatch = normalized_input.split(" ").map(char => normalized_name.includes(char)).every(Boolean);
        if (wordsMatch) {
          return country;
        }
        return false;
      });
    }
  },
  methods: {
    removeCountry () {
      this.countryFocus = false;
      this.countrySearch = "";
      this.form.country = "";
    },
    selectCountry (e, country) {
      this.countryFocus = false;
      this.countrySearch = country.name;
      this.form.country = country.code;
    },
    getCountryEmoji () {
      return countries.find(country => country.code === this.form.country).emoji;
    }
  }
};
</script>
