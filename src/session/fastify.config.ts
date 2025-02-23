import * as fastifyCookie from '@fastify/cookie'
import * as fastifySession from '@fastify/session'
import * as fastifyCors from '@fastify/cors'
import { customRedisStore } from './redis.provider'

export function registerFastifyPlugins(app) {
  app.register(fastifyCors, {
    origin: ['http://127.0.0.1:9000', 'http://localhost:9000'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  })

  app.register(fastifyCookie)

  app.register(fastifySession, {
    secret: process.env.SESSION_SECRET || 'supersecret',
    saveUninitialized: false,
    cookie: {
      sameSite: 'lax',
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
    store: customRedisStore,
  })
}
