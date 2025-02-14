import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        description: 'Email нового пользователя',
        example: 'newuser@example.com',
    })
    @IsEmail()
    @IsString()
    email: string;

    @ApiProperty({
        description: 'Пароль нового пользователя (минимум 5 символов)',
        example: 'securePassword',
    })
    @IsString()
    @MinLength(5)
    password: string;
}
