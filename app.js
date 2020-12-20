function App() {
  this.security = new window.app.Security()
  this.model = new window.app.Model(this.security)
  this.view = new window.app.View(this.model)
  this.controller = new window.app.Controller(this.model, this.view, this.security)
}

const app = new App()
