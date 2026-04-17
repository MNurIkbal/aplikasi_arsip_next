export async function fetchArsip(params: { search?: string; page: number; limit: number, sort: string, order: string }) {
  try {
    const query = new URLSearchParams();
    if (params.search) query.append("search", params.search);
    query.append("page", params.page.toString());
    query.append("limit", params.limit.toString());
    query.append("sort", params.sort.toString());
    query.append("order", params.order.toString());

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

    return result;
  } catch (error) {
    console.error("Client Service Error:", error);
    return { data: [], meta: { total: 0, totalPages: 0 } };
  }
}