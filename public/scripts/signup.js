const confirmPass = document.querySelector('#confirm-password');
const firstPass = document.querySelector('#first-password');
const submitBtn = document.querySelector('#submit-btn');
const pwdRulesSpan = document.querySelector('.password-rules-span');
const pwdCharacterRuleSpan = document.querySelector('.character-pwd-span');
const pwdNumberRuleSpan = document.querySelector('.number-pwd-span');
const confirmPwdSpan = document.querySelector('.confirm-password-span');
const pwdVisibilityImgs = document.querySelectorAll('.pwd-box img');
const inputs = document.querySelectorAll('input');

confirmPass.disabled = true;

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

confirmPass.addEventListener('input', () => {
  const value = confirmPass.value;

  if (value === '') {
    confirmPwdSpan.style.opacity = '0';
  } else {
    confirmPwdSpan.style.opacity = '1';
  }

  if (value !== firstPass.value) {
    confirmPwdSpan.innerHTML = 'Passwords do not match'
    confirmPwdSpan.style.color = 'red'
    submitBtn.disabled = true;
  } else { // if they do match: 
    confirmPwdSpan.innerHTML = 'Passwords match!'
    confirmPwdSpan.style.color = 'green'
    submitBtn.disabled = false;
  }


});

firstPass.addEventListener('input', () => {
  const inputValue = firstPass.value;
  const inputLength = inputValue.length;
  const numRegex = /\d/;
  let isLengthPassed = false;
  let isNumPassed = false;
  
  if (inputLength >= 6) {
    pwdCharacterRuleSpan.style.color = 'green'
    isLengthPassed = true;
  } else {
    pwdCharacterRuleSpan.style.color = 'red'
    isLengthPassed = false;
  }

  if (numRegex.test(inputValue)) {
    pwdNumberRuleSpan.style.color = 'green'
    isNumPassed = true;
  } else {
    pwdNumberRuleSpan.style.color = 'red'
    isNumPassed = false;
  }

  if (inputLength === 0) {
    pwdRulesSpan.style.color = '#989797'
    pwdNumberRuleSpan.style.color = '#989797'
    pwdCharacterRuleSpan.style.color = '#989797'
    confirmPass.value = '';
    confirmPwdSpan.style.opacity = '0'
  }

  if (isLengthPassed === true && isNumPassed === true) {
    pwdRulesSpan.style.color = 'green'
    confirmPass.disabled = false;
  } else {
    pwdRulesSpan.style.color = '#989797'
    confirmPass.disabled = true;
  }
})


document.querySelector('form').addEventListener('submit', async (e) => {
  document.querySelector('.username-taken').style.opacity = '0';
  e.preventDefault(); // dont let the form submit automatically
  const username = document.querySelector('#username').value;
  const password = document.querySelector('#confirm-password').value;

  try {
    const response = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    if (response.status === 409) {
      document.querySelector('.username-taken').style.opacity = '1';
      return;
    }

    if (response.status === 200) {
      window.location.href= '/dashboard'
    }
  } catch (error) {
    console.log('error', error)
  }
})