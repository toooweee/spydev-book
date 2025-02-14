import { ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { TokenService } from '../token/token.service';
import { compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(private readonly userService: UserService, private readonly tokenService: TokenService) {}

    async register(registerDto: RegisterDto) {
        const existingUser = await this.userService.findOne(registerDto.email);
        if (existingUser) {
            this.logger.error(`User with email ${registerDto.email} already exists`);
            throw new ConflictException('User already exists');
        }

        try {
            return await this.userService.create(registerDto);
        } catch (error) {
            this.logger.error(`Failed to create user: ${error.message}`);
            throw new ConflictException('Registration failed');
        }
    }

    async login(loginDto: LoginDto, agent: string) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        return this.tokenService.generateTokens(user, agent);
    }

    logout(token: string) {
        return this.tokenService.deleteRefreshToken(token)
    }

    private async validateUser(email: string, password: string) {
        const user = await this.userService.findOne(email);

        if (!user) {
            this.logger.error(`User with email ${email} not found`);
            throw new NotFoundException('Invalid credentials');
        }

        if (!this.comparePassword(password, user.password)) {
            this.logger.error(`Invalid password for user ${email}`);
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }

    private comparePassword(password: string, hash: string): boolean {
        return compareSync(password, hash);
    }
}
