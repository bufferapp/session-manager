import RPCClient from '@bufferapp/micro-rpc-client'
import jwt from 'jsonwebtoken'

const { setRequestSession, validateSession } = require('../src/middleware')

describe('middleware', () => {
  describe('setRequestSession', () => {
    it('should handle missing session cookie', async () => {
      const req = {
        cookies: [],
      }
      const res = {}
      const next = jest.fn()
      await setRequestSession({ production: true })(req, res, next)
      expect(next).toBeCalled()
    })

    it('should handle production session cookie', async () => {
      const bufferCookieName = 'buffer_session'
      const cookieValue = 'coooooookies'
      const req = {
        cookies: {
          [bufferCookieName]: cookieValue,
        },
      }
      const sessionUrl = 'someSessionUrl'
      const sessionKeys = ['*']
      const res = {}
      const next = jest.fn()
      const configuredMiddlware = setRequestSession({
        production: true,
        sessionUrl,
        sessionKeys,
      })
      await configuredMiddlware(req, res, next)
      expect(next).toBeCalled()
      expect(RPCClient.prototype.call).toBeCalledWith('get', {
        token: cookieValue,
        keys: sessionKeys,
        sessionVersion: jwt.fakeSessionVersion,
      })
      expect(req.session).toEqual(RPCClient.fakeSession)
    })

    it('should handle session service failure', async () => {
      const bufferCookieName = 'buffer_session'
      const cookieValue = 'brokenCookie'
      const req = {
        cookies: {
          [bufferCookieName]: cookieValue,
        },
        app: {
          get: () => {},
        },
        get: () => {},
      }
      const sessionUrl = 'someSessionUrl'
      const sessionKeys = ['*']
      const res = {
        clearCookie: () => {},
        redirect: () => {},
      }
      const next = jest.fn()

      const configuredMiddlware = setRequestSession({
        production: true,
        sessionUrl,
        sessionKeys,
      })
      await configuredMiddlware(req, res, next)
      expect(next).not.toBeCalled()
    })
  })

  describe('validateSession', () => {
    it('should call next with valid session', async () => {
      const requiredSessionKey = 'publish'
      const host = 'someHost'
      const requiredSessionKeys = [`${requiredSessionKey}.accessToken`]
      const req = {
        session: {
          [requiredSessionKey]: {
            accessToken: 'someAccessToken',
          },
        },
        get: () => host,
      }
      const res = {
        redirect: jest.fn(),
      }
      const next = jest.fn()
      const configuredMiddlware = validateSession({
        requiredSessionKeys,
      })
      await configuredMiddlware(req, res, next)
      expect(next).toBeCalled()
    })

    it('should call production redirect with invalid session', async () => {
      const requiredSessionKeys = ['nope.accessToken']
      const host = 'someHost'
      const originalUrl = '/someUrl'
      const redirect = encodeURIComponent(`https://${host}${originalUrl}`)
      const loginUrl = 'https://login.buffer.com/login/'
      const req = {
        session: {},
        originalUrl,
        get: () => host,
      }
      const res = {
        redirect: jest.fn(),
      }
      const next = jest.fn()
      const configuredMiddlware = validateSession({
        requiredSessionKeys,
        production: true,
      })
      await configuredMiddlware(req, res, next)
      expect(next).not.toBeCalled()
      expect(res.redirect).toBeCalledWith(`${loginUrl}?redirect=${redirect}`)
    })

    it('should call dev redirect with invalid session', async () => {
      const requiredSessionKeys = ['nope.accessToken']
      const host = 'someHost'
      const originalUrl = '/someUrl'
      const redirect = encodeURIComponent(`https://${host}${originalUrl}`)
      const loginUrl = 'https://login.local.buffer.com/login/'
      const req = {
        session: {},
        originalUrl,
        get: () => host,
      }
      const res = {
        redirect: jest.fn(),
      }
      const next = jest.fn()
      const configuredMiddlware = validateSession({
        requiredSessionKeys,
        production: false,
      })
      await configuredMiddlware(req, res, next)
      expect(next).not.toBeCalled()
      expect(res.redirect).toBeCalledWith(`${loginUrl}?redirect=${redirect}`)
    })

    it('should call redirect with invalid session (missing one)', async () => {
      const host = 'someHost'
      const originalUrl = '/someUrl'
      const requiredSessionKeys = ['hello.token', 'nope.accessToken']
      const req = {
        session: {
          hello: {
            token: ':wave:',
          },
        },
        originalUrl,
        get: () => host,
      }
      const res = {
        redirect: jest.fn(),
      }
      const next = jest.fn()
      const configuredMiddlware = validateSession({
        requiredSessionKeys,
      })
      await configuredMiddlware(req, res, next)
      expect(next).not.toBeCalled()
      expect(res.redirect).toBeCalled()
    })

    it('should call redirect with session key value is null', async () => {
      const host = 'someHost'
      const originalUrl = '/someUrl'
      const requiredSessionKeys = ['hello.token']
      const req = {
        session: {
          hello: {
            token: null,
          },
        },
        originalUrl,
        get: () => host,
      }
      const res = {
        redirect: jest.fn(),
      }
      const next = jest.fn()
      const configuredMiddlware = validateSession({
        requiredSessionKeys,
      })
      await configuredMiddlware(req, res, next)
      expect(next).not.toBeCalled()
      expect(res.redirect).toBeCalled()
    })

    it('should call redirect when session is missing', async () => {
      const host = 'someHost'
      const originalUrl = '/someUrl'
      const req = {
        originalUrl,
        get: () => host,
      }
      const res = {
        redirect: jest.fn(),
      }
      const next = jest.fn()
      const configuredMiddlware = validateSession({
        requiredSessionKeys: [],
        production: true,
      })
      await configuredMiddlware(req, res, next)
      expect(next).not.toBeCalled()
      expect(res.redirect).toBeCalled()
    })
  })
})
