const templates = require('./templates.js')

if (window.location.href.match('tasks.html') != null) {
  window.onload = fetchUserLists()
  addClickEventToNewTaskBtn()
}

function fetchUserLists () {
  axios.get('https://auth-task-manager-server.herokuapp.com/api/lists', {
    headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
  })
  .then(response => {
    const lists = response.data.lists
    if (lists[0].id) localStorage.setItem('list_id', lists[0].id)
    console.log(lists)
    renderUserLists(lists)
    extractUserTasks(lists[0])
  })
  .catch(e => { throw new Error(e) })
}

function renderUserLists (lists) {
  const listContainer = document.querySelector('.list-items-container')
  lists.forEach(list => {
    listContainer.innerHTML += userListsTemplate(list)
  })
}

function extractUserTasks (list) {
  const tasks = list.tasks
  const completedTasksContainer = document.querySelector('.complete-tasks')
  const incompleteTasksContainer = document.querySelector('.incomplete-tasks')

  tasks.forEach(task => {
    if (task.completed) {
      completedTasksContainer.innerHTML += completedTaskTemplate(task)
    } else {
      incompleteTasksContainer.innerHTML += incompleteTaskTemplate(task)
    }
  })

  addEventListenersForTaskCardBtns()
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

function createNewTask () {
  const list_id = localStorage.getItem('list_id')
  const token = localStorage.getItem('token')
  const title = document.getElementById('task-title').value
  const description = document.getElementById('task-desc').value
  const url = `https://auth-task-manager-server.herokuapp.com/api/lists/${list_id}/tasks`

  console.log(title, description, url, `Bearer ${token}`)


  axios({
    method: 'post',
    url: url,
    headers: { authorization: `Bearer ${token}` },
    data: { title, description, list_id }
  })
  .then(response => {
    console.log(response)
    // document.querySelector('.list-items-container').innerHTML = ''

    // Still printing out the entire list twice, then adding the new elmt

    // axios.get('https://auth-task-manager-server.herokuapp.com/api/lists', {
    //   headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
    // })
    // .then(response => {
    //   const lists = response.data.lists
    //   const list = lists[0]
    //   const tasks = list.tasks
    //   const completedTasksContainer = document.querySelector('.complete-tasks')
    //   const incompleteTasksContainer = document.querySelector('.incomplete-tasks')
    //
    //   tasks.forEach(task => {
    //     if (task.completed) {
    //       completedTasksContainer.innerHTML += completedTaskTemplate(task)
    //     } else {
    //       incompleteTasksContainer.innerHTML += incompleteTaskTemplate(task)
    //     }
    //   })
    // })
    // .catch(e => { throw new Error(e) })


  })
  .catch(e => { throw new Error(e) })
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

window.fetchUserLists = fetchUserLists
// window.renderUserLists = renderUserLists
