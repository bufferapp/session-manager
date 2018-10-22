const currentWindowUrl = () => window.location.href

export const loginServiceUrl = ({ production }) => {
  if (!process.env.SESSION_SERVICE_REDIRECT_URL)
    return `https://login${production ? '' : '.local'}.buffer.com`

  return process.env.SESSION_SERVICE_REDIRECT_URL
}

export const logoutUrl = ({ production }) =>
  `${loginServiceUrl({ production })}/logout/?redirect=${currentWindowUrl()}`

// TODO: remove beta '1' version after its been removed
export const sessionServiceUrl = ({ sessionVersion = '1', production }) => {
  if (!process.env.SESSION_SERVICE_URL)
    return `http://session-service-${sessionVersion}${production ? '.core' : ':3000'}`

  return process.env.SESSION_SERVICE_URL
}
