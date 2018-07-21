(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const validation = require('./validate.js');

const loginBtn = document.querySelector('.login-btn')
const signupBtn = document.querySelector('.signup-btn')

loginBtn.addEventListener('click', (event) => {
  event.preventDefault()

  const email = document.getElementById('login-email').value
  const password = document.getElementById('login-password').value

  if(!email || !password) validation.shakeNode(event.target);
  loginUser(email, password)
})

signupBtn.addEventListener('click', (event) => {
  event.preventDefault()

  const first_name = document.getElementById('signup-fName').value
  const last_name = document.getElementById('signup-lName').value
  const email = document.getElementById('signup-email').value
  const password = document.getElementById('signup-password').value

  if(!first_name || !last_name || !email || !password) validation.shakeNode(event.target);
  validateUser(first_name, last_name, email, password)
})

function loginUser (email, password) {
  axios.post('https://auth-task-manager-server.herokuapp.com/api/users/login', { email, password })
  .then(response => {
    const token = response.data.token
    document.location.replace("./views/tasks.html")
  })
  .catch(e => {
    validation.showAndFadeError(e);
    throw new Error(e)
  })
}

function validateUser (first_name, last_name, email, password) {
  axios.post('https://auth-task-manager-server.herokuapp.com/api/users/signup', { first_name, last_name, email, password })
  .then(response => {
    if (response) loginUser(email, password)
  })
  .catch(e => {
    validation.showAndFadeError(e);
    throw new Error(e) 
  })
}

},{"./validate.js":2}],2:[function(require,module,exports){
const validateEmailFormat  = () => {
  const emails = Array.from(document.querySelectorAll(".email"));
  const emailFormat = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  emails.forEach(email => {
    if (event.target.value === "" || emailFormat.test(event.target.value)) {
      event.target.removeAttribute("style");
    }else if (!emailFormat.test(event.target.value)) {
      event.target.style.color = "rgb(255, 69, 0)";
      event.target.style.borderColor = "rgba(255, 69, 0, 0.5)";
      event.target.style.boxShadow = "0 0 8px rgba(250, 128, 114, 0.9)";
    }
  })
}

const emails = Array.from(document.querySelectorAll(".email"));
//validates userinput on each key stroke.
emails.forEach(email => email.addEventListener("keyup", validateEmailFormat));

//Animate the text box if invalid
const shakeNode =  (node) => {
  node.style.boxShadow = "0 0 8px rgba(250, 128, 114, 0.9)";
  node.animate([
    {transform: "translateX(-10px)"},
    {transform: "translateX(+10px)"},
    {transform: "translateX(-10px)"},
    {transform: "translateX(+10px)"},
    {transform: "translateX(-10px)"}
  ], {duration: 200, iterations:1})
  setTimeout(() => { node.removeAttribute("style") }, 800);
};

//function to show and hide the sign up message
const showAndFadeError = (error) => {
  let loginSignupError = document.querySelector(".login-signup-error");
  loginSignupError.style.display = 'block';
  loginSignupError.innerHTML = error;
  //hides the message after time interval
  setTimeout(() => {
    loginSignupError.style.display = 'none';
  }, 2000);
}

//function to show message if valid or shakes input box if invalid
const validateSignUp = () => {
  if (emailFormat.test(email.value)) {
    showAndFadeError();
  } else {
    shakeNode(email);
  }
};

//sign up dom elements: input, button.
const loginBtn = document.querySelector(".login-btn");
const signupBtn = document.querySelector(".signup-btn");

//Event listener for signup button
loginBtn.addEventListener("click", validateSignUp);

module.exports = {
  validateEmailFormat,
  shakeNode,
  validateSignUp,
  showAndFadeError
}

},{}]},{},[1]);
