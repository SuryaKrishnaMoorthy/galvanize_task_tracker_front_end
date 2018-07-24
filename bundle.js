(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"./tasks.js":2,"./validation.js":4}],2:[function(require,module,exports){
const templates = require('./templates.js')

if (window.location.href.match('tasks.html') != null) window.onload = displayUserContent()

function displayUserContent () {
  fetchUserLists()
  displayListForm()
  addClickEventToNewTaskBtn()
}

function fetchUserLists() {
  axios.get('https://auth-task-manager-server.herokuapp.com/api/lists', {
    headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
  })
  .then(response => {
    const lists = response.data.lists
    if (lists.length) {
      localStorage.setItem('list_id', lists[0].id)
      renderUserLists(lists)
      fetchUserTasks(lists[0])
    }
  })
  .catch(e => { throw new Error(e) })
}

function renderUserLists(lists) {
  const listContainer = document.querySelector('.list-items-container')
  console.log("LISTS:", lists)
  if (listContainer.innerHTML !== '') listContainer.innerHTML = ''
  lists.forEach(list => { listContainer.innerHTML += userListsTemplate(list.id, list.title, list.tasks.length) })
  addClickEventToDeleteListBtn()
}

function fetchUserTasks (list) {
  const tasks = list.tasks
  const completedTasksContainer = document.querySelector('.complete-tasks')
  const incompleteTasksContainer = document.querySelector('.incomplete-tasks')

  renderUserTasks(tasks, completedTasksContainer, incompleteTasksContainer)
  // addEventListenersForTaskCardBtns()
}

function renderUserTasks (tasks, completedTasks, incompleteTasks) {
  if (completedTasks.innerHTML !== '') completedTasks.innerHTML = ''
  if (incompleteTasks.innerHTML !== '') incompleteTasks.innerHTML = ''

  tasks.forEach(task => {
    if (task.completed) {
      completedTasks.innerHTML += completedTaskTemplate(task)
    } else {
      incompleteTasks.innerHTML += incompleteTaskTemplate(task)
    }
  })
}

function addClickEventToNewTaskBtn () {
  const newTaskBtn = document.querySelector('.add-task')

  newTaskBtn.addEventListener('click', (event) => {
    event.preventDefault()

    document.querySelector('.new-list-or-task').innerHTML = createTaskTemplate()
    document.querySelector('.task-title').focus()
    addEventListenerToCreateTaskBtn()
  })
}

function addEventListenerToCreateTaskBtn () {
  const createTask = document.querySelector('.create-task')

  createTask.addEventListener('click', (event) => {
    event.preventDefault()

    createNewTask()
  })
}

function addEventListenersForTaskCardBtns (task) {
  // complete task btn, update task btn, maybe a delete task btn
}

function addClickEventToDeleteListBtn() {
  const listDeleteBtns = Array.from(document.querySelectorAll(".list-delete"))

  listDeleteBtns.forEach(btn => {
    btn.addEventListener("click", (event) => {
      event.preventDefault()
      deleteListFromDb(event)
    })
  })
}

function createNewTask () {
  const list_id = localStorage.getItem('list_id')
  const token = localStorage.getItem('token')
  const title = document.getElementById('task-title').value
  const description = document.getElementById('task-desc').value
  const url = `https://auth-task-manager-server.herokuapp.com/api/lists/${list_id}/tasks`

  axios({
    method: 'post',
    url: url,
    headers: { authorization: `Bearer ${token}` },
    data: { title, description, list_id }
  })
  .then(response => {
    displayUserContent()
    document.querySelector('.new-list-or-task').innerHTML = ''
  })
  .catch(e => { throw new Error(e) })
}

function displayListForm() {
  const addListBtn = document.querySelector(".add-list")
  const templateArea = document.querySelector(".new-list-or-task")

  addListBtn.addEventListener("click", (event) => {
    event.preventDefault()

    templateArea.innerHTML = createListTemplate()
    document.querySelector("#list-title").focus()
    submitListForm()
  })
}

function submitListForm() {
  const createListForm = document.querySelector(".needs-validation")
  createListForm.addEventListener('submit', createList)
}

function createList(error) {
  error.preventDefault()
  const title = document.querySelector("#list-title").value

  axios('https://auth-task-manager-server.herokuapp.com/api/lists', {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
      data: { title },
      method: 'POST'
    })
    .then((response) => {
      console.log('createList response.data:', response.data)
      const listContainer = document.querySelector('.list-items-container')
      const title = response.data.list.title;
      const listId = response.data.list.id;
      localStorage.setItem('list_id', listId)
      listContainer.innerHTML += userListsTemplate(listId, title, 0)
      document.querySelector("#list-title").value = ''
      addClickEventToDeleteListBtn()
    })
    .catch(e => { throw new Error(e) })
}

function deleteListFromDb(event) {
  const currentListNode = event.target.parentNode
  const listId = currentListNode.getAttribute("data-id")

  axios.delete(`https://auth-task-manager-server.herokuapp.com/api/lists/${listId}`, {
      headers: {  authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(response => currentListNode.style.display = "none")
    .catch(e => { throw new Error(e) })
}


window.fetchUserLists = fetchUserLists

},{"./templates.js":3}],3:[function(require,module,exports){
function incompleteTaskTemplate (task) {
  return `
  <div class="doing-card">
    <h5 class="doing-card-title m-2">${task.title}</h5>
    <div class="doing-card-body m-2">
      <p class="doing-card-content m-0">${task.description}</p>
    </div>
    <div class="doing-card-footer">
      <div class="card-icons">
        <a class="completeTask"><i class="far fa-check-square"></i></a>
        <a class="editIncompleteTask"><i class="far fa-edit"></i></a>
      </div>
      <p class="updated-time mr-2 mt-1 text-muted"><small>${((Date.now())-(new Date(task.created_at*1000)))} seconds ago</small></p>
    </div>
  </div>
  `
}

function completedTaskTemplate (task) {
  return `
  <div class="done-card">
    <h5 class="done-card-title m-2">${task.title}</h5>
    <div class="done-card-body m-2">
      <p class="done-card-content m-0">${task.description}</p>
    </div>
    <div class="done-card-footer">
      <div class="card-icons">
        <a class="deleteTask"><i class="far fa-window-close"></i></a>
        <a class="editCompleteTask"><i class="far fa-edit"></i></a>
      </div>
      <p class="updated-time mr-2 mt-1 text-muted"><small>${((Date.now())-(new Date(task.created_at*1000)))} seconds ago</small></p>
    </div>
  </div>
  `
}

function userListsTemplate (listId, title, taskLength) {
  return `
  <li class="list-group-item list-of-task" data-id=${listId}>${title}
    <span class="badge badge-info">${taskLength}</span>
    <span class="close list-delete">&times;</span>
  </li>
  `
}

function createListTemplate () {
  return `<div class="new-list-container">
    <form class="needs-validation" novalidate>
      <input type="text" class="form-control list-title" id="list-title" placeholder="List Title" required>
      <button type="submit" class="btn btn-primary create-list">Create List</button>
    </form>
  </div>`;
}

function createTaskTemplate () {
  return `<div class="new-task-container">
    <form class="needs-validation" novalidate>
      <input type="text" class="form-control task-title" id="task-title" placeholder="Title" required>
      <textarea class="form-control task-desc" id="task-desc" placeholder="Description" rows="3" required></textarea>
      <button type="submit" class="btn btn-primary create-task">Create Task</button>
    </form>
  </div>`;
}

window.incompleteTaskTemplate = incompleteTaskTemplate
window.completedTaskTemplate = completedTaskTemplate
window.createListTemplate = createListTemplate
window.createTaskTemplate = createTaskTemplate
window.userListsTemplate = userListsTemplate
window.createListTemplate = createListTemplate;
window.createTaskTemplate = createTaskTemplate;

},{}],4:[function(require,module,exports){
const nameFormat = /^[a-zA-Z'.-]+$/;
const emailFormat = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
const passwordFormat = /.{8,}/;

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

},{}]},{},[1]);
