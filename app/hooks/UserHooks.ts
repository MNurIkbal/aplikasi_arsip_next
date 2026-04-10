import { useQuery } from "@tanstack/react-query";
import { UseUsersProps } from "../types/UserType";

export const getUser = ({ pageIndex, pageSize, search }: UseUsersProps) => {
  return useQuery({
    // queryKey sangat penting untuk auto-refetch saat page/search berubah
    queryKey: ["users", pageIndex, pageSize, search], 
    queryFn: async () => {
      const res = await fetch(
        `/api/users?page=${pageIndex + 1}&limit=${pageSize}&search=${search}`
      );
      
      if (!res.ok) {
        throw new Error("Gagal mengambil data user");
      }
      return res.json();
    },
    // Opsi tambahan agar data tidak dianggap basi terlalu cepat
    staleTime: 5000, 
  });
};