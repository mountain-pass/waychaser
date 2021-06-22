import assert from 'assert'

assert(process.env.API_PORT, "'API_PORT' environment variable must be set")
export const API_PORT = Number.parseInt(process.env.API_PORT)

export const API_HOST = 'localhost'
