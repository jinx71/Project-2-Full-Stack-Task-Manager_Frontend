import client from './client';
import type { ApiResponse, Task, TaskInput } from '../types';

export const fetchTasks = async (): Promise<Task[]> => {
  const res = await client.get<ApiResponse<{ tasks: Task[] }>>('/tasks');
  return res.data.data.tasks;
};

export const createTask = async (input: TaskInput): Promise<Task> => {
  const res = await client.post<ApiResponse<{ task: Task }>>('/tasks', input);
  return res.data.data.task;
};

export const updateTask = async (id: string, input: Partial<TaskInput>): Promise<Task> => {
  const res = await client.put<ApiResponse<{ task: Task }>>(`/tasks/${id}`, input);
  return res.data.data.task;
};

export const deleteTask = async (id: string): Promise<void> => {
  await client.delete<ApiResponse<null>>(`/tasks/${id}`);
};
