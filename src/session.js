import jwt from 'jsonwebtoken'
import RPCClient from 'micro-rpc-client'
import {
  cookieName,
  cookieDomain,
  getCookie,
  writeCookie,
  destroyCookie,
} from './cookies'

import { sessionServiceUrl } from './urls'

export const sessionClient = ({ sessionVersion, production, isStaging }) =>
  new RPCClient({ url: sessionServiceUrl({ sessionVersion, production, isStaging }) })

// will need this in controller for creating a session with a version
// const createSessionServiceVersion = () =>
//   process.env.SESSION_VERSION;

export const createSession = async ({
  session,
  production,
  isStaging,
  res,
  userId,
  sessionVersion,
}) => {
  // this will throw errors when a session cannot be created
  const { token } = await sessionClient({
    sessionVersion,
    production,
    isStaging,
  }).call('create', {
    session,
    userId,
  })
  writeCookie({
    name: cookieName({ production }),
    value: token,
    domain: cookieDomain({ production }),
    res,
  })
  return {
    token,
    session,
  }
}

export const getSession = async ({ req, production, isStaging, sessionKeys }) => {
  const sessionCookie = getCookie({
    name: cookieName({ production }),
    req,
  })
  if (!sessionCookie) {
    return
  }
  const { sessionVersion } = jwt.decode(sessionCookie)
  const session = await sessionClient({
    sessionVersion,
    production,
    isStaging,
  }).call('get', {
    token: sessionCookie,
    keys: sessionKeys,
    sessionVersion,
  })
  return session
}

export const updateSession = async ({ session, req, production, isStaging }) => {
  const sessionCookie = getCookie({
    name: cookieName({ production }),
    req,
  })
  const { sessionVersion } = jwt.decode(sessionCookie)
  return sessionClient({
    sessionVersion,
    production,
    isStaging,
  }).call('update', {
    session,
    token: sessionCookie,
    sessionVersion,
  })
}

export const destroySession = async ({ req, res, production, isStaging }) => {
  const sessionCookieName = cookieName({ production })
  const sessionCookie = getCookie({
    name: sessionCookieName,
    req,
  })
  const { sessionVersion } = jwt.decode(sessionCookie)
  await sessionClient({
    sessionVersion,
    production,
    isStaging,
  }).call('destroy', {
    token: sessionCookie,
    sessionVersion,
  })
  destroyCookie({
    name: sessionCookieName,
    domain: cookieDomain({ production }),
    res,
  })
  destroyCookie({
    name: `${production ? '' : 'local'}bufferapp_ci_session`,
    domain: '.buffer.com',
    res,
  })
}
