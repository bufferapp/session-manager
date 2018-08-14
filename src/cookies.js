const cookieName = ({ production }) =>
  production ? 'buffer_session' : 'local_buffer_session'

const cookieDomain = ({ production }) =>
  production ? '.buffer.com' : '.local.buffer.com'

const getCookie = ({ req, name }) => req.cookies[name]

const writeCookie = ({
  name,
  value,
  domain,
  maxAge = 365 * 24 * 60 * 60 * 1000,
  httpOnly = true,
  secure = true,
  res,
}) => {
  res.cookie(name, value, {
    domain,
    maxAge,
    httpOnly,
    secure,
  })
}

const destroyCookie = ({ name, domain, res }) =>
  res.clearCookie(name, {
    domain,
  })

module.exports = {
  cookieName,
  cookieDomain,
  getCookie,
  writeCookie,
  destroyCookie,
}
