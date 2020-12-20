window.app = window.app || {}

function validateNumber(number) {
  return new RegExp('^[0-9]+$').test(number)
}

function validateSign(username) {
  // eslint-disable-next-line no-unused-expressions
  return username !== undefined && username !== null && new RegExp('^[a-zA-Z0-9.-]+').test(username)
}

function escapeHtml(text) {
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
function encodeURI(uri) {
  return encodeURIComponent(uri)
}

window.app.Security = {
  validateNumber, validateSign, escapeHtml, encodeURI,
}
