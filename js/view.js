window.app = window.app || {}

class View {
  constructor(model) {
    this.model = model
    this.loginTemp = window.app.LoginTemplate
    this.homeTemp = window.app.HomeTemplate
    this.projectTemp = window.app.ProjectTemplate
  }

  addEvent = function (elementID, event, func) {
    const el = document.getElementById(elementID)
    if (el) {
      el.addEventListener(event, func)
    }
  }

  getElement = function (selector) {
    return document.querySelector(selector)
  }

  getElements = function (selector) {
    return document.querySelectorAll(selector)
  }

  setBackground = function () {
    document.querySelector('body').style.background = this.randomGradient()
  }

  showProjectModal = function (title, name) {
    const modal = document.createElement('DIV')
    modal.innerHTML = this.homeTemp.ProjectModal(title, name)
    document.querySelector('content').appendChild(modal)
    this.addEvent('project-modal-bg', 'click', () => this.closeModal())
  }

  showItemModal = function (title, name, user, users) {
    const modal = document.createElement('DIV')
    modal.innerHTML = this.projectTemp.ItemModal(title, name, user, users)
    document.querySelector('content').appendChild(modal)
    this.addEvent('project-modal-bg', 'click', () => this.closeModal())
  }

  showModal = function (title, text, hasButtons, action) {
    const modal = document.createElement('DIV')
    modal.innerHTML = this.homeTemp.Modal(title, text, hasButtons)
    document.querySelector('content').appendChild(modal)
    this.addEvent('modal-bg', 'click', () => this.closeModal())
    if (hasButtons && action) {
      this.addEvent('yes-button', 'click', () => action())
      this.addEvent('no-button', 'click', () => this.closeModal())
    }
  }

  showAlertLogin = function (title, text, action) {
    const modal = document.createElement('DIV')
    modal.innerHTML = this.loginTemp.Alert(title, text)
    document.querySelector('content').appendChild(modal)
    this.accTemp = window.app.AccountTemplate
    this.functTemp = window.app.FunctionTemplate
    this.addEvent('modal-bg', 'click', () => action())
    this.addEvent('ok-button', 'click', () => action())
  }

  closeModal = function () {
    document.querySelector('.modal-container').remove()
  }

  randomGradient = function () {
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
}

window.app.View = View
