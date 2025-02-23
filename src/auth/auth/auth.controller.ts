import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'

import { AuthService } from './auth.service'
import { AuthDto } from './dto'
import { AtGuard } from './guards'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { FastifyRequest } from 'fastify'
import { FastifyReply } from 'fastify'
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiTags('Auth')
  @ApiOperation({ summary: 'Register new account' })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async signupLocal(
    @Body() dto: AuthDto,
    @Req() req: FastifyRequest,
  ): Promise<any> {
    return await this.authService.signupLocal(dto, req)
  }

  @ApiTags('Auth')
  @ApiOperation({ summary: 'Sign in' })
  @Post('login')
  @HttpCode(200)
  @HttpCode(HttpStatus.OK)
  async signinLocal(
    @Body() dto: AuthDto,
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
  ): Promise<any> {
    await this.authService.signinLocal(dto, req)
    return res.redirect('/auth/status')
  }

  @ApiTags('Auth')
  @ApiOperation({ summary: 'Get session status' })
  @ApiBearerAuth()
  @Get('status')
  @UseGuards(AtGuard)
  @HttpCode(200)
  async status(@Req() req: FastifyRequest) {
    return req.session.user
  }

  @ApiTags('Auth')
  @ApiOperation({ summary: 'Destroy session' })
  @ApiBearerAuth()
  @Get('logout')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: FastifyRequest): Promise<boolean> {
    return await this.authService.logout(req)
  }
}
