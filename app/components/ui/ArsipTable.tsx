// "use client";

// import { useState, useMemo, useTransition, useEffect } from "react";
// import Layout from "@/app/components/layout";
// import Breakbout from "@/app/components/ui/breakbout";
// import {
//     Table, TableBody, TableCell, TableHead, TableHeader, TableRow
// } from "@/app/components/ui/table";
// import { Button } from "@/app/components/ui/button";

// import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Pencil, Trash2 } from "lucide-react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
// import { Input } from "@/app/components/ui/input";
// import BaseModal from "@/app/components/ui/BaseModal";
// import ArsipForm from "@/app/components/ui/ArsipForm";
// import { ArsipType } from "@/app/types/GlobalType";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { useDebounce } from "use-debounce";


// export default function ArsipPage({ initialData, meta, serverPage, serverLimit, serverSearch }: ArsipType) {
//     const router = useRouter();
//     const pathname = usePathname();
//     const searchParams = useSearchParams();
//     const [isPending, startTransition] = useTransition();

//     const [searchTerm, setSearchTerm] = useState(serverSearch);
//     const [debouncedSearch] = useDebounce(searchTerm, 500);

//     const updateQuery = (newParams: Record<string, string | number>) => {
//         const params = new URLSearchParams(searchParams.toString());
//         Object.entries(newParams).forEach(([key, value]) => {
//             params.set(key, value.toString());
//         });

//         startTransition(() => {
//             router.push(`${pathname}?${params.toString()}`);
//         });
//     };
//     useEffect(() => {
//         if (debouncedSearch !== serverSearch) {
//             updateQuery({ search: debouncedSearch, page: 1 });
//         }
//     }, [debouncedSearch]);
//     //   const [searchTerm, setSearchTerm] = useState("");
//     //   const [currentPage, setCurrentPage] = useState(1);
//     //   const [itemsPerPage, setItemsPerPage] = useState(10);

//     // Data dummy
//     const rawData = useMemo(() => Array.from({ length: 105 }, (_, i) => ({
//         id: i + 1,
//         nomor: `${i + 1}`,
//         lokasiPekerjaan: "CGK - BANDARA SOEKARNO HATTA",
//         lokasiPengadaan: "Kantor Regional I Pusat Pelayanan Pengadaan Barang dan Jasa",
//         pengumuman: `PENGUMUMAN TENDER PEKERJAAN SEWA TROLLEY BAGASI TERMINAL ${i + 1}`,
//         tglPengumuman: "13 April 2026",
//         waktuPendaftaran: "13 Apr 2026 14:35 - 16 Apr 2026 15:00 Waktu Setempat"
//     })), []);

//     const filteredData = useMemo(() => {
//         return rawData.filter((item) =>
//             item.pengumuman.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//     }, [searchTerm, rawData]);

//     // const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//     // const safeCurrentPage = currentPage > totalPages ? 1 : currentPage;
//     // const startIndex = (safeCurrentPage - 1) * itemsPerPage;
//     // const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);


//     const [modalConfig, setModalConfig] = useState<{
//         isOpen: boolean;
//         type: "ADD" | "EDIT" | "DELETE" | null;
//         data: any;
//     }>({
//         isOpen: false,
//         type: null,
//         data: null,
//     });

//     const closeModal = () => setModalConfig({ isOpen: false, type: null, data: null });

//     const handleAction = (data: any) => {
//         closeModal();
//     };
//     return (
//         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//             <Button className="bg-indigo-600 hover:bg-indigo-600 mb-3 cursor-pointer text-white flex items-center gap-2 shadow-sm transition-all h-10 px-4" onClick={() => setModalConfig({ isOpen: true, type: "ADD", data: null })}>

//                 <span className="font-semibold text-sm">Tambah Data</span>
//             </Button>
//             <BaseModal
//                 isOpen={modalConfig.isOpen}
//                 onClose={closeModal}
//                 size="2xl"
//                 title={
//                     modalConfig.type === "ADD" ? "Buat Arsip Baru" :
//                         modalConfig.type === "EDIT" ? "Update Data Arsip" : "Hapus Data"
//                 }
//             >
//                 {/* Render Form Berdasarkan Type */}
//                 <ArsipForm
//                     initialData={modalConfig.data}
//                     onSubmit={handleAction}
//                     onCancel={closeModal}
//                 />
//             </BaseModal>
//             {/* --- HEADER: ROWS PER PAGE (KIRI) & SEARCH (KANAN) --- */}
//             <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">

