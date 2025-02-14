import { $Enums, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponse implements User {
    roles: $Enums.Role;
    id: string;
    email: string;

    @Exclude()
    password: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(user: User) {
        Object.assign(this, user);
    }
}
