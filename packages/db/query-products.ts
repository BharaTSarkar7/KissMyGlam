import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      subtype: true,
      images: {
        where: { isPrimary: true },
        take: 1
      }
    }
  });

  console.log('--- PRODUCT DETAILS ---');
  products.forEach(p => {
    console.log(`Name: ${p.name}`);
    console.log(`Price: $${p.price.toString()}`);
    console.log(`Category: ${p.category.name}`);
    console.log(`Subtype: ${p.subtype?.name || 'None'}`);
    console.log(`First Image URL: ${p.images[0]?.url || 'No image'}`);
    console.log('-----------------------');
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
