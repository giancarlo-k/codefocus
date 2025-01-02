import { showEmptyForm, languageFilterSelect, emptySnippetListItemSkeleton, currentDate, createSnippetInfoHTML, createListedSnippetHTML, showPreloadedForm, showEmptyEditor } from './data.js'
import { toggleHearts } from './sidebars.js'; 
import { displaySnippetAmt, updateLineCount } from '../utils.js'; 
import { handleFilters } from './filters.js';

const createSnippetBtn = document.querySelector('#create-snippet-button');
const snippetListElem = document.querySelector('.snippet-blocks-container');
const snippetInfoElem = document.querySelector('.snippet-info');
const snippetContainer = document.querySelector('.snippet-container');
const emptyElem = document.querySelector('.empty-snippet-container');
const editorContainerElem = document.querySelector('.editor-container');
const saveCodeElem = document.querySelector('.save-code-container');
const searchbarElem = document.querySelector('#searchbar');
const sortByDateElem = document.querySelector('.sort-time-filter-container select');

const editors = {};

let tagInputAmt = 1;

function isEditing() {
  if (currentlyEditing === true) {
    createSnippetBtn.style.opacity = '0.3';   
  } else {
    createSnippetBtn.style.opacity = '1';   
  }
}

function handleFormDynamics() {
  isEditing();

  const languageSelectElem = document.querySelector('.snippet-language-select select');
  const addTagInputImg = document.querySelector('.snippet-tags-bottom-container img');
  const inputTagContainer = document.querySelector('.tag-inputs-container');

  function checkTagInputAmt() {
    tagInputAmt = document.querySelectorAll('.tag-input').length;
  
    if (tagInputAmt >= 5) {
      addTagInputImg.style.display = 'none'
    } else {
      addTagInputImg.style.display = 'flex'
    }
  
    if (tagInputAmt === 0) {
      inputTagContainer.style.display = 'none'
      addTagInputImg.style.marginTop = '3px'
    } else {
      inputTagContainer.style.display = 'flex'
    }
  }

  addTagInputImg.addEventListener('click', () => {
    const tagDiv = document.createElement('div');
    tagDiv.classList.add('tag-input-box');
    const tagInputElem = document.createElement('input');
    tagInputElem.type = 'text';
    tagInputElem.classList.add('tag-input');
    tagInputElem.placeholder = 'Tag';
    tagInputElem.maxLength = '10';
    const removeTagElem = document.createElement('span');
    removeTagElem.classList.add('remove-tag-span');
    removeTagElem.textContent = 'Remove';
    tagDiv.appendChild(tagInputElem);
    tagDiv.appendChild(removeTagElem);
  
    inputTagContainer.appendChild(tagDiv)
    checkTagInputAmt();
  })

  inputTagContainer.addEventListener('click', e => {
    if (e.target.classList.contains('remove-tag-span')) {
      const parent = e.target.parentElement;
      parent.remove();
      checkTagInputAmt();
    }
  })

  // populating snippet language selector
  const snippetLanguageList = languageFilterSelect.slice(1)

  let languageHTML = '';

  snippetLanguageList.forEach(language => {
    languageHTML += `<option value="${language}">${language}</option>`;
  })

  languageSelectElem.innerHTML = languageHTML;
}

let snippetListHTML = '';
let firstForm = true;
let currentlyEditing = false;

createSnippetBtn.addEventListener('click', () => {
  if (currentlyEditing === false) {
    snippetInfoElem.innerHTML = showEmptyForm();
    editorContainerElem.innerHTML = '';
    saveCodeElem.style.display = 'none'
    const cancelFormButton = document.querySelector('.discard-btn')
    const saveChangesFormButton = document.querySelector('.save-snippet-form-btn'); 
    const emptyForm = document.querySelector('#form')
    emptyForm.addEventListener('submit', (e) => {
      e.preventDefault()
    })

    // doesnt actually submit the form, just sets up the listener 
    submitSnippetForm()
    // now that the form is showing, the user is 'editing'
    currentlyEditing = true;
    handleFormDynamics();
    snippetContainer.style.opacity = '1'
    emptyElem.style.display = 'none'
    snippetListHTML = emptySnippetListItemSkeleton;
    snippetListElem.innerHTML += snippetListHTML;
    
    // if editor and snippet info display is none, show them
    if (snippetContainer.style.opacity === '0') {
      firstForm = true;
    } 

    const lastAddedSnippet = snippetListElem.lastElementChild;
    
    cancelFormButton.addEventListener('click', () => {
      if (firstForm === true) {
        snippetContainer.style.opacity = '0';
        emptyElem.style.display = 'flex'
        currentlyEditing = false;
        createSnippetBtn.style.opacity = '1';   
        snippetClickListeners();
        const allListedSnippets = snippetListElem.querySelectorAll('.listed-snippet-container');
        allListedSnippets.forEach(snip => {
          snip.classList.remove('shown-snippet');
        })
        if (lastAddedSnippet) {
          lastAddedSnippet.remove()
        }
      }
    })

    saveChangesFormButton.addEventListener('click', () => {
      currentlyEditing = false;
    })
  } else {
    alert('ur editing')
  }
})