//                 {/* POJOK KIRI ATAS: Rows Per Page & Showing info */}
//                 <div className="flex items-center gap-3 text-sm w-full md:w-auto">
//                     <span className="text-gray-500 font-medium">Rows per page:</span>
//                     <Select value={serverLimit.toString()} onValueChange={(v) => updateQuery({ limit: v, page: 1 })}>
//                         <SelectTrigger className="w-[75px] h-9"><SelectValue /></SelectTrigger>
//                         <SelectContent>
//                             {[10, 25, 50, 100].map(val => (
//                                 <SelectItem key={val} value={val.toString()}>{val}</SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                     <span className="text-[13px] text-gray-400 italic">
//                         Showing {(serverPage - 1) * serverLimit + 1} to {Math.min(serverPage * serverLimit, meta.total)} of {meta.total} entries
//                     </span>
//                 </div>

//                 {/* SEARCH (Tetap di kanan atas) */}
//                 <div className="relative w-full md:w-80">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <Input
//                         placeholder="Cari kata kunci..."
//                         className="pl-9 h-10 border-gray-300 focus:ring-cyan-500 rounded-md"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                 </div>
//             </div>

//             {/* --- TABLE CONTENT --- */}
//             <div className="relative border border-cyan-100 rounded-sm overflow-hidden shadow-sm">
//                 <div className="overflow-x-auto">
//                     <Table className="w-full table-fixed min-w-[1100px] border-collapse table-hover">
//                         <TableHeader className="bg-gray-50 border-b-2 border-gray-100">
//                             <TableRow className="hover:bg-transparent">
//                                 <TableHead className="w-[60px] text-center border-r font-bold text-gray-700 uppercase text-[11px]">No</TableHead>
//                                 <TableHead className="w-[120px] text-center border-r font-bold text-gray-700 uppercase text-[11px]">Judul Pengarsipan</TableHead>
//                                 <TableHead className="w-[180px] text-center border-r font-bold text-gray-700 uppercase text-[11px]">Tanggal</TableHead>
//                                 <TableHead className="w-[350px] text-center border-r font-bold text-gray-700 uppercase text-[11px]">Kategori</TableHead>
//                                 <TableHead className="w-[140px] text-center border-r font-bold text-gray-700 uppercase text-[11px]">Jumlah Dokumen</TableHead>
//                                 <TableHead className="w-[90px] text-center font-bold text-gray-700 uppercase text-[11px]">Aksi</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {initialData.length > 0 ? (
//                                 initialData.map((item, index) => (
//                                     <TableRow key={item.id} className="hover:bg-cyan-50/20 transition-colors border-b border-gray-100">
//                                         <TableCell className="text-center border-r  py-3">{(serverPage - 1) * serverLimit + index + 1}</TableCell>
//                                         <TableCell className=" border-r  font-medium text-[12px] break-words whitespace-normal p-3">{item.judul}</TableCell>
//                                         <TableCell className="border-r px-4  text-[13px] break-words whitespace-normal leading-relaxed">
//                                             {new Date(item.tanggal).toLocaleDateString("id-ID", {
//                                                 day: "2-digit",
//                                                 month: "long",
//                                                 year: "numeric",
//                                             })}
//                                         </TableCell>
//                                         <TableCell className="border-r px-4 py-3">
//                                             <div className="text-blue-800 font-semibold leading-relaxed text-[13px] uppercase break-words whitespace-normal">{item.pengumuman}</div>
//                                         </TableCell>
//                                         <TableCell className="text-center border-r text-gray-500 text-[12px]">{item.tglPengumuman}</TableCell>
//                                         <TableCell className="p-2 text-center">
//                                             <div className="flex justify-center gap-1.5">
//                                                 <Button
//                                                     variant="outline"
//                                                     size="icon"
//                                                     className="h-8 w-8 cursor-pointer border-green-200 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all shadow-sm"
//                                                     title="Edit Data"
//                                                 >
//                                                     <Pencil className="h-4 w-4" />
//                                                 </Button>

