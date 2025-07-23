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
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Users,
  TrendingUp,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { selectSorting, setSorting } from "../store/sortingSlice";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { faker } from "@faker-js/faker";

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  joinDate: string;
}

faker.seed(123);

const generateUsers = (): User[] => {
  const users: User[] = [];
  const statuses = ["Active", "Inactive", "Pending"];

  for (let i = 0; i < 50; i++) {
    users.push({
      id: `user-${i}`,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      status: faker.helpers.arrayElement(statuses),
      joinDate: faker.date.recent({ days: 365 }).toLocaleDateString(),
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
  columnHelper.accessor("status", {
    header: () => "Status",
    cell: (info) => {
      const status = info.getValue();
      const statusColors = {
        Active: "bg-green-100 text-green-800",
        Inactive: "bg-red-100 text-red-800",
        Pending: "bg-yellow-100 text-yellow-800",
      };
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            statusColors[status as keyof typeof statusColors]
          }`}
        >
          {status}
        </span>
      );
    },
  }),
  columnHelper.accessor("joinDate", {
    header: () => "Join Date",
    cell: (info) => info.getValue(),
  }),
];

export default function Dashboard() {
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

  const totalUsers = usersList.length;
  const activeUsers = usersList.filter(
    (user) => user.status === "Active"
  ).length;
  const pendingUsers = usersList.filter(
    (user) => user.status === "Pending"
  ).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Manage your users and view analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                {((activeUsers / totalUsers) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingUsers}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users Data</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  ref={filterRef}
                  onChange={handleFilter}
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button onClick={handleNavigate}>View Charts</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="p-4 font-medium text-gray-700 select-none"
                        >
                          <div
                            className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors group"
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
                <tbody className="divide-y divide-gray-200">
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="p-4 text-gray-800">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 gap-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
              </div>

              <span className="text-sm text-gray-600">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()} ({totalUsers} total users)
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  Last
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
