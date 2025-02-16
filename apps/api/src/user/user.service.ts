import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, User } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';
import { CreateRegisterRequestDto } from './dto/create-register-request.dto';
import { MailService } from '../mail/mail.service';
import { randomBytes } from 'crypto';

@Injectable()
export class UserService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService,
    ) {}

    async create(user: Partial<User>) {
        const hashedPassword = this.hashPassword(user.password);
        return this.prismaService.user.create({
            data: {
                email: user.email,
                password: hashedPassword,
                name: user.name,
                surname: user.surname,
                phoneNumber: user.phoneNumber,
                government: user.government,
                governmentName: user.governmentName,
                roles: 'USER',
            },
        });
    }

    findAll() {
        return this.prismaService.user.findMany();
    }

    async findOne(idOrEmail: string) {
        const user = this.prismaService.user.findFirst({
            where: {
                OR: [{ id: idOrEmail }, { email: idOrEmail }],
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    update(id: string) {
        // return this.prismaService.user.update();
    }

    delete(id: string, user) {
        if (user.id !== id && !user.roles.includes(Role.ADMIN)) {
            throw new ForbiddenException('');
        }

        return this.prismaService.user.delete({
            where: { id },
            select: { id: true },
        });
    }

    private hashPassword(password: string) {
        return hashSync(password, genSaltSync(10));
    }

    // requests

    async createRegistrationRequest(dto: CreateRegisterRequestDto) {
        // Проверяем, существует ли уже заявка с таким email
        const existingRequest = await this.prismaService.registrationRequest.findUnique({
            where: { email: dto.email },
        });
        if (existingRequest) {
            throw new ForbiddenException('Заявка с таким email уже существует');
        }
        return this.prismaService.registrationRequest.create({
            data: {
                email: dto.email,
                government: dto.government,
                governmentName: dto.governmentName,
                name: dto.name,
                surname: dto.surname,
                phoneNumber: dto.phoneNumber,
            },
        });
    }

    // Одобрение заявки администратором
    async approveRegistrationRequest(requestId: string) {
        const request = await this.prismaService.registrationRequest.findUnique({
            where: { id: requestId },
        });
        if (!request) {
            throw new NotFoundException('Заявка не найдена');
        }

        // Генерация случайного пароля
        const password = randomBytes(8).toString('hex');
        const hashedPassword = this.hashPassword(password);

        // Создание пользователя на основании данных заявки
        const user = await this.prismaService.user.create({
            data: {
                email: request.email,
                password: hashedPassword,
                name: request.name,
                surname: request.surname,
                phoneNumber: request.phoneNumber,
                government: request.government,
                governmentName: request.governmentName,
                roles: 'USER',
            },
        });

        // Удаление заявки после успешного создания пользователя
        await this.prismaService.registrationRequest.delete({
            where: { id: requestId },
        });

        // Отправка письма с данными аккаунта
        await this.mailService.sendMail({
            from: 'bytoowee@yandex.ru',
            to: user.email,
            subject: 'Регистрация одобрена',
            text: `Ваш аккаунт был зарегистрирован.\nВаш пароль: ${password}`,
        });

        return user;
    }

    // Отклонение заявки администратором
    async rejectRegistrationRequest(requestId: string, adminComment?: string) {
        const request = await this.prismaService.registrationRequest.findUnique({
            where: { id: requestId },
        });
        if (!request) {
            throw new NotFoundException('Заявка не найдена');
        }
        // Обновление статуса заявки на REJECTED и сохранение комментария
        const updatedRequest = await this.prismaService.registrationRequest.update({
            where: { id: requestId },
            data: {
                status: 'REJECTED',
                adminComment: adminComment,
            },
        });
        // Отправка уведомления на почту
        await this.mailService.sendMail({
            from: 'bytoowee@yandex.ru',
            to: request.email,
            subject: 'Регистрация отклонена',
            text: `Ваша заявка на регистрацию была отклонена.${adminComment ? ' Комментарий: ' + adminComment : ''}`,
        });
        return updatedRequest;
    }
}
