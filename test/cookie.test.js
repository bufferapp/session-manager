import {
  getCookie,
  cookieName,
  cookieDomain,
  writeCookie,
} from '../src/cookies'

describe('cookies', () => {
  describe('getCookie', () => {
    it('should get a cookie from a request in production', () => {
      const name = 'buffer_session'
      const value = 'coooooookies'
      const req = {
        cookies: {
          [name]: value,
        },
      }
      expect(
        getCookie({
          name,
          req,
        }),
      ).toBe(value)
    })

    it('should return undefined if not exists', () => {
      const name = 'nope'
      const req = {
        cookies: {},
      }
      expect(
        getCookie({
          name,
          req,
        }),
      ).toBeUndefined()
    })
  })

  describe('cookieName', () => {
    it('should get a production cookie name', () => {
      expect(cookieName({ production: true })).toBe('buffer_session')
    })

    it('should get a development cookie name', () => {
      expect(cookieName({ production: false })).toBe('local_buffer_session')
    })
  })

  describe('cookieDomain', () => {
    it('should get a production cookie name', () => {
      expect(cookieDomain({ production: true })).toBe('.buffer.com')
    })

    it('should get a development cookie name', () => {
      expect(cookieDomain({ production: false })).toBe('.local.buffer.com')
    })
  })

  describe('writeCookie', () => {
    it('should write a production cookie', () => {
      const res = {
        cookie: jest.fn(),
      }
      const name = 'someCookieName'
      const value = 'someCookieValue'
      const domain = 'someCookieDomain'
      writeCookie({
        name,
        value,
        domain,
        res,
      })
      expect(res.cookie).toBeCalledWith(name, value, {
        domain,
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
      })
    })
  })
})
