import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { TokenModule } from '../token/token.module';
import { STRATEGIES } from './strategies';
import { GUARDS } from './guards';

@Module({
    controllers: [AuthController],
    providers: [AuthService, ...STRATEGIES, ...GUARDS],
    imports: [PassportModule, UserModule, TokenModule],
})
export class AuthModule {}
