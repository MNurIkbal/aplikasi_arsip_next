import { NextRequest } from "next/server";
import { sendTableResponse, sendError } from "@/app/lib/response";
import { getUsersService } from "@/app/services/UserService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const result = await getUsersService({
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
      search: searchParams.get("search") || "",
    });

    return sendTableResponse(
      result.data,
      result.meta,
      "Data user berhasil diambil"
    );

  } catch (error) {
    console.error("GET_USERS_ERROR:", error);
    return sendError("Gagal mengambil data user", 500, error);
  }
}