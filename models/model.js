/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
window.app = window.app || {}
window.app.Model = Model

const apiUrl = 'http://localhost:2000'
const apiKey = 'ahjgdj87698bjb89#sfksdfsfb#278'

function Model() {
  this.projects = []
  this.users = []
  this.statuses = []
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
    .then((res) => res.data)
  return this.projects
}

Model.prototype.getUsers = async function () {
  this.users = await this.getData(`${apiUrl}/users`)
    .then((res) => res.data)
  return this.users
}

Model.prototype.getStatuses = async function () {
  this.statuses = await this.getData(`${apiUrl}/status`)
    .then((res) => res.data)
  return this.statuses
}

Model.prototype.getProject = async function (projectID) {
  const project = await this.getData(`${apiUrl}/project?id=${projectID.toString()}`)
    .then((res) => res.data)
  console.log(project)
  return project
}

Model.prototype.getAsyncData = async function (url) {
  const result = await this.getData(url)
    .then((res) => res.data)
  return result
}

Model.prototype.getItemList = function (itemID) {
  this.getData(`${apiUrl}/task?id=${itemID}`)
    .then((res) => res.data.status_id)
}

Model.prototype.removeItem = function (itemID) {
  this.delData(`${apiUrl}/tasks/delete?id=${itemID.toString()}`)
    .then((res) => {
      console.log(res)
    })
}
