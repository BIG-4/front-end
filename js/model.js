/* eslint-disable max-len */
window.app = window.app || {}

const apiUrl = 'http://localhost:2000'
const apiKey = 'ahjgdj87698bjb89#sfksdfsfb#278'

class Model {
  constructor(security) {
    this.projects = []
    this.users = []
    this.statuses = []
    this.security = security
  }

  getData = async function (url) {
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

  logData = async function (url, data) {
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

  createData = async function (url, data) {
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

  updateData = async function (url, data) {
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

  delData = async function (url) {
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

  getProjects = async function () {
    this.projects = await this.getData(`${apiUrl}/project`)
    // .then((res) => res.data)
    return this.projects
  }

  getUsers = async function () {
    this.users = await this.getData(`${apiUrl}/users`)
    // .then((res) => res.data)
    return this.users
  }

  getStatuses = async function () {
    this.statuses = await this.getData(`${apiUrl}/status`)
    // .then((res) => res.data)
    return this.statuses
  }

  getAsyncData = async function (url) {
    const result = await this.getData(url)
      .then((res) => res.data)
    return result
  }

  // user
  logOut = function () {
    return this.getData(`${apiUrl}/users/logout`)
  }

  signIn = function (data) {
    return this.logData(`${apiUrl}/users/login`, data)
  }

  signUp = function (data) {
    return this.logData(`${apiUrl}/users/signup`, data)
  }

  // project

  updateProject = function (data) {
    return this.updateData(`${apiUrl}/projects/update`, data)
  }

  removeProject = function (projectID) {
    const id = projectID.toString()
    return this.delData(`${apiUrl}/projects/delete?id=${id}`)
  }

  createProject = function (data) {
    return this.createData(`${apiUrl}/projects/create`, data)
  }

  getProject = async function (projectID) {
    const project = await this.getData(`${apiUrl}/project?id=${projectID.toString()}`)
      .then((res) => res.data)
    return project
  }

  // search

  search = function (key, user, prj, status) {
    const pathKey = `key=${key}`
    const pathUser = user === 'all' ? '' : `&user_id=${user}`
    const pathPrj = prj === 'all' ? '' : `&project_id=${prj}`
    const pathStatus = status === 'all' ? '' : `&status_id=${status}`
    const urlRaw = `tasks/search?${pathKey}${pathUser}${pathPrj}${pathStatus}`
    const url = this.security.encodeURI(urlRaw)
    return this.getData(`${apiUrl}/${url}`)
  }

  // task

  getTask = function (taskID) {
    return this.getAsyncData(`${apiUrl}/task?id=${taskID.toString()}`)
  }

  updateTask = function (data) {
    return this.updateData(`${apiUrl}/tasks/update`, data)
  }

  removeTask = function (taskID) {
    return this.delData(`${apiUrl}/tasks/delete?id=${taskID.toString()}`)
  }

  getAllTask = function (prj) {
    const pathPrj = prj === 'all' ? '' : `&project_id=${prj}`

    return this.getAsyncData(`${apiUrl}/tasks/count?${pathPrj}`)
  }

  getNumTask = async function (prj, user) {
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

  createTask = function (data) {
    return this.createData(`${apiUrl}/tasks/create`, data)
  }

  getTasksList = async function (projectID) {
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

    return tasks
  }
}

window.app.Model = Model
