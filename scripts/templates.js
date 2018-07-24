function incompleteTaskTemplate (task) {
  return `
  <div class="doing-card">
    <h5 class="doing-card-title m-2">${task.title}</h5>
    <div class="doing-card-body m-2">
      <p class="doing-card-content m-0">${task.description}</p>
    </div>
    <div class="doing-card-footer">
      <i class="fas fa-check-circle fa-2x text-primary ml-2 doing-completed"></i>
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
      <i class="fas fa-check-circle fa-2x text-primary ml-2 done-completed"></i>
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
      <button type="submit" class="btn btn-primary create-list">Create Task</button>
    </form>
  </div>`;
}

window.incompleteTaskTemplate = incompleteTaskTemplate
window.completedTaskTemplate = completedTaskTemplate
window.userListsTemplate = userListsTemplate
window.createListTemplate = createListTemplate;
window.createTaskTemplate = createTaskTemplate;
