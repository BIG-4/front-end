window.app = window.app || {}

function View(model) {
  this.model = model
  this.loginTemp = window.app.LoginTemplate
  this.homeTemp = window.app.HomeTemplate
  this.searchTemp = window.app.SearchTemplate
  this.projectTemp = window.app.ProjectTemplate
  this.accTemp = window.app.AccountTemplate
  this.functTemp = window.app.FunctionTemplate
}

View.prototype.addEvent = function (elementID, event, func) {
  const el = document.getElementById(elementID)
  if (el) {
    el.addEventListener(event, func)
  }
}

View.prototype.getElement = function (selector) {
  return document.querySelector(selector)
}

View.prototype.getElements = function (selector) {
  return document.querySelectorAll(selector)
}

View.prototype.setBackground = function () {
  document.querySelector('body').style.background = this.randomGradient()
}

View.prototype.showProjectModal = function (title, name) {
  const modal = document.createElement('DIV')
  modal.innerHTML = this.homeTemp.ProjectModal(title, name)
  document.querySelector('content').appendChild(modal)
  this.addEvent('project-modal-bg', 'click', () => this.closeModal())
}

View.prototype.showItemModal = function (title, name, user, users) {
  const modal = document.createElement('DIV')
  modal.innerHTML = this.projectTemp.ItemModal(title, name, user, users)
  document.querySelector('content').appendChild(modal)
  this.addEvent('project-modal-bg', 'click', () => this.closeModal())
}

View.prototype.showModal = function (title, text, hasButtons, action) {
  const modal = document.createElement('DIV')
  modal.innerHTML = this.homeTemp.Modal(title, text, hasButtons)
  document.querySelector('content').appendChild(modal)
  this.addEvent('modal-bg', 'click', () => this.closeModal())
  if (hasButtons && action) {
    this.addEvent('yes-button', 'click', () => action())
    this.addEvent('no-button', 'click', () => this.closeModal())
  }
}

View.prototype.showAlertLogin = function (title, text, action) {
  const modal = document.createElement('DIV')
  modal.innerHTML = this.loginTemp.Alert(title, text)
  document.querySelector('content').appendChild(modal)
  this.addEvent('modal-bg', 'click', () => action())
  this.addEvent('ok-button', 'click', () => action())
}

View.prototype.showAlert = function (title, text) {
  const modal = document.createElement('DIV')
  modal.innerHTML = this.loginTemp.Alert(title, text)
  document.querySelector('content').appendChild(modal)
  this.addEvent('modal-bg', 'click', () => this.closeModal())
  this.addEvent('ok-button', 'click', () => this.closeModal())
}

View.prototype.closeModal = function () {
  document.querySelector('.modal-container').remove()
}

View.prototype.randomGradient = function () {
  const colors = [{
    light: 'rgba(0, 255, 0, 0.7)',
    dark: 'rgba(0, 0, 255, 0.7)',
  },
  {
    light: 'rgba(255, 255, 0, 0.7)',
    dark: 'rgba(255, 0, 0, 0.7)',
  },
  {
    light: 'rgba(0, 247, 255, 0.5)',
    dark: 'rgba(106, 0, 255, 0.8)',
  },
  ]
  const rand = Math.floor(Math.random() * (colors.length - 0))
  return `linear-gradient(160deg, ${colors[rand].light}, ${colors[rand].dark})`
}
window.app.View = View