//                                                 {/* BUTTON HAPUS */}
//                                                 <Button
//                                                     variant="outline"
//                                                     size="icon"
//                                                     className="h-8 cursor-pointer w-8 border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
//                                                     title="Hapus Data"
//                                                 >
//                                                     <Trash2 className="h-4 w-4" />
//                                                 </Button>
//                                             </div>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))
//                             ) : (
//                                 <TableRow><TableCell colSpan={7} className="text-center py-20 text-gray-400">Data tidak ditemukan...</TableCell></TableRow>
//                             )}
//                         </TableBody>
//                     </Table>
//                 </div>
//                 <div className="h-1 bg-cyan-600 w-full" />
//             </div>

//             {/* --- FOOTER: PAGINATION POJOK KIRI BAWAH --- */}
//             <div className="mt-4 flex flex-col md:flex-row items-center justify-start gap-4">

//                 {/* POJOK KIRI BAWAH: Pagination Nav */}
//                 <div className="flex items-center gap-1">
//                     <Button variant="outline" size="icon" className="h-9 w-9 cursor-pointer" onClick={() => updateQuery({ page: 1 })} disabled={serverPage === 1}>
//                         <ChevronsLeft className="h-4 w-4" />
//                     </Button>
//                     <Button variant="outline" size="icon" className="h-9 w-9 cursor-pointer" onClick={() => updateQuery({ page: serverPage - 1 })} disabled={serverPage === 1}>
//                         <ChevronLeft className="h-4 w-4" />
//                     </Button>
//                     <div className="flex items-center gap-1 mx-2 text-sm">
//                         <span>Page</span>
//                         <span className="bg-cyan-600 text-white px-2 py-1 rounded font-bold">{serverPage}</span>
//                         <span>of {meta.totalPages || 1}</span>
//                     </div>
//                     <Button variant="outline" size="icon" className="h-9 w-9 cursor-pointer" onClick={() => updateQuery({ page: serverPage + 1 })} disabled={serverPage >= meta.totalPages}>
//                         <ChevronRight className="h-4 w-4" />
//                     </Button>
//                     <Button variant="outline" size="icon" className="h-9 w-9 cursor-pointer" onClick={() => updateQuery({ page: meta.totalPages })} disabled={serverPage >= meta.totalPages}>
//                         <ChevronsRight className="h-4 w-4" />
//                     </Button>
//                 </div>

//                 <div className="text-[12px] text-gray-400 italic hidden md:block ml-auto">
//                     Terakhir diperbarui pada: {new Date().toLocaleDateString('id-ID')}
//                 </div>
//             </div>

//         </div>
//     );
// }

"use client";

import { useState, useTransition, useEffect } from "react";
import Layout from "@/app/components/layout";
import Breakbout from "@/app/components/ui/breakbout";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/app/components/ui/table";
import { Button } from "@/app/components/ui/button";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Pencil, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Input } from "@/app/components/ui/input";
import BaseModal from "@/app/components/ui/BaseModal";
import ArsipForm from "@/app/components/ui/ArsipForm";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { formatDateIndonesia } from "@/app/utils/helper";


// Definisi interface props agar lebih jelas
interface ArsipPageProps {
    initialData: any[];
    meta: { total: number; totalPages: number };
    serverPage: number;
    serverLimit: number;
    serverSearch: string;
}

