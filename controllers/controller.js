/* eslint-disable radix */
window.app = window.app || {}

function Controller(model, view) {
  this.model = model
  this.view = view
  this.searchTemp = window.app.SearchTemplate
  this.projectTemp = window.app.ProjectTemplate
  this.homeTemp = window.app.HomeTemplate
  this.functTemp = window.app.FunctionTemplate
  this.compTemp = window.app.CompareTemplate

  this.refresh('Login')
  this.view.setBackground()
}

const apiUrl1 = 'http://localhost:2000'
// General Controller

Controller.prototype.refresh = function (page, args) {
  if (page === 'Home') {
    console.log(this.model.users)
    document.querySelector('content').innerHTML = this.homeTemp.Home(args.projects, args.users, args.statuses)
    this.setHomeEvents()
    this.setSearchEvents()
    this.setHeaderEvents()
  } else if (page === 'Search') {
    // eslint-disable-next-line max-len
    document.querySelector('content').innerHTML = this.searchTemp.Search(args.items, this.model.projects, this.model.users, this.model.statuses, args.data)
    this.setSearchEvents()
    this.setHeaderEvents()
  } else if (page === 'Login') {
    this.view.render(page, {})
    this.setLoginEvents()
  } else if (page === 'Project') {
    document.querySelector('content').innerHTML = this.projectTemp.Project(args.project.project_id, args.project.project_name, args.tasks)
    this.setProjectEvents(args.project.project_id)
    this.setHeaderEvents()
  } else if (page === 'Account') {
    this.view.render(page, {})
    this.setHeaderEvents()
  } else if (page === 'Function') {
    document.querySelector('content').innerHTML = this.functTemp.Funct(this.model.projects, this.model.users, args)
    this.setHeaderEvents()
    this.setFunctionEvents()
  } else if (page === 'Compare') {
    document.querySelector('content').innerHTML = this.compTemp.Compare(this.model.projects, this.model.users, args)
    this.setHeaderEvents()
    this.setFunctionEvents()
  }
}

Controller.prototype.setHeaderEvents = function () {
  this.view.addEvent('nav-home', 'click', () => this.refresh('Home', { projects: this.model.projects, users: this.model.users, statuses: this.model.statuses }))
  this.view.addEvent('nav-acc', 'click', () => this.refresh('Account'))
  this.view.addEvent('nav-func', 'click', () => this.refresh('Function'))
  this.view.addEvent('nav-logout', 'click', () => this.logOut())
}

Controller.prototype.openHome = async function () {
  this.model.projects = await this.model.getProjects().then((res) => res)
  this.model.users = await this.model.getUsers().then((res) => res)
  this.model.statuses = await this.model.getStatuses().then((res) => res)

  this.refresh('Home', { projects: this.model.projects, users: this.model.users, statuses: this.model.statuses })
}

Controller.prototype.logOut = function () {
  this.model.getData(`${apiUrl1}/users/logout`, '')
    .then((res) => {
      console.log(res.data)
      this.refresh('Login')
    })
}

// Controller for Login

Controller.prototype.setLoginEvents = function () {
  const container = document.getElementById('container')
  this.view.addEvent('signUpBtn', 'click', () => {
    container.classList.add('right-panel-active')
  })
  this.view.addEvent('signInBtn', 'click', () => {
    container.classList.remove('right-panel-active')
  })
  this.view.addEvent('signIn', 'click', () => this.signIn())
  this.view.addEvent('signUp', 'click', () => this.signUp())
}

Controller.prototype.signIn = async function () {
  const data = {
    username: document.getElementById('signInUsername').value,
    password: document.getElementById('signInPassword').value,
  }
  this.model.logData(`${apiUrl1}/users/login`, data)
    .then((res) => {
      console.log(res.data) // JSON data parsed by `data.json()` call
      localStorage.setItem('user_id', res.data.id)
      localStorage.setItem('auth_token', res.data.auth_token)
      localStorage.setItem('access_token', res.data.access_token)
      this.model.getData(`${apiUrl1}/project`).then((res) => {
        this.model.projects = res.data
      })

      this.model.getData(`${apiUrl1}/users`).then((res) => {
        this.model.users = res.data
      })
    })

  this.openHome()
}

