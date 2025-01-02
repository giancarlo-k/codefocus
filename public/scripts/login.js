const firstPass = document.querySelector('#first-password');
const pwdVisibilityImgs = document.querySelectorAll('.pwd-box img');
const rememberMeElem = document.querySelector('.remember-input');

const inputs = document.querySelectorAll('input');

inputs.forEach(input => {
  input.addEventListener(('input'), () => {
    if (input.value) {
      input.style.borderColor = 'black'
    } else {
      input.style.borderColor = '#989797'
    }
  })
})

pwdVisibilityImgs.forEach(img => {
  img.addEventListener('click', () => {
    const inputElem = img.parentElement.querySelector('input')
    if (img.src.includes('view.png')) {
      img.src = '../images/hide.png';
      inputElem.type = 'text';
    } else {
      img.src = '../images/view.png';
      inputElem.type = 'password';
    }
  })
})


// Dealing with backend results
const incorrectSpan = document.querySelector('.incorrect-password');
const notFoundSpan = document.querySelector('.username-not-found');

document.querySelector('form').addEventListener('submit', async (e) => {
  incorrectSpan.style.opacity = 0;
  notFoundSpan.style.opacity = 0;
  e.preventDefault(); // dont let the form submit automatically
  const username = document.querySelector('#username').value;
  const password = document.querySelector('#first-password').value;
  const rememberMe = rememberMeElem.checked;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, rememberMe }),
      credentials: 'include'
    })

    const result = await response.json();

    if (response.status === 400) {
      document.querySelector('.incorrect-password').style.opacity = '1'
      return;
    }

    if (response.status === 404) {
      document.querySelector('.username-not-found').style.opacity = '1'
      return;
    }

    if (response.status === 200) {
      window.location.href= '/dashboard'
    }
  } catch (error) {
    console.log('error', error)
  }
})

// remember me