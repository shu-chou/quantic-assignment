/**
 * TodoTable component: displays a table of todo items with sorting and filtering capabilities.
 *
 * Props:
 *  - todos: array of Todo objects to display
 *  - onToggleComplete: callback function to toggle the completion status of a todo item
 *  - onDelete: callback function to delete a todo item
 *
 * Features:
 *  - Sorting: allows sorting by ID and title in ascending or descending order
 *  - Filtering: not implemented
 *  - Todo item rendering: displays completed status, ID, title, and delete button for each todo item
 */

"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Todo;
    direction: "asc" | "desc";
  }>({
    key: "id",
    direction: "asc",
  });

  const sortedTodos = [...todos].sort((a, b) => {
    const key = sortConfig.key;

    if (a[key] === undefined || b[key] === undefined) return 0;

    const aValue = a[key] as string | number;
    const bValue = b[key] as string | number;

    return sortConfig.direction === "asc"
      ? aValue > bValue
        ? 1
        : -1
      : aValue < bValue
      ? 1
      : -1;
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Completed</TableHead>
          <TableHead
            onClick={() =>
              setSortConfig({
                key: "id",
                direction: sortConfig.direction === "asc" ? "desc" : "asc",
              })
            }
          >
            ID ↕
          </TableHead>
          <TableHead
            onClick={() =>
              setSortConfig({
                key: "title",
                direction: sortConfig.direction === "asc" ? "desc" : "asc",
              })
            }
          >
            Title ↕
          </TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedTodos.map((todo) => (
          <TableRow key={todo.id}>
            <TableCell>
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => onToggleComplete(todo)}
              />
            </TableCell>
            <TableCell>{todo.id}</TableCell>
            <TableCell>{todo.title}</TableCell>
            <TableCell>
              <button
                onClick={() => todo.id && onDelete(todo.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
