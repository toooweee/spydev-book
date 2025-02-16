import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        description: 'Email пользователя',
        example: 'admin@example.com',
    })
    @IsEmail()
    @IsString()
    email: string;

    @ApiProperty({
        description: 'Пароль пользователя (минимум 5 символов)',
        example: 'admin123',
    })
    @IsString()
    @MinLength(5)
    password: string;
}
