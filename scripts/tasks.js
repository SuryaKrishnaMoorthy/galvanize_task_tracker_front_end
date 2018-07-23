const templates = require('./templates.js')

if (window.location.href.match('tasks.html') != null) {
  window.onload = fetchUserLists()
  // addClickEventToNewTaskBtn()
}

function fetchUserLists () {
  axios.get('https://auth-task-manager-server.herokuapp.com/api/lists', {
    headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
  })
  .then(response => {
    const lists = response.data.lists
    if (lists[0].id) localStorage.setItem('listID', lists[0].id)
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
  const incompleteTasksContainer = document.querySelector('.incomplete-tasks')
  tasks.forEach(task => {
    if (task.completed) {
      completedTasksContainer.innerHTML += completedTaskTemplate(task)
    } else {
      incompleteTasksContainer.innerHTML += incompleteTaskTemplate(task)
    }
  })
}

// function addClickEventToNewTaskBtn () {
//   const newTaskBtn = document.querySelector('.new-task')
//   newTaskBtn.addEventListener('click', (event) => {
//     event.preventDefault()
//
//     renderNewTaskTemplate()
//   })
// }

window.fetchUserLists = fetchUserLists
// window.renderUserLists = renderUserLists
