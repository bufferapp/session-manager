import RPCClient from 'micro-rpc-client'
import jwt from 'jsonwebtoken'
import {
  createSession,
  updateSession,
  destroySession,
  createOrUpdateSession,
} from '../src/session'

describe('session', () => {
  describe('createSession', () => {
    it('should create a new session in production', async () => {
      const res = {
        cookie: jest.fn(),
      }
      const sessionClient = new RPCClient({ url: 'sometesturl' })
      const expectedSession = {}
      const { token, session } = await createSession({
        session: expectedSession,
        res,
        sessionClient,
        production: true,
      })
      expect(RPCClient.prototype.call).toBeCalledWith('create', {
        session: expectedSession,
      })
      expect(token).toBe(RPCClient.fakeAccessToken)
      expect(session).toEqual(expectedSession)
      expect(res.cookie).toBeCalledWith(
        'buffer_session',
        RPCClient.fakeAccessToken,
        {
          domain: '.buffer.com',
          maxAge: 365 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: true,
        },
      )
    })

    it('should create a new session in dev', async () => {
      const res = {
        cookie: jest.fn(),
      }
      const sessionClient = new RPCClient({ url: 'sometesturl' })
      const expectedSession = {}
      const { token, session } = await createSession({
        session: expectedSession,
        res,
        sessionClient,
        production: false,
      })
      expect(RPCClient.prototype.call).toBeCalledWith('create', {
        session: expectedSession,
      })
      expect(token).toBe(RPCClient.fakeAccessToken)
      expect(session).toEqual(expectedSession)
      expect(res.cookie).toBeCalledWith(
        'local_buffer_session',
        RPCClient.fakeAccessToken,
        {
          domain: '.local.buffer.com',
          maxAge: 365 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: true,
        },
      )
    })

    it('should handle create session errors', async () => {
      const res = {
        cookie: jest.fn(),
      }
      const sessionClient = new RPCClient({ url: 'sometesturl' })
      const expectedSession = {
        broken: true,
      }
      try {
        await createSession({
          session: expectedSession,
          res,
          sessionClient,
          production: true,
        })
        throw new Error('This should break')
      } catch (err) {
        expect(err.message).toBe(RPCClient.fakeErrorMessage)
      }
    })
  })

  describe('updateSession', () => {
    it('should update a session in production', async () => {
      const name = 'buffer_session'
      const value = 'coooooookies'
      const req = {
        cookies: {
          [name]: value,
        },
      }
      const sessionClient = new RPCClient({ url: 'sometesturl' })
      const expectedSession = {}
      await updateSession({
        session: expectedSession,
        req,
        sessionClient,
        production: true,
      })
      expect(RPCClient.prototype.call).toBeCalledWith('update', {
        session: expectedSession,
        token: value,
        sessionVersion: jwt.fakeSessionVersion,
      })
    })

    it('should update a session in dev', async () => {
      const name = 'local_buffer_session'
      const value = 'coooooookiez'
      const req = {
        cookies: {
          [name]: value,
        },
      }
      const sessionClient = new RPCClient({ url: 'sometesturl' })
      const expectedSession = {}
      await updateSession({
        session: expectedSession,
        req,
        sessionClient,
        production: false,
      })
      expect(RPCClient.prototype.call).toBeCalledWith('update', {
        session: expectedSession,
        token: value,
        sessionVersion: jwt.fakeSessionVersion,
      })
    })

    it('should throw update session errors', async () => {
      const name = 'buffer_session'
      const value = 'coooooookies'
      const req = {
        cookies: {
          [name]: value,
        },
      }
      const sessionClient = new RPCClient({ url: 'sometesturl' })
      const expectedSession = {
        broken: true,
      }
      try {
        await updateSession({
          session: expectedSession,
          req,
          sessionClient,
          production: true,
        })
        throw new Error('This should break')
      } catch (err) {
        expect(err.message).toBe(RPCClient.fakeErrorMessage)
      }
    })
  })

  describe('createOrUpdateSession', () => {
    it('should create a new session in production', async () => {
      const res = {
        cookie: jest.fn(),
      }
      const req = {
        cookies: {},
      }
      const sessionClient = new RPCClient({ url: 'sometesturl' })
      const expectedSession = {}
      const { token, session } = await createOrUpdateSession({
        session: expectedSession,
        res,
        req,
        sessionClient,
        production: true,
      })
      expect(RPCClient.prototype.call).toBeCalledWith('create', {
        session: expectedSession,
      })
      expect(token).toBe(RPCClient.fakeAccessToken)
      expect(session).toEqual(expectedSession)
      expect(res.cookie).toBeCalledWith(
        'buffer_session',
        RPCClient.fakeAccessToken,
        {
          domain: '.buffer.com',
          maxAge: 365 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: true,
        },
      )
    })

    it('should update a session in production', async () => {
      const name = 'buffer_session'
      const value = 'coooooookies'
      const req = {
        cookies: {
          [name]: value,
        },
      }
      const sessionClient = new RPCClient({ url: 'sometesturl' })
      const expectedSession = {}
      await createOrUpdateSession({
        session: expectedSession,
        req,
        sessionClient,
        production: true,
      })
      expect(RPCClient.prototype.call).toBeCalledWith('update', {
        session: expectedSession,
        token: value,
        sessionVersion: jwt.fakeSessionVersion,
      })
    })
  })

  describe('destroySession', () => {
    it('should destroy a session', async () => {
      const name = 'buffer_session'
      const value = 'coooooookies'
      const req = {
        cookies: {
          [name]: value,
        },
      }
      const res = {
        clearCookie: jest.fn(),
        send: jest.fn(),
      }
      const sessionClient = new RPCClient({ url: 'sometesturl' })
      await destroySession({
        req,
        res,
        sessionClient,
        production: true,
      })
      expect(RPCClient.prototype.call).toBeCalledWith('destroy', {
        token: value,
        sessionVersion: jwt.fakeSessionVersion,
      })
      expect(res.clearCookie).toBeCalledWith('buffer_session', {
        domain: '.buffer.com',
      })
      expect(res.clearCookie).toBeCalledWith('bufferapp_ci_session', {
        domain: '.buffer.com',
      })
    })

    it('should destroy a dev session', async () => {
      const name = 'local_buffer_session'
      const value = 'coooooookies'
      const req = {
        cookies: {
          [name]: value,
        },
      }
      const res = {
        clearCookie: jest.fn(),
        send: jest.fn(),
      }
      const sessionClient = new RPCClient({ url: 'sometesturl' })
      await destroySession({
        req,
        res,
        sessionClient,
        production: false,
      })
      expect(RPCClient.prototype.call).toBeCalledWith('destroy', {
        token: value,
        sessionVersion: jwt.fakeSessionVersion,
      })
      expect(res.clearCookie).toBeCalledWith(name, {
        domain: '.local.buffer.com',
      })
      expect(res.clearCookie).toBeCalledWith('localbufferapp_ci_session', {
        domain: '.buffer.com',
      })
    })

    it('should handle destory session failure', async () => {
      const name = 'buffer_session'
      const req = {
        cookies: {
          [name]: 'brokenToken',
        },
      }
      const res = {}
      const sessionClient = new RPCClient({ url: 'sometesturl' })
      try {
        await destroySession({
          res,
          req,
          sessionClient,
          production: true,
        })
        throw new Error('This should break')
      } catch (err) {
        expect(err.message).toBe(RPCClient.fakeErrorMessage)
      }
    })
  })
})
