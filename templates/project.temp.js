/* eslint-disable camelcase */
/* eslint-disable no-return-assign */
window.app = window.app || {}

function Item({ task_id, task_title, username }) {
  return `<div id="item-${task_id}-title" class="item show droppable" draggable="true">
              <div class="no-margin border border-radius">
                  <p>${task_title}</p>
                  <p>User: ${username} </p>
              </div>
          </div>`
}

function OptionForm(id, username, user) {
  return id === user ? `<option value="${id}" selected="selected">${username}</option>` : `<option value="${id}">${username}</option>`
}

function List({ id, title, items }) {
  return `<div class="list bg-white shadow border-radius">
              <div class="header border-bottom">
                  <h4 id="list-${id}-title" class="no-margin show list-title">${title}</h4>   
                  <button id="add-item-${id}" class="icon-button color-info add-item droppable"><i class="lnr lnr-plus-circle"></i></button>
              </div>
              <div id="items-container-${id}" class="padding items-container">
                  ${items.reduce((acc, item) => acc += Item(item), '')}
              </div>
          </div>`
}

function ItemModal(title, taskName, user, users) {
  console.log(this.users)
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
                    <label>Task Name: </label>
                    <input name="t_name" id="t_name" value="${taskName}">
                </div>
                <div class="project-form">
                    <label>User: </label>
                    <select id="t_user">
                      <option value="all">Choose user</option>
                      ${users.reduce((acc, user) => acc += OptionForm(user.id, user.username, user), '')}
                    </select>
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

function Project(projectId, projectName, tasks) {
  return `<header class="shadow header" style="height: 56px">
                <h3 class="no-margin">Task Manangement</h3>
                <div class="nav-main">
                    <a id="nav-home" class="nav-link">Home</a>
                    <a id="nav-acc" class="nav-link">Account</a>
                    <a id="nav-func" class="nav-link">Function</a>
                    <a id="nav-logout" class="nav-link">Log Out</a>
                </div>
            </header>
            <h2 class="prj-title">${projectName}</h2>
            <main class="padding row project-detail" id="project-${projectId}">
            
                ${List({ id: 0, title: 'Unsigned', items: tasks.unsigned })}
                ${List({ id: 1, title: 'To do', items: tasks.todo })}
                ${List({ id: 2, title: 'Doing', items: tasks.doing })}
                ${List({ id: 3, title: 'Done', items: tasks.done })}
                
            </main>`
}

window.app.ProjectTemplate = {
  Project, List, Item, ItemModal,
}
