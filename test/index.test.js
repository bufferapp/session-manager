import {
  createSession,
  getSession,
  updateSession,
  destroySession,
  logoutUrl,
  loginServiceUrl,
  sessionServiceUrl,
  sessionClient,
  cookieName,
  cookieDomain,
  getCookie,
  writeCookie,
  destroyCookie,
} from '../src'

describe('SessionManager', () => {
  it('should export createSession', () => {
    expect(createSession).toBeDefined()
  })

  it('should export getSession', () => {
    expect(getSession).toBeDefined()
  })

  it('should export updateSession', () => {
    expect(updateSession).toBeDefined()
  })

  it('should export destroySession', () => {
    expect(destroySession).toBeDefined()
  })

  it('should export logoutUrl', () => {
    expect(logoutUrl).toBeDefined()
  })

  it('should export loginServiceUrl', () => {
    expect(loginServiceUrl).toBeDefined()
  })

  it('should export sessionServiceUrl', () => {
    expect(sessionServiceUrl).toBeDefined()
  })

  it('should export sessionClient', () => {
    expect(sessionClient).toBeDefined()
  })

  it('should export cookieName', () => {
    expect(cookieName).toBeDefined()
  })

  it('should export cookieDomain', () => {
    expect(cookieDomain).toBeDefined()
  })

  it('should export getCookie', () => {
    expect(getCookie).toBeDefined()
  })

  it('should export writeCookie', () => {
    expect(writeCookie).toBeDefined()
  })

  it('should export destroyCookie', () => {
    expect(destroyCookie).toBeDefined()
  })
})
