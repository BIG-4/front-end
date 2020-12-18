/* eslint-disable camelcase */
/* eslint-disable no-return-assign */
window.app = window.app || {}

function ProjectButton({ project_id, project_name }) {
  return `<div class="flex list-button">
                <button id="open-project-${project_id}" class="padding flex project-button"> 
                    ${project_name}  
                </button>
                <button id="edit-project-${project_id}" class="icon-button color-info edit-project">
                    <i class="lnr lnr-cog"></i>
                </button>
                <button id="remove-project-${project_id}" class="icon-button color-danger remove-project">
                    <i class="lnr lnr-trash"></i>
                </button>
            </div>`
}

function ProjectModal(title, projectName) {
  console.log(projectName)
  return `
    <div class="modal-container">
        <div id="project-modal-bg"></div>

        <div class="modal border-radius shadow bg-white">
            <div class="padding modal-header">
                <h4 class="text-center no-margin">${title}</h4>
                <button id="close-modal" class="icon-button color-danger close-modal">
                    <i class="lnr lnr-cross"></i>
                </button>
            </div>
            <div class="padding">
                <div class="project-form">
                    <label>Project Name: </label>
                    <input name="p_name" id="p_name" value="${projectName}">
                </div>
            </div>
            <div class="padding modal-submit">
                <button id="modal-submit">Submit</button>
            </div>
            
        </div>
    </div>
    `
}

function Modal(title, text, hasButtons) {
  return `<div class="modal-container">
                <div id="modal-bg"></div>
                <div class="modal border-radius shadow bg-white">
                    <div class="padding">
                        <h4 class="text-center no-margin">${title}</h4>
                    </div>
                    <div class="padding">
                        <p class="no-margin">${text}</p>
                    </div>
                    <div class="flex-right full-width border-top padding">
                    ${hasButtons ? '<button id="no-button" class="link">No</button><button id="yes-button" class="link">Yes</button>' : ''}
                    </div>
                </div>
            </div>`
}

function OptionForm(id, name) {
  return `
        <option value="${id}">${name}</option>
    `
}

function Home(projects) {
  return `<header class="shadow header " style="height: 56px">
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
                    <input id="search-key" name="keyword" type="text" placeholder="Search by keyword">
                </div>
                <div class="filter-field search-key">
                    <input id="search-user" name="user" type="text" placeholder="Type an user name">
                </div>
                <div class="filter-field filter-project">
                    <select id="search-prj">
                        <option value="all">Choose a project</option>
                    ${projects.reduce((acc, project) => acc += OptionForm(project.project_id, project.project_name), '')}
                    </select>
                </div>
                <div class="filter-field filter-status">
                    <select id="search-status">
                        <option value="all">Choose status</option>
                        <option value="0">Unsigned</option>
                        <option value="1">To do</option>
                        <option value="2">Doing</option>
                        <option value="3">Done</option>
                    </select>
                </div>
                <div class="search-btn">
                    <button id="search" class="btn-submit">Search</button>
                </div>
            </div>
            <main>
                <div class="border-radius shadow bg-white w-50 auto-margin">
                    <div class="flex border-bottom padding">
                        <h3 class="no-margin">Projects</h3>
                        <button id="add-project" class="icon-button color-success"><i class="lnr lnr-plus-circle"></i></button>
                    </div>
                    ${projects.length !== 0
    ? projects.reduce((acc, project) => acc += ProjectButton(project), '')

    : '<div class="padding color-gray text-center">No projects</div>'
}
                    <div class="padding border-top"></div>
                </div>
            </main>`
}

window.app.HomeTemplate = {
  Home, Modal, ProjectModal, OptionForm,
}
