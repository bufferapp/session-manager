const jwt = require('jsonwebtoken')
const RPCClient = require('micro-rpc-client')
const {
  cookieName,
  cookieDomain,
  getCookie,
  writeCookie,
  destroyCookie,
} = require('./cookies')

const { sessionServiceUrl } = require('./urls')

const sessionClient = ({ sessionVersion, production }) =>
  new RPCClient({ url: sessionServiceUrl({ sessionVersion, production }) })

// will need this in controller for creating a session with a version
// const createSessionServiceVersion = () =>
//   process.env.SESSION_VERSION;

const createSession = async ({
  session,
  production,
  res,
  userId,
  sessionVersion,
}) => {
  // this will throw errors when a session cannot be created
  const { token } = await sessionClient({
    sessionVersion,
    production,
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

const getSession = async ({ req, production, sessionKeys }) => {
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

const updateSession = async ({ session, req, production }) => {
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

const destroySession = async ({ req, res, production }) => {
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

module.exports = {
  createSession,
  getSession,
  updateSession,
  destroySession,
  sessionClient,
}
