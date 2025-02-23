import '@fastify/session'

declare module 'fastify' {
  interface Session {
    user?: any
  }
}
