/* eslint-disable no-return-assign */
window.app = window.app || {}

function Table(all, result) {
  let i1
  let i2
  let i3
  let i4
  let i5
  let i6
  let table = `
      <table>
          <tr class="table-header">
              <td>Fields</td>`
  for (i1 = 0; i1 < result.length; i1++) {
    table += `<td>${result[i1].user}</td>`
  }
  table += `</tr >
          <tr>
              <td>Number of To do tasks</td>`
  for (i2 = 0; i2 < result.length; i2++) {
    table += `<td>${result[i2].todo}</td>`
  }
  table += `</tr>
          <tr>
              <td>Number of Doing tasks</td>`
  for (i3 = 0; i3 < result.length; i3++) {
    table += `<td>${result[i3].doing}</td>`
  }
  table += `</tr>
          <tr>
              <td>Number of Done tasks</td>`
  for (i4 = 0; i4 < result.length; i4++) {
    table += `<td>${result[i4].done}</td>`
  }
  table += `</tr>
          <tr>
              <td>Personal Performance</td>`
  for (i5 = 0; i5 < result.length; i5++) {
    const allPer = result[i5].todo + result[i5].doing + result[i5].done
    let percent
    if (allPer === 0) percent = 0.00
    else percent = result[i5].done / allPer
    table += `<td class="ratio">${percent.toFixed(2)}% (${result[i5].done}/${allPer})</td>`
  }
  table += `</tr>
          <tr>
              <td>Project Performance</td>`
  for (i6 = 0; i6 < result.length; i6++) {
    table += `<td class="ratio">${(result[i6].done / all).toFixed(2)}% (${result[i6].done}/${all})</td>`
  }
  table += `</tr>
      </table > `

  return table
}

function CheckUser(name, check) {
  return name === check
    ? `<div class="checkbox">
          <input name="compare-user" type="checkbox" value="${name}" checked>
          <label for= "compare-user" > ${name}</label>
      </div>`
    : `<div class="checkbox">
      <input name="compare-user" type="checkbox" value="${name}">
      <label for= "compare-user" > ${name}</label>
  </div>`
}

function Compare(projects, users, data) {
  console.log(data)
  let result = `<header class="shadow header " style="height: 56px">
                <h3 class="no-margin">Task Manangement</h3>
                <div class="nav-main">
                    <a id="nav-home" class="nav-link">Home</a>
                    <a id="nav-func" class="nav-link">Function</a>
                    <a id="nav-logout" class="nav-link">Log Out</a>
                </div>
            </header>
            <main>
                <div class="search-filter">
                    <div class="filter-field filter-project">
                        <select id="compare-prj">
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
                    <div class="filter-field check-user">
                        <span class="check-title">Choose users</span>`
  users.forEach((user) => {
    if (data.checked.includes(user.username)) {
      result += `<div class="checkbox">
      <input name="compare-user" type="checkbox" value="${user.username}" checked>
      <label for= "compare-user" > ${user.username}</label>
  </div>`
    } else {
      result += `<div class="checkbox">
      <input name="compare-user" type="checkbox" value="${user.username}">
      <label for= "compare-user" > ${user.username}</label>
  </div>`
    }
  })
  result += `</div>
                    <div class="search-btn">
                        <button id="submit" class="btn-submit">Submit</button>
                    </div>
                </div>
                <h2 class="prj-title">Performance  Evaluation  Project "${data.prj_name}"</h2>

                <div class="border-radius shadow bg-white table-container auto-margin">`
  result += Table(data.all, data.result)

  return result += '</div></main>'
}

window.app.CompareTemplate = { Compare, Table }
