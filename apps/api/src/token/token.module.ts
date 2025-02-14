import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { options } from './config';
import { TokenController } from './token.controller';

@Module({
    imports: [JwtModule.registerAsync(options())],
    controllers: [TokenController],
    providers: [TokenService],
    exports: [TokenService],
})
export class TokenModule {}
