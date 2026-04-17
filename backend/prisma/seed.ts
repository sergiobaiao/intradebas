import { PrismaClient, SponsorshipLevel, SportCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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

