import assert from 'assert'

assert(
  process.env.API_PORT || process.env.npm_package_config_TEST_API_PORT,
  "'API_PORT' environment variable must be set"
)
export const API_PORT = Number.parseInt(
  process.env.API_PORT || process.env.npm_package_config_TEST_API_PORT
)

export const API_HOST = 'localhost'
