import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prismaClient = new PrismaClient();

async function createSuperAdminUser(): Promise<void> {
  const passwordHash = await hash('123456', 8);

  const user = {
    firstName: 'admin',
    lastName: '',
    email: 'admin@admin.com',
    password: passwordHash,
  };

  const adminAlreadyExists = await prismaClient.user.findUnique({
    where: {
      email: user.email,
    },
  });

  if (adminAlreadyExists) {
    return;
  }

  await prismaClient.user.create({
    data: user,
  });
}

async function seedDatabase(): Promise<void> {
  try {
    await createSuperAdminUser();
  } catch (error) {
    console.error(
      'Seed Error: Error when trying to populate the database',
      error,
    );
  } finally {
    prismaClient.$disconnect();
  }
}

seedDatabase();
