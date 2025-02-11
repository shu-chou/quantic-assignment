// Singleton API service class for interacting with the Todo API,
// providing methods for CRUD operations and handling errors.

import axios, { AxiosInstance } from "axios";

export interface Todo {
  id?: number;
  userId?: number;
  title: string;
  completed: boolean;
}

class TodoApiService {
  private static instance: TodoApiService;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: "https://jsonplaceholder.typicode.com",
      timeout: 5000,
    });
  }

  public static getInstance(): TodoApiService {
    if (!TodoApiService.instance) {
      TodoApiService.instance = new TodoApiService();
    }
    return TodoApiService.instance;
  }

  async getTodos(id?: number): Promise<Todo[]> {
    try {
      const response = id
        ? await this.axiosInstance.get(`/todos?userId=${id}`)
        : await this.axiosInstance.get("/todos");
      return response.data;
    } catch (error) {
      console.error("Error fetching todos:", error);
      throw error;
    }
  }

  async createTodo(todo: Omit<Todo, "id">): Promise<Todo> {
    const response = await this.axiosInstance.post<Todo>("/todos", todo);
    return response.data;
  }

  async updateTodo(id: number, todo: Partial<Todo>): Promise<Todo> {
    const response = await this.axiosInstance.patch<Todo>(`/todos/${id}`, todo);
    return response.data;
  }

  async deleteTodo(id: number): Promise<void> {
    try {
      await this.axiosInstance.delete(`/todos/${id}`);
    } catch (error) {
      console.error("Error deleting todo:", error);
      throw error;
    }
  }
}

export default TodoApiService;
