import { sendError, successResponse } from "@/app/utils/response";
import { validateArsip } from "@/app/utils/validation";
import { getArsipResource, store } from "@/app/services/ArsipService";
import { NextRequest } from "next/server";
import { DOKUMEN_RAHASIA } from "@/app/types/Constant";


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Parsing & Validasi Input
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");
  const sort = searchParams.get("sort") || "";
  const order = searchParams.get("order") || "";

  try {
    const result = await getArsipResource({ search, page, limit,sort,order });


    // Kirim Response
    return successResponse(result,"Data berhasil ditampilkan",200);
  } catch (error) {
    console.error("API Error:", error);
    return sendError('Gagal memuat data arsip',500,null);
  }
}

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
      password_arsip: kategori === DOKUMEN_RAHASIA ? password_arsip : null, // Hanya kirim password jika Rahasia
      attachments
    });


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