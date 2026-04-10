import { useQuery } from "@tanstack/react-query";
import { UseUsersProps } from "../types/GlobalType";

export const getUser = ({
  pageIndex,
  pageSize,
  search,
}: UseUsersProps) => {
  return useQuery({
    // 🔥 penting: masukin sorting ke queryKey
    queryKey: ["users", pageIndex, pageSize, search],

    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(pageIndex + 1),
        limit: String(pageSize),
        search: search || "",
      });

      const res = await fetch(`/api/users?${params.toString()}`);

      if (!res.ok) {
        throw new Error("Gagal mengambil data user");
      }

      return res.json();
    },

    staleTime: 5000,
  });
};