import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseUUIDPipe,
    UseInterceptors,
    ClassSerializerInterceptor,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponse } from './responses';
import { CurrentUser, Roles } from '@app/common/decorators';
import { JwtPayload } from '../auth/interfaces';
import { RolesGuard } from '../auth/guards/role.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: 'Создание нового пользователя' })
    @ApiResponse({
        status: 201,
        description: 'Пользователь успешно создан',
        type: CreateUserDto,
    })
    @UseInterceptors(ClassSerializerInterceptor)
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        const user = await this.userService.create(createUserDto);
        return new UserResponse(user);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    @ApiOperation({ summary: 'Получение списка всех пользователей' })
    @ApiResponse({
        status: 200,
        description: 'Возвращает массив пользователей',
        type: [UserResponse],
    })
    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    async findAll() {
        const result = [];
        const users = await this.userService.findAll();

        users.forEach((user) => {
            result.push(new UserResponse(user));
        });

        return result;
    }

    @Get('me')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Получение данных текущего пользователя (только для ADMIN)' })
    @ApiResponse({
        status: 200,
        description: 'Возвращает информацию о текущем пользователе',
    })
    me(@CurrentUser() user: JwtPayload) {
        return user;
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':id')
    @ApiOperation({ summary: 'Получение информации о пользователе по id или email' })
    @ApiResponse({
        status: 200,
        description: 'Возвращает данные пользователя',
        type: UserResponse,
    })
    async findOne(@Param('id') idOrEmail: string) {
        const user = await this.userService.findOne(idOrEmail);
        return new UserResponse(user);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Patch(':id')
    @ApiOperation({ summary: 'Обновление данных пользователя по id' })
    @ApiResponse({
        status: 200,
        description: 'Пользователь успешно обновлён',
    })
    async update(@Param('id', ParseUUIDPipe) id: string) {
        return this.userService.update(id);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Delete(':id')
    @ApiOperation({ summary: 'Удаление пользователя по id' })
    @ApiResponse({
        status: 200,
        description: 'Пользователь успешно удалён',
    })
    async delete(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
        return this.userService.delete(id, user);
    }
}
