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
        async $allOperations({ operation, args, query }) {
          // Daftar operasi yang akan disuntikkan waktu WIB secara otomatis
          const timestampOps = ["create", "update", "upsert", "createMany", "updateMany"];

          if (timestampOps.includes(operation)) {
            const now = new Date();
            // Geser waktu manual ke +7 jam untuk bypass standar UTC Prisma
            const jakartaTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);

            if (operation === "create" || operation === "update") {
              const data = args.data as any;
              // Set updated_at setiap ada perubahan
              data.updated_at = jakartaTime;
              
              // Set created_at jika belum ada (mencegah overwrite saat backdate manual)
              if (operation === "create" && !data.created_at) {
                data.created_at = jakartaTime;
              }
            }

            if (operation === "createMany" || operation === "updateMany") {
              const dataArray = Array.isArray(args.data) ? args.data : [args.data];
              dataArray.forEach((item: any) => {
                item.updated_at = jakartaTime;
                if (operation === "createMany" && !item.created_at) {
                  item.created_at = jakartaTime;
                }
              });
            }
          }
          return query(args);
        },
      },
    },
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;