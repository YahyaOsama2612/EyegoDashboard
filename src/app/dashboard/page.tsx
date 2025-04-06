"use client";
import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import { faker } from "@faker-js/faker";
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { selectSorting, setSorting } from "../store/sortingSlice";

interface User {
  id: string;
  name: string;
  email: string;
}

faker.seed(123);

const generateUsers = (): User[] => {
  const users: User[] = [];
  for (let i = 0; i < 15; i++) {
    users.push({
      id: `user-${i}`,
      name: faker.internet.username(),
      email: faker.internet.email(),
    });
  }
  return users;
};

const usersList = generateUsers();
const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor("name", {
    header: () => "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: () => "Email",
    cell: (info) => info.getValue(),
  }),
];

export default function DynamicTable() {
  const filterRef = useRef<HTMLInputElement>(null);
  const sortingRef = useRef<SortingState>([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const sorting = useSelector(selectSorting);

  useEffect(() => {
    sortingRef.current = sorting;
  }, [sorting]);

  const table = useReactTable({
    data: usersList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting: sorting,
    },
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sortingRef.current) : updater;
      sortingRef.current = newSorting;
      dispatch(setSorting(newSorting));
    },
  });

  const handleFilter = () => {
    const value = filterRef.current?.value || "";
    table.setGlobalFilter(value);
  };

  const handleNavigate = () => {
    router.push("/dashboard/chartpage");
  };

  const getSortIcon = (columnId: string) => {
    const sortEntry = (sorting as { id: string; desc: boolean }[]).find(
      (s) => s.id === columnId
    );
    if (!sortEntry) return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    return sortEntry.desc ? (
      <ArrowDown className="h-4 w-4" />
    ) : (
      <ArrowUp className="h-4 w-4" />
    );
  };

  useEffect(() => {
    if (filterRef.current?.value) {
      handleFilter();
    }
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-4 flex items-center gap-2">
        <input
          ref={filterRef}
          onChange={handleFilter}
          placeholder="Search..."
          className="border border-gray-300 rounded px-3 py-1 w-full max-w-sm"
        />
        <button
          className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          onClick={handleNavigate}
        >
          Go to chart
        </button>
      </div>

      <div className="overflow-x-auto rounded border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-3 font-medium text-gray-700 select-none"
                  >
                    <div
                      className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors group"
                      onClick={() => header.column.toggleSorting()}
                      title={`Sort by ${header.column.id}`}
                    >
                      <span>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </span>
                      <span className="text-gray-400 group-hover:text-blue-500">
                        {getSortIcon(header.column.id)}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3 text-gray-800">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 gap-2">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <span className="text-sm">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
  );
}
