/* eslint-disable radix */
window.app = window.app || {}

function Controller(model, view) {
  this.model = model
  this.view = view
  this.loginTemp = window.app.LoginTemplate
  this.searchTemp = window.app.SearchTemplate
  this.projectTemp = window.app.ProjectTemplate
  this.homeTemp = window.app.HomeTemplate
  this.functTemp = window.app.FunctionTemplate
  this.compTemp = window.app.CompareTemplate
  this.routes = window.app.Routes
  this.security = window.app.Security

  this.refresh('Login')
  this.view.setBackground()
  const router = new this.routes.Router({
    mode: 'hash',
    root: '/',
  })

  router
    .add(/home/, () => {
      this.openHome()
    })
    .add(/project\/(.*)/, (id) => {
      this.openProject(id)
    })
    .add(/function/, () => {
      this.refresh('Function')
    })
    .add(/login/, () => {
      if (localStorage.getItem('access_token') !== null) {
        localStorage.removeItem('access_token')
      }
      this.refresh('Login')
    })
    .add(/search/, () => {
      this.Search()
    })
}

// General Controller

Controller.prototype.refresh = function (page, args) {
  if (page === 'Home') {
    if (localStorage.getItem('access_token') === null || this.model.projects === undefined) {
      this.view.showAlertLogin('Warning', 'Please Login', () => {
        window.location.replace('/#/login')
      })
    } else {
      document.querySelector('content').innerHTML = this.homeTemp.Home(args.projects, args.users, args.statuses)
      this.setHomeEvents()
      this.setSearchEvents()
      this.setHeaderEvents()
    }
  } else if (page === 'Search') {
    // eslint-disable-next-line max-len
    if (localStorage.getItem('access_token') === null || this.model.projects === undefined) {
      this.view.showAlertLogin('Warning', 'Please Login', () => {
        window.location.replace('/#/login')
      })
    } else {
      document.querySelector('content').innerHTML = this.searchTemp.Search(args.items, this.model.projects, this.model.users, this.model.statuses, args.data)
      this.setSearchEvents()
      this.setHeaderEvents()
    }
  } else if (page === 'Login') {
    document.querySelector('content').innerHTML = this.loginTemp.Login()
    this.setLoginEvents()
  } else if (page === 'Project') {
    if (localStorage.getItem('access_token') === null || this.model.projects === undefined) {
      this.view.showAlertLogin('Warning', 'Please Login', () => {
        window.location.replace('/#/login')
      })
    } else {
      document.querySelector('content').innerHTML = this.projectTemp.Project(args.project.project_id, args.project.project_name, args.tasks)
      this.setProjectEvents(args.project.project_id)
      this.setHeaderEvents()
    }
  } else if (page === 'Function') {
    if (localStorage.getItem('access_token') === null || this.model.projects === undefined) {
      this.view.showAlertLogin('Warning', 'Please Login', () => {
        window.location.replace('/#/login')
      })
    } else {
      document.querySelector('content').innerHTML = this.functTemp.Funct(this.model.projects, this.model.users, args)
      this.setHeaderEvents()
      this.setFunctionEvents()
    }
  } else if (page === 'Compare') {
    if (localStorage.getItem('access_token') === null || this.model.projects === undefined) {
      this.view.showAlertLogin('Warning', 'Please Login', () => {
        window.location.replace('/#/login')
      })
    } else {
      document.querySelector('content').innerHTML = this.compTemp.Compare(this.model.projects, this.model.users, args)
      this.setHeaderEvents()
      this.setFunctionEvents()
    }
  }
}

Controller.prototype.setHeaderEvents = function () {
  this.view.addEvent('nav-brand', 'click', () => window.location.replace('/#/home'))
  this.view.addEvent('nav-home', 'click', () => window.location.replace('/#/home'))
  this.view.addEvent('nav-acc', 'click', () => this.refresh('Account'))
  this.view.addEvent('nav-func', 'click', () => window.location.replace('/#/function'))
  this.view.addEvent('nav-logout', 'click', () => this.logOut())
}

Controller.prototype.openHome = async function () {
  this.model.projects = await this.model.getProjects().then((res) => res.data)
  this.model.users = await this.model.getUsers().then((res) => res.data)
  this.model.statuses = await this.model.getStatuses().then((res) => res.data)
  this.refresh('Home', { projects: this.model.projects, users: this.model.users, statuses: this.model.statuses })
}

