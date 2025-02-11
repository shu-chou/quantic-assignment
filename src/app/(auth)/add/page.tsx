/**
 * AddTaskPage component: a page for adding new tasks.
 *
 * Features:
 *  - Uses the React Redux library to dispatch actions and update the state
 *  - Uses the TodoApiService to create new tasks on the server
 *  - Handles form submission and creates a new task with the provided title
 *  - Displays success and error messages using the Sonner library
 *
 * Purpose:
 *  - Provides a user interface for adding new tasks
 *  - Creates new tasks on the server using the TodoApiService
 *  - Updates the state with the newly created task
 *  - Displays success and error messages to the user
 */

"use client";

import { TodoForm } from "@/components/todo-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { addTodo } from "@/slice/todoSlice";
import TodoApiService from "@/services/api";
import { Todo } from "@/types";
import { toast } from "sonner";

export default function AddTaskPage() {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddTodo = async (data: { title: string }) => {
    try {
      const apiService = TodoApiService.getInstance();
      const newTodo = {
        userId: 2,
        title: data.title,
        completed: false,
      };
      const createdTodo = await apiService.createTodo(newTodo);
      dispatch(addTodo(createdTodo as Todo));
      toast.success("Task added successfully.");
    } catch (err) {
      console.error("Failed to add todo", err);
      toast.error("Failed to add task.");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add a New Task</h1>
      <TodoForm onSubmit={handleAddTodo} />
    </div>
  );
}
