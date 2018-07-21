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

//Animate the button if invalid
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

//function to show and hide the error Message
const showAndFadeError = (error) => {
  let loginSignupError = document.querySelector(".login-signup-error");
  loginSignupError.style.display = 'block';
  loginSignupError.innerHTML = error;
  //hides the message after time interval
  setTimeout(() => {
    loginSignupError.style.display = 'none';
  }, 2000);
}

module.exports = {
  validateEmailFormat,
  shakeNode,
  showAndFadeError
}
