import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TokenModule } from './token/token.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { NextGisModule } from './next-gis/next-gis.module';
import { MailModule } from './mail/mail.module';

@Module({
    imports: [
        UserModule,
        PrismaModule,
        AuthModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TokenModule,
        NextGisModule,
        MailModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
