import { prisma } from "@/app/lib/prisma";

type GetUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function getUsersService(params: GetUsersParams) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, params.limit || 10);
  const search = params.search || "";
  const skip = (page - 1) * limit;

  const whereClause = {
    OR: [
      { name: { contains: search } },
      { email: { contains: search } },
    ],
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
    }),
    prisma.user.count({
      where: whereClause,
    }),
  ]);

  return {
    data: users,
    meta: {
      total,
      page,
      limit,
      pageCount: Math.ceil(total / limit),
    },
  };
}

// services/userService.ts

export const createUser = {
  create: async (data: any) => {
    const formData = new FormData();
    
    // Masukkan semua data teks ke FormData
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("role", data.role);
    
    // Masukkan file image jika ada
    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await fetch("/api/users", {
      method: "POST",
      body: formData, // FormData otomatis mengatur Header Content-Type
    });

    return response;
  },

  update: async (id: string, data: any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("role", data.role);
    
    // Update password & image hanya jika diisi oleh user
    if (data.password) formData.append("password", data.password);
    if (data.image) formData.append("image", data.image);

    const response = await fetch(`/api/users/${id}`, {
      method: "PUT",
      body: formData,
    });

    return response;
  }
};