Controller.prototype.validateSignUp = function (uname, pw, repw) {
  if (uname === '' || pw === '' || repw === '') return false
  if (pw !== repw) return false
  return true
}

Controller.prototype.signUp = function () {
  const uname = document.getElementById('signUpUsername').value
  const pw = document.getElementById('signUpPw').value
  const repw = document.getElementById('signUpRetypePw').value

  const data = {
    username: uname,
    password: pw,
  }

  if (!this.validateSignUp(uname, pw, repw)) {
    console.log('error')
  } else {
    this.model.logData(`${apiUrl1}/users/signup`, data)
      .then((res) => {
        console.log(res) // JSON data parsed by `data.json()` call
        this.refresh('Login')
      })
  }
}

// Controller for home page

Controller.prototype.setHomeEvents = function () {
  this.view.addEvent('add-project', 'click', () => this.createProject())
  this.view.addEvent('search', 'click', () => this.Search())
  this.view.addEvent('reset', 'click', () => this.reset())

  this.view.getElements('.edit-project').forEach((button) => {
    this.view.addEvent(button.id, 'click', () => this.editProject(button.id.split('-')[2]))
  })
  this.view.getElements('.remove-project').forEach((button) => {
    this.view.addEvent(button.id, 'click', () => this.removeProject(button.id.split('-')[2]))
  })
  this.view.getElements('.project-button').forEach((button) => {
    this.view.addEvent(button.id, 'click', () => {
      this.openProject(button.id.split('-')[2])
    })
  })
}

Controller.prototype.createProject = function () {
  this.view.showProjectModal('New Project', '')
  this.view.addEvent('close-modal', 'click', () => this.view.closeModal())

  this.view.addEvent('modal-submit', 'click', () => {
    const data = {
      project_name: document.getElementById('p_name').value,
    }
    this.model.createData(`${apiUrl1}/projects/create`, data)
      .then((res) => {
        this.openHome()
      })
  })
}

Controller.prototype.editProject = function (projectID) {
  const pid = `open-project-${projectID}`
  this.view.showProjectModal('Edit Project', document.getElementById(pid).innerHTML.trim())
  this.view.addEvent('close-modal', 'click', () => this.view.closeModal())

  this.view.addEvent('modal-submit', 'click', () => {
    const data = {
      project_id: projectID,
      project_name: document.getElementById('p_name').value,
    }
    this.model.updateData(`${apiUrl1}/projects/update`, data)
      .then((res) => {
        this.openHome()
      })
  })
}

Controller.prototype.removeProject = function (projectID) {
  this.view.showModal('Remove project', 'Are you sure you want to remove this project?', true, () => {
    const id = projectID.toString()
    this.model.delData(`${apiUrl1}/projects/delete?id=${id}`)
      .then((res) => {
        this.openHome()
      })
  })
}

Controller.prototype.openProject = async function (projectID) {
  const project = await this.model.getAsyncData(`${apiUrl1}/project?id=${projectID.toString()}`)
    .then((res) => res)

  this.getTasksList(projectID)
    .then((res) => {
      this.refresh('Project', { project, tasks: res })
    })
}

Controller.prototype.getTasksList = async function (projectID) {
  const pathPrj = `${apiUrl1}/tasks/search?key=&project_id=${projectID}`

  const unsigned = await this.model.getAsyncData(`${pathPrj}&status_id=0`)
    .then((res) => res)

  const todo = await this.model.getAsyncData(`${pathPrj}&status_id=1`)
    .then((res) => res)

  const doing = await this.model.getAsyncData(`${pathPrj}&status_id=2`)
    .then((res) => res)

  const done = await this.model.getAsyncData(`${pathPrj}&status_id=3`)
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

// Controller for Search page
Controller.prototype.setSearchEvents = function () {
  this.view.addEvent('search', 'click', () => this.Search())
  this.view.getElements('.item-detail').forEach((item) => {
    this.view.addEvent(item.id, 'click', () => this.editItemInSearch(item.id.split('-')[1]))
  })
  this.view.getElements('.remove-item').forEach((item) => {
    this.view.addEvent(item.id, 'click', () => this.removeItemInSearch(item.id.split('-')[2]))
  })
}

Controller.prototype.Search = function () {
  const key = this.view.getElement('#search-key').value
  const user = this.view.getElement('#search-user').value
  const prj = this.view.getElement('#search-prj').value
  const status = this.view.getElement('#search-status').value

  const data = {
    key,
    user,
    prj,
    status,
  }

  const pathKey = `key=${key}`
  const pathUser = user === 'all' ? '' : `&user_id=${user}`
  const pathPrj = prj === 'all' ? '' : `&project_id=${prj}`
  const pathStatus = status === 'all' ? '' : `&status_id=${status}`

  this.model.getData(`${apiUrl1}/tasks/search?${pathKey}${pathUser}${pathPrj}${pathStatus}`)
    .then((res) => {
      console.log(res.data)
      this.refresh('Search', { items: res.data, data })
    })
}

Controller.prototype.editItemInSearch = async function (taskID) {
  const url = `${apiUrl1}/task?id=${taskID.toString()}`
  const item = await this.model.getAsyncData(url)
    .then((res) => res)
  this.view.showItemModal('Edit Task', item.task_title, item.user_id, this.model.users)
  this.view.addEvent('close-modal', 'click', () => this.view.closeModal())

  this.view.addEvent('modal-submit', 'click', () => {
    const data = {
      task_id: parseInt(taskID),
      task_title: document.getElementById('t_name').value,
      project_id: item.project_id,
      user_id: document.getElementById('t_user').value,
      status_id: item.status_id,
    }
    this.model.updateData(`${apiUrl1}/tasks/update`, data)
      .then((res) => {
        this.Search()
      })
  })
}

Controller.prototype.removeItemInSearch = async function (itemID) {
  this.view.showModal('Remove item', 'Are you sure you want to remove this item?', true, () => {
    const id = itemID.toString()
    this.model.delData(`${apiUrl1}/tasks/delete?id=${itemID.toString()}`)
      .then((res) => {
        this.Search()
      })
  })
}

// Controller for Function

Controller.prototype.setFunctionEvents = function () {
  this.view.addEvent('submit', 'click', () => this.Compare())
}

Controller.prototype.Compare = async function () {
  let i
  let j
  let check
  const prj = this.view.getElement('#compare-prj').value

  const users = document.getElementsByName('compare-user')
  const checked = []
  for (i = 0; i < users.length; i++) {
    console.log(users[i])
    if (users[i].checked) {
      checked.push(users[i].value)
    }
  }
  const pathPrj = prj === 'all' ? '' : `&project_id=${prj}`
  const result = []
  const url = `${apiUrl1}/tasks/count?${pathPrj}`

  for (j = 0; j < checked.length; j++) {
    // eslint-disable-next-line no-await-in-loop
    check = await this.getNumTask(url, checked[j])
      .then((res) => res)
    result.push(check)
  }

  const allTask = await this.model.getAsyncData(url)
    .then((res) => res)

  const data = {
    all: allTask.number_of_tasks,
    result,
    prj,
    checked,
  }
  console.log(data)

  this.refresh('Compare', data)
}

Controller.prototype.getNumTask = async function (url, user) {
  const pathUser = `&user=${user}`

  const todo = await this.model.getAsyncData(`${url + pathUser}&status_id=1`)
    .then((res) => res)
  const doing = await this.model.getAsyncData(`${url + pathUser}&status_id=2`)
    .then((res) => res)
  const done = await this.model.getAsyncData(`${url + pathUser}&status_id=3`)
    .then((res) => res)
  const data = {
    user,
    todo: todo.number_of_tasks,
    doing: doing.number_of_tasks,
    done: done.number_of_tasks,
  }

  return data
}

// Controller for Project board

Controller.prototype.setProjectEvents = function (projectID) {
  this.view.getElements('.add-item').forEach((button) => {
    this.view.addEvent(button.id, 'click', () => this.createItem(button.id.split('-')[2], projectID))
  })
  this.view.getElements('.item').forEach((item) => {
    this.view.addEvent(item.id, 'dragstart', (event) => {
      item.classList.add('dragging')
    })
    this.view.addEvent(item.id, 'dragend', (event) => {
      item.classList.remove('dragging')

      this.updateDragDropItem(item.id, projectID)
    })
  })
  this.view.getElements('.container').forEach((container) => {
    this.view.addEvent(container.id, 'dragover', (event) => {
      event.preventDefault()
      const afterElement = this.getDragAfterElement(container, event.clientY)
      const draggble = document.querySelector('.dragging')
      if (afterElement == null) {
        container.appendChild(draggble)
      } else {
        container.insertBefore(draggble, afterElement)
      }
    })
  })
  this.view.getElements('.item-detail').forEach((item) => {
    this.view.addEvent(item.id, 'click', () => this.editItem(item.id.split('-')[1], projectID))
  })
  this.view.getElements('.remove-item').forEach((item) => {
    this.view.addEvent(item.id, 'click', () => this.removeItem(item.id.split('-')[2], projectID))
  })
}

Controller.prototype.getDragAfterElement = function (container, y) {
  const draggbleElements = [...container.querySelectorAll('draggble:not(dragging)')]
  return draggbleElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect()
    const offset = y - box.top - box.height / 2
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child }
    }
    return closest
  }, { offset: Number.NEGATIVE_INFINITY }).element
}

