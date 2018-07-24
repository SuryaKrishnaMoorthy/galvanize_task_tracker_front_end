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
    if (lists[0].id) localStorage.setItem('list_id', lists[0].id)
    renderUserLists(lists)
    fetchUserTasks(lists[0])
  })
  .catch(e => { throw new Error(e) })
}

function renderUserLists(lists) {
  const listContainer = document.querySelector('.list-items-container')

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
  const completeTaskBtns = document.querySelectorAll('.completeTask')

  completeTaskBtns.forEach(btn => {
    btn.addEventListener('click', (event) => {
      event.preventDefault()

      // complete task, move to new div, remove from old div
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
  const addListBtn = document.querySelector(".add-list");
  const newList = document.querySelector(".new-list-or-task");
  addListBtn.addEventListener("click", () => {
    newList.innerHTML = createListTemplate();
    document.querySelector("#list-title").focus();
    submitListForm();
  })
}

function submitListForm() {
  const createListForm = document.querySelector(".needs-validation");
  createListForm.addEventListener('submit', createList);
}

function createList(e) {
  e.preventDefault();
  const title = document.querySelector("#list-title").value;
  axios('https://auth-task-manager-server.herokuapp.com/api/lists', {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
      data: { title },
      method: 'POST'
    })
    .then((response) => {
      const listContainer = document.querySelector('.list-items-container')
      const title = response.data.list.title;
      const listId = response.data.list.id;
      listContainer.innerHTML += userListsTemplate(listId, title, 0);
      document.querySelector("#list-title").value = "";
      addClickEventToDeleteListBtn();
    })
    .catch(e => {
      throw new Error(e);
    })
}

function addClickEventToDeleteListBtn() {
  const listDeleteBtns = Array.from(document.querySelectorAll(".list-delete"));
  listDeleteBtns.forEach(listDeleteBtn => {
    listDeleteBtn.addEventListener("click", (event) => deleteListFromDb(event))
  })
}

function deleteListFromDb(event) {
  const currentListNode = event.target.parentNode;
  const listId = currentListNode.getAttribute("data-id");
  axios.delete(`https://auth-task-manager-server.herokuapp.com/api/lists/${listId}`, {
      headers: {  authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(response => currentListNode.style.display = "none")
    .catch(e => { throw new Error(e) })
}

window.fetchUserLists = fetchUserLists
// window.renderUserLists = renderUserLists
