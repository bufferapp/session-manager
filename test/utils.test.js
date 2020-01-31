import * as utils from '../src/utils'

describe('utils', () => {
  describe('isPublishImpersonation', () => {
    it('returns false for a normal session', () => {
      const session = {
        global: { publishKey: 'publish-user-key' },
        publish: { foreignKey: 'publish-user-key' },
      }

      expect(utils.isPublishImpersonation(session)).toBe(false)
    })

    it('returns true for a publish impersonated user', () => {
      const session = {
        global: { publishKey: 'publish-user-key' },
        publish: { foreignKey: 'publish-impersonated-user-key' },
      }

      expect(utils.isPublishImpersonation(session)).toBe(true)
    })

    it('returns false for no session passed', () => {
      expect(utils.isPublishImpersonation()).toBe(false)
    })

    it('returns false for a non publish session', () => {
      const session = {
        global: { accountId: 'acccount-key' },
        analyze: { foreignKey: 'analyze-user-key' },
      }
      expect(utils.isPublishImpersonation(session)).toBe(false)
    })
  })

  describe('isGlobalImpersonation', () => {
    it('returns false for a normal session', () => {
      const session = {
        global: { publishKey: 'publish-user-key' },
        publish: { foreignKey: 'publish-user-key' },
      }

      expect(utils.isGlobalImpersonation(session)).toBe(false)
    })

    it('returns true for a global impersonated user', () => {
      const session = {
        global: { publishKey: 'publish-user-key' },
        publish: { foreignKey: 'publish-user-key' },
        impersonated_by: { mock: 'session-is-an-object' },
      }

      expect(utils.isGlobalImpersonation(session)).toBe(true)
    })

    it('returns false for no session passed', () => {
      expect(utils.isGlobalImpersonation()).toBe(false)
    })
  })

  describe('isImpersonation', () => {
    it('returns false for a normal publish session', () => {
      const session = {
        global: { publishKey: 'publish-user-key' },
        publish: { foreignKey: 'publish-user-key' },
      }

      expect(utils.isImpersonation(session)).toBe(false)
    })

    it('returns false for a non-publish session', () => {
      const session = {
        global: { publishKey: 'publish-user-key' },
        publish: { foreignKey: 'publish-user-key' },
      }

      expect(utils.isImpersonation(session)).toBe(false)
    })

    it('returns true for a global impersonated user', () => {
      const session = {
        global: { publishKey: 'publish-user-key' },
        publish: { foreignKey: 'publish-user-key' },
        impersonated_by: { mock: 'session-is-an-object' },
      }

      expect(utils.isImpersonation(session)).toBe(true)
    })

    it('returns true for a publish impersonated user', () => {
      const session = {
        global: { publishKey: 'publish-user-key' },
        publish: { foreignKey: 'publish-impersonated-user-key' },
      }

      expect(utils.isImpersonation(session)).toBe(true)
    })

    it('returns false for no session passed', () => {
      expect(utils.isImpersonation()).toBe(false)
    })
  })
})
