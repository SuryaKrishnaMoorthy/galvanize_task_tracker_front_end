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

function userListsTemplate (title) {
  return `
  <li class="list-group-item list-of-task">${title}
    <span class="badge badge-info">2</span>
  </li>
  `
}

window.incompleteTaskTemplate = incompleteTaskTemplate
window.completedTaskTemplate = completedTaskTemplate
window.userListsTemplate = userListsTemplate