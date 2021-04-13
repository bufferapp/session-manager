import { loginServiceUrl, logoutUrl } from '../src/urls'

describe('urls', () => {
  describe('loginServiceUrl', () => {
    it('should return production service url', () => {
      const expectedServiceUrl = 'https://login.buffer.com'
      expect(loginServiceUrl({ production: true })).toBe(expectedServiceUrl)
    })

    it('should return dev service url', () => {
      const expectedServiceUrl = 'https://login.local.buffer.com'
      expect(loginServiceUrl({ production: false })).toBe(expectedServiceUrl)
    })
  })

  describe('logoutUrl', () => {
    const windowLocation = global.window.location

    beforeEach(() => {
      delete global.window.location
    })
    afterAll(() => {
      global.window.location = windowLocation
    })

    it('should return expected logoutUrl', () => {
      const href = 'http://localhost/'
      const expectedHref = 'http%3A%2F%2Flocalhost%2F'

      window.location = new URL(href)

      expect(logoutUrl({ production: true })).toBe(
        `https://login.buffer.com/logout/?redirect=${expectedHref}`,
      )
    })

    it('should return expected logoutUrl in dev', () => {
      const href = 'http://localhost/'
      const expectedHref = 'http%3A%2F%2Flocalhost%2F'

      window.location = new URL(href)

      expect(logoutUrl({ production: false })).toBe(
        `https://login.local.buffer.com/logout/?redirect=${expectedHref}`,
      )
    })

    it('should return expected logoutUrl with query parameters', () => {
      const href =
        'https://localhost/?utm_source=publish-free&utm_medium=email&utm_campaign=welcome-free&utm_content=cdu'
      const expectedHref =
        'https%3A%2F%2Flocalhost%2F%3Futm_source%3Dpublish-free%26utm_medium%3Demail%26utm_campaign%3Dwelcome-free%26utm_content%3Dcdu'

      window.location = new URL(href)

      expect(logoutUrl({ production: true })).toBe(
        `https://login.buffer.com/logout/?redirect=${expectedHref}`,
      )
    })
  })
})
