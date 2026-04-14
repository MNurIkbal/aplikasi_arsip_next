import { prisma } from "@/app/utils/prisma";
import { sendError, successResponse } from "@/app/utils/response";
import { validateArsip } from "@/app/utils/validation";
import { store } from "@/app/services/ArsipService";
import { NextRequest } from "next/server";
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const judul = formData.get("judul") as string;
        const tanggal = formData.get("tanggal") as string;
        const kategori = formData.get("kategori") as string;
        const password_arsip = formData.get("password_arsip") as string | null;

        const attachments: any[] = [];
        let index = 0;
        while (formData.has(`attachments[${index}][nama_dokumen]`)) {
            const nama_dokumen = formData.get(`attachments[${index}][nama_dokumen]`) as string;
            const file = formData.get(`attachments[${index}][file]`) as File | null;

            if (file) {
                attachments.push({ nama_dokumen, file });
            }
            index++;
        }


        const dataToValidate = {
            judul,
            tanggal,
            kategori,
            password_arsip,
            nama_dokumen: attachments,
        };

        const validation = validateArsip(dataToValidate, false);

        if (!validation.isValid) {
            const errorMessages = Object.values(validation.errors);
            const firstErrorMessage = errorMessages.length > 0 ? errorMessages[0] : "Validasi gagal";
            return sendError(firstErrorMessage as string, 400, validation.errors);
        }

        // Eksekusi Store (Sekarang mengembalikan object dari Database)
        const result = await store({
            judul,
            tanggal,
            kategori,
            password_arsip: kategori === "Dokumen Rahasia" ? password_arsip : null, // Hanya kirim password jika Rahasia
            attachments
        });

        console.log(result);

        if (result.ok) {
            const data = await result.json();
            return successResponse(null, data.message, 201);
        } else {
            return sendError("Gagal memproses arsip", 500);
        }

    } catch (error: any) {
        console.error("API Error:", error);
        return sendError("Terjadi kesalahan pada server", 500, error.message);
    }
}

export async function getArsipAction(params: {
  search?: string;
  page: number;
  limit: number;
}) {
  const { search, page, limit } = params;
  const skip = (page - 1) * limit;

  // Filter pencarian berdasarkan judul
  const where = search
    ? {
        judul: {
          contains: search,
          mode: "insensitive" as const,
        },
      }
    : {};

  try {
    const [data, total] = await Promise.all([
      prisma.arsip.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      prisma.arsip.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching arsip:", error);
    return { data: [], meta: { total: 0, totalPages: 0 } };
  }
}