Controller.prototype.logOut = function () {
  this.model.logOut()
    .then((res) => {
      console.log(res)
      localStorage.removeItem('auth_token')
      localStorage.removeItem('access_token')
      window.location.replace('/#/login')
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
    password: this.security.escapeHtml(document.getElementById('signInPassword').value),
  }
  if (this.security.validateSign(data.username) && this.security.validateSign(data.password)) {
    this.model.signIn(data)
      .then((res) => {
        console.log(res) // JSON data parsed by `data.json()` call
        localStorage.setItem('user_id', res.data.id)
        localStorage.setItem('auth_token', res.data.auth_token)
        localStorage.setItem('access_token', res.data.access_token)
      })

    this.model.projects = await this.model.getProjects().then((res) => res.data)
    this.model.users = await this.model.getUsers().then((res) => res.data)

    window.location.replace('/#/home')
  } else {
    this.view.showAlert('Warning', 'Username and Password must include only letters and digits')
  }
}

Controller.prototype.validateSignUp = function (uname, pw, repw) {
  if (uname === '' || pw === '' || repw === '') return false
  if (pw !== repw) return false
  return this.security.validateSign(uname) && this.security.validateSign(pw)
}

Controller.prototype.signUp = function () {
  const uname = document.getElementById('signUpUsername').value
  const pw = document.getElementById('signUpPw').value
  const repw = document.getElementById('signUpRetypePw').value

  const data = {
    username: uname,
    password: this.security.escapeHtml(pw),
  }

  if (!this.validateSignUp(uname, pw, repw)) {
    this.view.showAlert('Warning', 'Username and Password must include only letters and digits')
  } else {
    this.model.signUp(data)
      .then((res) => {
        console.log(res)
        this.refresh('Login')
      })
  }
}

// Controller for home page

Controller.prototype.setHomeEvents = function () {
  this.view.addEvent('add-project', 'click', () => this.createProject())
  this.view.addEvent('search', 'click', () => window.location.replace('/#/search'))
  this.view.addEvent('reset', 'click', () => this.reset())

  this.view.getElements('.edit-project').forEach((button) => {
    this.view.addEvent(button.id, 'click', () => this.editProject(button.id.split('-')[2]))
  })
  this.view.getElements('.remove-project').forEach((button) => {
    this.view.addEvent(button.id, 'click', () => this.removeProject(button.id.split('-')[2]))
  })
  this.view.getElements('.project-button').forEach((button) => {
    this.view.addEvent(button.id, 'click', () => {
      window.location.replace(`/#/project/${button.id.split('-')[2]}`)
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
    this.model.createProject(data)
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
    this.model.updateProject(data)
      .then((res) => {
        this.openHome()
      })
  })
}

Controller.prototype.removeProject = function (projectID) {
  this.view.showModal('Remove project', 'Are you sure you want to remove this project?', true, () => {
    this.model.removeProject(projectID)
      .then((res) => {
        console.log(res)
        this.openHome()
      })
  })
}

Controller.prototype.openProject = async function (projectID) {
  const project = await this.model.getProject(projectID)
    .then((res) => res)

  this.model.getTasksList(projectID)
    .then((res) => {
      this.refresh('Project', { project, tasks: res })
    })
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
  const key = this.security.escapeHtml(this.view.getElement('#search-key').value)
  // const key = this.view.getElement('#search-key').value
  const user = this.view.getElement('#search-user').value
  const prj = this.view.getElement('#search-prj').value
  const status = this.view.getElement('#search-status').value

  const data = {
    key,
    user,
    prj,
    status,
  }

  this.model.search(key, user, prj, status)
    .then((res) => {
      console.log(res.data)
      this.refresh('Search', { items: res.data, data })
    })
}

Controller.prototype.editItemInSearch = async function (taskID) {
  const item = await this.model.getTask(taskID)
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
    this.model.updateTask(data)
      .then((res) => {
        this.Search()
      })
  })
}

Controller.prototype.removeItemInSearch = function (taskID) {
  this.view.showModal('Remove Task', 'Are you sure you want to remove this task?', true, () => {
    this.model.removeTask(taskID)
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
  let prjName
  this.model.getProject(prj)
    .then((res) => {
      prjName = res.project_name
    })
  const users = document.getElementsByName('compare-user')
  const checked = []
  for (i = 0; i < users.length; i++) {
    console.log(users[i])
    if (users[i].checked) {
      checked.push(users[i].value)
    }
  }
  const result = []

  for (j = 0; j < checked.length; j++) {
    // eslint-disable-next-line no-await-in-loop
    check = await this.model.getNumTask(prj, checked[j])
      .then((res) => res)
    result.push(check)
  }

  const allTask = await this.model.getAllTask(prj)
    .then((res) => res)

  const data = {
    all: allTask.number_of_tasks,
    result,
    prj,
    prj_name: prjName,
    checked,
  }
  console.log(data)

  this.refresh('Compare', data)
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
  const task = await this.model.getTask(id)
    .then((res) => res)
  const data = {
    task_id: id,
    task_title: task.task_title,
    project_id: task.project_id,
    user_id: task.user_id,
    status_id: status,
  }
  this.model.updateTask(data)
    .then((res) => {
      this.openProject(projectID)
    })
}

Controller.prototype.createItem = async function (listID, projectID) {
  const users = await this.model.getUsers().then((res) => res.data)

  this.view.showItemModal('New Task', '', 'all', users)
  this.view.addEvent('close-modal', 'click', () => this.view.closeModal())

  this.view.addEvent('modal-submit', 'click', () => {
    const data = {
      task_title: document.getElementById('t_name').value,
      project_id: this.view.getElements('.project-detail')[0].id.split('-')[1],
      user_id: document.getElementById('t_user').value,
      status_id: listID,
    }
    this.model.createTask(data)
      .then((res) => {
        this.openProject(projectID)
      })
  })
}

Controller.prototype.editItem = async function (taskID, projectID) {
  const task = await this.model.getTask(taskID)
    .then((res) => res)
  const users = await this.model.getUsers().then((res) => res.data)
  this.view.showItemModal('Edit Task', task.task_title, task.user_id, users)
  this.view.addEvent('close-modal', 'click', () => this.view.closeModal())

  this.view.addEvent('modal-submit', 'click', () => {
    const data = {
      task_id: parseInt(taskID),
      task_title: document.getElementById('t_name').value,
      project_id: task.project_id,
      user_id: document.getElementById('t_user').value,
      status_id: task.status_id,
    }
    this.model.updateTask(data)
      .then((res) => {
        this.openProject(projectID)
      })
  })
}

Controller.prototype.removeItem = async function (taskID, projectID) {
  this.view.showModal('Remove Task', 'Are you sure you want to remove this task?', true, () => {
    this.model.removeTask(taskID)
      .then((res) => {
        this.openProject(projectID)
      })
  })
}

window.app.Controller = Controller
