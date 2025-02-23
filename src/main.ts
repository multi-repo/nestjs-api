import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import * as cliColor from 'cli-color'
import IORedis from 'ioredis'
import * as fastifyCookie from '@fastify/cookie'
import * as fastifySession from '@fastify/session'
import * as fastifyCors from '@fastify/cors'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'

async function bootstrap() {
  console.log(cliColor.green('✅ Starting NestJS (Fastify) application...'))
  console.log()

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  await app.register(fastifyCors, {
    origin: ['http://127.0.0.1:9000', 'http://localhost:9000'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  })

  await app.register(fastifyCookie)

  const redis = new IORedis('redis://localhost:6379', {
    lazyConnect: true,
    connectTimeout: 5000,
    maxRetriesPerRequest: 3,
  })

  await redis.ping()

  redis.on('error', (err) => {
    console.error('Ошибка Redis:', err)
  })

  redis.on('connect', () => {
    console.log('Подключение к Redis успешно!')
  })

  redis.on('pong', (message) => {
    console.log('Redis ответил на ping:', message)
  })

  redis.on('monitor', (time, args) => {
    console.log('Redis команда:', time, args)
  })

  const customRedisStore = {
    get(sid: string, callback: (err?: any, session?: any) => void) {
      redis.get(`session:${sid}`, (err, data) => {
        if (err) return callback(err)
        if (!data) return callback()
        try {
          const session = JSON.parse(data)
          callback(null, session)
        } catch (error) {
          callback(error)
        }
      })
    },
    set(sid: string, session: any, callback: (err?: any) => void) {
      const ttl =
        session.cookie && session.cookie.maxAge
          ? Math.floor(session.cookie.maxAge / 1000)
          : 24 * 60 * 60
      redis.set(`session:${sid}`, JSON.stringify(session), 'EX', ttl, (err) => {
        callback(err)
      })
    },
    destroy(sid: string, callback: (err?: any) => void) {
      redis.del(`session:${sid}`, (err) => {
        callback(err)
      })
    },
  }

  await app.register(fastifySession, {
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

  const config = new DocumentBuilder()
    .setTitle('NestJS Fastify API')
    .setDescription(
      `
      NestJS boilerplate with Fastify
      PrismaORM 
      Postgres 
      Fastify-session & Redis
    `,
    )
    .setVersion('1.0.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app as any, document)

  await app.listen(3000, '0.0.0.0')

  console.log(
    cliColor.blue(`🌐 Application is running on: http://localhost:3000`),
  )
}

bootstrap().catch((error) => {
  console.error(cliColor.red('❌ Error during bootstrap:'), error)
  process.exit(1)
})
