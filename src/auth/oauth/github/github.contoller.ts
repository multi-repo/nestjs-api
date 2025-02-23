import { Controller, Get, Query, Req, Res } from '@nestjs/common'
import { GithubOAuthService } from './github.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { FastifyRequest, FastifyReply } from 'fastify'

@Controller('auth/github')
export class GithubController {
  constructor(private readonly githubOAuthService: GithubOAuthService) {}

  @ApiTags('OAuth2-github')
  @ApiOperation({ summary: 'login with github account' })
  @Get('login')
  async githubLogin(@Res() res: FastifyReply) {
    const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_CALLBACK_URL}&scope=user:email`
    return res.redirect(url, 302)
  }

  @ApiTags('OAuth2-github')
  @ApiOperation({ summary: 'Github callback' })
  @Get('callback')
  async githubCallback(
    @Query('code') code: string,
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
  ) {
    try {
      await this.githubOAuthService.authenticate(code, req)
      return res.redirect('/auth/status', 302) // переадресация на статус
    } catch (error) {
      console.error('GitHub OAuth callback error:', error)

      return res.status(error.status || 500).send({ message: error.message })
    }
  }
}
