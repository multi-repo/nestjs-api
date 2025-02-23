import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cliColor from 'cli-color'
import { registerFastifyPlugins } from './session/fastify.config'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
// import * as mercurius from 'mercurius'

async function bootstrap() {
  try {
    console.log(cliColor.green('✅ Starting NestJS (Fastify) application...'))
    console.log()

    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
    )

    registerFastifyPlugins(app)

    // app.register(mercurius, {
    //   schema: schema,
    //   resolvers: resolvers,
    //   graphiql: true,
    // });

    // Запуск приложения
    await app.listen(3000, '0.0.0.0')
    console.log(
      cliColor.blue(`🌐 Application is running on: http://localhost:3000`),
    )
  } catch (error) {
    console.error(cliColor.red('❌ Error during bootstrap:'), error)
    process.exit(1)
  }
}

bootstrap()
