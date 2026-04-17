"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";
import UserForm from "./UserForm";
import BaseModal from "./BaseModal";
import { getUser } from "@/app/hooks/UserHooks";
import { confirmDelete, formatDateTime } from "@/app/utils/helper";
import Image from "next/image";
import { useRouter } from "next/navigation";

const columnHelper = createColumnHelper<any>();

// 🔥 Style Role
const getRoleStyle = (role: string) => {
  switch (role) {
    case "Admin":
      return "bg-red-50 text-red-600";
    case "Pegawai":
      return "bg-green-50 text-green-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function UserTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const queryClient = useQueryClient();
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);

  const [search, setSearch] = useState("");

  // 🔥 Fetch Data
  const { data, isLoading, isError } = getUser({
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    search: search,
  });

  // 🔥 Columns
  const columns = [
    columnHelper.display({
      id: "no",
      header: "No",
      enableSorting: true,
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;

        return pageIndex * pageSize + row.index + 1;
      },
    }),
    columnHelper.accessor("image", {
      header: "Image",
      enableSorting: false,
      cell: (info) => {
        const img = info.getValue();
        return (
          <div className="relative w-[60px] h-[60px]">
            <Image
              src={img}
              alt="User Image"
              fill
              // Tambahkan baris ini
              sizes="60px"
              className="rounded-full object-cover"
            />
          </div>
        );
      },
    }),

    columnHelper.accessor("name", {
      header: "Nama Lengkap",
      enableSorting: true,
    }),

    columnHelper.accessor("email", {
      header: "Email",
      enableSorting: true,
    }),

    columnHelper.accessor("role", {
      header: "Role",
      enableSorting: true,
      cell: (info) => {
        const role = info.getValue();
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getRoleStyle(
              role
            )}`}
          >
            {role}
          </span>
        );
      },
    }),

    columnHelper.accessor("created_at", {
      header: "Tanggal Dibuat",
      enableSorting: true,
      cell: (info) => {
        const value = info.getValue();

        return formatDateTime(value);

      },
    }),

    // 🔥 ACTION COLUMN
    columnHelper.display({
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex gap-2">
            {/* EDIT */}
            <button
              onClick={() =>
                setModalConfig({
                  isOpen: true,
                  type: "EDIT",
                  data: user // Mengirimkan data user ke form
                })
              }
              className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition cursor-pointer"
            >
              <Pencil className="w-4 h-4" />
            </button>

            {/* DELETE */}
            <button
              onClick={() =>
                confirmDelete(`/api/users/${user.id}`, () => {
                  // 1. Refresh untuk TanStack Query (Client Side Cache)
                  queryClient.invalidateQueries({ queryKey: ["users"] });

                  // 2. Refresh untuk Server Components (Next.js Cache)
                  router.refresh();
                })
              }
              className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    pageCount: data?.meta?.pageCount ?? -1,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

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

  const handleAction = (data: any) => {
    closeModal();
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

      {/* HEADER */}
      <button
        onClick={() => setModalConfig({ isOpen: true, type: "ADD", data: null })}
        className="bg-indigo-600 font-semibold ml-4 mt-4 cursor-pointer text-white px-5 py-2 rounded-xl font-bold shadow-lg"
      >
        
        Tambah Data
      </button>

      {/* MODAL DYNAMIC MANIPULATION */}
      <BaseModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        size="2xl"
        title={
          modalConfig.type === "ADD" ? "Buat User Baru" :
            modalConfig.type === "EDIT" ? "Update Data User" : "Hapus Data"
        }
      >
        {/* Render Form Berdasarkan Type */}
        <UserForm
          initialData={modalConfig.data}
          onSubmit={handleAction}
          onCancel={closeModal}
        />
      </BaseModal>
      <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">

        <h3 className="text-lg font-bold text-gray-800">
          Manajemen User
        </h3>

        <div className="flex items-center gap-3 w-full md:w-auto">

          {/* SEARCH */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 w-full transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">

          {/* THEAD */}
          <thead className="bg-gray-50 border-b border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest border-r last:border-r-0 cursor-pointer select-none"
                  >
                    <div className="flex items-center justify-between w-full">

                      <span>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </span>

                      <span className="ml-2 w-4 text-right">
                        {{
                          asc: "↑",
                          desc: "↓",
                        }[header.column.getIsSorted() as string] ?? "↕"}
                      </span>

                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-20 text-center text-gray-400 animate-pulse">
                  Memuat data...
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-gray-400">
                  Data tidak ditemukan
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-indigo-50/60 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 text-sm text-gray-700 font-medium border-r last:border-r-0"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-5 border-t border-gray-100 flex items-center justify-between">

        <p className="text-sm text-gray-500">
          Menampilkan{" "}
          <span className="font-bold text-gray-800">
            {data?.data?.length || 0}
          </span>{" "}
          dari{" "}
          <span className="font-bold text-gray-800">
            {data?.meta?.total || 0}
          </span>{" "}
          user
        </p>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            Page{" "}
            <span className="font-bold text-gray-800">
              {pagination.pageIndex + 1}
            </span>{" "}
            of{" "}
            <span className="font-bold text-gray-800">
              {data?.meta?.pageCount || 1}
            </span>
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 bg-gray-50 rounded-lg disabled:opacity-30 hover:bg-gray-100 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 bg-gray-50 rounded-lg disabled:opacity-30 hover:bg-gray-100 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}