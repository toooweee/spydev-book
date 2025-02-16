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
import { UserResponse } from './responses';
import { CurrentUser, Roles } from '@app/common/decorators';
import { JwtPayload } from '../auth/interfaces';
import { RolesGuard } from '../auth/guards/role.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRegisterRequestDto } from './dto/create-register-request.dto';
import { Public } from '@app/common/decorators';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

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

    @Public()
    @Post('/registration-request')
    @ApiOperation({ summary: 'Отправить заявку на регистрацию' })
    @ApiResponse({
        status: 201,
        description: 'Заявка успешно отправлена',
        type: CreateRegisterRequestDto,
    })
    async createRegistrationRequest(@Body() createRegisterRequestDto: CreateRegisterRequestDto) {
        return this.userService.createRegistrationRequest(createRegisterRequestDto);
    }

    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Get('/registration-request')
    @ApiOperation({ summary: 'Получить все заявки на рег' })
    @ApiResponse({
        status: 200,
        description: 'Все заявки на регистрацию',
    })
    async getAll() {
        return this.userService.getAllRequests();
    }


    // 2. Одобрение заявки (только для админа)
    @Patch('/registration-request/:id/approve')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Одобрить заявку на регистрацию' })
    async approveRegistrationRequest(@Param('id', ParseUUIDPipe) requestId: string) {
        return this.userService.approveRegistrationRequest(requestId);
    }

    // 3. Отклонение заявки (только для админа)
    @Patch('/registration-request/:id/reject')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Отклонить заявку на регистрацию' })
    async rejectRegistrationRequest(
        @Param('id', ParseUUIDPipe) requestId: string,
        @Body('adminComment') adminComment: string,
    ) {
        return this.userService.rejectRegistrationRequest(requestId, adminComment);
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
