const jwt = jest.genMockFromModule('jsonwebtoken')
jwt.fakeSessionVersion = 'fakeSessionVersion'
jwt.decode = jest.fn(() => ({
  sessionVersion: jwt.fakeSessionVersion,
}))
module.exports = jwt
