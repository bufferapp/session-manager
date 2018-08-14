const ObjectPath = require('object-path')
const { getSession } = require('./session')
const { loginServiceUrl } = require('./urls')
const { cookieName, cookieDomain, destroyCookie } = require('./cookies')

const setRequestSession = ({ production, sessionKeys }) => async (
  req,
  res,
  next,
) => {
  try {
    const session = await getSession({
      req,
      production,
      sessionKeys,
    })
    req.session = session
    next()
  } catch (e) {
    const bugsnag = req.app.get('bugsnag')
    if (bugsnag) {
      bugsnag.notify(e, {
        originalUrl: req.originalUrl,
      })
    }
    // destroy the cookie(s) and redirect to the login page
    // if getting the session failed for any reason
    destroyCookie({
      name: cookieName({ production }),
      domain: cookieDomain({ production }),
      res,
    })
    destroyCookie({
      name: `${production ? '' : 'local'}bufferapp_ci_session`,
      domain: '.buffer.com',
      res,
    })
    const redirect = encodeURIComponent(
      `https://${req.get('host')}${req.originalUrl}`,
    )
    const baseUrl = `${loginServiceUrl({ production })}/login/`
    res.redirect(`${baseUrl}?redirect=${redirect}`)
  }
}

const validateSession = ({ requiredSessionKeys, production }) => (
  req,
  res,
  next,
) => {
  let allValidKeys = true
  requiredSessionKeys.forEach(key => {
    if (!ObjectPath.has(req.session, key)) {
      allValidKeys = false
    }
  })
  if (allValidKeys && req.session) {
    return next()
  }
  const redirect = encodeURIComponent(
    `https://${req.get('host')}${req.originalUrl}`,
  )
  const baseUrl = `${loginServiceUrl({ production })}/login/`
  res.redirect(`${baseUrl}?redirect=${redirect}`)
}

module.exports = {
  setRequestSession,
  validateSession,
}
