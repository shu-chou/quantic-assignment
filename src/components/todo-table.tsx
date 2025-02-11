/**
 * TodoTable component: a table for displaying and managing todo items.
 *
 * Features:
 *  - Sorting and filtering of todo items
 *  - Pagination for large data sets
 *  - Callback functions for toggling todo item completion and deletion
 *  - Global search functionality
 *
 * Props:
 *  - todos: an array of todo items to display
 *  - onToggleComplete: callback function to toggle todo item completion
 *  - onDelete: callback function to delete a todo item
 *
 * Uses:
 *  - React Table library for table functionality
 *  - UI components (Button, Input, Table) for rendering the table
 *
 * Purpose:
 *  - Provides a table for users to view and manage their todo items
 *  - Allows users to sort and filter todo items by various columns
 *  - Paginates the table for large data sets
 *  - Calls the onToggleComplete and onDelete callback functions when the respective actions are triggered
 *  - Provides a global search functionality to search for todo items by title
 */

"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Todo } from "../types";

interface TodoTableProps {
  todos: Todo[];
  onToggleComplete: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export function TodoTable({
  todos,
  onToggleComplete,
  onDelete,
}: TodoTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns: ColumnDef<Todo>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <div className="text-left">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent font-semibold"
          >
            ID
          </Button>
        </div>
      ),
      sortingFn: "basic",
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <div className="text-left">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent font-semibold"
          >
            Title
          </Button>
        </div>
      ),
      sortingFn: "text",
    },
    {
      id: "completed",
      header: ({ column }) => (
        <div className="text-left">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent font-semibold"
          >
            Status
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <span
          className={
            row.original.completed
              ? "text-green-600 font-semibold"
              : "text-gray-600"
          }
        >
          {row.original.completed ? "Completed" : "Active"}
        </span>
      ),
      sortingFn: (rowA, rowB) =>
        Number(rowA.original.completed) - Number(rowB.original.completed),
    },
    {
      id: "actions",
      header: () => <div className="text-left font-semibold">Actions</div>,
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={row.original.completed}
            onClick={() => onToggleComplete(row.original)}
          >
            Complete
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => row.original.id && onDelete(row.original.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: todos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: (row, filterValue) =>
      row.original.title.toLowerCase().includes(filterValue.toLowerCase()),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <Input
          type="text"
          placeholder="Search by title..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-1/3"
        />
      </div>

      <div className="rounded-md border">
        <Table className="w-full table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
