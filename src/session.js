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

export const sessionClient = ({ sessionVersion, production }) =>
  new RPCClient({ url: sessionServiceUrl({ sessionVersion, production }) })

// will need this in controller for creating a session with a version
// const createSessionServiceVersion = () =>
//   process.env.SESSION_VERSION;

export const createOrUpdateSession = async ({
  sessionVersion,
  production,
  session,
  accountId,
  req,
  res,
}) => {
  const sessionCookie = getCookie({
    name: cookieName({ production }),
    req,
  })
  if (sessionCookie) {
    return updateSession({ session, req, production })
  }

  return createSession({ sessionVersion, production, session, res, accountId })
}

export const createSession = async ({
  sessionVersion,
  production,
  session,
  res,
  userId,
  accountId,
}) => {
  // this will throw errors when a session cannot be created
  const { token } = await sessionClient({
    sessionVersion,
    production,
  }).call('create', {
    session,
    userId,
    accountId,
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

export const getSession = async ({ req, production, sessionKeys }) => {
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
  }).call('get', {
    token: sessionCookie,
    keys: sessionKeys,
    sessionVersion,
  })
  return session
}

export const updateSession = async ({ session, req, production }) => {
  const sessionCookie = getCookie({
    name: cookieName({ production }),
    req,
  })
  const { sessionVersion } = jwt.decode(sessionCookie)
  return sessionClient({
    sessionVersion,
    production,
  }).call('update', {
    session,
    token: sessionCookie,
    sessionVersion,
  })
}

export const destroySession = async ({ req, res, production }) => {
  const sessionCookieName = cookieName({ production })
  const sessionCookie = getCookie({
    name: sessionCookieName,
    req,
  })
  const { sessionVersion } = jwt.decode(sessionCookie)
  await sessionClient({
    sessionVersion,
    production,
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

export const getActiveSessions = async ({
  sessionVersion,
  production,
  userId,
}) => {
  const session = await sessionClient({
    sessionVersion,
    production,
  }).call('getActiveSessions', {
    userId,
    sessionVersion,
  })
  return session
}
