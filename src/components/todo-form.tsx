/**
 * TodoForm component: a form for creating new todo items.
 *
 * Features:
 *  - Validation using Zod schema
 *  - Form state management using React Hook Form
 *  - Automatic form reset after submission
 *
 * Props:
 *  - onSubmit: callback function to handle form submission
 *
 * Uses:
 *  - Zod for schema validation
 *  - React Hook Form for form state management
 *  - UI components (Button, Input, Form) for rendering the form
 *
 * Purpose:
 *  - Provides a form for users to create new todo items
 *  - Validates user input using Zod schema
 *  - Calls the onSubmit callback function with validated form data
 */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const TodoSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
});

type TodoFormData = z.infer<typeof TodoSchema>;

interface TodoFormProps {
  onSubmit: (data: TodoFormData) => void;
}

export function TodoForm({ onSubmit }: TodoFormProps) {
  const form = useForm<TodoFormData>({
    resolver: zodResolver(TodoSchema),
    defaultValues: {
      title: "",
    },
  });

  const handleSubmit = (data: TodoFormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add</Button>
      </form>
    </Form>
  );
}