function submitSnippetForm() {

  createSnippetBtn.style.opacity = '1';  
  const form = document.querySelector('#form');

  form.addEventListener('submit', async (e) => {
    currentlyEditing = false;
    e.preventDefault();
    const formLanguageSelect = document.querySelector('#form-snippet-language');
    const nameInput = document.querySelector('#name-input')
    

    const tagsElem = document.querySelectorAll('.tag-input')
    let tagArray = [];
  
    
    tagsElem.forEach(tag => {
      const val = tag.value.trim()
      if (val != '') {
        tagArray.push(val)
      }
    })
    

    const formData = {
      name: nameInput.value,
      language: formLanguageSelect.value,
      createdAtFormatted: currentDate,
      tags: tagArray,
      favorite: false
    }

    const response = await fetch('/testurl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    const result = await response.json();
    const snippetID = result.snippet._id;

    displaySnippetInfo(snippetID);
    editorContainerElem.innerHTML = showEmptyEditor(snippetID);
    saveCodeElem.style.display = 'flex';
    createSnippetBtn.style.opacity = '1'
    await populateUserSnippets();
    const newSnipElem = document.querySelector(`.listed-snippet-container[data-id="${snippetID}"]`);
    newSnipElem.classList.add('shown-snippet');

  })
}

async function populateUserSnippets() {
  searchbarElem.value = '';
  let finalizedSnippetListItemHTML = '';
  
  const response = await fetch('/snippets', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })

  const result = await response.json()
  let arrayOfSnippets = result.snippets;
  if (sortByDateElem.value === 'newest-first') {
    arrayOfSnippets = [...arrayOfSnippets]
    arrayOfSnippets = arrayOfSnippets.reverse();
  }
  arrayOfSnippets.forEach(snip => {
    finalizedSnippetListItemHTML += createListedSnippetHTML(snip)
  })

  snippetListElem.innerHTML = finalizedSnippetListItemHTML;

  // snippet amount (right under searchbar)
  const amountOfSnippets = arrayOfSnippets.length;
  displaySnippetAmt(amountOfSnippets);

  // displaying snippet info on click
  snippetClickListeners();

  // favoriting a snippet via the listed element
  let favorite;
  const listedSnippetHeartElems = document.querySelectorAll('.favorites-img')
  listedSnippetHeartElems.forEach(heart => {
    heart.addEventListener('click', e => {
      e.stopPropagation();
      toggleHearts(heart);
      favorite = heart.src.endsWith('heart-2.png') ? true : false;
      const snippet = heart.closest('.listed-snippet-container');
      const snippetID = snippet.dataset.id;
      favoriteSnippet(snippetID, favorite);

      // changing the snippet info if its showing
      if (snippetInfoElem.querySelector('.edit-snippet-box').dataset.id === snippetID) {
        document.querySelector('.snippet-info-heart').src = favorite ? '../images/heart-2.png' : '../images/heart.png'; 
      }  
    })
  })

  handleFilters();
}

