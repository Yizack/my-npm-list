import countriesData from "~/assets/countries.json";

class Countries {
  getAll () {
    return countriesData;
  }

  getEmoji (code) {
    return countriesData.find(country => country.code === code)?.emoji || "";
  }

  getName (code) {
    return countriesData.find(country => country.code === code)?.name || "";
  }
}

export const countries = new Countries();
