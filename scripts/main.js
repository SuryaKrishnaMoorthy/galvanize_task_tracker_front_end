const validation = require('./validation.js')
require('./tasks.js')

const loginBtn = document.querySelector('.login-btn')
const signupBtn = document.querySelector('.signup-btn')
const logoutBtn = document.querySelector('.logout')

if (loginBtn) {
  loginBtn.addEventListener('click', (event) => {
    event.preventDefault()

    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value

    if (!validation.emailFormat.test(email) || !validation.passwordFormat.test(password)) {
      validation.shakeNode(event.target)
      return validation.showAndFadeError("Email/Password is not in correct format")
    }

    loginUser(email, password)
  })
}

if (signupBtn) {
  signupBtn.addEventListener('click', (event) => {
    event.preventDefault()

    const first_name = document.getElementById('signup-fName').value
    const last_name = document.getElementById('signup-lName').value
    const email = document.getElementById('signup-email').value
    const password = document.getElementById('signup-password').value

    if (!validation.nameFormat.test(first_name) || !validation.nameFormat.test(last_name)
        || !validation.emailFormat.test(email) || !validation.passwordFormat.test(password)) {
      validation.shakeNode(event.target)
      return validation.showAndFadeError("The values entered are not in correct format")
    }

    validateUser(first_name, last_name, email, password)
  })
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', (event) => {
    event.preventDefault()

    logoutUser()
  })
}

function loginUser (email, password) {
  axios.post('https://auth-task-manager-server.herokuapp.com/api/users/login', { email, password })
  .then(response => {
    const token = response.data.token
    localStorage.setItem('token', token)
    document.location.replace("./views/tasks.html")
  })
  .catch(e => {
    validation.showAndFadeError(e.response.data.error);
    throw new Error(e)
  })
}

function validateUser (first_name, last_name, email, password) {
  axios.post('https://auth-task-manager-server.herokuapp.com/api/users/signup', { first_name, last_name, email, password })
  .then(response => {
    if (response) loginUser(email, password)
  })
  .catch(e => {
    validation.showAndFadeError(e.response.data.error);
    throw new Error(e)
  })
}

function logoutUser () {
  localStorage.clear()
  document.location.replace("./../index.html")
}

// Add validations to input fields on page load
validation.addNameValidation();
validation.addEmailValidation();
validation.addPasswordValidation();
