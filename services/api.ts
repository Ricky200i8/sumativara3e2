// services/api.ts
import { Task } from '@/types/task';

const API_URL = __DEV__ 
  ? "http://192.168.1.50:3000"  // Cambia por tu IP
  : "3000-firebase-sumativara3e2-1763406693823.cluster-ocv3ypmyqfbqysslgd7zlhmxek.cloudworkstations.dev";

export const taskApi = {
  getAll: async (userId: number): Promise<Task[]> => {
    const res = await fetch(`${API_URL}/tasks?userId=${userId}`);
    return res.json();
  },

  create: async (task: Omit<Task, "id">): Promise<Task> => {
    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    return res.json();
  },

  update: async (id: number, task: Partial<Task>): Promise<Task> => {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
  },
};