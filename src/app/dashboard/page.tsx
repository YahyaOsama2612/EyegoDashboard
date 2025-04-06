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

  const table = useReactTable({
    data: usersList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting: sortingRef.current,
    },
    onSortingChange: (updater) => {
      sortingRef.current =
        typeof updater === "function" ? updater(sortingRef.current) : updater;
    },
  });

  const handleFilter = () => {
    const value = filterRef.current?.value || "";
    table.setGlobalFilter(value);
  };
  const handelnavigate = () => {
    router.push("/dashboard/chartpage");
  };
  const handleSort = (columnId: string) => {
    const existingSort = sortingRef.current.find((s) => s.id === columnId);
    const direction =
      existingSort?.desc === false
        ? true
        : existingSort?.desc
        ? undefined
        : false;

    const newSorting =
      direction === undefined
        ? sortingRef.current.filter((s) => s.id !== columnId)
        : [{ id: columnId, desc: direction }];

    sortingRef.current = newSorting;
    table.options.onSortingChange?.(newSorting);
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
          className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
          onClick={handelnavigate}
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
                    className="p-3 font-medium text-gray-700 cursor-pointer select-none"
                    onClick={() => handleSort(header.column.id)}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {sortingRef.current.find((s) => s.id === header.column.id)
                      ? sortingRef.current.find(
                          (s) => s.id === header.column.id
                        )?.desc
                        ? "🔽 "
                        : " 🔼"
                      : ""}
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
