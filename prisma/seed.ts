import { PrismaClient, Role } from "@prisma/client";
import { fakerID_ID as faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";

// Biarkan kosong, Prisma akan otomatis baca dari .env atau prisma.config.ts
const prisma = new PrismaClient();


async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  console.log("--- Memulai Seeding ---");
  
  // Hapus data lama
  await prisma.user.deleteMany();
  const now = new Date();
  console.log(now);
  
  // Generate data
  const users = Array.from({ length: 10 }).map((_, i) => ({
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: passwordHash,
    role: i === 0 ? Role.admin : Role.pegawai,

  }));

  await prisma.user.createMany({ data: users });

  console.log("✅ Berhasil memasukkan 10 user Indonesia!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });