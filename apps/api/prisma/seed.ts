const { hash, genSalt } = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedDatabase() {
    const plainPassword = 'admin123';
    const saltRounds = 10;

    try {
        // Генерация соли и хэша асинхронно
        const salt = await genSalt(saltRounds);
        const hashedPassword = await hash(plainPassword, salt);

        const user = await prisma.user.upsert({
            where: { email: 'admin@example.com' },
            update: {},
            create: {
                email: 'admin@example.com',
                password: hashedPassword,
                name: 'Admin',
                surname: 'User',
                phoneNumber: '1234567890',
                roles: 'ADMIN',
                government: null,
                governmentName: null,
            },
        });

        console.log('Admin user created or updated:', user);
    } catch (e) {
        console.error('Error during user creation:', e);
    }

    console.log('Admin user created (if not exists already)');
}

seedDatabase()
    .catch((error) => {
        console.error('Error during seeding:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
