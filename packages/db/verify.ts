import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany({
    include: {
      subtypes: true,
      _count: {
        select: { products: true }
      }
    },
    orderBy: { sortOrder: 'asc' }
  });

  console.log('--- DATABASE VERIFICATION ---');
  categories.forEach(cat => {
    console.log(`\nCategory: ${cat.name} (${cat.slug})`);
    console.log(`Subtypes: ${cat.subtypes.map(s => s.name).join(', ')}`);
    console.log(`Products: ${cat._count.products}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
