import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Req,
  Res,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { GoogleOAuthService } from './google.service'
import { FastifyRequest } from 'fastify'
import { FastifyReply } from 'fastify'

@ApiTags('OAuth2-google')
@Controller('auth')
export class OAuthController {
  constructor(private readonly googleService: GoogleOAuthService) {}

  @ApiTags('OAuth2-google')
  @ApiOperation({ summary: 'Google login' })
  @Get('google/login')
  async handleLogin(@Res() res: FastifyReply) {
    console.log('Google login route hit')
    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      response_type: 'code',
      scope: 'openid email profile',
    })

    const googleLoginUrl = `${baseUrl}?${params.toString()}`
    console.log('Redirecting to:', googleLoginUrl)
    return res.redirect(googleLoginUrl, 302)
  }

  @ApiTags('OAuth2-google')
  @ApiOperation({ summary: 'Google redirect url' })
  @Get('google/redirect')
  async handleRedirect(
    @Query('code') code: string,
    @Res() res: FastifyReply,
    @Req() req: FastifyRequest,
  ) {
    console.log('Session before authentication:', req.session)

    try {
      await this.googleService.authenticate(code, req)
      console.log('Session after authentication:', req.session)
      return res.redirect('/auth/status', 302)
    } catch (error) {
      console.error('Authentication error:', error)

      throw new HttpException(
        error.response?.data?.message || error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
