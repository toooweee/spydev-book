import { Controller, Get, Res, UnauthorizedException } from '@nestjs/common';
import { TokenService } from './token.service';
import { Response } from 'express';
import { REFRESH_TOKEN } from './constants';
import { Cookie, Public, UserAgent } from '@app/common/decorators';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Public()
@Controller('token')
export class TokenController {
    constructor(private readonly tokenService: TokenService) {}

    @Get('refresh')
    @ApiOperation({ summary: 'Обновление токенов (refresh tokens)' })
    @ApiHeader({
        name: 'User-Agent',
        description: 'Заголовок User-Agent браузера пользователя',
        required: true,
    })
    @ApiResponse({
        status: 200,
        description:
            'Токены успешно обновлены. Возвращает новый accessToken и refreshToken. RefreshToken также устанавливается в cookie.',
    })
    @ApiResponse({
        status: 401,
        description: 'Refresh токен отсутствует, недействителен или истёк. В этом случае возвращается Unauthorized.',
    })
    async refreshTokens(@Cookie(REFRESH_TOKEN) refreshToken: string, @Res() res: Response, @UserAgent() agent: string) {
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token missing');
        }

        try {
            const tokens = await this.tokenService.refreshTokens(refreshToken, agent);
            this.setRefreshTokenCookie(tokens.refreshToken, res);
            res.json(tokens);
        } catch (error) {
            console.error('Refresh token error:', error);
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    private setRefreshTokenCookie(token: string, res: Response) {
        res.cookie(REFRESH_TOKEN, token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
            path: '/',
        });
    }
}
