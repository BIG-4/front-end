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
    // this.view.render(page, { projects: this.model.getProjects() });
    document.querySelector('content').innerHTML = this.homeTemp.Home(this.model.getProjects())
    this.setHomeEvents()
    this.setSearchEvents()
    this.setHeaderEvents()
  } else if (page === 'Search') {
    // eslint-disable-next-line max-len
    // this.view.render(page, { items: args.items, data: args.data, projects: this.model.getProjects() })
    document.querySelector('content').innerHTML = this.searchTemp.Search(args.items, this.model.getProjects(), args.data)
    this.setSearchEvents()
    this.setHeaderEvents()
  } else if (page === 'Login') {
    this.view.render(page, {})
    this.setLoginEvents()
  } else if (page === 'Project') {
    console.log(args)
    document.querySelector('content').innerHTML = this.projectTemp.Project(args.project.project_id, args.project.project_name, args.tasks)
    this.setProjectEvents()
    this.setHeaderEvents()
  } else if (page === 'Account') {
    this.view.render(page, {})
    this.setHeaderEvents()
  } else if (page === 'Function') {
    console.log(args)
    document.querySelector('content').innerHTML = this.functTemp.Funct(this.model.getProjects(), this.model.getUsers(), args)
    this.setHeaderEvents()
    this.setFunctionEvents()
  } else if (page === 'Compare') {
    console.log(args)
    document.querySelector('content').innerHTML = this.compTemp.Compare(this.model.getProjects(), this.model.getUsers(), args)
    this.setHeaderEvents()
    this.setFunctionEvents()
  }
}

Controller.prototype.setHeaderEvents = function () {
  this.view.addEvent('nav-home', 'click', () => this.refresh('Home'))
  this.view.addEvent('nav-acc', 'click', () => this.refresh('Account'))
  this.view.addEvent('nav-func', 'click', () => this.refresh('Function'))
  this.view.addEvent('nav-logout', 'click', () => this.logOut())
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

Controller.prototype.signIn = function () {
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

      this.refresh('Home')
    })
    // this.refresh('Home');
}

Controller.prototype.validateSignUp = function (name, uname, pw, repw) {
  if (name === '' || uname === '' || pw === '' || repw === '') return false
  if (pw !== repw) return false
  return true
}

Controller.prototype.signUp = function () {
  const name = document.getElementById('signUpName').value
  const uname = document.getElementById('signUpUsername').value
  const pw = document.getElementById('signUpPw').value
  const repw = document.getElementById('signUpRetypePw').value

  const data = {
    username: uname,
    password: pw,
  }

  if (!this.validateSignUp(name, uname, pw, repw)) {
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
  this.view.addEvent('search', 'click', () => this.search())
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
        this.refresh('Home')
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
        this.refresh('Home')
      })
  })
}

