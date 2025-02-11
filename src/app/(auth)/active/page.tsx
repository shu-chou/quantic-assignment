/**
 * ActiveTasks component: a page for displaying active tasks.
 *
 * Features:
 *  - Uses the React Redux library to dispatch actions and update the state
 *  - Uses the TodoApiService to update and delete tasks on the server
 *  - Filters the tasks to only show active tasks
 *  - Handles task completion and deletion
 *  - Displays success and error messages using the Sonner library
 *
 * Purpose:
 *  - Provides a user interface for displaying active tasks
 *  - Allows users to complete and delete tasks
 *  - Updates the state with the updated or deleted task
 *  - Displays success and error messages to the user
 */

"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { updateTodo, deleteTodo, setError } from "@/slice/todoSlice";
import { TodoTable } from "@/components/todo-table";
import { Todo } from "@/types";
import TodoApiService from "@/services/api";
import { toast } from "sonner";

export default function ActiveTasks() {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, loading, error } = useSelector(
    (state: RootState) => state.todos
  );
  const activeTodos = todos.filter((todo) => !todo.completed);

  const handleComplete = async (todo: Todo) => {
    try {
      const apiService = TodoApiService.getInstance();
      const updatedTodo = { ...todo, completed: true };
      await apiService.updateTodo(todo.id!, updatedTodo);
      dispatch(updateTodo(updatedTodo));
      toast.success("Task marked as completed");
    } catch (err) {
      console.error("Failed to update todo", err);
      toast.error("Failed to update task.");
    }
  };
  const handleDeleteTodo = async (id: number) => {
    try {
      const apiService = TodoApiService.getInstance();
      await apiService.deleteTodo(id);
      dispatch(deleteTodo(id));
      toast.success("Task deleted successfully.");
    } catch (err) {
      console.log(err);
      dispatch(setError({ message: "Failed to delete todo" }));
      toast.error("Failed to delete task.");
    }
  };

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Tasks</h1>
          <p className="text-muted-foreground">Complete your tasks</p>
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
              todos={activeTodos}
              onToggleComplete={handleComplete}
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
