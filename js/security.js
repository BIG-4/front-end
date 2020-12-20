window.app = window.app || {}

class Security {
  constructor() {
    this.secures = []
  }

  validateNumber = function (number) {
    return new RegExp('^[0-9]+$').test(number)
  }

  validateSign = function (username) {
    // eslint-disable-next-line no-unused-expressions
    return username !== undefined && username !== null && new RegExp('^[a-zA-Z0-9.-]+').test(username)
  }

  escapeHtml = function (text) {
    if (text === undefined || text === null) return text
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#039;',
    }
    return text.replace(/[&<>"']/g, (m) => map[m])
  }

  encodeURI = function (uri) {
    return encodeURIComponent(uri)
  }
}

window.app.Security = Security
