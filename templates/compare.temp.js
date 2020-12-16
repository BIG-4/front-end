window.app = window.app || {}
window.app.CompareTemplate = { Compare, Table }

function Compare(projects, users, data) {
    console.log(users);
    var result = `<header class="shadow header " style="height: 56px">
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
                        ${projects.reduce((acc, project) => acc += OptionForm(project.project_id, project.project_name, data.prj), '')}
                        </select>
                    </div>  
                    <div class="filter-field check-user">
                        <span class="check-title">Choose users</span>
                    ${users.reduce((acc, user) => acc += CheckUser(user.username, data.checked), '')}
                    </div>
                    <div class="search-btn">
                        <button id="submit" class="btn-submit">Submit</button>
                    </div>
                </div>
                <div class="border-radius shadow bg-white table-container auto-margin">`
    result += Table(data.all, data.result)

    return result += '</div></main>'
}

function Table(all, result) {
    console.log(result);
    var table = `
    <table>
        <tr class="table-header">
            <td>Fields</td>`
    for (var i = 0; i < result.length; i++) {
        table += `<td>${result[i].user}</td>`
    }
    table += `</tr >
        <tr>
            <td>Number of To do tasks</td>`
    for (var i = 0; i < result.length; i++) {
        table += `<td>${result[i].todo}</td>`
    }
    table += `</tr>
        <tr>
            <td>Number of Doing tasks</td>`
    for (var i = 0; i < result.length; i++) {
        table += `<td>${result[i].doing}</td>`
    }
    table += `</tr>
        <tr>
            <td>Number of Done tasks</td>`
    for (var i = 0; i < result.length; i++) {
        table += `<td>${result[i].done}</td>`
    }
    table += `</tr>
        <tr>
            <td>Personal Ratio</td>`
    for (var i = 0; i < result.length; i++) {
        table += `<td>${result[i].done} / ${result[i].todo + result[i].doing + result[i].done}</td>`
    }
    table += `</tr>
        <tr>
            <td>Project Ratio</td>`
    for (var i = 0; i < result.length; i++) {
        table += `<td>${result[i].done} / ${all}</td>`
    }
    table += `</tr>
    </table > `

    return table
}

function OptionForm(id, name, prj) {
    return id == prj ? `<option value="${id}" selected="selected">${name}</option>` : `<option value="${id}">${name}</option>`
}
function CheckUser(name, users) {
    return `
    <div class="checkbox">
        <input name="compare-user" type="checkbox" value="${name}">
        <label for= "compare-user" > ${name}</label>
    </div>`
}