export default function ArsipClientContent({ initialData, meta, serverPage, serverLimit, serverSearch }: ArsipPageProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // State pencarian lokal untuk input yang responsif
    const [searchTerm, setSearchTerm] = useState(serverSearch);
    const [debouncedSearch] = useDebounce(searchTerm, 500);

    // Fungsi utama sinkronisasi URL (Memicu Re-render Server Component)
    const updateQuery = (newParams: Record<string, string | number>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value]) => {
            params.set(key, value.toString());
        });

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    // Trigger pencarian saat debouncedSearch berubah
    useEffect(() => {
        if (debouncedSearch !== serverSearch) {
            updateQuery({ search: debouncedSearch, page: 1 });
        }
    }, [debouncedSearch]);

    // Modal State
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: "ADD" | "EDIT" | "DELETE" | null;
        data: any;
    }>({
        isOpen: false,
        type: null,
        data: null,
    });

    const closeModal = () => setModalConfig({ isOpen: false, type: null, data: null });

    return (
        <div className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
            {/* Header: Tambah Data */}
            <Button 
                className="bg-indigo-600 hover:bg-indigo-700 mb-3 text-white flex items-center gap-2 h-10 px-4 transition-all" 
                onClick={() => setModalConfig({ isOpen: true, type: "ADD", data: null })}
            >
                <span className="font-semibold text-sm">Tambah Data</span>
            </Button>

            <BaseModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                size="2xl"
                title={modalConfig.type === "ADD" ? "Buat Arsip Baru" : "Update Data Arsip"}
            >
                <ArsipForm
                    initialData={modalConfig.data}
                    onSubmit={closeModal}
                    onCancel={closeModal}
                />
            </BaseModal>

            {/* Filter: Rows per page & Search */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
                <div className="flex items-center gap-3 text-sm w-full md:w-auto">
                    <span className="text-gray-500 font-medium">Rows per page:</span>
                    <Select 
                        value={serverLimit.toString()} 
                        onValueChange={(v) => updateQuery({ limit: v, page: 1 })}
                    >
                        <SelectTrigger className="w-[75px] h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {[10, 25, 50, 100].map(val => (
                                <SelectItem key={val} value={val.toString()}>{val}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <span className="text-[13px] text-gray-400 italic">
                        Showing {(serverPage - 1) * serverLimit + 1} to {Math.min(serverPage * serverLimit, meta.total)} of {meta.total} entries
                    </span>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Cari judul arsip..."
                        className="pl-9 h-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="relative border border-cyan-100 rounded-sm overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <Table className="w-full table-fixed min-w-[1000px]">
                        <TableHeader className="bg-gray-50 border-b-2">
                            <TableRow>
                                <TableHead className="w-[60px] text-center font-bold text-[11px] uppercase">No</TableHead>
                                <TableHead className="w-[300px] font-bold text-[11px] uppercase">Judul Pengarsipan</TableHead>
                                <TableHead className="w-[150px] text-center font-bold text-[11px] uppercase">Tanggal</TableHead>
                                <TableHead className="w-[200px] text-center font-bold text-[11px] uppercase">Kategori</TableHead>
                                <TableHead className="w-[120px] text-center font-bold text-[11px] uppercase">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {initialData.length > 0 ? (
                                initialData.map((item, index) => (
                                    <TableRow key={item.id} className="hover:bg-cyan-50/20">
                                        <TableCell className="text-center py-3">
                                            {(serverPage - 1) * serverLimit + index + 1}
                                        </TableCell>
                                        <TableCell className="font-medium text-[12px] break-words px-3">
                                            {item.judul}
                                        </TableCell>
                                        <TableCell className="text-center text-[13px]">
                                            {formatDateIndonesia(item.tanggal)}
                                        </TableCell>
                                        <TableCell className="text-center text-blue-800 font-semibold text-[12px] uppercase">
                                            {item.kategori}
                                        </TableCell>
                                        <TableCell className="p-2 text-center">
                                            <div className="flex justify-center gap-1.5">
                                                <Button 
                                                    variant="outline" size="icon" className="h-8 w-8 text-green-600 bg-green-50"
                                                    onClick={() => setModalConfig({ isOpen: true, type: "EDIT", data: item })}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 bg-red-50">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-20 text-gray-400">
                                        Data tidak ditemukan...
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="h-1 bg-cyan-600 w-full" />
            </div>

            {/* Footer Pagination */}
            <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => updateQuery({ page: 1 })} disabled={serverPage === 1}>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => updateQuery({ page: serverPage - 1 })} disabled={serverPage === 1}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1 mx-2 text-sm">
                        <span>Page</span>
                        <span className="bg-cyan-600 text-white px-2 py-1 rounded font-bold">{serverPage}</span>
                        <span>of {meta.totalPages || 1}</span>
                    </div>
                    <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => updateQuery({ page: serverPage + 1 })} disabled={serverPage >= meta.totalPages}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => updateQuery({ page: meta.totalPages })} disabled={serverPage >= meta.totalPages}>
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="text-[12px] text-gray-400 italic">
                    Terakhir diperbarui pada: {new Date().toLocaleDateString('id-ID')}
                </div>
            </div>
        </div>
    );
}