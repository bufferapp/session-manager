import ObjectPath from 'object-path'
import { getSession } from './session'
import { loginServiceUrl } from './urls'
import { cookieName, cookieDomain, destroyCookie } from './cookies'
import BuffLog from "@bufferapp/bufflog";

export const setRequestSession = ({ production, sessionKeys }) => async (
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
    return next()
  } catch (e) {
    const bugsnag = req.app.get('bugsnag')
    if (bugsnag) {
      bugsnag.notify(e, {
        originalUrl: req.originalUrl,
      })
    }
    return cleanSessionAndRedirect(req, res, next, production, true)
  }
}

export const validateSession = ({ requiredSessionKeys, production }) => (
  req,
  res,
  next,
) => {
  let allValidKeys = true
  requiredSessionKeys.forEach(key => {
    if (!ObjectPath.has(req.session, key) || !req.session[key]) {
      allValidKeys = false
    }
  })
  BuffLog.info('------ debugHenry', {
    allValidKeys,
    requiredSessionKeys,
    session: req.session,
  })
  if (allValidKeys && req.session) {
    return next()
  }
  return cleanSessionAndRedirect(req, res, next, production, false)
}

export const ensureNoTFA = ({ production }) => (req, res, next) => {
  const isTFAInProgress = !!ObjectPath.get(req, 'session.global.tfa', false)
  if (isTFAInProgress) {
    return cleanSessionAndRedirect(req, res, next, production, true)
  }
  return next()
}

function cleanSessionAndRedirect(
  req,
  res,
  next,
  production,
  deleteSession = false,
) {
  if (deleteSession) {
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
  }

  const redirect = encodeURIComponent(
    `https://${req.get('host')}${req.originalUrl}`,
  )
  const baseUrl = `${loginServiceUrl({ production })}/login/`
  res.redirect(`${baseUrl}?redirect=${redirect}`)
}
