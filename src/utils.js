const objectPath = require('object-path')
/**
 * Check if the current session corresponds to an impersonated user
 *
 * @param {Object} session
 * @returns {Boolean}
 */
export function isImpersonation(session = {}) {
  return isPublishImpersonation(session) || isGlobalImpersonation(session)
}

/**
 * Impersonation from Classic Admin replaces only the session.publish
 * part of the session, while leaving session.global intact
 *
 * We can use that to check if this is a publish impersonation
 *
 * @param {Object} session
 * @returns {Boolean}
 */
export function isPublishImpersonation(session = {}) {
  const publishId = objectPath.get(session, 'publish.foreignKey')
  const publishKey = objectPath.get(session, 'global.publishKey')

  return !!publishId && !!publishKey && publishId !== publishKey
}

/**
 * Impersonation from Global Admin is currently only used for Analyze users
 * but it's likely to become a more generic way to impersonate users
 *
 * The impersonating user's session is stored in a session.impersonated_by.
 *
 *
 * @param {Object} session
 * @returns {Boolean}
 */
export function isGlobalImpersonation(session = {}) {
  return typeof session.impersonated_by === 'object'
}
