const loginBtn = document.querySelector('.login-btn')
const signupBtn = document.querySelector('.signup-btn')

loginBtn.addEventListener('click', (event) => {
  event.preventDefault()
  console.log('login')
})

signupBtn.addEventListener('click', (event) => {
  event.preventDefault()
  console.log('signup')
})
