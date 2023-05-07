export function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=capital,population,languages,flags,name`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
