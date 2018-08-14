const {
  createSession,
  getSession,
  updateSession,
  destroySession,
  sessionClient,
} = require('./session')

const { logoutUrl, loginServiceUrl, sessionServiceUrl } = require('./urls')

const {
  cookieName,
  cookieDomain,
  getCookie,
  writeCookie,
  destroyCookie,
} = require('./cookies')

module.exports = {
  createSession,
  getSession,
  updateSession,
  destroySession,
  logoutUrl,
  loginServiceUrl,
  sessionServiceUrl,
  sessionClient,
  cookieName,
  cookieDomain,
  getCookie,
  writeCookie,
  destroyCookie,
}