// displaying snippet info
async function displaySnippetInfo(snippetID) {
  searchbarElem.value = '';
  const response = await fetch('/snippets', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })

  const result = await response.json()
  const arrayOfSnippets = result.snippets;
  const snippetToDisplay = arrayOfSnippets.find(snippet => snippet._id === snippetID);

  snippetInfoElem.innerHTML = createSnippetInfoHTML(snippetToDisplay);

  // deleting snippet
  const infoDeleteBtn = document.querySelector('#delete-snippet')
  infoDeleteBtn.addEventListener('click', () => {
    const snippetInfoID = infoDeleteBtn.parentElement.dataset.id

    let text = 'This snippet will be deleted <b>forever</b>'
    Swal.fire({
      title: 'Are you sure?',
      html: text, 
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'No, cancel',
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSnippet(snippetInfoID);
        emptyElem.style.display = 'flex';
        snippetContainer.style.opacity = '0';
        const totalSnippetElem = document.querySelector('.total-snippets-span');
        displaySnippetAmt(totalSnippetElem.innerHTML[0] - 1);
      }
    })


  })

  // add snippet to favorite
  let favorite = false;
  const snippetInfoHeartElems = document.querySelectorAll('.snippet-info-heart');
  snippetInfoHeartElems.forEach(heart => {
    heart.addEventListener('click', () => {
      const snippetInfoID = heart.parentElement.dataset.id
      toggleHearts(heart); // only changes the frontend 
      favorite = heart.src.endsWith('heart-2.png') ? true : false;
      favoriteSnippet(snippetInfoID, favorite);
    })
  }) 

  // edit snippet metadata
  const infoEditButtons = document.querySelectorAll('.edit-snippet-img')
  infoEditButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentlyEditing = true;
      const snippetID = btn.parentElement.dataset.id;
      snippetInfoElem.innerHTML = showPreloadedForm(snippetToDisplay);
      handleFormDynamics();
      const languageSelectElem = document.querySelector('#form-snippet-language');
      languageSelectElem.value = snippetToDisplay.language;
      editSnippetInfo(snippetID);
    })
  })

  // code handling
  let savedValue = ''
  if (snippetToDisplay.code) { savedValue = snippetToDisplay.code };
  let savedLanguage = 'javascript';
  if (snippetToDisplay.language) { savedLanguage =  snippetToDisplay.language}
  editorContainerElem.innerHTML = showEmptyEditor(snippetID);
  initializeEditors(savedValue, savedLanguage);
  const lineCount = snippetToDisplay.lineCount;
  updateLineCount(lineCount);
  
}

async function deleteSnippet(snippetID) {
  searchbarElem.value = '';
  const deletedListedSnippet = document.querySelector(`.listed-snippet-container[data-id="${snippetID}"]`);
  if (deletedListedSnippet) { deletedListedSnippet.remove() };

  const response = await fetch('/delete', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ snippetID })
  })
}

// editing a snippets metadata (ex. name, language & tags)
async function editSnippetInfo(snippetID) {
  const discardBtn = document.querySelector('.discard-btn');
  discardBtn.addEventListener('click', () => {
    displaySnippetInfo(snippetID);
    currentlyEditing = false;
    createSnippetBtn.style.opacity = 1;
  })
  const form = document.querySelector('#form');
  form.addEventListener('submit', async (e) => {
    createSnippetBtn.style.opacity = 1;
    currentlyEditing = false;
    e.preventDefault();
    const formLanguageSelect = document.querySelector('#form-snippet-language');
    const nameInput = document.querySelector('#name-input');
    const tagsElem = document.querySelectorAll('.tag-input');
    let tagArray = [];
  
    
    tagsElem.forEach(tag => {
      const val = tag.value.trim()
      if (val != '') {
        tagArray.push(val)
      }
    })
  
    const formData = {
      name: nameInput.value,
      language: formLanguageSelect.value,
      tags: tagArray
    }
  
    const response = await fetch('/edit', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ snippetID, formData })
    })

    displaySnippetInfo(snippetID);
    populateUserSnippets();
  })
}

async function favoriteSnippet(snippetID, favorite) {
  const response = await fetch('/favorite', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ snippetID, favorite })
  })

  if (response.ok) {
    const listedSnippetElem = document.querySelector(`.listed-snippet-container[data-id="${snippetID}"]`)
    if (listedSnippetElem) {
      listedSnippetElem.querySelector('.favorites-img').src = favorite ? '../images/heart-2.png' : '../images/heart.png';
    }
  }
}

function snippetClickListeners() {
  const allListedSnippets = snippetListElem.querySelectorAll('.listed-snippet-container');
  allListedSnippets.forEach(snippet => {   
    snippet.addEventListener('click', () => {
      currentlyEditing = false;
      createSnippetBtn.style.opacity = 1;
      emptyElem.style.display = 'none';
      snippetContainer.style.opacity = '1';
      allListedSnippets.forEach(snippet => snippet.classList.remove('shown-snippet'))
      snippet.classList.add('shown-snippet')
      emptyElem.style.display = 'none'
      snippetContainer.style.opacity = '1'
      const id = snippet.dataset.id;
      displaySnippetInfo(id)
    })
  })
}

populateUserSnippets();

// monaco editor
require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@latest/min/vs' } });

