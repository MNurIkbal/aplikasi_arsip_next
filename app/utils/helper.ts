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
      const datas = await response.json();
      console.log(datas);
      

      if (!response.ok) throw new Error("Gagal menghapus data");
      const data = await response.json();
      await Swal.fire("Berhasil!", data.message, "success");

      if (onSuccess) onSuccess();
    } catch (error) {
      Swal.fire("Error!", "Terjadi kesalahan saat menghapus.", "error");
    }
  }
};

export const formatDateIndonesia = (date: Date | string | null | undefined): string => {
  if (!date) return "-";

  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) return "-";

  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const formatDate = (date?: string | null): string => {
  if (!date) return "";
  return date.split("T")[0];
};

export const parseJSON = (value: any) => {
  if (!value) return {};

  if (typeof value === "object") return value;

  try {
    return JSON.parse(value);
  } catch (error) {
    console.error("JSON parse error:", error);
    return {};
  }
};


export type ParamArsip = {
  id: number;
  nama_dokumen: string;
  file?: File | null;
};

export type FieldArsip = {
  id : number;
  judul: string;
  tanggal: string;
  kategori: string;
  password_arsip: string;
  params: ParamArsip[];
};