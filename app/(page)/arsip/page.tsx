"use client";

import React, { useState, useMemo } from "react";
import Layout from "@/app/components/layout";
import Breakbout from "@/app/components/ui/breakbout";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/app/components/ui/table";
import { Button } from "@/app/components/ui/button";

import { FileSearch, UserPlus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Input } from "@/app/components/ui/input";

export default function ArsipPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Data dummy
  const rawData = useMemo(() => Array.from({ length: 105 }, (_, i) => ({
    id: i + 1,
    nomor: `${i + 1}`,
    lokasiPekerjaan: "CGK - BANDARA SOEKARNO HATTA",
    lokasiPengadaan: "Kantor Regional I Pusat Pelayanan Pengadaan Barang dan Jasa",
    pengumuman: `PENGUMUMAN TENDER PEKERJAAN SEWA TROLLEY BAGASI TERMINAL ${i + 1}`,
    tglPengumuman: "13 April 2026",
    waktuPendaftaran: "13 Apr 2026 14:35 - 16 Apr 2026 15:00 Waktu Setempat"
  })), []);

  const filteredData = useMemo(() => {
    return rawData.filter((item) =>
      item.pengumuman.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, rawData]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const safeCurrentPage = currentPage > totalPages ? 1 : currentPage;
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Layout>
      <Breakbout menu="Pengarsipan" />

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <Button className="bg-cyan-600 hover:bg-cyan-700 mb-3 cursor-pointer text-white flex items-center gap-2 shadow-sm transition-all h-10 px-4">
          <Plus className="h-4 w-4" />
          <span className="font-semibold text-sm">Tambah Data</span>
        </Button>
        {/* --- HEADER: ROWS PER PAGE (KIRI) & SEARCH (KANAN) --- */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">

          {/* POJOK KIRI ATAS: Rows Per Page & Showing info */}
          <div className="flex items-center gap-3 text-sm w-full md:w-auto">
            <span className="text-gray-500 font-medium">Rows per page:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}
            >
              <SelectTrigger className="w-[75px] h-9 border-gray-300 bg-gray-50 cusror-pointer focus:ring-cyan-500 rounded-md">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100].map(val => (
                  <SelectItem key={val} value={val.toString()}>{val}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-[13px] text-gray-400 italic">
              Showing {filteredData.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
            </span>
          </div>

          {/* SEARCH (Tetap di kanan atas) */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari kata kunci..."
              className="pl-9 h-10 border-gray-300 focus:ring-cyan-500 rounded-md"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>

        {/* --- TABLE CONTENT --- */}
        <div className="relative border border-cyan-100 rounded-sm overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table className="w-full table-fixed min-w-[1100px] border-collapse table-hover">
              <TableHeader className="bg-gray-50 border-b-2 border-gray-100">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[60px] text-center border-r font-bold text-gray-700 uppercase text-[11px]">No</TableHead>
                  <TableHead className="w-[120px] text-center border-r font-bold text-gray-700 uppercase text-[11px]">Lokasi Kerja</TableHead>
                  <TableHead className="w-[180px] text-center border-r font-bold text-gray-700 uppercase text-[11px]">Lokasi Pengadaan</TableHead>
                  <TableHead className="w-[350px] text-center border-r font-bold text-gray-700 uppercase text-[11px]">Pengumuman</TableHead>
                  <TableHead className="w-[140px] text-center border-r font-bold text-gray-700 uppercase text-[11px]">Tgl Pengumuman</TableHead>
                  <TableHead className="w-[210px] text-center border-r font-bold text-gray-700 uppercase text-[11px]">Waktu Pendaftaran</TableHead>
                  <TableHead className="w-[90px] text-center font-bold text-gray-700 uppercase text-[11px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((item) => (
                    <TableRow key={item.id} className="hover:bg-cyan-50/20 transition-colors border-b border-gray-100">
                      <TableCell className="text-center border-r text-gray-600 py-3">{item.nomor}</TableCell>
                      <TableCell className="text-center border-r text-gray-600 font-medium text-[12px] break-words whitespace-normal p-3">{item.lokasiPekerjaan}</TableCell>
                      <TableCell className="border-r px-4 text-blue-500 text-[13px] break-words whitespace-normal leading-relaxed">{item.lokasiPengadaan}</TableCell>
                      <TableCell className="border-r px-4 py-3">
                        <div className="text-blue-800 font-semibold leading-relaxed text-[13px] uppercase break-words whitespace-normal">{item.pengumuman}</div>
                      </TableCell>
                      <TableCell className="text-center border-r text-gray-500 text-[12px]">{item.tglPengumuman}</TableCell>
                      <TableCell className="border-r px-4 text-gray-500 text-[11px] leading-tight italic break-words whitespace-normal">{item.waktuPendaftaran}</TableCell>
                      <TableCell className="p-2 text-center">
                        <div className="flex justify-center gap-1.5">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 cursor-pointer border-green-200 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all shadow-sm"
                            title="Edit Data"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          {/* BUTTON HAPUS */}
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 cursor-pointer w-8 border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            title="Hapus Data"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={7} className="text-center py-20 text-gray-400">Data tidak ditemukan...</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="h-1 bg-cyan-600 w-full" />
        </div>

        {/* --- FOOTER: PAGINATION POJOK KIRI BAWAH --- */}
        <div className="mt-4 flex flex-col md:flex-row items-center justify-start gap-4">

          {/* POJOK KIRI BAWAH: Pagination Nav */}
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-9 w-9 cursor-pointer" onClick={() => setCurrentPage(1)} disabled={safeCurrentPage === 1}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9 cursor-pointer" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safeCurrentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1 mx-2">
              <span className="text-sm text-gray-500">Page</span>
              <span className="flex h-8 w-8 items-center justify-center bg-cyan-600 text-white rounded-md text-xs font-bold shadow-sm">
                {safeCurrentPage}
              </span>
              <span className="text-sm text-gray-500">of {totalPages || 1}</span>
            </div>

            <Button variant="outline" size="icon" className="h-9 w-9 cursor-pointer" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={safeCurrentPage >= totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9 cursor-pointer" onClick={() => setCurrentPage(totalPages)} disabled={safeCurrentPage >= totalPages}>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-[12px] text-gray-400 italic hidden md:block ml-auto">
            Terakhir diperbarui pada: {new Date().toLocaleDateString('id-ID')}
          </div>
        </div>

      </div>
    </Layout>
  );
}