# session-manager

[![Build Status](https://travis-ci.org/bufferapp/session-manager.svg?branch=master)](https://travis-ci.org/bufferapp/session-manager)

Buffer session manager

## Configuration via environment variables

### `SESSION_SERVICE_REDIRECT_URL` (optional)

* Defines the location for the redirect response for invalid sessions.
* Default value is `https://login.buffer.com` in production and `https://login.local.buffer.com` in development
### `SESSION_SERVICE_URL` (optional)

* Defines the internal URL to the `session-service`.
* Defaults to `http://session-service-1.core` in production and `http://session-service-1:3000` in development.

## Env Presets

Targets node and browsers with > 3% market share. See this tweet for more context:

https://twitter.com/jamiebuilds/status/1022568918949408768
