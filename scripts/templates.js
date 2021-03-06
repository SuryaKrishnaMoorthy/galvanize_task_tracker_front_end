function incompleteTaskTemplate (task, timePassed) {
  return `
  <div class="doing-card">
    <h5 class="doing-card-title m-2">${task.title}</h5>
    <div class="doing-card-body m-2">
      <p class="doing-card-content m-0">${task.description}</p>
    </div>
    <div class="doing-card-footer">
      <div class="card-icons" data-list-id=${task.list_id} data-task-id=${task.id}>
        <a class="completeTask" title="Mark completed"><i class="far fa-check-square"></i></a>
        <a class="editIncompleteTask" title="Edit task"><i class="far fa-edit"></i></a>
        <a class="deleteTask" title="Delete task"><i class="far fa-window-close"></i></a>
      </div>
      <p class="updated-time mr-2 mt-1 text-muted"><small>${timePassed} ago</small></p>
    </div>
  </div>
  `
}

function completedTaskTemplate (task, timePassed) {
  return `
  <div class="done-card">
    <h5 class="done-card-title m-2">${task.title}</h5>
    <div class="done-card-body m-2">
      <p class="done-card-content m-0">${task.description}</p>
    </div>
    <div class="done-card-footer">
      <div class="card-icons" data-list-id=${task.list_id} data-task-id=${task.id}>
        <a class="uncompleteTask" title="Mark incomplete"><i class="far fa-check-square"></i></a>
        <a class="editCompleteTask" title="Edit task"><i class="far fa-edit"></i></a>
        <a class="deleteTask" title="Delete task"><i class="far fa-window-close"></i></a>
      </div>
      <p class="updated-time mr-2 mt-1 text-muted"><small>${timePassed} ago</small></p>
    </div>
  </div>
  `
}

function userListsTemplate (listId, title, taskLength) {
  return `
  <li class="list-group-item list-of-task" data-id=${listId}>${title}
    <span class="badge">${taskLength}</span>
    <span class="close list-delete">&times;</span>
  </li>
  `
}

function createListTemplate () {
  return `<div class="new-list-container">
    <form class="needs-validation" novalidate>
      <input type="text" class="form-control list-title title" id="list-title" placeholder="List Title" required>
      <div class="invalid-feedback-list text-danger"><small></small></div>
      <button type="submit" class="btn create-list">Create List</button>
    </form>
  </div>`;
}

function createTaskTemplate () {
  return `<div class="new-task-container">
    <form class="needs-validation" novalidate>
      <input type="text" class="form-control task-title title" id="task-title" placeholder="Title" required>
      <div class="invalid-feedback-task text-danger m-0 p-0"><small></small></div>
      <textarea class="form-control task-desc" id="task-desc" placeholder="Description" rows="3" required></textarea>
      <button type="submit" class="btn create-task">Create Task</button>
    </form>
  </div>`;
}

function updateTaskTemplate (task) {
  return `<div class="new-task-container">
    <form class="needs-validation" novalidate>
      <input type="text" class="form-control task-title title" id="task-title" placeholder="Title" value="${task.title}" required>
      <div class="invalid-feedback-updatetask text-danger"><small></small></div>
      <textarea class="form-control task-desc" id="task-desc" placeholder="Description" rows="3" required >${task.description}</textarea>
      <button type="submit" class="btn update-task">Update Task</button>
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
window.updateTaskTemplate = updateTaskTemplate;
