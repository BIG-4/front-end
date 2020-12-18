/* eslint-disable no-return-assign */
window.app = window.app || {}

function OptionForm(id, name, prj) {
  return id === prj ? `<option value="${id}" selected="selected">${name}</option>` : `<option value="${id}">${name}</option>`
}

function OptionStatus(status) {
  const arr = ['Unsigned', 'To do', 'Doing', 'Done']
  let result = ''
  for (let i = 0; i < 4; i++) {
    result += (i === status) ? `<option value="${i}" selected="selected">${arr[i]}</option>` : `<option value="${i}">${arr[i]}</option>`
  }
  return result
}

function Search(items, projects, data) { // function Search(items)
  let result = `<header class="shadow header " style="height: 56px">
                <h3 class="no-margin">Task Manangement</h3>
                <div class="nav-main">
                    <a id="nav-home" class="nav-link">Home</a>
                    <a id="nav-acc" class="nav-link">Account</a>
                    <a id="nav-func" class="nav-link">Function</a>
                    <a id="nav-logout" class="nav-link">Log Out</a>
                </div>
            </header>
            <div class="search-filter">
                <div class="filter-field search-key">
                    <input id="search-key" name="keyword" type="text" placeholder="Search by keyword" value="${data.key}">
                </div>
                <div class="filter-field search-key">
                    <input id="search-user" name="user" type="text" placeholder="Type an user name" value="${data.user}">
                </div>
                <div class="filter-field filter-project">
                    <select id="search-prj">
                    <option value="all">Choose a project</option>
                    ${projects.reduce((acc, project) => acc += OptionForm(project.project_id, project.project_name, data.prj), '')}
                    </select>
                </div>
                <div class="filter-field filter-status">
                    <select id="search-status" value="2">
                        <option value="all">Choose status</option>
                        ${OptionStatus(data.status)}
                    </select>
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

                    <div class="padding border-top">`
  if (items.length !== 0) {
    items.forEach((key) => {
      result += `
        <div id="item-${key.task_id}-title" class="item show droppable" draggable="true">
            <p class="no-margin border border-radius">${key.task_title}</p>
        </div>
        `
    })
  } else {
    result += '<div><h3>Not found</h3></div>'
  }

  return result += '</div></div></main>'
}

window.app.SearchTemplate = { Search }
