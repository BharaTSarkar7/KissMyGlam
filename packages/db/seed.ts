import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Categories and Subtypes
  const categoryDresses = await prisma.category.upsert({
    where: { slug: 'dresses' },
    update: {},
    create: {
      name: 'Dresses',
      slug: 'dresses',
      imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
      sortOrder: 1,
      subtypes: {
        create: [
          { name: 'Midi', slug: 'midi', sortOrder: 1 },
          { name: 'Mini', slug: 'mini', sortOrder: 2 },
          { name: 'Gown', slug: 'gown', sortOrder: 3 },
        ],
      },
    },
    include: { subtypes: true },
  });

  const categoryTops = await prisma.category.upsert({
    where: { slug: 'tops' },
    update: {},
    create: {
      name: 'Tops',
      slug: 'tops',
      imageUrl: 'https://images.unsplash.com/photo-1550639525-c97d455acf70?q=80&w=800&auto=format&fit=crop',
      sortOrder: 2,
      subtypes: {
        create: [
          { name: 'T-Shirts', slug: 't-shirts', sortOrder: 1 },
          { name: 'Blouses', slug: 'blouses', sortOrder: 2 },
          { name: 'Crop Tops', slug: 'crop-tops', sortOrder: 3 },
          { name: 'Tank Tops', slug: 'tank-tops', sortOrder: 4 },
          { name: 'Shirts', slug: 'shirts', sortOrder: 5 },
          { name: 'Halter Tops', slug: 'halter-tops', sortOrder: 6 },
          { name: 'Cami Tops', slug: 'cami-tops', sortOrder: 7 },
        ],
      },
    },
    include: { subtypes: true },
  });

  const categoryBottomwear = await prisma.category.upsert({
    where: { slug: 'bottomwear' },
    update: {},
    create: {
      name: 'Bottomwear',
      slug: 'bottomwear',
      imageUrl: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=800&auto=format&fit=crop',
      sortOrder: 3,
      subtypes: {
        create: [
          { name: 'Jeans', slug: 'jeans', sortOrder: 1 },
          { name: 'Trousers', slug: 'trousers', sortOrder: 2 },
          { name: 'Skirts', slug: 'skirts', sortOrder: 3 },
          { name: 'Shorts', slug: 'shorts', sortOrder: 4 },
        ],
      },
    },
    include: { subtypes: true },
  });

  const categoryWinterwear = await prisma.category.upsert({
    where: { slug: 'winterwear' },
    update: {},
    create: {
      name: 'Winterwear',
      slug: 'winterwear',
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
      sortOrder: 4,
      subtypes: {
        create: [
          { name: 'Jackets', slug: 'jackets', sortOrder: 1 },
          { name: 'Sweaters', slug: 'sweaters', sortOrder: 2 },
          { name: 'Coats', slug: 'coats', sortOrder: 3 },
          { name: 'Hoodies', slug: 'hoodies', sortOrder: 4 },
          { name: 'Cardigans', slug: 'cardigans', sortOrder: 5 },
        ],
      },
    },
    include: { subtypes: true },
  });

  // Helper to find subtype ID
  const getSubtypeId = (category: any, slug: string) => category.subtypes.find((s: any) => s.slug === slug)?.id;

  // 2. Create Products
  const products = [
    // Dresses
    {
      name: 'Silk Midi Dress',
      slug: 'silk-midi-dress',
      description: 'Elegant silk midi dress for evening wear.',
      price: 129.00,
      categoryId: categoryDresses.id,
      subtypeId: getSubtypeId(categoryDresses, 'midi'),
      sizes: ['S', 'M', 'L'],
      colours: ['Black', 'Emerald'],
      isFeatured: true,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop', altText: 'Silk Midi Dress', isPrimary: true },
        ],
      },
    },
    {
      name: 'Floral Mini Dress',
      slug: 'floral-mini-dress',
      description: 'Cute floral mini dress perfect for summer.',
      price: 65.00,
      categoryId: categoryDresses.id,
      subtypeId: getSubtypeId(categoryDresses, 'mini'),
      sizes: ['XS', 'S', 'M', 'L'],
      colours: ['Red Floral', 'Blue Floral'],
      isFeatured: false,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop', altText: 'Floral Mini Dress', isPrimary: true },
        ],
      },
    },
    // Tops
    {
      name: 'Cotton Basic T-Shirt',
      slug: 'cotton-basic-t-shirt',
      description: 'Comfortable everyday cotton tee.',
      price: 25.00,
      categoryId: categoryTops.id,
      subtypeId: getSubtypeId(categoryTops, 't-shirts'),
      sizes: ['S', 'M', 'L', 'XL'],
      colours: ['White', 'Black', 'Grey'],
      isFeatured: false,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop', altText: 'White Cotton T-Shirt', isPrimary: true },
        ],
      },
    },
    {
      name: 'Linen Wrap Blouse',
      slug: 'linen-wrap-blouse',
      description: 'Breathable linen wrap blouse for a chic look.',
      price: 55.00,
      categoryId: categoryTops.id,
      subtypeId: getSubtypeId(categoryTops, 'blouses'),
      sizes: ['S', 'M', 'L'],
      colours: ['Beige', 'Navy'],
      isFeatured: true,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?q=80&w=800&auto=format&fit=crop', altText: 'Linen Wrap Blouse', isPrimary: true },
        ],
      },
    },
    // Bottomwear
    {
      name: 'High-Waisted Wide Leg Jeans',
      slug: 'high-waisted-wide-leg-jeans',
      description: 'Trendy high-waisted jeans with a comfortable wide leg.',
      price: 85.00,
      categoryId: categoryBottomwear.id,
      subtypeId: getSubtypeId(categoryBottomwear, 'jeans'),
      sizes: ['26', '28', '30', '32'],
      colours: ['Light Blue', 'Vintage Wash'],
      isFeatured: true,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop', altText: 'Wide Leg Jeans', isPrimary: true },
        ],
      },
    },
    {
      name: 'Tailored Linen Trousers',
      slug: 'tailored-linen-trousers',
      description: 'Smart and lightweight tailored trousers.',
      price: 75.50,
      categoryId: categoryBottomwear.id,
      subtypeId: getSubtypeId(categoryBottomwear, 'trousers'),
      sizes: ['S', 'M', 'L'],
      colours: ['Sand', 'Olive'],
      isFeatured: false,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop', altText: 'Tailored Trousers', isPrimary: true },
        ],
      },
    },
    // Winterwear
    {
      name: 'Oversized Wool Coat',
      slug: 'oversized-wool-coat',
      description: 'Keep warm in style with this oversized wool blend coat.',
      price: 199.00,
      categoryId: categoryWinterwear.id,
      subtypeId: getSubtypeId(categoryWinterwear, 'coats'),
      sizes: ['S', 'M', 'L'],
      colours: ['Camel', 'Charcoal'],
      isFeatured: true,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=800&auto=format&fit=crop', altText: 'Wool Coat', isPrimary: true },
        ],
      },
    },
    {
      name: 'Chunky Knit Cardigan',
      slug: 'chunky-knit-cardigan',
      description: 'Cozy up with this hand-knitted chunky cardigan.',
      price: 110.00,
      categoryId: categoryWinterwear.id,
      subtypeId: getSubtypeId(categoryWinterwear, 'cardigans'),
      sizes: ['One Size'],
      colours: ['Cream', 'Dusty Pink'],
      isFeatured: false,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop', altText: 'Chunky Cardigan', isPrimary: true },
        ],
      },
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
