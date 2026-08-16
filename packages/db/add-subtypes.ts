import { prisma } from "./index";

async function main() {
  const dresses = await prisma.category.findUnique({ where: { slug: "dresses" } });
  
  if (!dresses) {
    console.error("Dresses category not found");
    process.exit(1);
  }

  const existingMaxi = await prisma.subtype.findFirst({ where: { categoryId: dresses.id, slug: "maxi" } });
  if (!existingMaxi) {
    await prisma.subtype.create({
      data: { categoryId: dresses.id, name: "Maxi", slug: "maxi", sortOrder: 3 }
    });
    console.log("Added Maxi");
  } else {
    console.log("Maxi already exists");
  }

  const existingJumpsuit = await prisma.subtype.findFirst({ where: { categoryId: dresses.id, slug: "jumpsuit" } });
  if (!existingJumpsuit) {
    await prisma.subtype.create({
      data: { categoryId: dresses.id, name: "Jumpsuit", slug: "jumpsuit", sortOrder: 4 }
    });
    console.log("Added Jumpsuit");
  } else {
    console.log("Jumpsuit already exists");
  }

  console.log("Done");
}

main().catch(console.error);
