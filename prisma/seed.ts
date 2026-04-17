import { PrismaClient, Role } from "@prisma/client";
import { fakerID_ID as faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";

// Biarkan kosong, Prisma akan otomatis baca dari .env atau prisma.config.ts
const prisma = new PrismaClient();

export const getJakartaDate = () => {
  const now = new Date();
  // Ambil offset timezone dalam menit (untuk Jakarta biasanya -420)
  
  // Paksa geser waktu sebanyak 7 jam (420 menit)
  // dikurangi offset lokal agar netral, lalu ditambah 7 jam
  const jakartaTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
  
  return jakartaTime;
};
async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  
  
  // Hapus data lama
  await prisma.user.deleteMany();
  
  // Generate data
  const users = Array.from({ length: 10 }).map((_, i) => ({
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: passwordHash,
    role: i === 0 ? Role.Admin : Role.Pegawai,
    image:  "uploads/1775881364762-user.png",
    created_at: getJakartaDate(), // Gunakan helper untuk waktu WIB
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