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
                ${List({ id: 0, title: 'Unsigned', items: [] })}
                ${List({ id: 1, title: 'To do', items: [] })}
                ${List({ id: 2, title: 'Doing', items: [] })}
                ${List({ id: 3, title: 'Done', items: [] })}
                
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

function Item({ id, title }) {
    return `<div id="item-${id}-title" class="item show droppable" draggable="true">
                <p class="no-margin border border-radius">${title}</p>
            </div>
            <textarea id="item-${id}-title-input" class="hide border border-radius item-input">${title}</textarea>`
}