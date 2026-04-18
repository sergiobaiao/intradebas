import { PrismaClient, SponsorshipLevel, SportCategory, UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await hash('admin123', 10);

  await prisma.team.createMany({
    data: [
      { name: 'Mucura', color: '#E63946', totalScore: 0 },
      { name: 'Jacare', color: '#2D6A4F', totalScore: 0 },
      { name: 'Capivara', color: '#E9C46A', totalScore: 0 },
    ],
    skipDuplicates: true,
  });

  await prisma.sport.createMany({
    data: [
      { name: 'Futsal', category: SportCategory.coletiva },
      { name: 'ALDEBARUN 5K', category: SportCategory.individual, isAldebarun: true },
      { name: 'Futevolei', category: SportCategory.dupla },
    ],
    skipDuplicates: true,
  });

  const sports = await prisma.sport.findMany({
    select: {
      id: true,
      category: true,
    },
  });

  const scoringRows = [
    ['coletiva', 1, 5],
    ['coletiva', 2, 3],
    ['coletiva', 3, 1],
    ['individual', 1, 3],
    ['individual', 2, 2],
    ['individual', 3, 1],
    ['dupla', 1, 3],
    ['dupla', 2, 2],
    ['dupla', 3, 1],
    ['fitness', 1, 2],
    ['fitness', 2, 1],
    ['fitness', 3, 0],
  ] as const;

  await prisma.sponsorshipQuota.createMany({
    data: [
      {
        level: SponsorshipLevel.bronze,
        price: 350,
        maxSlots: 8,
        courtesyCount: 2,
        benefits: 'Costas camisa + Backdrop',
        backdropPriority: 1,
      },
      {
        level: SponsorshipLevel.prata,
        price: 500,
        maxSlots: 4,
        courtesyCount: 3,
        benefits: 'Mangas camisa + Merchandising + Backdrop',
        backdropPriority: 2,
      },
      {
        level: SponsorshipLevel.ouro,
        price: 1000,
        maxSlots: 2,
        courtesyCount: 4,
        benefits: 'Frente camisa + Ativacao + Backdrop',
        backdropPriority: 3,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.user.upsert({
    where: {
      email: 'admin@intradebas.local',
    },
    update: {
      name: 'Administrador INTRADEBAS',
      role: UserRole.superadmin,
      isActive: true,
      passwordHash: adminPasswordHash,
    },
    create: {
      email: 'admin@intradebas.local',
      name: 'Administrador INTRADEBAS',
      role: UserRole.superadmin,
      isActive: true,
      passwordHash: adminPasswordHash,
    },
  });

  const admin = await prisma.user.findUniqueOrThrow({
    where: { email: 'admin@intradebas.local' },
    select: { id: true },
  });

  for (const [category, position, points] of scoringRows) {
    await prisma.scoringConfig.upsert({
      where: {
        id: `${category}-${position}`,
      },
      update: {
        points,
        updatedBy: admin.id,
      },
      create: {
        id: `${category}-${position}`,
        category,
        position,
        points,
        updatedBy: admin.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
