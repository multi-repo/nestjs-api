import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import * as argon from 'argon2'
import { AuthDto } from './dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { FastifyRequest } from 'fastify'
import { Users } from '@prisma/client'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signupLocal(dto: AuthDto, req: FastifyRequest): Promise<Users> {

    const existingUser = await this.prisma.users.findUnique({
      where: { username: dto.username, email: dto.email },
    })
    if (existingUser) {
      throw new BadRequestException('User already exists')
    }


    const hash = await argon.hash(dto.password)
    dto.password = undefined


    const newUser = await this.prisma.users.create({
      data: { ...dto, hash: hash },
    })


    await this.saveSession(req, newUser)

    return newUser
  }

  async ValidateUser(dto: AuthDto): Promise<Users> {
    const user = await this.prisma.users.findUnique({
      where: { username: dto.username },
    })
    if (!user) throw new ForbiddenException('Access Denied')

    const passwordMatches = await argon.verify(user.hash, dto.password)
    if (!passwordMatches) throw new ForbiddenException('Access Denied')

    return user
  }

  async signinLocal(dto: AuthDto, req: FastifyRequest): Promise<Users> {
    const user = await this.ValidateUser(dto)
    await this.saveSession(req, user, dto.remember)
    return user
  }

  async logout(req: FastifyRequest): Promise<boolean> {
    await this.destroySession(req)
    return true
  }

  async ValidateOAuthUser(dto: AuthDto, req: FastifyRequest): Promise<Users> {
    const user = await this.prisma.users.findUnique({
      where: { username: dto.username, email: dto.email },
    })
    if (user) {
      await this.saveSession(req, user, true)
      return user
    }


    const hash = await argon.hash(dto.password)
    dto.password = undefined
    const newUser = await this.prisma.users.create({
      data: { ...dto, hash: hash },
    })

    if (newUser) {
      await this.saveSession(req, newUser, true)
      return newUser
    }
    throw new BadRequestException('OAuth validation failed')
  }

  private async saveSession(
    req: FastifyRequest,
    user: Users,
    remember?: boolean,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {

      if (remember) {
        req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30 // 30 дней
      } else {
        req.session.cookie.maxAge = 1000 * 60 * 10 // 10 минут
      }

      req.session.user = { ...user }
      req.session.save((err) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  }

  private async destroySession(req: FastifyRequest): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (req.session) {
        req.session.destroy((err) => {
          if (err) {
            reject(err)
          } else {
            resolve(true)
          }
        })
      } else {
        reject(new Error('Session handling is not available'))
      }
    })
  }
}
