window.app = window.app || {}

class Router {
  routes = [];

  mode = null;

  root = '/';

  constructor(options) {
    if (options.mode) this.mode = options.mode
    if (options.root) this.root = options.root
    this.listen()
  }

  add = (path, cb) => {
    this.routes.push({ path, cb })
    return this
  };

  clearSlashes = (path) => path
    .toString()
    .replace(/\/$/, '')
    .replace(/^\//, '');

  getFragment = () => {
    let fragment = ''
    const match = window.location.href.match(/#(.*)$/)
    fragment = match ? match[1] : ''
    return this.clearSlashes(fragment)
  }

  navigate = (path = '') => {
    window.location.href = `${window.location.href.replace(/#(.*)$/, '')}#${path}`

    return this
  };

  listen = () => {
    clearInterval(this.interval)
    this.interval = setInterval(this.interval, 50)
  };

  interval = () => {
    if (this.current === this.getFragment()) return
    this.current = this.getFragment()

    this.routes.some((route) => {
      const match = this.current.match(route.path)
      if (match) {
        match.shift()
        route.cb.apply({}, match)
        return match
      }
      return false
    })
  };
}

window.app.Routes = { Router }