Controller.prototype.removeProject = function (projectID) {
  this.view.showModal('Remove project', 'Are you sure you want to remove this project?', true, () => {
    const id = projectID.toString()
    this.model.delData(`${apiUrl1}/projects/delete?id=${id}`)
      .then((res) => {
        this.refresh('Home')
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
  this.view.addEvent('reset', 'click', () => this.Reset())
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
  const pathUser = `&user=${user}`
  const pathPrj = prj === 'all' ? '' : `&project_id=${prj}`
  const pathStatus = status === 'all' ? '' : `&status_id=${status}`

  this.model.getData(`${apiUrl1}/tasks/search?${pathKey}${pathUser}${pathPrj}${pathStatus}`)
    .then((res) => {
      console.log(res.data)
      this.refresh('Search', { items: res.data, data })
    })
}

// Controller for Function

Controller.prototype.setFunctionEvents = function () {
  this.view.addEvent('submit', 'click', () => this.compare())
}

Controller.prototype.compare = async function () {
  let i
  let j
  let check
  const prj = this.view.getElement('#compare-prj').value

  const users = document.getElementsByName('compare-user')
  const checked = []
  for (i = 0; i < users.length; i++) {
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
  const pathUser = `user=${user}`

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

Controller.prototype.setProjectEvents = function () {
  this.view.getElements('.add-item').forEach((button) => {
    this.view.addEvent(button.id, 'click', () => this.createItem(button.id.split('-')[2]))
  })
  this.view.getElements('.item').forEach((item) => {
    this.view.addEvent(item.id, 'click', () => this.editItem(item.id.split('-')[1]))
    this.view.addEvent(item.id, 'dragstart', (event) => this.dragStarted(event, item.id))
    this.view.addEvent(item.id, 'dragend', (event) => this.dragEnded(event, item.id))
  })
  this.view.getElements('.droppable').forEach((element) => {
    this.view.addEvent(element.id, 'dragenter', (event) => this.dragEnter(event))
  })
}

Controller.prototype.createItem = function (listID) {
  this.view.showItemModal('New Task', '', 'all', this.model.getUsers())
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
        this.refresh('Project')
      })
  })
}

Controller.prototype.editItem = async function (taskID) {
  const url = `${apiUrl1}/task?id=${taskID.toString()}`
  const item = await this.model.getAsyncData(url)
    .then((res) => res)
  this.view.showItemModal('Edit Task', item.task_title, item.user_id, this.model.getUsers())
  this.view.addEvent('close-modal', 'click', () => this.view.closeModal())

  this.view.addEvent('modal-submit', 'click', () => {
    const data = {
      task_id: taskID,
      task_title: document.getElementById('t_name').value,
      project_id: item.project_id,
      user_id: document.getElementById('t_user').value,
      status_id: item.status_id,
    }
    this.model.updateData(`${apiUrl1}/tasks/update`, data)
      .then((res) => {
        this.refresh('Project')
      })
  })
}

Controller.prototype.removeItem = function (itemID) {
  this.model.removeItem(itemID)
  this.refresh('Project', { projectID: this.currentProject })
}

Controller.prototype.dragStarted = function (event, id) {
  event.dataTransfer.setData('id', id)
  event.dataTransfer.dropEffect = 'move'
  event.currentTarget.style.opacity = '0.6'
  console.log('drag-start', event, id)
}

Controller.prototype.dragEnded = function (event, itemID) {
  if (document.querySelector('.drag-preview')) {
    document.querySelector('.drag-preview').remove()
  }
  event.target.style.opacity = '1'
  console.log('drag-end')
}

Controller.prototype.dragEnter = function (event) {
  // eslint-disable-next-line no-use-before-define
  if (event.dataTransfer.types.includes('id') && !isPreview(event.fromElement) && !isSelected(event.currentTarget) && !previousIsSelected(event.currentTarget)) {
    event.preventDefault()
    console.log('aaa')
    event.currentTarget.parentNode.insertBefore(this.createDragPreview(), event.currentTarget)
  }
  console.log('drag-enter', event)
}

function isPreview(element) {
  return element && element.className === 'drag-preview'
}

function isSelected(element) {
  return element && element.style && element.style.opacity === '0.6'
}

function previousIsSelected(element) {
  return Array.from(element.parentNode.children).findIndex((el) => el === element) !== 0 && Array.from(element.parentNode.children)[Array.from(element.parentNode.children).findIndex((el) => el === element) - 2].style.opacity === '0.6'
}

Controller.prototype.createDragPreview = function () {
  document.querySelectorAll('.drag-preview').forEach((element) => element.remove())
  const previewElement = document.createElement('div')
  previewElement.className = 'drag-preview'
  previewElement.innerHTML = '<div class="dashed"></>'
  previewElement.ondragover = (event) => event.preventDefault()
  previewElement.ondragleave = (event) => event.currentTarget.remove()
  previewElement.ondrop = (event) => this.dragDropped(event)
  return previewElement
}

Controller.prototype.dragDropped = function (event) {
  const sourceItemID = event.dataTransfer.getData('id').split('-')[1]
  const sourceItem = { ...this.model.getItem(sourceItemID) }
  const targetListID = event.currentTarget.parentNode.id.split('-')[2]
  const targetPosition = this.targetPosition(event, sourceItemID, targetListID)
  this.model.removeItem(sourceItemID)
  this.model.insertItem(targetListID, sourceItem, targetPosition)
  this.refresh('Project', { projectID: this.currentProject })
}

window.app.Controller = Controller
