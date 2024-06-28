import countriesData from "~/assets/countries.json";

class Countries {
  getAll () {
    return countriesData;
  }

  getEmoji (code: string) {
    return countriesData.find(country => country.code === code)?.emoji || "";
  }

  getName (code: string) {
    return countriesData.find(country => country.code === code)?.name || "";
  }
}

export const countries = new Countries();
