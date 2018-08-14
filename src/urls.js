const currentWindowUrl = () => window.location.href

const loginServiceUrl = ({ production }) =>
  `https://login${production ? '' : '.local'}.buffer.com`

const logoutUrl = ({ production }) =>
  `${loginServiceUrl({ production })}/logout/?redirect=${currentWindowUrl()}`

// TODO: remove beta '1' version after its been removed
const sessionServiceUrl = ({ sessionVersion = '1', production }) =>
  `http://session-service-${sessionVersion}${production ? '.buffer' : ''}`

module.exports = {
  logoutUrl,
  loginServiceUrl,
  sessionServiceUrl,
}
