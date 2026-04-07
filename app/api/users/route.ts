import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { sendTableResponse,sendError } from "@/app/lib/response";


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // 1. Parsing & Validasi Parameter
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10"));
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    // 2. Abstraksi Filter (Agar sinkron antara findMany dan count)
    // Ingat: Hapus 'mode: insensitive' jika menggunakan SQLite/MySQL
    const whereClause = {
      OR: [
        { name: { contains: search } },
        { email: { contains: search } },
      ],
    };

    // 3. Eksekusi Query secara Paralel
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { created_at: "desc" }, // Pastikan sesuai schema (createdAt vs created_at)
      }),
      prisma.user.count({
        where: whereClause,
      }),
    ]);

    // 4. Kirim Response Khusus Tabel
    return sendTableResponse(
      users, 
      {
        total,
        page,
        limit,
        pageCount: Math.ceil(total / limit),
      },
      "Data user berhasil diambil"
    );

  } catch (error) {
    console.error("GET_USERS_ERROR:", error);
    // 5. Kirim Response Error
return sendError("Gagal mengambil data user", 500, error);
  }
}