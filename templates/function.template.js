/* eslint-disable no-return-assign */
window.app = window.app || {}

function OptionForm(id, name, prj) {
  return `< option value = "${id}" > ${name}</option > `
}
function CheckUser(name) {
  return `
          <div class="checkbox">
              <label for= "compare-user" > ${name}</label>
              <input name="compare-user" type="checkbox" value="${name}">
          </div>
           `
}

function Funct(projects, users) {
  return `<header class="shadow header " style="height: 56px">
                <h3 class="no-margin">Task Manangement</h3>
                <div class="nav-main">
                    <a id="nav-home" class="nav-link">Home</a>
                    <a id="nav-acc" class="nav-link">Account</a>
                    <a id="nav-func" class="nav-link">Function</a>
                    <a id="nav-logout" class="nav-link">Log Out</a>
                </div>
            </header>
            <main>
                <div class="search-filter">
                    <div class="filter-field filter-project">
                        <select id="compare-prj">
                        <option value="all">Choose a project</option>
                        ${projects.reduce((acc, project) => acc += OptionForm(project.project_id, project.project_name), '')}
                        </select>
                    </div>  
                    <div class="filter-field check-user">
                    <span class="check-title">Choose users</span>
                    ${users.reduce((acc, user) => acc += CheckUser(user.username), '')}
                    </div>
                    <div class="search-btn">
                        <button id="submit" class="btn-submit">Submit</button>
                    </div>
                </div>
            </main>`
}
window.app.FunctionTemplate = { Funct }
