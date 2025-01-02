const searchbarElem = document.querySelector('#searchbar');
const favoritesFilterElem = document.querySelector('.favorites-container');
const languageFilterSelectElem = document.querySelector('.language-filter-container select');

export function handleFilters() {
  let searchValue = '';
  let filteredLanguage = 'all languages'
  let showFavorites = false;

  function updateDisplayedSnippets() {
    const allListedSnippets = document.querySelectorAll('.listed-snippet-container');
  
    allListedSnippets.forEach(snippet => {
      const snippetName = snippet.querySelector('.snippet-name').textContent.toLowerCase();
      const snippetLanguage = snippet.querySelector('.listed-snippet-language').textContent.toLowerCase();
      let isFavorited;
      if (snippet.querySelector('.favorites-img').src.endsWith('heart-2.png')) {
        isFavorited = true;
      } else { isFavorited = false };
  
      let matchesSearch = true;
      if (snippetName.includes(searchValue.toLowerCase()) || searchValue === '') {
        matchesSearch = true;
      } else {
        matchesSearch = false;
      }

      const matchesFavorite = isFavorited;
      let matchesLanguage = false;

      if (snippetLanguage === filteredLanguage || filteredLanguage === 'all languages') {
        matchesLanguage = true;
      } else { matchesLanguage = false; };
  
      if (matchesLanguage && matchesSearch) {
        snippet.style.display = 'block';
        if (showFavorites === true) {
          if (matchesFavorite) {
             snippet.style.display = 'block'
          } else { snippet.style.display = 'none'; };
        }
      } else { snippet.style.display = 'none'; };
    })
  }

  searchbarElem.addEventListener('input', () => {
    searchValue = searchbarElem.value;
    updateDisplayedSnippets()
  })

  favoritesFilterElem.addEventListener('click', () => {
    const favimg = favoritesFilterElem.querySelector('img');
    if (favimg.src.endsWith('heart-2.png')) {
      showFavorites = true;
    } else { showFavorites = false; };
    updateDisplayedSnippets();
  })

  languageFilterSelectElem.addEventListener('change', () => {
    filteredLanguage = languageFilterSelectElem.value;
    updateDisplayedSnippets();
  })
}
