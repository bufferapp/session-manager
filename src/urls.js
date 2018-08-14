const currentWindowUrl = () => window.location.href

export const loginServiceUrl = ({ production }) =>
  `https://login${production ? '' : '.local'}.buffer.com`

export const logoutUrl = ({ production }) =>
  `${loginServiceUrl({ production })}/logout/?redirect=${currentWindowUrl()}`

// TODO: remove beta '1' version after its been removed
export const sessionServiceUrl = ({ sessionVersion = '1', production }) =>
  `http://session-service-${sessionVersion}${production ? '.buffer' : ''}`
