import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();
const defaultPasswordHash = hashSync('123456', 10);

async function main() {
  const users = [
    {
      username: 'admin',
      passwordHash: defaultPasswordHash,
      fullName: 'System Administrator',
      role: 'admin' as const,
      status: 'active' as const,
    },
    {
      username: 'reviewer',
      passwordHash: defaultPasswordHash,
      fullName: 'Default Reviewer',
      role: 'reviewer' as const,
      status: 'active' as const,
    },
    {
      username: 'operator',
      passwordHash: defaultPasswordHash,
      fullName: 'Default Operator',
      role: 'operator' as const,
      status: 'active' as const,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { username: user.username },
      update: {
        fullName: user.fullName,
        role: user.role,
        status: user.status,
      },
      create: user,
    });
  }
}

main()
  .catch(async (error) => {
    console.error('Prisma seed failed.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
