const RPCClient = jest.genMockFromModule('micro-rpc-client')
RPCClient.fakeAccessToken = 'someFakeAccessToken'
RPCClient.fakeSession = {
  global: {
    userId: 1,
  },
  account: {
    accessToken: 'someAccessToken',
  },
}
RPCClient.fakeErrorMessage = 'some error happened'
RPCClient.prototype.call = jest.fn((name, args) => {
  if (name === 'get') {
    if (args.token === 'brokenCookie') {
      return Promise.reject(new Error(RPCClient.fakeErrorMessage))
    }
    return Promise.resolve(RPCClient.fakeSession)
  } else if (name === 'create') {
    if (args.session.broken === true) {
      return Promise.reject(new Error(RPCClient.fakeErrorMessage))
    }
    return Promise.resolve({ token: RPCClient.fakeAccessToken })
  } else if (name === 'update') {
    if (args.session.broken === true) {
      return Promise.reject(new Error(RPCClient.fakeErrorMessage))
    }
    return Promise.resolve('OK')
  } else if (name === 'destroy') {
    if (args.token === 'brokenToken') {
      return Promise.reject(new Error(RPCClient.fakeErrorMessage))
    }
    return Promise.resolve('OK')
  }
})
module.exports = RPCClient
