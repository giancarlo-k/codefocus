import { handleTags_info, handleTags_list, handeTags_form, handleLanguageIcons } from "../utils.js";

const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

export let currentDate = (`${month}/${day}/${year}`);

export const languageFilterSelect = [
  "All Languages", "JavaScript", "Python", "Java", "C++", "C#", 
  "HTML", "CSS", "Ruby", "PHP", "TypeScript", "Swift"
];

export const emptySnippetListItemSkeleton =  `
      <div class="listed-snippet-container fill-out-form-preset">
        Awaiting Snippet Info 
      </div>
  `

export const finishedSnippetListItemSkeleton = `
      <div class="listed-snippet-container">

        <div class="top-container">
          <div class="snippet-name">My First Snippet</div>
          <img width="16" src="../images/heart.png" class="favorites-img">
          <img width="17" class="delete-snippet-img" src="../images/recycle-bin.png">
        </div>
        <div class="middle-container">
          <span>Python</span>         
          <img width="17" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" />
          <span style="color: black" >&#x2022</span>
          <div class="tag">Function</div>
          <div class="tag">API</div>
          
        </div>

        <div class="bottom-container">
          <span class="snippet-creation-date">11/2/24</span>
          <span class="snippet-line-amount">119 Lines</span>
        </div>
      </div>
`

export function createListedSnippetHTML({ _id, name, language, createdAtFormatted, tags, favorite, lineCount }) {
  let tagHTML = handleTags_list(tags)
  const linkLanguage = handleLanguageIcons(language)
  const heartimg = favorite ? 'heart-2' : 'heart';

  if (lineCount === undefined) { lineCount = 1 };

  return `
      <div data-id="${_id}" class="listed-snippet-container">

        <div class="top-container">
          <div class="snippet-name">${name}</div>
          <img width="15" src="../images/${heartimg}.png" class="favorites-img">
        </div>
        <div class="middle-container">
          <span class="listed-snippet-language">${language}</span>         
          <img width="17" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${linkLanguage}/${linkLanguage}-original.svg" />
          ${tagHTML != '' ? '<span style="color: black" >&#x2022</span>' : ''}
          ${handleTags_list(tags)}
          
        </div>

        <div class="bottom-container">
          <span class="snippet-creation-date">${createdAtFormatted}</span>
          <span data-id="${_id}" class="listed-snippet-line-amount">${lineCount} ${lineCount != 1 ? 'Lines' : 'Line'}</span>
        </div>
      </div>
  `;
}


export function createSnippetInfoHTML({ _id, name, language, createdAtFormatted, tags, favorite, lastSaved, lineCount }) {
  const linkLanguage = handleLanguageIcons(language);
  const heartimg = favorite ? 'heart-2' : 'heart';
  let lastSavedHTML = '';
  if (lastSaved) {
    lastSavedHTML = `Last saved on ${currentDate} at ${lastSaved}`;
  }

  return ` 
        <div class="finished-info-box">
          <div class="snippet-info-top-container">
            <span id="snippet-name">${name}</span>              
            <div data-id="${_id}" class="edit-snippet-box">
              <img class="snippet-info-heart" width="23" src="../images/${heartimg}.png">
              <img id="delete-snippet" width="24" src="../images/recycle-bin.png">
              <img class="edit-snippet-img" id="edit-snippet-img" width="22" src="../images/editing.png">
            </div>
          </div>

          <div class="snippet-info-middle-container">
            <span id="snippet-language">${language}</span>
            <img id="snippet-language-icon" width="22" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${linkLanguage}/${linkLanguage}-original.svg"/>
          </div>

          <div class="snippet-info-bottom-container">
            ${handleTags_info(tags)}
          </div>

          <div class="snippet-info-4th-container">
            <div class="created-saved-box">
              <div id="created-date">Created on ${createdAtFormatted}</div>
              <span id="last-saved-divider" style="color: #6d6d6d" >${lastSavedHTML != '' ? '&#x2022' : ''}</span>
              <div id="last-saved">${lastSavedHTML}</div>
            </div>           
            <div id="line-count">${lineCount} Lines</div>
          </div>
        </div>
    `
}

export function showEmptyForm() {
  return `
        <form id='form' class="snippet-form">
          <div class="snippet-form-top-container">
            <div class="snippet-name-container">             
              <input id="name-input" required type="text" placeholder="Snippet Name" maxlength="30" autocomplete="off" pattern=".*[a-zA-Z0-9].*" title="Must contain at least one non-whitespace character">
              <div class="snippet-name-rules">Must be 35 characters or less</div>
            </div>
            <div class="form-processing-buttons">
              <button type="button" class="discard-btn">Cancel</button>
              <button type="submit" class="save-snippet-form-btn">Save Changes</button>
            </div>
          </div>

          <div class="snippet-form-bottom-container">
            <div class="snippet-language-select">
              <span>Snippet Language</span>
              <select id="form-snippet-language" class="filter-select"></select>
            </div>

            <div class="snippet-tags-container">
              <div class="snippet-tags-top-container">
                <span>Tags</span>
              </div>
              <div class="snippet-tags-bottom-container">

                <div class="tag-inputs-container"> 

                  <div class="tag-input-box">
                    <input type="text" class="tag-input" placeholder="Tag" maxlength="10">
                    <span class="remove-tag-span">Remove</span>
                  </div>       

                </div>


                <img width="24" src="../images/add.png">
              </div>
            </div>
          </div>
        </form>
  `
}

// when editing an already existing snippet
export function showPreloadedForm({ name, tags }) {
  return `
    <form id='form' class="snippet-form">
      <div class="snippet-form-top-container">
        <div class="snippet-name-container">             
          <input id="name-input" required type="text" placeholder="Snippet Name" value="${name}" maxlength="30" autocomplete="off" pattern=".*[a-zA-Z0-9].*" title="Must contain at least one non-whitespace character">
          <div class="snippet-name-rules">Must be 35 characters or less</div>
        </div>
        <div class="form-processing-buttons">
          <button type="button" class="discard-btn">Cancel</button>
          <button type="submit" class="save-snippet-form-btn">Save Changes</button>
        </div>
      </div>

      <div class="snippet-form-bottom-container">
        <div class="snippet-language-select">
          <span>Snippet Language</span>
          <select id="form-snippet-language" class="filter-select"></select>
        </div>

        <div class="snippet-tags-container">
          <div class="snippet-tags-top-container">
            <span>Tags</span>
          </div>
          <div class="snippet-tags-bottom-container">

            <div class="tag-inputs-container"> 
              ${handeTags_form(tags)}
            </div>


            <img width="24" src="../images/add.png">
          </div>
        </div>
      </div>
    </form>
`
}

export function showEmptyEditor(id) {
  return `<div data-id="${id}" class="editor"></div>`
}
