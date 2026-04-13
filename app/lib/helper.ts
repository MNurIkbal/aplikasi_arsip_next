
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Swal from "sweetalert2";

export const nowWib = () => {
  const now = new Date();
  const hari = new Date(now.getTime() + 7 * 60 * 60 * 1000);

  return hari;
};

export function formatDateTime(value: string) {
  const [datePart, timePart] = value.split("T");

  const time = timePart.slice(0, 5);

  return `${datePart} ${time}`;
}

export const confirmDelete = async (url: string, onSuccess?: () => void) => {
  const result = await Swal.fire({
    title: "Apakah Anda yakin?",
    text: `Data ini akan dihapus permanen!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  });

  if (result.isConfirmed) {
    // Tampilkan loading saat proses hapus berlangsung
    Swal.fire({
      title: "Memproses...",
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
    });

    try {
      const response = await fetch(`${url}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Gagal menghapus data");
      const data = await response.json();
      await Swal.fire("Berhasil!", data.message, "success");

      if (onSuccess) onSuccess();
    } catch (error) {
      Swal.fire("Error!", "Terjadi kesalahan saat menghapus.", "error");
    }
  }
};

export const refreshData = async (router: AppRouterInstance) => {
  return new Promise<void>((resolve) => {
    // 1. Trigger refresh dari router
    router.refresh();
    
    // 2. Beri sedikit jeda agar Server Component selesai re-render
    // sebelum UI (seperti Modal/SweetAlert) memberikan konfirmasi final
    setTimeout(() => {
      resolve();
    }, 100); 
  });
};