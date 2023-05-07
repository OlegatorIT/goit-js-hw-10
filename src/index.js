import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const inputEl = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onValueInput, DEBOUNCE_DELAY));

function onValueInput(e) {
  if (e.target.value.trim() === '') {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }
  fetchCountries(e.target.value.trim())
    .then(contry => {
      if (contry.length > 10) {
        countryList.innerHTML;
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        return;
      }

      if (contry.length <= 10) {
        // =====OPEN ON CLICK==========================================
        const country = document.querySelector('.country-list');
        country.addEventListener('click', onClickCountry);

        function onClickCountry(e) {
          contry.forEach((el, i) => {
            if (
              el.name.common === e.target.textContent ||
              el.flags.svg === e.target.src
            ) {
              const index = i;
              renderInfo(index);
            }
          });
        }
        // ============================================================
        const countryNameArr = [];

        contry.forEach((el, i) => {
          const {
            name: { common },
            flags: { svg },
          } = contry[i];
          countryNameArr.push(
            ` <li class="country-item">
           <img src="${svg}" alt="flag:${common}" height="20" width="35">
           <p class="country-text">${common}</p>
           </li>`
          );
        });
        countryList.innerHTML = countryNameArr.join('');
      }
      if (contry.length === 1) {
        renderInfo(0);
      } else {
        countryInfo.innerHTML = '';
      }

      function renderInfo(i) {
        countryList.innerHTML = '';

        const {
          capital,
          name: { common },
          population,
          flags: { svg },
          languages,
        } = contry[i];

        countryInfo.innerHTML = `
             <ul class="info-list">
        <li class="info-item">
          <img width="40" height="20" src="${svg}" alt="flag:${common}">
          <p class="info-name">${common}</p>
        </li>
        <li class="info-item">
          <p class="info-text"><span class="info-accent">Capital:</span>${capital}</p>
        </li>
        <li class="info-item">
          <p class="info-text"><span class="info-accent">Population:</span>${population}</p>
        </li>
        <li class="info-item">
          <p class="info-text"><span class="info-accent">Languages:</span>${Object.values(
            languages
          )}</p>
        </li>
      </ul>`;
      }
    })
    .catch(error => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}
