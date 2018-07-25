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
      // fetchUserTasks(lists[0])
      renderTasks(list)
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

function renderTasks(list){
  const listNodes = Array.from(document.querySelectorAll(".list-of-task"))
  listNodes.forEach(listNode => {
    listNode.addEventListener("click", () => { if(listNode.getAttribute("data-id")) fetchUserTasks(list) } )
  })
}
window.fetchUserLists = fetchUserLists
