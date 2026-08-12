import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

/**
 * One-off script to create the first AdminUser.
 *
 * Usage:
 *   1. Add ADMIN_EMAIL, ADMIN_PASSWORD (and optionally ADMIN_NAME) to packages/db/.env
 *   2. Run: npm run create-admin --workspace=packages/db
 *
 * Safe to run once — skips if an AdminUser with that email already exists.
 */

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";

  if (!email || !password) {
    console.error(
      "❌ Missing required environment variables.\n" +
        "   Add ADMIN_EMAIL and ADMIN_PASSWORD to packages/db/.env\n" +
        "   (and optionally ADMIN_NAME, defaults to 'Admin')."
    );
    process.exit(1);
  }

  // Check for existing user
  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`⚠️  AdminUser with email "${email}" already exists. Skipping.`);
    process.exit(0);
  }

  // Hash the password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create the admin user
  const admin = await prisma.adminUser.create({
    data: {
      email,
      passwordHash,
      name,
      role: "OWNER",
    },
  });

  console.log(`✅ AdminUser created successfully!`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Name:  ${admin.name}`);
  console.log(`   Role:  ${admin.role}`);
}

main()
  .catch((e) => {
    console.error("❌ Failed to create admin user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
