/**
 * Home page component: displays a list of todos and allows users to manage them.
 *
 * Features:
 *  - Uses the React Redux library to manage state and dispatch actions
 *  - Uses the NextAuth.js library to authenticate users and retrieve their session data
 *  - Fetches todos from the TodoApiService on mount, using the user's ID if available
 *  - Handles toggling the completion status of a todo
 *  - Handles deleting a todo
 *  - Displays a list of todos using the TodoTable component
 *  - Displays error messages if something goes wrong
 *
 * Purpose:
 *  - Provides a user interface for managing todos
 *  - Fetches and displays a list of todos for the current user
 *  - Allows users to toggle the completion status of a todo
 *  - Allows users to delete a todo
 *  - Displays error messages if something goes wrong
 */

"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TodoTable } from "@/components/todo-table";
import TodoApiService from "../../services/api";
import { RootState, AppDispatch } from "../../store/store";
import {
  setTodos,
  updateTodo,
  deleteTodo,
  setLoading,
  setError,
} from "../../slice/todoSlice";
import { Todo } from "../../types";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, loading, error } = useSelector(
    (state: RootState) => state.todos
  );
  const { data: session } = useSession();
  // useEffect(() => {
  //   async function fetchTodos() {
  //     if(todos.length > 0) return;
  //     dispatch(setLoading(true));
  //     try {
  //       const apiService = TodoApiService.getInstance();
  //       const fetchedTodos = await apiService.getTodos();
  //       if (Array.isArray(fetchedTodos)) {
  //         dispatch(setTodos(fetchedTodos as Todo[]));
  //       } else {
  //         throw new Error("Invalid data format");
  //       }
  //       toast.success("Tasks fetched successfully.");
  //     } catch (err) {
  //       console.error("Error fetching todos:", err);
  //       dispatch(setError({ message: "Failed to fetch todos" }));
  //       toast.error("Failed to fetch tasks.");
  //     } finally {
  //       dispatch(setLoading(false));
  //     }
  //   }
  //   fetchTodos();
  // }, []);

  useEffect(() => {
    if (todos.length > 0) return;
    async function fetchTodos() {
      if (!session?.user) return;
      dispatch(setLoading(true));
      try {
        const apiService = TodoApiService.getInstance();
        const fetchedTodos = await apiService.getTodos(
          session.user.isAdmin ? undefined : session.user.userId
        );
        if (Array.isArray(fetchedTodos)) {
          dispatch(setTodos(fetchedTodos as Todo[]));
        } else {
          throw new Error("Invalid data format");
        }
        toast.success("Tasks fetched successfully.");
      } catch (err) {
        console.error("Error fetching todos:", err);
        dispatch(setError({ message: "Failed to fetch todos" }));
        toast.error("Failed to fetch tasks.");
      } finally {
        dispatch(setLoading(false));
      }
    }
    fetchTodos();
  }, [session, dispatch]);
  const handleToggleComplete = async (todo: Todo) => {
    try {
      const apiService = TodoApiService.getInstance();
      const updatedTodo = { ...todo, completed: !todo.completed };
      await apiService.updateTodo(todo.id!, updatedTodo);
      dispatch(updateTodo(updatedTodo));
      toast.success(
        `Task "${todo.title}" marked as ${
          updatedTodo.completed ? "Completed" : "Active"
        }`
      );
    } catch (err) {
      console.error("Error updating todo:", err);
      dispatch(setError({ message: "Failed to update todo" }));
      toast.success("Failed to update the task");
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      const apiService = TodoApiService.getInstance();
      await apiService.deleteTodo(id);
      dispatch(deleteTodo(id));
      toast.success("Task deleted successfully.");
    } catch (err) {
      console.error("Error deleting todo:", err);
      dispatch(setError({ message: "Failed to delete todo" }));
      toast.error("Failed to delete task.");
    }
  };

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Tasks</h1>
          <p className="text-muted-foreground">Manage your tasks efficiently</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error.message}
          </div>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : todos.length > 0 ? (
            <TodoTable
              todos={todos}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTodo}
            />
          ) : (
            <div className="text-center py-4">No tasks found.</div>
          )}
        </div>
      </div>
    </main>
  );
}
