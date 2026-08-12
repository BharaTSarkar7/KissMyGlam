import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: { images: true },
    where: { isActive: true }
  });
  const withMultiple = products.find(p => p.images.length > 1);
  if (withMultiple) {
    console.log(`Found product: ${withMultiple.slug}`);
  } else {
    console.log("No product with multiple images found.");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
