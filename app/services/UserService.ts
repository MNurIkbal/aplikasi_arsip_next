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