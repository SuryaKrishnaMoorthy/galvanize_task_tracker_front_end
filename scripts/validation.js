const nameFormat = /^[a-zA-Z'.-]+$/;
const emailFormat = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
const passwordFormat = /.{8,}/;
const titleFormat = /./;

const changeInputBoxStyle = (e, format) => {
  if (e.target.value === "" || format.test(e.target.value)) {
    e.target.removeAttribute("style");
  }else if (!format.test(e.target.value)) {
    e.target.style.color = "rgb(255, 69, 0)";
    e.target.style.borderColor = "rgba(255, 69, 0, 0.5)";
    e.target.style.boxShadow = "0 0 8px rgba(250, 128, 114, 0.9)";
  };
};

// Add listeners to input fields
const addNameValidation = () => {
  const names = Array.from(document.querySelectorAll(".name"));
  names.forEach(name => name.addEventListener("keyup", (e) => changeInputBoxStyle(e, nameFormat)));
}

const addEmailValidation = () => {
  const emails = Array.from(document.querySelectorAll(".email"));
  emails.forEach(email => email.addEventListener("keyup", (e) => changeInputBoxStyle(e, emailFormat)));
}

const addPasswordValidation = () => {
  const passwords = Array.from(document.querySelectorAll(".password"));
  passwords.forEach(password => password.addEventListener("keyup", (e) => changeInputBoxStyle(e, passwordFormat)));
}

const addTitleValidation =() => {
  const titleInputs = Array.from(document.querySelectorAll(".title"))
  titleInputs.forEach(title => title.addEventListener("keyup", (e) => changeInputBoxStyle(e, titleFormat)))
}

//Animate the login/signup button if invalid
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

//Show and hide the error Message
const showAndFadeError = (error) => {
  const loginSignupError = document.querySelector(".login-signup-error");
  loginSignupError.style.display = 'block';
  loginSignupError.innerHTML = error;
  setTimeout(() => { loginSignupError.style.display = 'none'; }, 3000);
};

module.exports = {
  nameFormat,
  emailFormat,
  passwordFormat,
  addNameValidation,
  addEmailValidation,
  addPasswordValidation,
  shakeNode,
  showAndFadeError
}
