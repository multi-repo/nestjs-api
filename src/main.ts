import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import * as cliColor from 'cli-color'
import { registerFastifyPlugins } from './session/fastify.config'
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

  registerFastifyPlugins(app)

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
