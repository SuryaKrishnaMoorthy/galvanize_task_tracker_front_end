const loginBtn = document.querySelector('.login-btn')
const signupBtn = document.querySelector('.signup-btn')

loginBtn.addEventListener('click', (event) => {
  event.preventDefault()

  const email = document.getElementById('login-email').value
  const password = document.getElementById('login-password').value
  loginUser(email, password)
})

signupBtn.addEventListener('click', (event) => {
  event.preventDefault()

  const first_name = document.getElementById('signup-fName').value
  const last_name = document.getElementById('signup-lName').value
  const email = document.getElementById('signup-email').value
  const password = document.getElementById('signup-password').value

  validateUser(first_name, last_name, email, password)
})

function loginUser (email, password) {
  axios.post('https://auth-task-manager-server.herokuapp.com/api/users/login', { email, password })
  .then(response => {
    const token = response.data.token
    document.location.replace("./views/tasks.html")
  })
  .catch(e => { throw new Error(e) })
}

function validateUser (first_name, last_name, email, password) {
  axios.post('https://auth-task-manager-server.herokuapp.com/api/users/signup', { first_name, last_name, email, password })
  .then(response => {
    if (response) loginUser(email, password)
  })
  .catch(e => { throw new Error(e) })
}