function initializeEditors(savedValue, savedLanguage) {
  require(['vs/editor/editor.main'], function() {
    monaco.editor.defineTheme('custom', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '888888' },
        { token: 'keyword', foreground: '351DE2'},
        { token: 'string', foreground: '3b9996' },
        { token: 'variable', foreground: '3d8e2b' },
        { token: 'number', foreground: '09885a' },
        { token: 'type', foreground: '3d8e2b' },
        { token: 'bracket', foreground: '3d8e2b' },
        { token: 'delimiter', foreground: '000000' },
        { token: 'delimiter.parenthesis', foreground: '2879d1' },
        { token: 'delimiter.square', foreground: '2879d1' },
        { token: 'delimiter.bracket', foreground: '2879d1' },
        { token: 'identifier', foreground: '8A35B4' },
        { token: 'attribute.value.html', foreground: '351DE2' },
        { token: 'attribute.name.html', foreground: '3b9996' },
        { token: 'tag.html', foreground: '691bb1' },
        { token: 'metatag.content.html', foreground: '8a2be2' },
        { token: 'tag.css', foreground: '691bb1' },
        { token: 'attribute.name.css', foreground: '351DE2' },
        { token: 'metatag.php', foreground: '351DE2' },
        { token: 'keyword.php', foreground: '8a2be2' },
      ],
      colors: {
        'editor.background': '#d5d5d5',
        'editor.foreground': '#000000',
        'editor.lineHighlightBackground': '#f2f0f048',
        'editorCursor.foreground': '#333333',
        'editor.selectionBackground': '#b2b0b083',
        'editorLineNumber.foreground': '#888888',
        'editorLineNumber.activeForeground': '#8a2be2',
      }
    });


    //metatag.php
    //
  
  
    const editorElems = document.querySelectorAll('.editor');
  
    editorElems.forEach(editor => {
      const id = editor.dataset.id;
      
      let codeValue = '';
      if (savedValue) { codeValue = savedValue }
      let codeLanguage = 'javascript';
      if (savedLanguage) {
        savedLanguage = savedLanguage.toLowerCase()
        switch (savedLanguage) {
          case 'c++':
            codeLanguage = 'cpp';
            break;
          case 'c#':
            codeLanguage = 'csharp';
            break;
          default:
            codeLanguage = savedLanguage;
        }
      }

      editors[id] = monaco.editor.create(editor, {
        value: codeValue,
        language: codeLanguage,
        theme: 'custom'
      })

      // save button
      const saveCodeBtn = document.querySelector('.save-code-button');
      saveCodeBtn.addEventListener('click', () => {
        const lineCount = editors[id].getModel().getLineCount();
        const currentSnippetID = document.querySelector('.edit-snippet-box').dataset.id;
        saveCode(editors[id], lineCount, currentSnippetID);
      })
  
      // command S
      document.addEventListener('keydown', e => {
        if ((e.metaKey || e.ctrlKey) && e.key === 's') {
          e.preventDefault();
          const lineCount = editors[id].getModel().getLineCount();
          if (document.querySelector('.edit-snippet-box')) {
            const currentSnippetID = document.querySelector('.edit-snippet-box').dataset.id;
            saveCode(editors[id], lineCount, currentSnippetID);
          } else { alert('No Info is currently showing.') }
        }
      })


      // live line count while typing
      editors[id].onDidChangeModelContent(() => {
        const lineCount = editors[id].getModel().getLineCount();
        updateLineCount(lineCount);
      })
    })
  
    window.addEventListener('resize', () => {
      editors.forEach(editor => {
        editor.layout()
      })
    });
  });
}

async function saveCode(editor, lineCount, snippetID) {
  const listedSnippetLineCountElem = document.querySelector(`.listed-snippet-line-amount[data-id="${snippetID}"]`);
  listedSnippetLineCountElem.innerHTML = `${lineCount} ${lineCount != 1 ? 'Lines' : 'Line'}`

  const code = editor.getValue();
  const response = await fetch('/savecode', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, lineCount, snippetID })
  })

  if (response.ok) {
    const result = await response.json();
    const lastSaved = result.lastSaved;
    const lastSavedElem = document.querySelector('#last-saved');
    lastSavedElem.innerHTML = `Last saved on ${currentDate} at ${lastSaved}`;
    if (document.querySelector('#last-saved-divider').innerHTML === "") {
      document.querySelector('#last-saved-divider').innerHTML = '&#x2022';
    }
  }
}

sortByDateElem.addEventListener('change', () => {
  populateUserSnippets()
})