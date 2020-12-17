window.app = window.app || {}
window.app.ProjectTemplate = { Project, List, Item }

function Project(project_id, project_name, tasks) {
    return `<header class="shadow header" style="height: 56px">
                <h3 class="no-margin">Task Manangement</h3>
                <div class="nav-main">
                    <a id="nav-home" class="nav-link">Home</a>
                    <a id="nav-acc" class="nav-link">Account</a>
                    <a id="nav-func" class="nav-link">Function</a>
                    <a id="nav-logout" class="nav-link">Log Out</a>
                </div>
            </header>
            <h2 class="prj-title">${project_name}</h2>
            <main class="padding row">
                ${List({ id: 0, title: 'Unsigned', items: tasks.unsigned })}
                ${List({ id: 1, title: 'To do', items: tasks.todo })}
                ${List({ id: 2, title: 'Doing', items: tasks.doing })}
                ${List({ id: 3, title: 'Done', items: tasks.done })}
                
            </main>`
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

function Item({ task_id, task_title, username }) {
    return `<div id="item-${task_id}-title" class="item show droppable" draggable="true">
                <div class="no-margin border border-radius">
                    <p>${task_title}</p>
                    <p>User: ${username} </p>
                </div>
            </div>`
}