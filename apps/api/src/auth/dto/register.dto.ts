import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        description: 'Email пользователя',
        example: 'user@example.com',
    })
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Орган местного самоуправления',
        example: 'ООО',
    })
    government: string;

    @ApiProperty({
        description: 'Наименование органа',
        example: 'Физкульт',
    })
    governmentName: string;

    @IsNotEmpty()
    @ApiProperty({
        description: 'Имя',
        example: 'Олег',
    })
    name: string;

    @IsNotEmpty()
    @ApiProperty({
        description: 'Фамилия',
        example: 'Олегов',
    })
    surname: string;

    @IsPhoneNumber()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty({
        description: 'Пароль нового пользователя (минимум 5 символов)',
        example: 'securePassword',
    })
    @IsString()
    @MinLength(5)
    password: string;
}
