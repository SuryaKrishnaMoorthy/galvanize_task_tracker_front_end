const doingCardTemplate =   `<div class="doing-card">
        <h5 class="doing-card-title m-2">${tasks.title}</h5>
        <div class="doing-card-body m-2">
          <p class="doing-card-content m-0">${tasks.description}</p>
        </div>
        <div class="doing-card-footer">
          <i class="fas fa-check-circle fa-2x text-primary ml-2 doing-completed"></i>
          <p class="updated-time mr-2 mt-1 text-muted"><small>${tasks.created_at} seconds ago</small></p>
        </div>
      </div>`;

module.exports = doingCardTemplate;
