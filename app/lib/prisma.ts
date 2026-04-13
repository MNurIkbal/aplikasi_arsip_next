import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  }).$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const jakartaTime = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);

          // --- 1. LOGIKA AUTO-TIMESTAMP ---
          const timestampOps = ["create", "update", "upsert", "createMany", "updateMany"];
          if (timestampOps.includes(operation)) {
            const data = (args as any).data;
            if (data) {
              if (operation === "create" || operation === "update") {
                data.updated_at = jakartaTime;
                if (operation === "create" && !data.created_at) {
                  data.created_at = jakartaTime;
                }
              } else if (operation === "createMany" || operation === "updateMany") {
                const dataArray = Array.isArray(data) ? data : [data];
                dataArray.forEach((item: any) => {
                  item.updated_at = jakartaTime;
                  if (operation === "createMany" && !item.created_at) {
                    item.created_at = jakartaTime;
                  }
                });
              }
            }
          }

          // --- 2. LOGIKA GLOBAL FILTER SOFT DELETE ---
          const readOps = ["findFirst", "findMany", "count", "aggregate", "findUnique", "findFirstOrThrow", "findUniqueOrThrow"];
          
          // Gunakan pengecekan (args as any) agar TS tidak error saat mengakses .where
          if (readOps.includes(operation)) {
            (args as any).where = {
              ...(args as any).where,
              deleted_at: null,
            };
          }

          // --- 3. LOGIKA OVERRIDE DELETE ---
          if (operation === "delete") {
            return (prisma as any)[model].update({
              where: (args as any).where,
              data: { deleted_at: jakartaTime },
            });
          }

          if (operation === "deleteMany") {
            return (prisma as any)[model].updateMany({
              where: (args as any).where,
              data: { deleted_at: jakartaTime },
            });
          }

          return query(args);
        },
      },
    },
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;