Controller.prototype.updateDragDropItem = async function (taskID, projectID) {
  const parent = document.querySelector(`#${taskID}`).parentNode
  const id = taskID.split('-')[1]
  const status = parent.id.split('-')[2]
  const url = `${apiUrl1}/task?id=${id}`
  const item = await this.model.getAsyncData(url)
    .then((res) => res)
  const data = {
    task_id: id,
    task_title: item.task_title,
    project_id: item.project_id,
    user_id: item.user_id,
    status_id: status,
  }
  this.model.updateData(`${apiUrl1}/tasks/update`, data)
    .then((res) => {
      this.openProject(projectID)
    })
}

Controller.prototype.createItem = function (listID, projectID) {
  this.view.showItemModal('New Task', '', 'all', this.model.users)
  this.view.addEvent('close-modal', 'click', () => this.view.closeModal())

  this.view.addEvent('modal-submit', 'click', () => {
    const data = {
      task_title: document.getElementById('t_name').value,
      project_id: this.view.getElements('.project-detail')[0].id.split('-')[1],
      user_id: document.getElementById('t_user').value,
      status_id: listID,
    }
    this.model.createData(`${apiUrl1}/tasks/create`, data)
      .then((res) => {
        this.openProject(projectID)
      })
  })
}

Controller.prototype.editItem = async function (taskID, projectID) {
  const url = `${apiUrl1}/task?id=${taskID.toString()}`
  const item = await this.model.getAsyncData(url)
    .then((res) => res)
  this.view.showItemModal('Edit Task', item.task_title, item.user_id, this.model.users)
  this.view.addEvent('close-modal', 'click', () => this.view.closeModal())

  this.view.addEvent('modal-submit', 'click', () => {
    const data = {
      task_id: parseInt(taskID),
      task_title: document.getElementById('t_name').value,
      project_id: item.project_id,
      user_id: document.getElementById('t_user').value,
      status_id: item.status_id,
    }
    this.model.updateData(`${apiUrl1}/tasks/update`, data)
      .then((res) => {
        this.openProject(projectID)
      })
  })
}

Controller.prototype.removeItem = async function (itemID, projectID) {
  this.view.showModal('Remove item', 'Are you sure you want to remove this item?', true, () => {
    const id = itemID.toString()
    this.model.delData(`${apiUrl1}/tasks/delete?id=${itemID.toString()}`)
      .then((res) => {
        this.openProject(projectID)
      })
  })
}

window.app.Controller = Controller
