import { writeFileSync } from "fs";

const request = await fetch("https://gist.githubusercontent.com/Yizack/bbfce31e0217a3689c8d961a356cb10d/raw/7269c363de83d072bd7988ecaae93c56b95edca8/countries.json");
const { countries } = await request.json();
const countriesList = countries.map(({ name_en, emoji, code_2 }) => ({ name: name_en, code: code_2, emoji }));

writeFileSync("assets/countries.json", JSON.stringify(countriesList, null, 2));
