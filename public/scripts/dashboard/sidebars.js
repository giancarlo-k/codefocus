import { languageFilterSelect } from './data.js'

const favoritesFilterElem = document.querySelector('.favorites-container');
const languageFilterSelectElem = document.querySelector('.language-filter-container select');

export function toggleHearts(heart) {
  if (heart.src.endsWith('heart.png')) {
    heart.src = '../images/heart-2.png';
  } else {
    heart.src = '../images/heart.png'
  }
}

favoritesFilterElem.addEventListener('click', () => {
  
  const favimg = favoritesFilterElem.querySelector('img');
  if (favimg.src.endsWith('heart.png') ) {
    favimg.src = '../images/heart-2.png';
    favoritesFilterElem.classList.add('selected-filter');
  } else {
    favimg.src = '../images/heart.png'
    favoritesFilterElem.classList.remove('selected-filter');
  }
})

let languageHTML = '';

languageFilterSelect.forEach(language => {
  languageHTML += `<option value="${language.toLowerCase()}">${language}</option>`;
})

languageFilterSelectElem.innerHTML = languageHTML;

const snippetListHeartElems = document.querySelectorAll('.favorites-img');

snippetListHeartElems.forEach(heart => {
  heart.addEventListener('click', () => {
    toggleHearts(heart)
  })
});
