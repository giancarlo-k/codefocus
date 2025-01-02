export function handleTags_info(array) {
  if (array.every(item => item === '')) {
    return `<div style="color: #000000a6;">No Tags</div>`
  } else {
    return array.map(tag => `<div class="snippet-final-tag">${tag}</div>`).join('')
  }
}; 

export function handleTags_list(array) {
  if (array.every(item => item === '')) {
    return 'No Tags';
  } else if (array.length >= 2) {
    let result = array.slice(0, 2).map(tag => `<div class="tag">${tag}</div>`).join('')
    if (array[0].length >= 6) {
      result = `<div class="tag">${array[0]}</div>`
    }
    return result;
  } else if (array.length === 1) {
    return `<div class="tag">${array[0]}</div>`
  } 
}

export function handeTags_form(array) {
  return array.map(tag => `
        <div style="" class="tag-input-box">
          <input type="text" class="tag-input" placeholder="Tag" value="${tag}" maxlength="10">
          <span class="remove-tag-span">Remove</span>
        </div>       
    `).join('');
}

export function handleLanguageIcons(language) {
  const defaultNameWorks = ['JavaScript', 'Python', 'Java', 'Ruby', 'PHP', 'TypeScript', 'Swift'];
  if (!defaultNameWorks.includes(language)) {
    switch(language){
      case 'HTML':
        return 'html5'
        break;
      case 'CSS':
        return 'css3'
        break;
      case 'C++':
        return 'cplusplus'
        break;
      case 'C#':
        return 'csharp'
        break;
    }
  } else {
    return language.toLowerCase();
  }
}

export const displaySnippetAmt = (amount) => {
  const amtOfSnippetsElem = document.querySelector('.total-snippets-span');
  if (amount === 1) {
    amtOfSnippetsElem.innerHTML = `1 Snippet`
  } else { amtOfSnippetsElem.innerHTML = `${amount} Total Snippets` };
}

// only for the snippet info
export function updateLineCount(lineCount) {
  const lineCountElem = document.querySelector('#line-count');
  if (lineCount === undefined) { lineCount = 1 };
  lineCountElem.innerHTML = `${lineCount} ${lineCount != 1 ? 'Lines' : 'Line'}`;
}