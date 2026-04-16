"use client";

import { useState, useTransition, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Button } from "@/app/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Pencil, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Input } from "@/app/components/ui/input";
import BaseModal from "@/app/components/ui/BaseModal";
import ArsipForm from "@/app/components/ui/ArsipForm";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { formatDateIndonesia } from "@/app/utils/helper";
import { ArsipPageProps } from "@/app/types/GlobalType";
import { fetchArsip } from "@/app/hooks/ArsipHooks";
import useSWR from "swr";

export default function ArsipClientContent({ serverPage, serverLimit, serverSearch }: ArsipPageProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [searchTerm, setSearchTerm] = useState(serverSearch);
    const [debouncedSearch] = useDebounce(searchTerm, 500);

    const { data, isLoading } = useSWR(
        ["/api/arsip", debouncedSearch, serverPage, serverLimit],
        () => fetchArsip({ search: debouncedSearch, page: serverPage, limit: serverLimit }),
        {
            revalidateOnFocus: false,
            keepPreviousData: true, // Biar tabel gak kedap-kedip saat fetch
        }
    );


    const initialData = data?.data.data || [];
    
    const meta = data?.meta || { total: 0, totalPages: 1 };

    const updateQuery = (newParams: Record<string, string | number>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value]) => {
            params.set(key, value.toString());
        });

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        });
    };

    useEffect(() => {
        if (debouncedSearch !== serverSearch) {
            updateQuery({ search: debouncedSearch, page: 1 });
        }
    }, [debouncedSearch]);

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
        <div className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${(isPending || isLoading) ? 'opacity-80' : ''}`}>
            <Button 
                className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 mb-3 text-white flex items-center gap-2 h-10 px-4 transition-all" 
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
                        placeholder="Search"
                        className="pl-9 h-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

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
                            {isLoading && initialData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-20 text-indigo-600 animate-pulse">
                                        Loading data...
                                    </TableCell>
                                </TableRow>
                            ) : initialData.length > 0 ? (
                                initialData.map((item : any, index : any) => (
                                    <TableRow key={item.id} className="hover:bg-cyan-50/20">
                                        <TableCell className="text-center py-3">
                                            {(serverPage - 1) * serverLimit + index + 1}
                                        </TableCell>
                                        <TableCell className="font-medium text-[12px] break-words px-3 text-black">
                                            {item.judul}
                                        </TableCell>
                                        <TableCell className="text-center text-[13px] text-black">
                                            {formatDateIndonesia(item.tanggal)}
                                        </TableCell>
                                        <TableCell className="text-center  font-semibold text-[12px] uppercase">
                                            {item.kategori}
                                        </TableCell>
                                        <TableCell className="p-2 text-center">
                                            <div className="flex justify-center gap-1.5">
                                                <Button 
                                                    variant="outline" size="icon" className="h-8 w-8 cursor-pointer text-green-600 bg-green-50"
                                                    onClick={() => setModalConfig({ isOpen: true, type: "EDIT", data: item })}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 cursor-pointer bg-red-50">
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

            <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => updateQuery({ page: 1 })} disabled={serverPage === 1}>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => updateQuery({ page: serverPage - 1 })} disabled={serverPage === 1}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1 mx-2 text-sm text-black">
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