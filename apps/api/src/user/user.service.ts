import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Role, User } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(user: Partial<User>) {
        const hashedPassword = this.hashPassword(user.password);

        return this.prismaService.user.create({
            data: {
                email: user.email,
                password: hashedPassword,
                roles: 'USER',
            },
        });
    }

    findAll() {
        return this.prismaService.user.findMany();
    }

    async findOne(idOrEmail: string) {
        const user =  this.prismaService.user.findFirst({
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
            where: { id }, select: { id: true },
        });
    }

    private hashPassword(password: string) {
        return hashSync(password, genSaltSync(10));
    }
}
