const templates = require('./templates.js')

if (window.location.href.match('tasks.html') != null) {
  window.onload = fetchUserLists()
  displayListForm()
}

function fetchUserLists() {
  axios.get('https://auth-task-manager-server.herokuapp.com/api/lists', {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      const lists = response.data.lists
      if (lists[0].id) localStorage.setItem('listID', lists[0].id)
      //console.log(lists)
      renderUserLists(lists)
      extractUserTasks(lists[0])
    })
    .catch(e => {
      throw new Error(e)
    })
}

function renderUserLists(lists) {
  const listContainer = document.querySelector('.list-items-container')
  lists.forEach(list => {
    listContainer.innerHTML += userListsTemplate(list.id, list.title, list.tasks.length)
  })
  addClickEventToDeleteListBtn()
}

function extractUserTasks(list) {
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
    .catch(e => {
      throw new Error(e);
    })
}

window.fetchUserLists = fetchUserLists
// window.renderUserLists = renderUserLists
