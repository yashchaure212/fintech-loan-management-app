import prisma from "../src/config/prisma.js";
import { hashPassword } from "../src/services/password.service.js";

async function seedRoles() {
  console.log("🌱 Seeding roles...");

  const roles = [
    {
      name: "ADMIN",
      description: "System Administrator",
    },
    {
      name: "CUSTOMER",
      description: "Customer",
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        name: role.name,
      },
      update: {},
      create: role,
    });
  }

  console.log("✅ Roles seeded successfully");
}

async function seedAdmin() {
  console.log("🌱 Seeding admin user...");

  const adminRole = await prisma.role.findUnique({
    where: {
      name: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: {
      email: "admin@fintech.com",
    },
    update: {},
    create: {
      roleId: adminRole.id,
      email: "admin@fintech.com",
      phone: "9999999999",
      password: await hashPassword("Admin@123"),
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
    },
  });

  console.log("✅ Admin user seeded successfully");
}

async function main() {
  try {
    await prisma.$connect();

    await seedRoles();
    await seedAdmin();

    console.log("🎉 Database seeding completed");
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
