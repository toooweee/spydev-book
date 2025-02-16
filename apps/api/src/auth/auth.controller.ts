import { Controller, Post, Body, Res, BadRequestException, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { REFRESH_TOKEN } from '../token/constants';
import { RegisterDto } from './dto/register.dto';
import { Cookie, Public, UserAgent } from '@app/common/decorators';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Public()
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: 'Вход пользователя (login)' })
    @ApiResponse({
        status: 200,
        description:
            'Успешная аутентификация. Возвращает accessToken и refreshToken. RefreshToken также устанавливается в cookie.',
    })
    @ApiResponse({ status: 400, description: 'Неверные входные данные' })
    @ApiResponse({ status: 401, description: 'Неверный email или пароль' })
    async login(@Body() loginDto: LoginDto, @Res() res: Response, @UserAgent() agent: string) {
        const tokens = await this.authService.login(loginDto, agent);
        res.cookie(REFRESH_TOKEN, tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: '/',
        });
        res.json(tokens);
    }

    @Post('register')
    @ApiOperation({ summary: 'Регистрация нового пользователя' })
    @ApiResponse({
        status: 201,
        description: 'Пользователь успешно зарегистрирован',
    })
    @ApiResponse({ status: 400, description: 'Ошибка регистрации' })
    @ApiResponse({
        status: 409,
        description: 'Пользователь с таким email уже существует',
    })
    async resister(@Body() registerDto: RegisterDto) {
        const user = await this.authService.register(registerDto);

        if (!user) {
            throw new BadRequestException('An error occurred during user registration');
        }

        return user;
    }

    @Post('logout')
    @ApiOperation({ summary: 'Выход пользователя (logout)' })
    @ApiResponse({
        status: 200,
        description:
            'Пользователь успешно вышел из системы. Если refreshToken присутствует – производится его аннулирование и очистка cookie.',
    })
    @Post('logout')
    async logout(@Cookie(REFRESH_TOKEN) refreshToken: string, @Res() res: Response) {
        if (!refreshToken) {
            res.sendStatus(HttpStatus.OK).json();
            return;
        }

        await this.authService.logout(refreshToken);
        res.cookie(REFRESH_TOKEN, '', {
            httpOnly: true,
            secure: false,
            expires: new Date(),
        });
        res.sendStatus(HttpStatus.OK).json();
    }
}
