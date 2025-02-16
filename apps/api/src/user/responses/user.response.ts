import { Exclude } from 'class-transformer';
import { $Enums, User } from '@prisma/client';

export class UserResponse implements User {
    id: string;
    email: string;
    government: string | null; // Теперь тип string | null
    governmentName: string | null; // Теперь тип string | null
    name: string;
    surname: string;
    phoneNumber: string;
    roles: $Enums.Role;
    createdAt: Date;
    updatedAt: Date;

    @Exclude()
    password: string;

    constructor(user: User) {
        Object.assign(this, user);
    }
}
