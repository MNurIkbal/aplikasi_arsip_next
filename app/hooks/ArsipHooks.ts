export async function fetchArsip(params: { search?: string; page: number; limit: number }) {
  try {
    // 1. Susun Query String secara otomatis agar aman dari karakter aneh
    const query = new URLSearchParams();
    if (params.search) query.append("search", params.search);
    query.append("page", params.page.toString());
    query.append("limit", params.limit.toString());

    
    // 2. Hit ke endpoint API Route yang sudah kita buat sebelumnya
    const response = await fetch(`/api/arsip?${query.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal mengambil data dari server");
    }

    // Mengembalikan { data, meta }
    return result; 
  } catch (error) {
    console.error("Client Service Error:", error);
    return { data: [], meta: { total: 0, totalPages: 0 } };
  }
}