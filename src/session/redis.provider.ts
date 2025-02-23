import IORedis from 'ioredis'

const redisUri = process.env.REDIS_URI || 'redis://localhost:6379'

export const redis = new IORedis(redisUri, {
  lazyConnect: true,
  connectTimeout: 5000,
  maxRetriesPerRequest: 3,
})

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

export const customRedisStore = {
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
