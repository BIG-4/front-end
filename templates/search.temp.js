/* eslint-disable camelcase */
/* eslint-disable no-return-assign */
window.app = window.app || {}

function Search(items, projects, users, statuses, data) { // function Search(items)
  let result = `<header class="shadow header " style="height: 56px">
                <h3 class="no-margin brand" id="nav-brand">Task Manangement</h3>
                <div class="nav-main">
                    <a id="nav-home" class="nav-link">Home</a>
                    <a id="nav-func" class="nav-link">Function</a>
                    <a id="nav-logout" class="nav-link">Log Out</a>
                </div>
            </header>
            <div class="search-filter">
                <div class="filter-field search-key">
                    <input id="search-key" name="keyword" type="text" placeholder="Search by keyword" value="${data.key}">
                </div>
                <div class="filter-field filter-user">
                    <select id="search-user">
                        <option value="all">Choose a user</option>`
  users.forEach((user) => {
    if (user.id.toString() === data.user) {
      result += `<option value="${user.id}" selected>${user.username}</option>`
    } else {
      result += `<option value="${user.id}">${user.username}</option>`
    }
  })
  result += `</select>
                </div>
                <div class="filter-field filter-project">
                    <select id="search-prj" value=${data.prj}>
                        <option value="all">Choose a project</option>`
  projects.forEach((project) => {
    if (project.project_id.toString() === data.prj) {
      result += `<option value="${project.project_id}" selected>${project.project_name}</option>`
    } else {
      result += `<option value="${project.project_id}">${project.project_name}</option>`
    }
  })
  result += `</select>
                </div>
                <div class="filter-field filter-status">
                    <select id="search-status">
                        <option value="all">Choose status</option>`
  statuses.forEach((status) => {
    if (status.id.toString() === data.status) {
      result += `<option value="${status.id}" selected>${status.name}</option>`
    } else {
      result += `<option value="${status.id}">${status.name}</option>`
    }
  })
  result += ` </select>
                </div>
                <div class="search-btn">
                    <button id="search" class="btn-submit">Search</button>
                </div>
            </div>
            <main>
                <div class="border-radius shadow bg-white w-50 auto-margin">
                    <div class="flex border-bottom padding">
                        <h3 class="no-margin">Search Result</h3>
                    </div>

                    <div class="padding border-top search-result">`
  if (items.length !== 0) {
    items.forEach((key) => {
      result += `
      <div id="item-${key.task_id}-title" class="item show">
          <button id="remove-item-${key.task_id}" class="icon-button color-danger remove-item">
              <i class="lnr lnr-cross"></i>
          </button> 
          <div id="item-${key.task_id}-detail" class="no-margin border border-radius item-detail">
              <p>${key.task_title}</p>
              <p>User: ${key.username} </p>
          </div>
      </div>
        `
    })
  } else {
    result += '<div><h3>Not found</h3></div>'
  }

  return result += '</div></div></main>'
}

window.app.SearchTemplate = { Search }
