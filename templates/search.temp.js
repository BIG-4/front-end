window.app = window.app || {}
window.app.SearchTemplate = { ProjectModal, Search, Item }

function Search(items, projects) { //function Search(items) {
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
                    <input id="keyword" name="keyword" type="text" placeholder="Search by keyword">
                </div>
                <div class="filter-field filter-project">
                    <select>
                    <option value="all">Choose a project</option>
                    ${projects.reduce((acc, project) => acc += OptionForm(project.project_id, project.project_name), '')}
                    </select>
                </div>
                <div class="filter-field filter-status">
                    <select>
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
                <div class="search-btn">
                    <button id="reset" class="btn-reset">Reset</button>
                </div>
            </div>
            <main>
                <div class="border-radius shadow bg-white w-50 auto-margin">
                    <div class="flex border-bottom padding">
                        <h3 class="no-margin">Search Result</h3>
                    </div>

                    <div class="padding border-top">
                    ${items.reduce((acc, item) => acc += Item(item), '')}
                    </div>
                </div>
            </main>`
}

function OptionForm(id, name) {
    return `
        <option value="${id}">${name}</option>
    `
}

function Item({ id, title }) {
    return `<div id="item-${id}-title" class="item show droppable" draggable="true">
                <p class="no-margin border border-radius">${title}</p>
            </div>
            <textarea id="item-${id}-title-input" class="hide border border-radius item-input">${title}</textarea>`
}