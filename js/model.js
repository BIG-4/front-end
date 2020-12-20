/* eslint-disable max-len */
window.app = window.app || {}

const apiUrl = 'http://localhost:2000'
const apiKey = 'ahjgdj87698bjb89#sfksdfsfb#278'

function Model() {
  this.projects = []
  this.users = []
  this.statuses = []
  this.security = window.app.Security
}

// api

Model.prototype.getData = async function (url) {
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      api_key: apiKey,
      user_id: localStorage.getItem('user_id'),
      auth_token: localStorage.getItem('auth_token'),
      access_token: localStorage.getItem('access_token'),
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  })
  return response.json()
}

Model.prototype.logData = async function (url, data) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      api_key: apiKey,
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
  return response.json() // parses JSON response into native JavaScript objects
}

Model.prototype.createData = async function (url, data) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      api_key: apiKey,
      user_id: localStorage.getItem('user_id'),
      auth_token: localStorage.getItem('auth_token'),
      access_token: localStorage.getItem('access_token'),
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
  return response.json() // parses JSON response into native JavaScript objects
}

Model.prototype.updateData = async function (url, data) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      api_key: apiKey,
      user_id: localStorage.getItem('user_id'),
      auth_token: localStorage.getItem('auth_token'),
      access_token: localStorage.getItem('access_token'),
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
  return response.json() // parses JSON response into native JavaScript objects
}

Model.prototype.delData = async function (url) {
  const response = await fetch(url, {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      api_key: apiKey,
      user_id: localStorage.getItem('user_id'),
      auth_token: localStorage.getItem('auth_token'),
      access_token: localStorage.getItem('access_token'),
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  })
  return response.json() // parses JSON response into native JavaScript objects
}

Model.prototype.getProjects = async function () {
  this.projects = await this.getData(`${apiUrl}/project`)
  // .then((res) => res.data)
  return this.projects
}

Model.prototype.getUsers = async function () {
  this.users = await this.getData(`${apiUrl}/users`)
  // .then((res) => res.data)
  return this.users
}

Model.prototype.getStatuses = async function () {
  this.statuses = await this.getData(`${apiUrl}/status`)
  // .then((res) => res.data)
  return this.statuses
}

Model.prototype.getAsyncData = async function (url) {
  const result = await this.getData(url)
    .then((res) => res.data)
  return result
}

// user
Model.prototype.logOut = function () {
  return this.getData(`${apiUrl}/users/logout`)
}

Model.prototype.signIn = function (data) {
  return this.logData(`${apiUrl}/users/login`, data)
}

Model.prototype.signUp = function (data) {
  return this.logData(`${apiUrl}/users/signup`, data)
}

// project

Model.prototype.updateProject = function (data) {
  return this.updateData(`${apiUrl}/projects/update`, data)
}

Model.prototype.removeProject = function (projectID) {
  const id = projectID.toString()
  return this.delData(`${apiUrl}/projects/delete?id=${id}`)
}

Model.prototype.createProject = function (data) {
  return this.createData(`${apiUrl}/projects/create`, data)
}

Model.prototype.getProject = async function (projectID) {
  const project = await this.getData(`${apiUrl}/project?id=${projectID.toString()}`)
    .then((res) => res.data)
  console.log(project)
  return project
}

// search

Model.prototype.search = function (key, user, prj, status) {
  console.log(key)

  const pathKey = `key=${key}`
  const pathUser = user === 'all' ? '' : `&user_id=${user}`
  const pathPrj = prj === 'all' ? '' : `&project_id=${prj}`
  const pathStatus = status === 'all' ? '' : `&status_id=${status}`
  const urlRaw = `tasks/search?${pathKey}${pathUser}${pathPrj}${pathStatus}`
  const url = this.security.encodeURI(urlRaw)
  console.log(url)
  return this.getData(`${apiUrl}/${url}`)
}

// task

Model.prototype.getTask = function (taskID) {
  return this.getAsyncData(`${apiUrl}/task?id=${taskID.toString()}`)
}

Model.prototype.updateTask = function (data) {
  return this.updateData(`${apiUrl}/tasks/update`, data)
}

Model.prototype.removeTask = function (taskID) {
  return this.delData(`${apiUrl}/tasks/delete?id=${taskID.toString()}`)
}

Model.prototype.getAllTask = function (prj) {
  const pathPrj = prj === 'all' ? '' : `&project_id=${prj}`

  return this.getAsyncData(`${apiUrl}/tasks/count?${pathPrj}`)
}

Model.prototype.getNumTask = async function (prj, user) {
  const pathPrj = prj === 'all' ? '' : `&project_id=${prj}`
  const pathUser = `&user=${user}`
  const url = `${apiUrl}/tasks/count?${pathPrj}${pathUser}`

  const todo = await this.getAsyncData(`${url}&status_id=1`)
    .then((res) => res)
  const doing = await this.getAsyncData(`${url}&status_id=2`)
    .then((res) => res)
  const done = await this.getAsyncData(`${url}&status_id=3`)
    .then((res) => res)
  const data = {
    user,
    todo: todo.number_of_tasks,
    doing: doing.number_of_tasks,
    done: done.number_of_tasks,
  }

  return data
}

Model.prototype.createTask = function (data) {
  return this.createData(`${apiUrl}/tasks/create`, data)
}

Model.prototype.getTasksList = async function (projectID) {
  const pathPrj = `${apiUrl}/tasks/search?key=&project_id=${projectID}`

  const unsigned = await this.getAsyncData(`${pathPrj}&status_id=0`)
    .then((res) => res)

  const todo = await this.getAsyncData(`${pathPrj}&status_id=1`)
    .then((res) => res)

  const doing = await this.getAsyncData(`${pathPrj}&status_id=2`)
    .then((res) => res)

  const done = await this.getAsyncData(`${pathPrj}&status_id=3`)
    .then((res) => res)

  const tasks = {
    unsigned,
    todo,
    doing,
    done,
  }
  console.log(tasks)

  return tasks
}

window.app.Model = Model
