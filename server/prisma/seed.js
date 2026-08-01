import prisma from "../src/config/prisma.js";

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

async function main() {
  try {
    await prisma.$connect();

    await seedRoles();

    console.log("🎉 Database seeding completed");
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
