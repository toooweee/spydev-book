import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { v4 } from 'uuid';
import { add } from 'date-fns';
import { User } from '@prisma/client';
import { Tokens } from './interfaces';

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService, private readonly prismaService: PrismaService) {}

    async generateTokens(user: User, agent: string): Promise<Tokens> {
        const accessToken = this.generateAccessToken(user);
        const refreshToken = await this.createRefreshToken(user.id, agent);

        return {
            accessToken: `Bearer ${accessToken}`,
            refreshToken,
        };
    }

    async refreshTokens(refreshToken: string, agent: string): Promise<Tokens> {
        const token = await this.prismaService.token.findUnique({
            where: { token: refreshToken },
        });

        if (!token) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        await this.prismaService.token.delete({
            where: { token: token.token },
        });

        if (token.exp < new Date()) {
            throw new UnauthorizedException('Refresh token expired');
        }

        const user = await this.prismaService.user.findUnique({
            where: { id: token.userId },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return this.generateTokens(user, agent);
    }

    deleteRefreshToken(token: string) {
        return this.prismaService.token.delete({
            where: { token: token },
        })
    }

    private generateAccessToken(user: User): string {
        return this.jwtService.sign({
            id: user.id,
            email: user.email,
            roles: user.roles,
        });
    }

    private async createRefreshToken(userId: string, agent: string): Promise<string> {
        const tokenV4 = v4();
        const exp = add(new Date(), { months: 1 });

        await this.prismaService.token.upsert({
            where: {
                userId_userAgent: {
                    userId,
                    userAgent: agent,
                },
            },
            update: {
                token: tokenV4,
                exp,
            },
            create: {
                token: tokenV4,
                exp,
                userId,
                userAgent: agent,
            },
        });

        return tokenV4;
    }
}
