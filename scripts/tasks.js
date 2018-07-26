const templates = require('./templates.js')
const validation = require('./validation.js')

if (window.location.href.match('tasks.html') != null) {
  if (localStorage.getItem('token') !== null) {
    window.onload = displayUserContent()
  } else {
    document.location.replace("./../index.html")
  }
}

function displayUserContent() {
  fetchUserLists()
  displayListForm()
  addClickEventToNewTaskBtn()
}

function fetchUserLists() {
  axios.get('https://auth-task-manager-server.herokuapp.com/api/lists', {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then((response) => {
      const lists = response.data.lists
      if (lists.length) {
        if (localStorage.getItem('list_id') === null) localStorage.setItem('list_id', lists[0].id)
        renderUserLists(lists)
        lists.forEach(list => {
          if (list.id === parseInt(localStorage.getItem('list_id'))) fetchUserTasks(list)
        })
      } else {
        displayNewListTemplateIfNewUser()
      }
    })
    .catch(e => {
      throw new Error(e)
    })
}

function renderUserLists(lists) {
  const listContainer = document.querySelector('.list-items-container')
  if (listContainer.innerHTML !== '') listContainer.innerHTML = ''

  lists.forEach((list, i) => {
    listContainer.innerHTML += userListsTemplate(list.id, list.title, list.tasks.length)
    listContainer.children[i].style.backgroundColor = '#fff'
    if (list.id === parseInt(localStorage.getItem('list_id'))) listContainer.children[i].style.backgroundColor = '#8eb9ff'
  })
  addClickEventToLists(lists)
  updateActiveListWhenClicked()
  addClickEventToDeleteListBtn()
}

function addClickEventToLists(lists) {
  lists.forEach(list => {
    const selector = "[data-id='" + `${list.id}` + "']"
    const listNode = document.querySelector(selector)

    listNode.addEventListener('click', () => {
      fetchUserTasks(list)
    })
  })
}

function fetchUserTasks(list) {
  const tasks = list.tasks
  const completedTasksContainer = document.querySelector('.complete-tasks')
  const incompleteTasksContainer = document.querySelector('.incomplete-tasks')
  localStorage.setItem('list_id', list.id)

  renderUserTasks(tasks, completedTasksContainer, incompleteTasksContainer)
}

function getTimeDiff(task) {
  let createTime = (task.created_at === task.updated_at) ? task.created_at : task.updated_at;
  let timePassed = (Date.now() - new Date(createTime)) / 1000;

  if (timePassed > 60) {
    timePassed = timePassed / 60;
    if (timePassed > 60) {
      timePassed = timePassed / 60;
      if (timePassed > 24) {
        timePassed = timePassed / 24;
        timePassed = Math.floor(timePassed) + " days";
      } else {
        timePassed = Math.floor(timePassed) + " hours";
      }
    } else {
      timePassed = Math.floor(timePassed) + " minutes";
    }
  } else {
    timePassed = Math.floor(timePassed) + " seconds";
  }
  return timePassed
}

function renderUserTasks(tasks, completedTasks, incompleteTasks) {
  if (completedTasks.innerHTML !== '') completedTasks.innerHTML = ''
  if (incompleteTasks.innerHTML !== '') incompleteTasks.innerHTML = ''

  tasks.forEach(task => {
    const timePassed = getTimeDiff(task)

    if (task.completed) {
      completedTasks.innerHTML += completedTaskTemplate(task, timePassed)
    } else {
      incompleteTasks.innerHTML += incompleteTaskTemplate(task, timePassed)
    }
  })

  onClickToggleTaskCompletion()
  markIncompleteTaskToComplete()
  editIncompleteTask(tasks)
  editCompleteTasks(tasks)
  addEventListenerToDeleteTask()
}

function addEventListenerToDeleteTask() {
  const deleteTaskIcons = Array.from(document.querySelectorAll(".deleteTask"))
  deleteTaskIcons.forEach(icon => {
    icon.addEventListener("click", (event) => {
      event.preventDefault()

      const list_id = event.target.parentNode.parentNode.getAttribute("data-list-id")
      const task_id = event.target.parentNode.parentNode.getAttribute("data-task-id")
      deleteTask(true, list_id, task_id, null)
    })
  })
}

function deleteTask(completed, list_id, task_id, task) {
  const token = localStorage.getItem('token')
  const url = `https://auth-task-manager-server.herokuapp.com/api/lists/${list_id}/tasks/${task_id}`

  axios({
      method: 'delete',
      url: url,
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      fetchUserLists()
    })
    .catch(e => {
      throw new Error(e)
    })
}

function addClickEventToNewTaskBtn() {
  const newTaskBtn = document.querySelector('.add-task')

  newTaskBtn.addEventListener('click', (event) => {
    event.preventDefault()

    document.querySelector('.new-list-or-task').innerHTML = createTaskTemplate()
    document.querySelector('.task-title').focus()
    addEventListenerToCreateTaskBtn()
  })
}

function addEventListenerToCreateTaskBtn() {
  const createTask = document.querySelector('.create-task')

  createTask.addEventListener('click', (event) => {
    event.preventDefault()

    validation.addTitleValidation(event)
    createNewTask()
  })
}

function editIncompleteTask(tasks) {
  tasks.forEach(task => {
    const selector = "[data-task-id='" + `${task.id}` + "']"
    const taskNode = document.querySelector(selector)

    taskNode.children[1].addEventListener('click', (event) => {
      event.preventDefault()

      const templateArea = document.querySelector(".new-list-or-task");
      templateArea.innerHTML = updateTaskTemplate(task);
      addClickEventToUpdateBtn(task);
    })
  })
}

function editCompleteTasks (tasks) {
  tasks.forEach(task => {
    const selector = "[data-task-id='" + `${task.id}` + "']"
    const taskNode = document.querySelector(selector)

    if (task.completed) {
      taskNode.children[2].addEventListener('click', (event) => {
        event.preventDefault()

        const templateArea = document.querySelector(".new-list-or-task")
        templateArea.innerHTML = updateTaskTemplate(task)
        addClickEventToUpdateBtn(task)
      })
    }
  })
}

function addClickEventToUpdateBtn(task) {
  const createListForm = document.querySelector(".update-task");
  createListForm.addEventListener('click', (event) => {
    event.preventDefault()

    const list_id = task.list_id;
    const task_id = task.id;
    task.description = document.querySelector("#task-desc").value;

    validation.addTitleValidation()
    updateTask(false, list_id, task_id, task)
  })
}

function markIncompleteTaskToComplete() {
  const completeTaskIcons = Array.from(document.querySelectorAll(".completeTask"));
  completeTaskIcons.forEach(icon => {
    icon.addEventListener("click", (event) => {
      event.preventDefault()

      const list_id = event.target.parentNode.parentNode.getAttribute("data-list-id");
      const task_id = event.target.parentNode.parentNode.getAttribute("data-task-id");
      updateTask(true, list_id, task_id, null)
    })
  })
}

function onClickToggleTaskCompletion () {
  const completeTaskIcons = Array.from(document.querySelectorAll(".completeTask"))
  completeTaskIcons.forEach(icon => icon.addEventListener("click", toggleTaskCompletion))

  const uncompleteTaskIcons = Array.from(document.querySelectorAll(".uncompleteTask"))
  uncompleteTaskIcons.forEach(icon => icon.addEventListener("click", toggleTaskCompletion))
}

function toggleTaskCompletion (event) {
  event.preventDefault()

  const list_id = event.target.parentNode.parentNode.getAttribute("data-list-id")
  const task_id = event.target.parentNode.parentNode.getAttribute("data-task-id")

  if (event.target.parentNode.className === 'completeTask') {
    updateTask(true, list_id, task_id, null)
  } else {
    updateTask(false, list_id, task_id, null)
  }
}

function updateTask(completed, list_id, task_id, task) {
  const token = localStorage.getItem('token');
  const url = `https://auth-task-manager-server.herokuapp.com/api/lists/${list_id}/tasks/${task_id}`;

  if(task){
    task.title = document.getElementById('task-title').value;
    if (!task.title) {
      const titleNode = document.getElementById('task-title');
      titleNode.style.color = "rgb(255, 69, 0)";
      titleNode.style.borderColor = "rgba(255, 69, 0, 0.5)";
      titleNode.style.boxShadow = "0 0 8px rgba(250, 128, 114, 0.9)";
      document.querySelector("#task-title").setAttribute("placeholder", "Please provide Task Title");
      return
    }
  }

  let body;
  if (task) {
    body = {
      title: task.title,
      description: task.description
    };
  } else {
    body = {
      completed
    };
  }



  axios({
      method: 'patch',
      url: url,
      headers: {
        authorization: `Bearer ${token}`
      },
      data: body
    })
    .then(response => {
      document.querySelector(".new-list-or-task").innerHTML = ''
      if (!task) //
      fetchUserLists()
    })
    .catch(e => {
      throw new Error(e)
    })
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

function createNewTask() {
  const list_id = localStorage.getItem('list_id')
  const token = localStorage.getItem('token')
  const title = document.getElementById('task-title').value
  const description = document.getElementById('task-desc').value
  const url = `https://auth-task-manager-server.herokuapp.com/api/lists/${list_id}/tasks`

  if (!title) {
    const titleNode = document.getElementById('task-title');
    titleNode.style.color = "rgb(255, 69, 0)";
    titleNode.style.borderColor = "rgba(255, 69, 0, 0.5)";
    titleNode.style.boxShadow = "0 0 8px rgba(250, 128, 114, 0.9)";
    document.querySelector("#task-title").setAttribute("placeholder", "Please provide Task Title");
    return
  }

  axios({
      method: 'post',
      url: url,
      headers: {
        authorization: `Bearer ${token}`
      },
      data: {
        title,
        description,
        list_id
      }
    })
    .then(response => {
      displayUserContent()
      document.querySelector('.new-list-or-task').innerHTML = ''
    })
    .catch(e => {
      throw new Error(e)
    })
}

function displayListForm() {
  const addListBtn = document.querySelector(".add-list")
  const templateArea = document.querySelector(".new-list-or-task")

  addListBtn.addEventListener("click", (event) => {
    event.preventDefault()

    templateArea.innerHTML = createListTemplate()
    document.querySelector("#list-title").focus()
    validation.addTitleValidation()
    submitListForm()
  })
}

function submitListForm() {
  const createListForm = document.querySelector(".needs-validation")
  createListForm.addEventListener('submit', createList)
}

function createList(event) {
  event.preventDefault()
  const title = document.querySelector("#list-title").value;

  if (!title) {
    event.target[0].style.color = "rgb(255, 69, 0)";
    event.target[0].style.borderColor = "rgba(255, 69, 0, 0.5)";
    event.target[0].style.boxShadow = "0 0 8px rgba(250, 128, 114, 0.9)";
    document.querySelector("#list-title").setAttribute("placeholder", "Please provide List Title");
    return
  }

  axios('https://auth-task-manager-server.herokuapp.com/api/lists', {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
      },
      data: {
        title
      },
      method: 'POST'
    })
    .then((response) => {
      const listContainer = document.querySelector('.list-items-container')
      const title = response.data.list.title;
      const listId = response.data.list.id;
      localStorage.setItem('list_id', listId)
      listContainer.innerHTML += userListsTemplate(listId, title, 0)
      document.querySelector("#list-title").value = ''
      document.querySelector('.new-list-or-task').innerHTML = ''
      addClickEventToDeleteListBtn()
      fetchUserLists()
    })
    .catch(e => {
      throw new Error(e)
    })
}

function deleteListFromDb(event) {
  const currentListNode = event.target.parentNode
  const listId = currentListNode.getAttribute("data-id")

  axios.delete(`https://auth-task-manager-server.herokuapp.com/api/lists/${listId}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      currentListNode.style.display = "none"
      const completedTasksContainer = document.querySelector('.complete-tasks')
      completedTasksContainer.innerHTML = ''
      const incompleteTasksContainer = document.querySelector('.incomplete-tasks')
      incompleteTasksContainer.innerHTML = ''
    })
    .catch(e => {
      throw new Error(e)
    })
}

function displayNewListTemplateIfNewUser() {
  document.querySelector(".add-list").click()
}

function updateActiveListWhenClicked() {
  const lists = document.querySelectorAll('.list-of-task')
  lists.forEach(list => {
    list.addEventListener('click', (event) => {
      event.preventDefault()

      document.querySelectorAll('.list-of-task').forEach(li => {
        if (li.style.backgroundColor !== '#fff') li.style.backgroundColor = '#fff'
      })

      list.style.backgroundColor = '#8eb9ff'
    })
  })
}

window.fetchUserLists = fetchUserLists
