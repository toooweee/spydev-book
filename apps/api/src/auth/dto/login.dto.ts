import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        description: 'Email пользователя',
        example: 'user@example.com',
    })
    @IsEmail()
    @IsString()
    email: string;

    @ApiProperty({
        description: 'Пароль пользователя (минимум 5 символов)',
        example: 'password123',
    })
    @IsString()
    @MinLength(5)
    password: string;
}
