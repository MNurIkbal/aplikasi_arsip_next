"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  useReactTable, 
  getCoreRowModel, 
  flexRender, 
  createColumnHelper 
} from "@tanstack/react-table";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const columnHelper = createColumnHelper<any>();

const columns = [
  columnHelper.accessor("name", { header: "Nama Lengkap" }),
  columnHelper.accessor("email", { header: "Email" }),
  columnHelper.accessor("role", { 
    header: "Role",
    cell: (info) => (
      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase">
        {info.getValue()}
      </span>
    )
  }),
];

export default function UserTable() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["users", pagination, search],
    queryFn: async () => {
      const res = await fetch(
        `/api/users?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}&search=${search}`
      );
      return res.json();
    },
  });

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    pageCount: data?.meta?.pageCount ?? -1,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header Tabel & Search */}
      <div className="p-5 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-gray-800">Manajemen User</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 w-full md:w-64 transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Body Tabel */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="bg-gray-50/50">
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr><td colSpan={3} className="p-20 text-center text-gray-400 animate-pulse">Memuat data...</td></tr>
            ) : table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50/80 transition-colors">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 text-sm text-gray-700 font-medium">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer & Pagination */}
      <div className="p-5 border-t border-gray-50 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Menampilkan <span className="font-bold text-gray-800">{data?.data?.length || 0}</span> dari <span className="font-bold text-gray-800">{data?.meta?.total || 0}</span> user
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 bg-gray-50 rounded-lg disabled:opacity-30 hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 bg-gray-50 rounded-lg disabled:opacity-30 hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}