import { PrismaClient } from "@prisma/client";

// Menambahkan tipe prisma ke dalam global object NodeJS
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Gunakan instance yang sudah ada atau buat baru jika belum ada
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Di mode development, simpan instance ke global object agar tidak kena limit koneksi DB
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;